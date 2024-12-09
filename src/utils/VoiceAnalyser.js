import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import livesAdd from "../assets/audio/livesAdd.wav";
import livesCut from "../assets/audio/livesCut.wav";
import { response } from "../services/telementryService";
import AudioCompare from "./AudioCompare";
import PropTypes from "prop-types";
import { SpeakButton, getLocalData, NextButtonRound } from "./constants";
import config from "./urlConstants.json";
import { filterBadWords } from "./Badwords";
import S3Client from "../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
/* eslint-disable */

function VoiceAnalyser(props) {
  const [loadCnt, setLoadCnt] = useState(0);
  const [loader, setLoader] = useState(false);
  const [pauseAudio, setPauseAudio] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [recordedAudioBase64, setRecordedAudioBase64] = useState("");
  const [audioPermission, setAudioPermission] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [temp_audio, set_temp_audio] = useState(null);
  const [isStudentAudioPlaying, setIsStudentAudioPlaying] = useState(false);
  const [temp_Student_audio, set_temp_Student_audio] = useState(null);
  const { callUpdateLearner } = props;
  const lang = getLocalData("lang");
  const { livesData, setLivesData } = props;

  useEffect(() => {
    if (!props.enableNext) {
      setRecordedAudio("");
    }
  }, [props.enableNext]);

  useEffect(() => {
    setRecordedAudio("");
  }, [props.contentId]);

  const playAudio = async (val) => {
    if (isStudentAudioPlaying) {
      return;
    }
    const { audioLink } = props;
    try {
      let audioSource;

      if (audioLink) {
        audioSource = audioLink;
      } else {
        audioSource = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${props.contentId}.wav`;
      }
      let audio = new Audio(audioSource);

      audio.addEventListener("canplaythrough", () => {
        set_temp_audio(audio);
        setPauseAudio(val);
        if (val) {
          audio.play();
        } else {
          audio.pause();
        }
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio failed to load", e);
        setPauseAudio(false); // Set pause state to false
        alert("Failed to load the audio. Please try again.");
      });
    } catch (err) {
      console.error("An error occurred:", err);
      alert("An unexpected error occurred while trying to play the audio.");
    }
  };

  const playRecordedAudio = (val) => {
    if (pauseAudio) {
      return;
    }
    try {
      const audio = new Audio(recordedAudio);
      audio.addEventListener("canplaythrough", () => {
        setIsStudentAudioPlaying(val);
        set_temp_Student_audio(audio);
        if (val) {
          audio.play();
          audio.onended = () => setIsStudentAudioPlaying(false);
        } else {
          audio.pause();
        }
      });
      audio.addEventListener("error", (e) => {
        console.error("Audio failed to load", e);
        setIsStudentAudioPlaying(false);
        alert("Failed to load the audio. Please try again.");
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (temp_Student_audio !== null) {
      if (!isStudentAudioPlaying) {
        temp_Student_audio.pause();
        props.setVoiceAnimate(false);
      } else {
        temp_Student_audio.play();
        props.setVoiceAnimate(true);
      }
      temp_Student_audio.onended = function () {
        setPauseAudio(false);
        props.setVoiceAnimate(false);
      };
      temp_Student_audio.addEventListener("ended", () =>
        setIsStudentAudioPlaying(false)
      );
    }
    return () => {
      if (temp_Student_audio !== null) {
        temp_Student_audio.pause();
      }
    };
  }, [temp_Student_audio]);

  useEffect(() => {
    if (temp_audio !== null) {
      if (!pauseAudio) {
        temp_audio.pause();
        props.setVoiceAnimate(false);
      } else {
        temp_audio.play();
        props.setVoiceAnimate(true);
      }
      temp_audio.onended = function () {
        setPauseAudio(false);
        props.setVoiceAnimate(false);
      };
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  }, [temp_audio]);

  useEffect(() => {
    if (loadCnt === 0) {
      getpermision();
      setLoadCnt((loadCnt) => Number(loadCnt + 1));
    }
  }, [loadCnt]);

  useEffect(() => {
    if (recordedAudio !== "") {
      let uri = recordedAudio;
      let request = new XMLHttpRequest();
      request.open("GET", uri, true);
      request.responseType = "blob";
      request.onload = function () {
        let reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          let base64Data = e.target.result.split(",")[1];
          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
    } else {
      setLoader(false);
      setRecordedAudioBase64("");
      setApiResponse("");
    }
  }, [recordedAudio]);

  useEffect(() => {
    if (props.isNextButtonCalled) {
      if (recordedAudioBase64 !== "") {
        const lang = getLocalData("lang") || "ta";
        fetchASROutput(lang, recordedAudioBase64);
        setLoader(true);
      }
    }
  }, [props.isNextButtonCalled]);

  useEffect(() => {
    if (recordedAudioBase64 !== "") {
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
    }
  }, [recordedAudioBase64]);

  useEffect(() => {
    props.setVoiceText(apiResponse);
  }, [apiResponse]);

  const uploadAudioToS3 = async (base64Data, sessionId, currentLine) => {
    const audioFileName = `${
      process.env.REACT_APP_CHANNEL
    }/${sessionId}-${Date.now()}-${currentLine}.wav`;
    const command = new PutObjectCommand({
      Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
      Key: audioFileName,
      Body: Uint8Array.from(window.atob(base64Data), (c) => c.charCodeAt(0)),
      ContentType: "audio/wav",
    });

    try {
      await S3Client.send(command);
      return audioFileName;
    } catch (err) {
      console.error("Audio upload error:", err);
      return null;
    }
  };

  const logResponse = (audioFileName, originalText, responseText, duration) => {
    response(
      {
        target:
          process.env.REACT_APP_CAPTURE_AUDIO === "true"
            ? `${audioFileName}`
            : "",
        type: "SPEAK",
        values: [
          { original_text: originalText },
          { response_text: responseText },
          { duration },
        ],
      },
      "ET"
    );
  };

  const fetchASROutput = async (sourceLanguage, base64Data) => {
    try {
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const sub_session_id = getLocalData("sub_session_id");
      const { originalText, contentType, contentId, currentLine } = props;
      const responseStartTime = new Date().getTime();
      let responseText = "";
      let profanityWord = "";
      let newThresholdPercentage = 0;
      let data = {};
      let audioFileName = "";

      let requestBody = {
        original_text: originalText,
        audio: base64Data,
        user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId,
        contentType,
      };

      if (props.selectedOption) {
        requestBody["is_correct_choice"] = props.selectedOption?.isAns;
      }

      if (props.correctness) {
        requestBody["correctness"] = props.correctness;
      }

      if (callUpdateLearner) {
        const { data: updateLearnerData } = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
          requestBody
        );

        //Need: handle  Errors

        data = updateLearnerData;
        responseText = data.responseText;
        profanityWord = await filterBadWords(data.responseText);
        if (profanityWord !== data.responseText) {
          props?.setOpenMessageDialog({
            message: "Please avoid using inappropriate language.",
            isError: true,
          });
        }
        newThresholdPercentage = data?.subsessionTargetsCount || 0;
        if (contentType.toLowerCase() !== "word") {
          handlePercentageForLife(
            newThresholdPercentage,
            contentType,
            data?.subsessionFluency,
            lang
          );
        }
      }

      const responseEndTime = new Date().getTime();
      const responseDuration = Math.round(
        (responseEndTime - responseStartTime) / 1000
      );

      // Need: Remove false when REACT_APP_AWS_S3_BUCKET_NAME and keys added
      if (process.env.REACT_APP_CAPTURE_AUDIO === "true") {
        audioFileName = await uploadAudioToS3(
          base64Data,
          sessionId,
          currentLine
        );
      }

      logResponse(audioFileName, originalText, responseText, responseDuration);

      setApiResponse(callUpdateLearner ? data.status : "success");

      if (
        callUpdateLearner &&
        (props.pageName === "wordsorimage" || props.pageName === "m5")
      ) {
        const isMatching =
          data?.createScoreData?.session?.error_rate?.character === 0;
        if (typeof props.updateStoredData === "function") {
          props.updateStoredData(recordedAudio, isMatching);
        }
      }
      if (props.handleNext) {
        props.handleNext();
        if (temp_audio !== null) {
          temp_audio.pause();
          setPauseAudio(false);
        }
      }
      setLoader(false);
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
    } catch (error) {
      setLoader(false);
      if (props.handleNext) {
        props.handleNext();
      }
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
      setRecordedAudioBase64("");
      setApiResponse("error");
      console.log("err", error);
    }
  };

  const getThreshold = (totalSyllables) => {
    if (totalSyllables <= 100) return 30;
    if (totalSyllables <= 150) return 25;
    if (totalSyllables <= 175) return 20;
    if (totalSyllables <= 250) return 15;
    if (totalSyllables <= 500) return 10;
    return 5; // For totalSyllables > 500
  };

  const handlePercentageForLife = (
    percentage, // subsessionTargetsCount
    contentType,
    fluencyScore, // subsessionFluency
    language
  ) => {
    try {
      if (livesData) {
        let totalSyllables = livesData?.totalTargets;
        if (language === "en" && totalSyllables > 50) {
          // Need: need to check why this is 50
          totalSyllables = 50;
        }
        // Calculate the current percentage based on total targets.
        percentage = Math.round((percentage / totalSyllables) * 100);

        // Define the total number of lives and adjust the threshold based on syllables.
        const totalLives = 5;
        const threshold = getThreshold(totalSyllables);

        // Calculate lives lost based on percentage.
        let livesLost = Math.floor(percentage / (threshold / totalLives));

        // Check fluency criteria and adjust lives lost accordingly.
        let meetsFluencyCriteria;
        switch (contentType.toLowerCase()) {
          case "word":
            meetsFluencyCriteria = fluencyScore < 2;
            break;
          case "sentence":
            meetsFluencyCriteria = fluencyScore < 6;
            break;
          case "paragraph":
            meetsFluencyCriteria = fluencyScore < 10;
            break;
          default:
            meetsFluencyCriteria = true; // Assume criteria met if not specified.
        }

        // If fluency criteria are not met, reduce an additional life, but ensure it doesn't exceed the total lives.
        if (!meetsFluencyCriteria && livesLost < totalLives) {
          livesLost = Math.min(livesLost + 1, totalLives);
        }

        // Determine the number of red and black lives to show.
        const redLivesToShow = totalLives - livesLost;
        let blackLivesToShow = 5;
        if (livesLost <= 5) {
          blackLivesToShow = livesLost;
        }

        // Prepare the new lives data.
        let newLivesData = {
          ...livesData,
          blackLivesToShow,
          redLivesToShow,
          meetsFluencyCriteria: meetsFluencyCriteria,
        };

        // Play audio based on the change in lives.
        const HeartGaain =
          livesData.redLivesToShow === undefined
            ? 5 - newLivesData.redLivesToShow
            : livesData.redLivesToShow - newLivesData.redLivesToShow;
        let isLiveLost;
        if (HeartGaain > 0) {
          isLiveLost = true;
        } else {
          isLiveLost = false;
        }
        const audio = new Audio(isLiveLost ? livesCut : livesAdd);
        audio.play();

        // Update the state or data structure with the new lives data.
        setLivesData(newLivesData);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const getpermision = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setAudioPermission(true);
      })
      .catch((error) => {
        console.log("Permission Denied");
        setAudioPermission(false);
      });
  };

  return (
    <div>
      {loader ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
        </Box>
      ) : (
        (() => {
          if (audioPermission != null) {
            if (audioPermission) {
              return (
                <>
                  <AudioCompare
                    setRecordedAudio={setRecordedAudio}
                    originalText={props.originalText}
                    playAudio={playAudio}
                    pauseAudio={pauseAudio}
                    playRecordedAudio={playRecordedAudio}
                    isStudentAudioPlaying={isStudentAudioPlaying}
                    dontShowListen={
                      props.isShowCase
                        ? props.isShowCase && !recordedAudio
                        : props.dontShowListen
                    }
                    isShowCase={props.isShowCase}
                    recordedAudio={recordedAudio}
                    setEnableNext={props.setEnableNext}
                    showOnlyListen={props.showOnlyListen}
                    setOpenMessageDialog={props.setOpenMessageDialog}
                  />
                  {/* <RecordVoiceVisualizer /> */}
                </>
              );
            } else {
              return (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    props.setOpenMessageDialog({
                      message:
                        "Microphone is blocked. Enable microphone to continue.",
                      isError: true,
                    });
                  }}
                >
                  <SpeakButton />
                </Box>
              );
            }
          }
        })()
      )}
      {!loader && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {props.enableNext && (
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (props.setIsNextButtonCalled) {
                  props.setIsNextButtonCalled(true);
                } else {
                  props.handleNext();
                }
              }}
            >
              <NextButtonRound />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

VoiceAnalyser.propTypes = {
  enableNext: PropTypes.bool.isRequired,
  setIsNextButtonCalled: PropTypes.func,
  handleNext: PropTypes.func.isRequired,
  originalText: PropTypes.string,
  isShowCase: PropTypes.bool,
  dontShowListen: PropTypes.bool,
  setEnableNext: PropTypes.func.isRequired,
  showOnlyListen: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  contentType: PropTypes.string.isRequired,
  currentLine: PropTypes.number.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setVoiceAnimate: PropTypes.func.isRequired,
  callUpdateLearner: PropTypes.bool,
  setVoiceText: PropTypes.func.isRequired,
  livesData: PropTypes.object,
  contentId: PropTypes.string,
  updateStoredData: PropTypes.any,
  pageName: PropTypes.string,
  selectedOption: PropTypes.bool,
  correctness: PropTypes.object,
  audioLink: PropTypes.string,
  setLivesData: PropTypes.any,
};

export default VoiceAnalyser;
