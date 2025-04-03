import { Box, CardContent, Typography, CircularProgress } from "@mui/material";
import { createRef, useState, useEffect, useRef } from "react";
import v11 from "../../assets/audio/V10.mp3";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import hintsImg from "../../assets/hints.svg";
import {
  PlayAudioButton,
  StopAudioButton,
  ListenButton,
  RetryIcon,
  StopButton,
  SpeakButton,
  NextButtonRound,
} from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import PropTypes from "prop-types";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

const isChrome =
  /Chrome/.test(navigator.userAgent) &&
  /Google Inc/.test(navigator.vendor) &&
  !/Edg/.test(navigator.userAgent);

const WordsOrImage = ({
  handleNext,
  background,
  header,
  type,
  words,
  hints,
  image,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  percentage,
  fluency,
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
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  loading,
  setOpenMessageDialog,
  isNextButtonCalled,
  setIsNextButtonCalled,
}) => {
  const audioRefs = createRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storedData, setStoredData] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSpeakButton, setShowSpeakButton] = useState(true);
  const [showStopButton, setShowStopButton] = useState(false);
  const [showListenRetryButtons, setShowListenRetryButtons] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const audioRef = useRef(null);
  const currentWordRef = useRef(null);
  const currentIsSelected = useRef(false);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [showWrongTick, setShowWrongTick] = useState(true);

  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  let mediaRecorder;
  let recordedChunks = [];

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

      recognitionInstance.onstart = () => {
        startAudioRecording();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        setShowStopButton(false);
        setShowListenRetryButtons(true);

        const matchPercentage = phoneticMatch(
          currentWordRef.current,
          transcript
        );

        if (matchPercentage < 49) {
          setAnswer(false);
          const audio = new Audio(wrongSound);
          audio.play();
        } else {
          setAnswer(true);
          const audio = new Audio(correctSound);
          audio.play();
        }
        stopAudioRecording();
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          console.log("No Speech!");
        } else if (event.error === "aborted") {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onend = () => {
        stopAudioRecording();
      };

      setRecognition(recognitionInstance);
    }
  };

  const startAudioRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing audio stream:", error);
      });
  };

  const stopAudioRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        recordedChunks = [];
      };
    }
  };

  const startRecording = (word, isSelected) => {
    if (isChrome) {
      if (!browserSupportsSpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
      }
      resetTranscript();
      startAudioRecording();
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
      });
    }
    setIsRecording(true);
    setShowSpeakButton(false);
    setShowStopButton(true);
    currentWordRef.current = word;
    currentIsSelected.current = isSelected;
  };

  const stopRecording = (word) => {
    if (isChrome) {
      SpeechRecognition.stopListening();
      stopAudioRecording();
      const finalTranscript = transcriptRef.current;
      const matchPercentage = phoneticMatch(
        currentWordRef.current,
        finalTranscript
      );

      if (matchPercentage < 49) {
        setAnswer(false);
        const audio = new Audio(wrongSound);
        audio.play();
      } else {
        setAnswer(true);
        const audio = new Audio(correctSound);
        audio.play();
      }
      setIsRecording(false);
      setShowStopButton(false);
      setShowListenRetryButtons(true);
    } else {
      setIsRecording(false);
      setShowStopButton(false);
      setShowListenRetryButtons(true);
      if (recognition) {
        recognition.stop();
      }
    }
  };

  const retryRecording = (word, isSelected) => {
    setShowListenRetryButtons(false);
    setShowSpeakButton(false);
    setShowStopButton(true);
    startRecording(word, isSelected);
  };

  const nextRecording = () => {
    setShowListenRetryButtons(false);
    setShowSpeakButton(true);
    setShowStopButton(false);
    setAnswer("");
    handleNext();
  };

  useEffect(() => {
    if (isRecording && recognition && recognition.state !== "recording") {
      recognition.start();
    }
  }, [isRecording, recognition]);

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

  useEffect(() => {
    if (!isChrome) {
      initializeRecognition();
    }
  }, []);

  const updateStoredData = (audio, isCorrect) => {
    if (audio && words) {
      const newEntry = {
        selectedAnswer: words,
        audioUrl: audio,
        correctAnswer: isCorrect,
      };
      setStoredData((prevData) => [...prevData, newEntry]);
    }
  };

  const resetStoredData = () => {
    setStoredData([]);
  };

  useEffect(() => {
    updateStoredData();
    setShowHint(false);
  }, [handleNext]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRefs.current?.pause();
      setIsPlaying(false);
    } else {
      audioRefs.current?.play();
      setIsPlaying(true);
    }
  };

  const playAudio = () => {
    if (recordedAudioBlob && audioRef.current) {
      const audioBlobUrl = URL.createObjectURL(recordedAudioBlob);
      audioRef.current.src = audioBlobUrl;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const getAnswerColor = (answer) => {
    if (answer === true) return "green";
    if (answer === false) return "red";
    return "#333F61";
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      storedData={storedData}
      resetStoredData={resetStoredData}
      pageName={"wordsorimage"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        contentType,
        percentage,
        fluency,
        playTeacherAudio,
        handleBack,
        isShowCase,
        startShowCase,
        setStartShowCase,
        disableScreen,
        livesData,
        gameOverData,
        loading,
        setIsNextButtonCalled,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            position: "absolute",
            right: "20px",
            textAlign: "center",
            cursor: "pointer",
            width: "100px",
          }}
          onClick={() => setShowHint(!showHint)}
        >
          <img style={{ height: "55px" }} src={hintsImg} alt="" />
          <p>Hint</p>
          {showHint && (
            <Box
              sx={{
                position: "absolute",
                top: "80px",
                width: "100%",
                right: "0px",
                background: "white",
                boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#333F61",
                fontWeight: 600,
                backgroundColor: "#ffff12",
              }}
            >
              {hints}
            </Box>
          )}
        </Box>
        <Typography
          variant="h5"
          component="h4"
          sx={{
            color: "#333F61",
            fontSize: "30px",
            letterSpacing: "1.5px",
            lineHeight: "normal",
            fontWeight: 600,
            fontFamily: "Quicksand",
            marginLeft: "20px",
            textAlign: "center",
          }}
        >
          {header}
        </Typography>
      </Box>
      <CardContent
        sx={{
          overflow: "hidden",
          pt: "100px",
          opacity: disableScreen ? 0.25 : 1,
          pointerEvents: disableScreen ? "none" : "initial",
        }}
      >
        <Box>
          {type === "image" ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={image}
                style={{
                  maxWidth: "450px",
                  maxHeight: "130px",
                  marginBottom: "40px",
                }}
              />
            </Box>
          ) : type === "phonics" ? (
            <Box
              position="relative"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: "40px",
              }}
            >
              <Box
                position="relative"
                sx={{
                  minWidth: "403px",
                  borderRadius: "15px",
                  background: "rgba(255, 161, 50, 0.1)",
                  height: "88px",
                  display: "flex",
                }}
              >
                <audio
                  ref={audioRefs}
                  preload="metadata"
                  onCanPlay={(e) => {
                    setIsReady(true);
                  }}
                  onPlaying={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source type="audio/mp3" src={v11} />
                </audio>

                <Box
                  sx={{
                    height: "88px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      marginLeft: "20px",
                      marginTop: "5px",
                    }}
                    onClick={() => {
                      togglePlayPause();
                    }}
                  >
                    {isReady &&
                      (isPlaying ? (
                        <StopAudioButton color={"#FFA132"} />
                      ) : (
                        <PlayAudioButton color={"#FFA132"} />
                      ))}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h4"
                    sx={{
                      color: "#333F61",
                      fontSize: "44px",
                      letterSpacing: "2.2px",
                      lineHeight: "normal",
                      fontWeight: 600,
                      fontFamily: "Quicksand",
                      marginLeft: "20px",
                    }}
                  >
                    {"REF LECTION"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: {
                  xs: "",
                  md: imageLoaded ? "flex" : "",
                },
                justifyContent: "center",
                width: "100%",
              }}
            >
              {image && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={image}
                    onLoad={() => setImageLoaded(true)} // When image loads, set state to true
                    onError={(e) => {
                      e.target.style.display = "none"; // Hide if error occurs
                      setImageLoaded(false);
                    }}
                    style={{
                      width: "80%", // Image will take full width of the parent container
                      maxWidth: "500px", // Limit the width to 500px
                      height: "auto", // Maintain aspect ratio
                      maxHeight: "500px", // Cap the height at 200px
                      marginBottom: "40px",
                      objectFit: "contain", // Ensures the image fits well within the dimensions
                    }}
                    alt="Responsive content" // Adding alt text for accessibility
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center", // Centers content vertically
                  alignItems: "center", // Centers content horizontally
                  width: "100%",
                }}
              >
                {!words && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                  </Box>
                )}
                {words && !matchedChar && (
                  <Typography
                    variant="h5"
                    component="h4"
                    sx={{
                      mb: 4,
                      color: getAnswerColor(answer),
                      textAlign: "center",
                      fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                      fontWeight: 700,
                      fontFamily: "Quicksand",
                      lineHeight: "50px",
                    }}
                    fontSize={{ md: "40px", xs: "25px" }}
                  >
                    {words ? words[0].toUpperCase() + words.slice(1) : ""}
                  </Typography>
                )}
                {matchedChar && (
                  <Box
                    display={"flex"}
                    mb={4}
                    sx={{
                      color: "red",
                      width: "100%",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {highlightWords(words, matchedChar, getAnswerColor(answer))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {(level === 1 || level === 2 || level === 3) && !isShowCase ? (
            <div>
              {showSpeakButton && (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => startRecording(words, true)}
                >
                  <SpeakButton />
                </Box>
              )}
              {showStopButton && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                >
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => stopRecording(words)}
                  >
                    <StopButton />
                  </Box>
                  <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <RecordVoiceVisualizer />
                  </Box>
                </div>
              )}
              {showListenRetryButtons && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                >
                  <Box sx={{ cursor: "pointer" }} onClick={playAudio}>
                    <ListenButton />
                  </Box>
                  <Box
                    sx={{ cursor: "pointer", marginLeft: "16px" }}
                    onClick={() => retryRecording(words, true)}
                  >
                    <RetryIcon />
                  </Box>
                  <Box
                    sx={{ cursor: "pointer", marginLeft: "16px" }}
                    onClick={() => nextRecording()}
                  >
                    <NextButtonRound />
                  </Box>
                </div>
              )}
              <audio ref={audioRef} src={recordedAudioBlob} hidden />
            </div>
          ) : (
            <VoiceAnalyser
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              originalText={words}
              handleNext={handleNext}
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                setEnableNext,
                livesData,
                setLivesData,
                setOpenMessageDialog,
                isNextButtonCalled,
                setIsNextButtonCalled,
              }}
            />
          )}
        </Box>
      </CardContent>
    </MainLayout>
  );
};

