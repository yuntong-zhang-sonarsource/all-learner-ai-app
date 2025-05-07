import React, { useState, useEffect, useRef } from "react";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import { practiceSteps, getLocalData } from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import {
  ListenButton,
  RetryIcon,
  SpeakButton,
  StopButton,
  NextButtonRound,
} from "../../utils/constants";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import { Box, CircularProgress } from "@mui/material";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const content = {
  conversation: [
    {
      speaker: "Good morning, dear! How can I help you?",
      user: "Good morning, sir.\nI need some potatoes",
    },
    { speaker: "How many kilos do you want?", user: "Two kilograms, please." },
    {
      speaker: "One kilo of potatoes costs Rs. 30.",
      user: "That’s fine. I also need half a kilo of carrots and beans.",
    },
    {
      speaker: "Anything else?",
      user: "No, that’s all. What is the total amount?",
    },
    {
      speaker: "The total amount is Rs. 100",
      user: "Here is the money. Thank you, sir.",
    },
  ],
};

const AskMoreM14 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  handleBack,
  setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  fluency,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  isNextButtonCalled,
  setIsNextButtonCalled,
}) => {
  const [currentSteps, setCurrentStep] = useState(-1);
  const [isMikeClicked, setIsMikeClicked] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [cloudText, setCloudText] = useState("......");
  const [showPandaText, setShowPandaText] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [imageData, setImageData] = useState({});
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [showVoice, setShowVoice] = useState(false);
  const [words, setWords] = useState([]);
  const utteranceRef = useRef(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState("");
  const [completeAudio, setCompleteAudio] = useState(null);
  //const [imageData, setImageData] = useState({});
  const [loader, setLoader] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const audioRef = useRef(null);
  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
    console.log("Live Transcript:", transcript);
  }, [transcript]);

  const handleStartRecording = () => {
    // if (!browserSupportsSpeechRecognition) {
    //   //alert("Speech recognition is not supported in your browser.");
    //   return;
    // }
    setRecAudio(null);
    resetTranscript();
    setIsRecording(true);
    handleMikeClick();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  const playWordAudio = (audio) => {
    if (audio) {
      audioRef.current.src = audio;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  const stopCompleteAudio = () => {
    if (isPlaying) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcriptRef.current);
    setIsRecording(false);
    //console.log("Final Transcript:", transcriptRef.current);
  };

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  const playAudio = (audioKey) => {
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    } else {
      if (audioKey) {
        const audio = new Audio(audioKey);

        audio.onended = () => setIsPlaying(false);

        audio.play();
        setAudioInstance(audio);
        setIsPlaying(true);
      } else {
        console.error("Audio file not found:", audioKey);
      }
    }
  };

  const getPulseAnimationStyle = (color) => ({
    position: "absolute",
    width: "90px",
    height: "90px",
    backgroundColor: color,
    borderRadius: "50%",
    animation: "pulse 1.2s linear infinite",
    "@keyframes pulse": {
      "0%": {
        transform: "scale(0.6)",
        opacity: 0,
      },
      "50%": {
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.4)",
        opacity: 0,
      },
    },
  });

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data?.conversation || [];
  };

  const getImages = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data || [];
  };

  //steps = 1;

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.name || "P1";

  //const conversation = contentM14[level]?.[currentLevel]?.conversation || content?.conversation;

  const conversation = getConversation(level, currentLevel);

  useEffect(() => {
    setImageData(getImages(level, currentLevel));
  }, [currentLevel]);

  console.log(
    "levelM14",
    level,
    currentStep,
    currentLevel,
    conversation,
    steps,
    imageData
  );

  useEffect(() => {
    setCurrentStep(-1);
    setIsMikeClicked(false);
    setShowModal(true);
    setCloudText("......");
    setShowPandaText(false);
    setShowClock(false);
  }, [currentLevel]);

  // useEffect(() => {
  //   if (currentSteps >= 0 && currentSteps < conversation.length) {
  //     if (currentSteps === 0) {
  //       setCloudText(conversation[0].speaker);
  //       setTimeout(() => {
  //         setShowPandaText(true);
  //       }, 4000);
  //     } else {
  //       setCloudText(conversation[currentSteps].speaker);
  //       setTimeout(() => {
  //         setShowPandaText(true);
  //       }, 4000);
  //     }
  //   }
  // }, [currentSteps]);

  useEffect(() => {
    if (currentSteps >= 0 && currentSteps < conversation.length) {
      const textToSpeak = conversation[currentSteps].speaker;
      const splitWords = textToSpeak.split(" ");
      setCloudText(textToSpeak);
      setWords(splitWords);
      setCurrentWordIndex(-1);
      setShowPandaText(false);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Track each word being spoken
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const charIndex = event.charIndex;
          const spokenWordIndex = splitWords.findIndex((word, i) => {
            const joined = splitWords.slice(0, i + 1).join(" ");
            return joined.length >= charIndex;
          });
          setCurrentWordIndex(spokenWordIndex);
        }
      };

      utterance.onend = () => {
        setCurrentWordIndex(-1);
        setShowVoice(true);
        setTimeout(() => {
          setShowVoice(false);
          setShowPandaText(true);
        }, 1500);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [currentSteps]);

  const generateCloudPositions = () => {
    const positions = [];
    const cloudCount = 6;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < cloudCount; i++) {
      const top = i % 2 === 0 ? screenHeight * 0.1 : screenHeight * 0.0;
      const left = (i * (screenWidth / cloudCount)) % screenWidth;
      positions.push({ top, left });
    }

    return positions;
  };

  const cloudPositions = generateCloudPositions();

  const handlePauseClick = async () => {
    if (isPlaying) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    }
    setIsLoading(true);

    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";

    if (currentLevel === "S1" || currentLevel === "S2") {
      const options = {
        originalText: conversation[currentSteps]?.user,
        questionText: conversation[currentSteps]?.speaker,
        contentType: contentType,
        contentId: contentId,
      };

      responseText = await fetchASROutput(recAudio, options, setLoader);
      setApiResponse(responseText);
    }

    await callTelemetryApi(
      conversation[currentSteps]?.user,
      sessionId,
      currentStep - 1,
      recAudio,
      responseStartTime,
      responseText?.responseText || ""
    );

    if (currentSteps < conversation.length - 1) {
      const audio = new Audio(correctSound);
      audio.play();
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => {
        handleNext();
      }, 2000);
      setShowPandaText(false);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setCurrentStep(conversation.length);
      //console.log('texxxxxt');
      handleNext();
      setShowPandaText(false);
      // for (let i = 0; i < 5; i++) {
      //   handleNext();
      // }
    }
    setIsMikeClicked(false);
    setShowClock(false);
    setRecAudio("");
    setIsLoading(false);
  };

  const handleMikeClick = () => {
    setIsMikeClicked(true);
    setShowClock(true);
  };

  const handlePlayClick = () => {
    setShowModal(false);
    setCurrentStep(0);
    setShowPandaText(false);
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      //={recAudio}
      fluency={false}
      //={recAudio}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        disableScreen,
        loading,
        //fluency = false,
        isShowCase,
        startShowCase,
        setStartShowCase,
        livesData,
        gameOverData,
        setIsNextButtonCalled,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100vh",
          background: "#B6E4FA",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cloudPositions?.map((pos, index) => (
          <img
            key={index}
            src={Assets.cloudyImg}
            alt="Cloudy Background"
            style={{
              position: "absolute",
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: "200px",

              opacity: 0.7,
            }}
          />
        ))}
        {showModal && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "17px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Ask More!
            </span>
            <img src={Assets.modalImg} alt="Modal" style={{ width: "500px" }} />
            <img
              src={Assets.playImg}
              alt="Play Button"
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                width: "120px",
              }}
              onClick={handlePlayClick}
            />
          </div>
        )}
        {/* {showClock && (
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src={clockImg} alt="Clock" style={{ width: '30px' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333F61' }}>00:10</span>
        </div>
      )} */}
        <img
          src={Assets.sunImg}
          alt="Sun"
          style={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "100px",
          }}
        />
        <img
          src={
            getAssetUrl(s3Assets[imageData?.images?.imageOne]) ||
            Assets[imageData?.images?.imageOne] ||
            Assets.beerImg
          }
          alt="Left Character"
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            //width: "210px",
            height: "250px",
            zIndex: 2,
          }}
        />
        <img
          src={
            getAssetUrl(s3Assets[imageData?.images?.imageTwo]) ||
            Assets[imageData?.images?.imageTwo] ||
            Assets.pandaImg
          }
          alt="Right Character"
          style={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            //width: "210px",
            height: "250px",
            zIndex: 2,
          }}
        />

        {currentSteps >= 0 && currentSteps < conversation.length ? (
          <>
            <div
              style={{
                position: "absolute",
                top: "19%",
                left: "17%",
                width: "250px",
                textAlign: "center",
              }}
            >
              <img
                src={Assets.cloudImg}
                alt="Cloud"
                style={{ width: "100%" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#333F61",
                  textAlign: "center",
                  fontFamily: "Quicksand",
                  //lineHeight: 1.4,
                  wordBreak: "keep-all",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                {words.map((word, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor:
                        i === currentWordIndex ? "yellow" : "transparent",
                      padding: "1px 2px",
                      borderRadius: "4px",
                      marginRight: "4px",
                      color: i === currentWordIndex ? "#000" : "#333F61",
                      display: "inline-block",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </div>

            {!showPandaText && (
              <div
                style={{
                  position: "absolute",
                  top: "18%",
                  right: "21%",
                  width: "195px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "130%",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src={Assets.cloudPandaImg}
                    alt="Cloud Panda"
                    style={{ width: "100%" }}
                  />
                  <img
                    src={Assets.listeningImg}
                    alt="Listening Icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      height: "150px",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            )}

            {/* {showVoice && (
              <div
                style={{
                  position: "absolute",
                  top: "18%",
                  right: "21%",
                  width: "195px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "130%",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src={Assets.cloudPandaImg}
                    alt="Cloud Panda"
                    style={{ width: "100%" }}
                  />
                  <img
                    src={Assets.voiceImg}
                    alt="Voice Icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      height: "80px",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            )} */}

            {showPandaText && (
              <div
                style={{
                  position: "absolute",
                  top: "18%",
                  right: "21%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* 👂 Audio Button on the left */}
                {currentLevel !== "S1" && currentLevel !== "S2" && (
                  <div style={{ marginRight: "10px" }}>
                    {isPlaying ? (
                      <Box
                        sx={{
                          marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                        }}
                        onClick={stopCompleteAudio}
                      >
                        <StopButton height={45} width={45} />
                      </Box>
                    ) : (
                      <Box
                        //className="walkthrough-step-1"
                        sx={{
                          marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                          //cursor: `url(${clapImage}) 32 24, auto`,
                        }}
                        onClick={() => {
                          playAudio(
                            getAssetAudioUrl(
                              s3Assets[conversation[currentSteps]?.audio]
                            ) || Assets[conversation[currentSteps]?.audio]
                          );
                        }}
                      >
                        <ListenButton height={50} width={50} />
                      </Box>
                    )}
                  </div>
                )}

                {/* 🐼 Cloud and text */}
                <div
                  style={{
                    position: "relative",
                    width: "195px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={Assets.cloudPandaImg}
                    alt="Cloud Panda"
                    style={{ width: "130%" }}
                  />
                  <img
                    src={Assets.voiceImg}
                    alt="Voice Icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      height: "150px",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            )}

            {showPandaText && (
              <div
                style={{
                  display: "flex",
                  //width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:
                    currentLevel === "S1" || currentLevel === "S2"
                      ? "30px"
                      : "15px",
                  gap: "10px",
                  position: "fixed", // Use fixed to ensure it remains in the center regardless of scrolling
                  top: "60%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  flexDirection: "column",
                  //backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background for better visibility
                  padding: "20px",
                  borderRadius: "10px",
                  //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Adds slight shadow for better UI
                  zIndex: 1000, // Ensure it's above all other content
                  width: "auto", // Keep it flexible
                  maxWidth: "90%",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                  </Box>
                ) : (
                  <>
                    <VoiceAnalyser
                      pageName={"m8"}
                      setVoiceText={setVoiceText}
                      onAudioProcessed={handleRecordingComplete}
                      setRecordedAudio={setRecordedAudio}
                      setVoiceAnimate={setVoiceAnimate}
                      storyLine={storyLine}
                      dontShowListen={true}
                      handleNext={handleNext}
                      enableNext={enableNext}
                      originalText={parentWords}
                      audioLink={audio ? audio : completeAudio}
                      buttonAnimation={true}
                      handleStartRecording={handleStartRecording}
                      handleStopRecording={handleStopRecording}
                      {...{
                        contentId,
                        contentType,
                        currentLine: currentStep - 1,
                        playTeacherAudio,
                        callUpdateLearner,
                        isShowCase,
                        setEnableNext,
                        //showOnlyListen: answer !== "correct",
                        showOnlyListen: false,
                        setOpenMessageDialog,
                      }}
                    />
                    {recAudio && (
                      <div
                        onClick={handlePauseClick}
                        style={{
                          cursor: "pointer",
                          marginLeft:
                            currentLevel === "S1" || currentLevel === "S2"
                              ? "0px"
                              : "33px",
                        }}
                      >
                        <NextButtonRound height={45} width={45} />
                      </div>
                    )}
                  </>
                )}
                <audio
                  ref={audioRef}
                  //onEnded={handleAudioEnd}
                  src={completeAudio}
                  hidden
                />
              </div>
            )}
          </>
        ) : (
          !showModal && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Conversation Complete!
            </div>
          )
        )}

        <img
          src={Assets.sandImg}
          alt="Sand"
          style={{
            position: "relative",
            bottom: "0",
            width: "100%",
            height: "auto",
            marginTop: "450px",
          }}
        />
      </div>
    </MainLayout>
  );
};

export default AskMoreM14;
