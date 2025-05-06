import { Box, Button } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import listenImg2 from "../../assets/listen.png";
import spinnerStop from "../../assets/pause.png";
import MainLayout from "../Layouts.jsx/MainLayout";
import clapImage from "../../assets/hand-ic.svg";
// import bulbHint from "../../assets/hint.svg";
// import bulbHintDisabled from "../../assets/DisabledHint.svg";
import * as Assets from "../../utils/imageAudioLinks";
import frame from "../../assets/frame.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import addSound from "../../assets/audio/add.mp3";
import removeSound from "../../assets/remove.wav";
import {
  WordRedCircle,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  RetryIcon,
  getLocalData,
} from "../../utils/constants";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import Joyride from "react-joyride";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";

// const isChrome =
//   /Chrome/.test(navigator.userAgent) &&
//   /Google Inc/.test(navigator.vendor) &&
//   !/Edg/.test(navigator.userAgent);

const isChrome = true;

const Mechanics7 = ({
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
}) => {
  const [words, setWords] = useState(
    type === "word" ? [] : ["Friend", "She is", "My"]
  );
  const [recordingStates, setRecordingStates] = useState({});
  const [completeAudio, setCompleteAudio] = useState(null);

  useEffect(() => {
    if (words && words?.length) {
      setRecordingStates(
        words.reduce((acc, word) => ({ ...acc, [word]: false }), {})
      );
      setCompleteAudio(currentImg?.completeAudio);
    }
  }, [words]);

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const transcriptRef = useRef("");

  console.table([
    { Label: "Final Transcript", Value: transcript },
    { Label: "Interim Transcript", Value: interimTranscript },
    { Label: "Is Chrome", Value: isChrome },
  ]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const [recAudio, setRecAudio] = useState("");

  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentIsSelected, setCurrentIsSelected] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState({});
  const [isMicOn, setIsMicOn] = useState(false);
  const [syllAudios, setSyllAudios] = useState([]);
  const [isCorrect, setIsCorrect] = useState(true);
  const currentWordRef = useRef(currentWord);
  const currentIsSelectedRef = useRef(currentIsSelected);
  const wordsRef = useRef(words);
  const selectedWordsRef = useRef(selectedWords);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRecordingNew, setIsRecordingNew] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [run, setRun] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  //const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const chunksRef = useRef([]);

  const syllableCount = currentImg?.syllablesAudio?.length || 0;
  const isLastSyllable = stepIndex === syllableCount;
  const [currentText, setCurrentText] = useState("");

  // Update currentText whenever currentImg or stepIndex changes
  useEffect(() => {
    const text = isLastSyllable
      ? currentImg?.completeWord
      : currentImg?.syllablesAudio?.[stepIndex]?.name || "";
    setCurrentText(text);
  }, [currentImg, stepIndex, isLastSyllable]);

  // const currentText = isLastSyllable
  //   ? currentImg?.completeWord
  //   : currentImg?.syllablesAudio?.[stepIndex]?.name || "";

  const currentAudio = isLastSyllable
    ? currentImg?.completeAudio
    : currentImg?.syllablesAudio?.[stepIndex]?.audio || null;
  const [stepsIndex, setStepsIndex] = useState(0);

  console.log("wordSyl", currentText);

  const walkSteps = [
    {
      target: ".walkthrough-step-1",
      content: (
        <div style={{ textAlign: "center" }}>
          <img
            src={Assets.cowStep}
            alt="Instructor Cow"
            style={{ width: 80, marginBottom: 10 }}
          />
        </div>
      ),
      disableBeacon: true,
      placement: "top",
    },
    {
      target: ".walkthrough-step-2",
      content: (
        <div style={{ textAlign: "center" }}>
          <img
            src={Assets.cowStep}
            alt="Instructor Cow"
            style={{ width: 80, marginBottom: 10 }}
          />
        </div>
      ),
      disableBeacon: true,
      placement: "top",
    },
    // {
    //   target: '.walkthrough-step-3',
    //   content: (
    //     <div style={{ textAlign: 'center' }}>
    //       <img src={Assets.cowStep} alt="Instructor Cow" style={{ width: 80, marginBottom: 10 }} />
    //     </div>
    //   ),
    //   disableBeacon: true,
    //   placement: 'top',
    // },
    // {
    //   target: '.walkthrough-step-4',
    //   content: (
    //     <div style={{ textAlign: 'center' }}>
    //       <img src={Assets.cowStep} alt="Instructor Cow" style={{ width: 80, marginBottom: 10 }} />
    //     </div>
    //   ),
    //   disableBeacon: true,
    //   placement: 'top',
    // },
    // {
    //   target: '.walkthrough-step-5',
    //   content: (
    //     <div style={{ textAlign: 'center' }}>
    //       <img src={Assets.cowStep} alt="Instructor Cow" style={{ width: 80, marginBottom: 10 }} />
    //     </div>
    //   ),
    //   disableBeacon: true,
    //   placement: 'top',
    // },
  ];

  const MyCustomTooltip = ({ step }) => {
    return (
      <div style={{ background: "transparent", boxShadow: "none", padding: 0 }}>
        <img
          src={Assets.cowStep}
          alt="Cow Instructor"
          style={{ width: 100, height: 100 }}
        />
      </div>
    );
  };

  // useEffect(() => {
  //   const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
  //   if (!hasSeenWalkthrough) {
  //     setRun(true);
  //     localStorage.setItem('hasSeenWalkthrough', 'true');
  //   }
  // }, []);

  //setCompleteAudio(currentImg?.completeAudio);

  const startAudioRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          //console.log("📦 Chunk recorded:", event.data);
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("⛔ Recording stopped.");
        if (chunksRef.current.length === 0) {
          console.warn("❗ No data to create blob.");
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        //console.log("✅ Blob created:", audioBlob);
        setRecordedAudioBlob(audioBlob);
        chunksRef.current = [];

        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      //console.log("🎙️ Recording started...");
    } catch (error) {
      console.error("🚨 Error starting audio recording:", error);
    }
  };

  const stopAudioRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      //console.log("🛑 Stopping recording...");
      mediaRecorderRef.current.stop();
    } else {
      console.warn("❗ Recorder already inactive or null.");
    }
  };

  const playAudioFromBlob = (blob) => {
    if (!(blob instanceof Blob)) {
      console.error("Invalid input: Expected a Blob or File.");
      return;
    }

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(blob);

    audio.src = objectUrl;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });

    audio.onended = () => {
      URL.revokeObjectURL(objectUrl);
      setIsPlaying(false);
    };
  };

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    await callTelemetryApi(
      currentText,
      sessionId,
      currentStep - 1,
      recAudio,
      responseStartTime,
      responseText?.responseText || ""
    );
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    currentWordRef.current = currentWord;
    currentIsSelectedRef.current = currentIsSelected;
    wordsRef.current = words;
    selectedWordsRef.current = selectedWords;
  }, [currentWord, currentIsSelected, words, selectedWords]);

  const initializeRecognition = () => {
    let recognitionInstance;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
    } else {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    if (recognitionInstance) {
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {};

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);

        handleWordsLogic(currentText, transcript, currentIsSelected);
        setIsProcessing(false);
        setIsMicOn(false);
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        setIsProcessing(false);
        setIsMicOn(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          console.log("No Speech!");
        } else if (event.error === "aborted") {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onend = () => {
        setIsProcessing(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, [recognition]);

  const startRecording = (word, isSelected) => {
    //console.log('recs', recognition);
    if (isChrome) {
      // if (!browserSupportsSpeechRecognition) {
      //   //alert("Speech recognition is not supported in your browser.");
      //   return;
      // }
      resetTranscript();
      startAudioRecording();
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
      });
    }
    setRecordingStates((prev) => ({
      ...prev,
      [word]: true,
    }));
    setIsRecording(true);
    setCurrentWord(word);
    setCurrentIsSelected(isSelected);
  };

  const stopRecording = (word) => {
    let audio = new Audio(correctSound);
    audio.play();
    if (isChrome) {
      SpeechRecognition.stopListening();
      stopAudioRecording();
      const finalTranscript = transcriptRef.current;
      console.log("textR", word, finalTranscript);

      const matchPercentage = phoneticMatch(word, finalTranscript);

      if (matchPercentage < 40) {
        setIncorrectWords((prevState) => ({
          ...prevState,
          [currentText]: true,
        }));
      } else {
        setIncorrectWords((prevState) => ({
          ...prevState,
          [currentText]: false,
        }));
      }

      handleWordsLogic(word, finalTranscript, currentIsSelected);
      setIsMicOn(false);
      setIsRecording(false);
      setIsProcessing(false);
    } else {
      if (recognition) {
        recognition.stop();
      }
      setIsProcessing(true);
    }
    setRecordingStates((prev) => ({
      ...prev,
      [word]: false,
    }));
    setIsRecording(false);
  };

  useEffect(() => {
    if (isRecording && recognition && recognition.state !== "recording") {
      recognition.start();
    }
  }, [isRecording, recognition, currentWord]);

  useEffect(() => {
    if (!isChrome) {
      initializeRecognition();
    }
  }, []);

  const playAudio = (audioPath) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  const handlePlayAudio = (elem) => {
    const matchedSyllable = syllAudios.find(
      (syllable) => syllable.name.toLowerCase() === elem.toLowerCase()
    );

    if (matchedSyllable) {
      playAudio(matchedSyllable.audio);
    } else {
      console.warn(`No audio found for the syllable: ${elem}`);
    }
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

  useEffect(() => {
    setSelectedWords([]);
  }, [contentId]);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    setWordsAfterSplit(currentImg.syllable);
    setWords(currentImg.syllable);
    setSyllAudios(currentImg.syllablesAudio);
    wordsRef.current = currentImg.syllable;
  }, [currentImg]);

  const handleWordsLogic = (word, transcribedText, isSelected) => {
    console.log("wordsZ", word, transcribedText);

    const matchPercentage = phoneticMatch(word, transcribedText);

    if (matchPercentage < 40) {
      setIncorrectWords((prevState) => ({
        ...prevState,
        [word]: true,
      }));
    } else {
      setIncorrectWords((prevState) => ({
        ...prevState,
        [word]: false,
      }));
    }

    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    if (
      selectedWordsRef.current?.length + 1 !== wordsAfterSplit?.length ||
      isSelected
    ) {
      setEnableNext(false);
    }

    if (isSelected) {
      // Remove the word from selectedWords and add it back to words
      let selectedWordsArr = [...selectedWordsRef.current];
      let index = selectedWordsArr.findIndex((elem) => elem === word);
      if (index !== -1) {
        selectedWordsArr.splice(index, 1);
        setSelectedWords(selectedWordsArr);
        selectedWordsRef.current = selectedWordsArr;

        // Add the word back to words only if it doesn't already exist
        if (!wordsRef.current.includes(word)) {
          const updatedWords = [...wordsRef.current, word];
          setWords(updatedWords);
          wordsRef.current = updatedWords;
        }
      }
    } else {
      // Remove the word from words and add it to selectedWords
      let wordsArr = [...wordsRef.current];
      let index = wordsArr.findIndex((elem) => elem === word);
      if (index !== -1) {
        wordsArr.splice(index, 1);
        setWords(wordsArr);
        wordsRef.current = wordsArr;
      }

      // Add the word to selectedWords only if it doesn't already exist
      if (!selectedWordsRef.current.includes(word)) {
        const updatedSelectedWords = [...selectedWordsRef.current, word];
        setSelectedWords(updatedSelectedWords);
        selectedWordsRef.current = updatedSelectedWords;
      }
    }
  };

  const handleWords = (word, isSelected) => {
    if (isMicOn) {
      stopRecording();
      setIsMicOn(false);
    } else {
      setIsMicOn(true);
    }
    startRecording(word, isSelected);
  };

  const answer =
    selectedWordsRef.current?.length !== wordsAfterSplit?.length
      ? ""
      : selectedWordsRef.current?.join(" ") === parentWords
      ? "correct"
      : "wrong";

  useEffect(() => {
    const isWrong =
      selectedWordsRef.current?.length !== wordsAfterSplit?.length ||
      selectedWordsRef.current?.join(" ") !== parentWords;

    setIsCorrect(isWrong);
  }, [selectedWordsRef.current, wordsAfterSplit, parentWords]);

  console.log("ans", incorrectWords);

  const getBorderColor = () => {
    if (answer === "correct") {
      return "#58CC02";
    } else if (answer === "wrong") {
      return "#C30303";
    } else if (
      !wordsRef.current?.length &&
      !!selectedWordsRef.current?.length &&
      type === "word"
    ) {
      return "#1897DE";
    }
    return "rgba(51, 63, 97, 0.10)";
  };

  const getBorder = () => {
    if (answer === "wrong") return "2px solid #C30303";
    if (answer === "correct") return "none";
    if (
      !wordsRef.current.length &&
      selectedWordsRef.current.length &&
      type === "word"
    ) {
      return "2px solid #1897DE";
    }
    return "none";
  };

  const getMarginLeft = (wIndex) => {
    return wIndex > 0 ? "150px!important" : undefined;
  };

  const getDynamicMarginLeft = (wIndex) => {
    return wordsRef.current.length === 1 && wIndex === 0 ? "250px" : "0px";
  };

  const getCircleHeight = (elem) => {
    return elem?.length < 3 ? 65 : 70;
  };

  const getColor = (type, isIncorrect, answer) => {
    if (type === "word") {
      if (isIncorrect) return "#C30303";
      if (answer === "correct") return "#58CC02";
      return "#1897DE";
    }
    if (answer === "wrong") return "#C30303";
    return "#333F61";
  };

  const isCorrectWord = incorrectWords[currentText] === false;
  const isIncorrectWord = incorrectWords[currentText] === true;

  console.log("audios", completeAudio, answer);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      answer={answer}
      isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      recAudio={recAudio}
      isCorrect={isCorrect}
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
      }}
    >
      {/* {isRecordingComplete && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <img
            src={Assets.frame}
            height={"110px"}
            alt="frame"
            width={"300px"}
            style={{ position: "relative", zIndex: 1 }}
          />
          <img
            src={currentImg?.img}
            alt="pencil"
            height={"85px"}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      )} */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          height: "60vh",
          //width: "80%"
        }}
      >
        {/*         
        <Joyride
          steps={walkSteps}
          run={run}
          //stepIndex={stepsIndex}
          showSkipButton={false}
          showProgress={false}
          disableOverlayClose={true}
          disableCloseOnEsc={true}
          spotlightClicks={true}
          tooltipComponent={MyCustomTooltip}
          hideBackButton={true}
          styles={{
            options: {
              //arrowColor: "#fff",
              backgroundColor: "#fff",
              backgroundColor: 'transparent',
              arrowColor: 'transparent', 
              textColor: "#333",
              zIndex: 10000,
            },
          }}
          callback={(data) => {
            console.log('Joyride callback:', data);
            if (data.status === 'finished' || data.status === 'skipped') {
              setRun(false);
            }
          }}                  
        />
        */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maskBorderWidth: 6,
          }}
        >
          <img
            src={currentImg?.img}
            alt="pencil"
            height={"200px"}
            width={"200px"}
            style={{
              zIndex: 2,
            }}
          />
        </Box>
        <Box
          sx={{
            width: "1px",
            backgroundColor: "#E0E2E7",
            height: "100%",
            border: "1px solid #E0E2E7",
          }}
        />
        {false && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                mb: 5,
                mt: 4,
              }}
            >
              {wordsRef.current?.slice(0, 1)?.map((elem, wIndex) => (
                <React.Fragment key={elem}>
                  {type === "word" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        //marginLeft: getDynamicMarginLeft(wIndex),
                      }}
                    >
                      <Box
                        onClick={() => handleWords(elem)}
                        sx={{
                          marginTop: "10px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: { xs: "30px", sm: "40px", md: "50px" },
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          //   background: "#1897DE",
                          m: { xs: 0.5, sm: 1 },
                          cursor:
                            wIndex === 0
                              ? `url(${clapImage}) 32 24, auto`
                              : "auto",
                          //   borderRadius: "12px",
                          //   border: "5px solid #10618E",
                          fontSize: {
                            xs: "30px",
                            sm: "30px",
                            md: "40px",
                            lg: "40px",
                          },
                          //marginLeft: getMarginLeft(wIndex),
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#1CB0F60F",
                            border: "2px solid #1CB0F633",
                            borderRadius: "16px",
                            display: "flex",
                            padding: "8px 70px",
                          }}
                        >
                          {elem?.split("")?.map((char, index) => (
                            <span
                              style={{
                                color: wIndex == 0 ? "##333F61" : "#000000",
                                fontWeight: 700,
                                fontSize: "72px",
                                lineHeight: "87px",
                                letterSpacing: "2%",
                                fontFamily: "Quicksand",
                                marginLeft: index > 0 ? "10px" : undefined,
                                textTransform: "uppercase",
                              }}
                            >
                              {char}
                            </span>
                          ))}
                        </Box>
                      </Box>
                    </div>
                  ) : (
                    <Box
                      onClick={() => handleWords(elem)}
                      sx={{
                        textAlign: "center",
                        px: { xs: "15px", sm: "20px", md: "25px" },
                        py: { xs: "8px", sm: "10px", md: "12px" },
                        m: { xs: 0.5, sm: 1 },
                        textTransform: "none",
                        borderRadius: "12px",
                        border: `1px solid rgba(51, 63, 97, 0.10)`,
                        background: "#FFF",
                        cursor: "pointer",
                        fontSize: {
                          xs: "25px",
                          sm: "30px",
                          md: "35px",
                          lg: "40px",
                        },
                      }}
                    >
                      <span
                        style={{
                          color: "#6F80B1",
                          fontWeight: 600,
                          fontFamily: "Quicksand",
                        }}
                      >
                        {elem}
                      </span>
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </div>
        )}
        <Box textAlign="center">
          <Box
            sx={{
              backgroundColor: !isRecorded
                ? "#1CB0F60F" // default background
                : isIncorrectWord
                ? "#58CC020F" // red FF7F360F
                : "#58CC020F", // green background
              border: !isRecorded
                ? "2px solid #1CB0F633" // default border
                : isIncorrectWord
                ? "2px solid #58CC02" // red FF7F36
                : "2px solid #58CC02", // green border
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 70px",
              marginBottom: "16px",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isRecorded && (
                <img
                  //src={!isIncorrectWord ? Assets.tick : Assets.wrongTick}
                  src={Assets.tick}
                  alt="tick"
                  style={{ marginRight: "16px", width: "56px", height: "56px" }}
                />
              )}
              {currentText?.split("").map((char, index) => (
                <span
                  key={index}
                  style={{
                    color: !isRecorded
                      ? "#333F61" // default background
                      : isIncorrectWord
                      ? "#58CC02" // red FF7F36
                      : "#58CC02",
                    //color: isRecorded ? "#58CC02" : "#333F61",
                    fontWeight: 700,
                    fontSize: "72px",
                    lineHeight: "87px",
                    letterSpacing: "2%",
                    fontFamily: "Quicksand",
                    marginLeft: index > 0 ? "10px" : undefined,
                    textTransform: "uppercase",
                  }}
                >
                  {char}
                </span>
              ))}
            </Box>
            {isRecorded && (
              <img
                src={Assets.graph}
                alt="graph"
                style={{ height: "40px", margin: "10px" }}
              />
            )}
          </Box>

          {/* Action Buttons */}
          {!isRecording && !isRecorded && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                maskBorderWidth: 6,
                gap: 5,
              }}
            >
              {isPlaying ? (
                <div>
                  <Box
                    sx={{
                      marginTop: "7px",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: { xs: "50px", sm: "60px", md: "70px" },
                      cursor: "pointer",
                      marginLeft: getMarginLeft(0),
                    }}
                    onClick={stopCompleteAudio}
                  >
                    <StopButton height={50} width={50} />
                  </Box>
                </div>
              ) : (
                <div>
                  <Box
                    className="walkthrough-step-1"
                    sx={{
                      marginTop: "7px",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: { xs: "50px", sm: "60px", md: "70px" },
                      cursor: `url(${clapImage}) 32 24, auto`,
                      marginLeft: getMarginLeft(0),
                    }}
                    onClick={() => {
                      playWordAudio(currentAudio);
                    }}
                  >
                    <ListenButton height={50} width={50} />
                  </Box>
                </div>
              )}
              <Box
                className="walkthrough-step-2"
                sx={{
                  position: "relative",
                  width: "90px",
                  height: "90px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "7px",
                  //marginLeft: getMarginLeft(0),
                  cursor: `url(${clapImage}) 32 24, auto`,
                }}
                onClick={() => {
                  setIsRecording(true);
                  startRecording(currentText);
                  //startAudioRecording();
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "90px",
                    height: "90px",
                    backgroundColor: "#58CC0233",
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
                  }}
                />
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <SpeakButton height={50} width={50} />
                </Box>
              </Box>
            </Box>
          )}

          {isRecording && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                maskBorderWidth: 6,
              }}
            >
              <Box style={{ marginTop: "10px", marginBottom: "50px" }}>
                <RecordVoiceVisualizer />
              </Box>
              <Box
                className="walkthrough-step-3"
                sx={{
                  marginTop: "7px",
                  position: "relative",
                  display: "flex",
                  gap: "50px",
                  justifyContent: "center",
                  alignItems: "center",
                  //height: { xs: "30px", sm: "40px", md: "50px" },
                  minWidth: { xs: "50px", sm: "60px", md: "70px" },
                  cursor: `url(${clapImage}) 32 24, auto`,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "90px",
                    height: "90px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    //marginTop: "7px",
                    //marginLeft: getMarginLeft(0),
                    cursor: `url(${clapImage}) 32 24, auto`,
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    setIsRecording(false);
                    setIsRecorded(true);
                    stopRecording(currentText);
                    //stopAudioRecording();
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: "90px",
                      height: "90px",
                      backgroundColor: "#FF4B4B33",
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
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <StopButton height={50} width={50} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {isRecorded && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
                gap: "10px",
                //maskBorderWidth: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  marginRight: "5px",
                  //maskBorderWidth: 6,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maskBorderWidth: 6,
                    gap: 5,
                  }}
                >
                  {isPlaying ? (
                    <div>
                      <Box
                        sx={{
                          //marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                          marginLeft: getMarginLeft(0),
                        }}
                        onClick={stopCompleteAudio}
                      >
                        <img
                          src={spinnerStop}
                          alt="Audio"
                          style={{
                            height: "50px",
                            width: "50px",
                            cursor: "pointer",
                          }}
                        />
                        {/* <StopButton height={50} width={50} /> */}
                      </Box>
                    </div>
                  ) : (
                    <div>
                      <Box
                        className="walkthrough-step-4"
                        sx={{
                          //marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: `url(${clapImage}) 32 24, auto`,
                          //marginLeft: getMarginLeft(0),
                        }}
                        onClick={() => {
                          playAudioFromBlob(recordedAudioBlob);
                        }}
                      >
                        <img
                          src={listenImg2}
                          alt="Audio"
                          style={{
                            height: "50px",
                            width: "50px",
                            cursor: "pointer",
                          }}
                        />
                        {/* <ListenButton height={50} width={50} /> */}
                      </Box>
                    </div>
                  )}
                </Box>
                <div
                  onClick={() => {
                    setIsRecorded(false);
                    setIsRecording(true);
                    startRecording(currentText);
                  }}
                  style={{
                    //marginTop: "-10px",
                    cursor: "pointer",
                    //marginLeft: "30px",
                  }}
                >
                  <RetryIcon height={50} width={50} />
                </div>
              </Box>
              <Box
                className="walkthrough-step-5"
                onClick={() => {
                  setIsRecorded(false);
                  if (isLastSyllable) {
                    callTelemetry();
                    handleNext();
                    setStepIndex(0);
                  } else {
                    setStepIndex((prev) => prev + 1);
                  }
                }}
                sx={{
                  marginTop: "30px",
                  cursor: "pointer",
                  //marginLeft: "30px",
                }}
              >
                <NextButtonRound height={50} width={50} />
              </Box>
            </Box>
          )}
          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            src={completeAudio}
            hidden
          />
        </Box>
      </div>
    </MainLayout>
  );
};

export default Mechanics7;