WordsOrImage.propTypes = {
  handleNext: PropTypes.func.isRequired,
  header: PropTypes.string,
  image: PropTypes.string,
  setVoiceText: PropTypes.func.isRequired,
  setRecordedAudio: PropTypes.func.isRequired,
  setVoiceAnimate: PropTypes.func.isRequired,
  enableNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  points: PropTypes.number,
  currentStep: PropTypes.number.isRequired,
  percentage: PropTypes.string,
  fluency: PropTypes.bool,
  isDiscover: PropTypes.bool,
  showProgress: PropTypes.bool,
  callUpdateLearner: PropTypes.bool,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  setEnableNext: PropTypes.func.isRequired,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  setLivesData: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setIsNextButtonCalled: PropTypes.func,
  background: PropTypes.bool,
  type: PropTypes.any,
  words: PropTypes.any,
  storyLine: PropTypes.number,
  steps: PropTypes.number,
  contentId: PropTypes.any,
  contentType: PropTypes.string,
  level: PropTypes.any,
  progressData: PropTypes.object,
  playTeacherAudio: PropTypes.func,
  livesData: PropTypes.any,
  gameOverData: PropTypes.any,
  highlightWords: PropTypes.func,
  matchedChar: PropTypes.any,
};

export default WordsOrImage;
