import {
  Box,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { createRef, useState, useEffect, useRef, useCallback } from "react";
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
  getLocalData,
} from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import PropTypes from "prop-types";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import teacherImg from "../../assets/teacher.png";
import studentImg from "../../assets/student.png";
import listenImg2 from "../../assets/listen.png";
import spinnerStop from "../../assets/pause.png";
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

const WordsOrImage = ({
  handleNext,
  mechanism_id = "",
  background,
  header,
  type,
  words,
  hints = "",
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
  audioLink,
}) => {
  const audioRefs = createRef(null);
  const [audioInstance, setAudioInstance] = useState(null);
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
  const audioRefNew = useRef(null);
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
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const mimeType = "audio/webm;codecs=opus";

  const startAudioRecording = useCallback(async () => {
    setRecordedBlob(null);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.error("MIME type not supported:", mimeType);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordedChunksRef.current.length === 0) {
          console.warn("No audio data captured.");
          setRecordedBlob(null);
          return;
        }

        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        setRecordedBlob(blob);
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Emit data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData(); // Flush remaining data
      recorder.stop();
      setIsRecording(false);
    }
  }, []);

  const playRecordings = useCallback(() => {
    console.log("play", isPlaying);

    if (!recordedBlob || !(recordedBlob instanceof Blob)) {
      console.error("No valid audio blob to play:", recordedBlob);
      return;
    }

    if (audioRefNew.current) {
      // If audio is already playing, resume from where it left off
      audioRefNew.current.play();
      setIsPlaying(true);
      return;
    }

    console.log("bls", recordedBlob);

    const audioUrl = URL.createObjectURL(recordedBlob);
    const audio = new Audio(audioUrl);
    audioRefNew.current = audio;

    // audio.onplay = () => {
    //   setIsPlaying(true);
    // };
    audio.play();
    setIsPlaying(true);

    console.log("play", isPlaying);

    audio.onended = () => {
      setIsPlaying(false);
      audioRefNew.current = null;
    };

    audio.onerror = () => {
      console.error("Playback failed:", audio.error);
      setIsPlaying(false);
    };

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setIsPlaying(false);
    });
  }, [recordedBlob]);

  const stopPlayback = useCallback(() => {
    if (audioRefNew.current) {
      audioRefNew.current.pause();
      audioRefNew.current.currentTime = 0;
      audioRefNew.current = null;
      setIsPlaying(false);
    }
  }, []);

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

  const startRecording = (word, isSelected) => {
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
      console.log("transcript", finalTranscript, currentWordRef.current);

      const matchPercentage = phoneticMatch(
        currentWordRef.current,
        finalTranscript
      );

      const isFirefox =
        typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().includes("firefox");

      if (isFirefox) {
        setAnswer(true);
        const audio = new Audio(correctSound);
        audio.play();
      } else {
        if (matchPercentage < 49) {
          setAnswer(false);
          const audio = new Audio(wrongSound);
          audio.play();
        } else {
          setAnswer(true);
          const audio = new Audio(correctSound);
          audio.play();
        }
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

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);
    console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      words,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      responseText?.responseText || ""
    );
  };

  const retryRecording = (word, isSelected) => {
    setShowListenRetryButtons(false);
    setShowSpeakButton(false);
    setShowStopButton(true);
    startRecording(word, isSelected);
  };

  const nextRecording = () => {
    if (audioRefNew.current) {
      audioRefNew.current.pause();
      audioRefNew.current.currentTime = 0;
      audioRefNew.current = null;
      setIsPlaying(false);
    }
    callTelemetry();
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

  const stopCompleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const getAnswerColor = (answer) => {
    const isFirefox =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox");

    if (isFirefox && (answer === true || answer === false)) {
      return "green";
    }

    if (answer === true) return "green";
    if (answer === false) return "red";
    return "#333F61";
  };

  console.log("wds", words, matchedChar, answer);

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
          {mechanism_id === "mechanic_15" ? header : ""}
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
                position: "relative",
                display: {
                  xs: "",
                  // md: imageLoaded ? "flex" : "",
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
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={image}
                      onLoad={() => setImageLoaded(true)} // When image loads, set state to true
                      onError={(e) => {
                        e.target.style.display = "none"; // Hide if error occurs
                        setImageLoaded(false);
                      }}
                      style={{
                        width: "100%", // Image will take full width of the parent container
                        maxWidth: "400px", // Limit the width to 500px
                        marginBottom: "40px",
                        height: "auto", // Maintain aspect ratio
                        maxHeight: "340px", // Cap the height at 200px
                        objectFit: "contain", // Ensures the image fits well within the dimensions
                      }}
                      alt="Responsive content" // Adding alt text for accessibility
                    />
                    {hints && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: "-100px",
                          top: "0px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: "100px",
                          zIndex: 1000,
                        }}
                        onClick={() => setShowHint(!showHint)}
                      >
                        <img style={{ height: "55px" }} src={hintsImg} alt="" />
                        <p>Hint</p>
                        {showHint && (
                          <Box
                            sx={(theme) => ({
                              position: "absolute",
                              bottom: "0px",
                              left: "90px",
                              width: "150px",
                              backgroundColor: "#ffff12",
                              padding: "10px 15px",
                              borderRadius: "20px",
                              fontSize: "20px",
                              color: "#333F61",
                              fontWeight: 600,
                              fontFamily:
                                '"Comic Sans MS", cursive, sans-serif',
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              maxWidth: "150px",
                              textAlign: "center",
                              lineHeight: "1.4",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                              zIndex: 1001,
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                bottom: "20px",
                                left: "-15px",
                                width: "15px",
                                height: "15px",
                                backgroundColor: "#ffff12",
                                borderRadius: "50%",
                                boxShadow: "10px 10px 0 0 #ffff12",
                              },
                              [theme.breakpoints.down(1120)]: {
                                left: "auto",
                                right: "90px",
                                "&::before": {
                                  left: "auto",
                                  right: "-15px",
                                  boxShadow: "-10px 10px 0 0 #ffff12", // Flip direction
                                },
                              },
                            })}
                          >
                            {hints}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  // flexDirection: "column",
                  justifyContent: "space-around", // Centers content vertically
                  alignItems: "center", // Centers content horizontally
                  width: "100%",
                  gap: 4,
                  marginBottom: "40px",
                }}
              >
                {!words && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                  </Box>
                )}
                {words && !matchedChar && (
                  <Box
                    sx={{
                      ...(mechanism_id === "mechanic_15"
                        ? {
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 8,
                          }
                        : ""),
                    }}
                  >
                    {mechanism_id === "mechanic_15" && (
                      <Avatar
                        src={teacherImg}
                        sx={{ bgcolor: "green", height: "60px", width: "60px" }}
                      >
                        Teacher
                      </Avatar>
                    )}

                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                        fontWeight: 700,
                        fontFamily: "Quicksand",
                        lineHeight: "50px",
                        ...(mechanism_id === "mechanic_15"
                          ? {
                              position: "relative",
                              backgroundColor: "#FAD7A0",
                              padding: "10px 20px",
                              borderRadius: "20px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: "50%",
                                left: "-10px",
                                transform: "translateY(-50%)",
                                width: 0,
                                height: 0,
                                borderTop: "10px solid transparent",
                                borderBottom: "10px solid transparent",
                                borderRight: "10px solid #d8d8d8",
                              },
                            }
                          : {
                              mb: 4,
                              color: getAnswerColor(answer),
                              textAlign: "center",
                            }),
                      }}
                      fontSize={{ md: "40px", xs: "25px" }}
                    >
                      {words ? words[0].toUpperCase() + words.slice(1) : ""}
                    </Typography>
                  </Box>
                )}
                {mechanism_id === "mechanic_15" && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        position: "relative",
                        backgroundColor: "#D7BDE2",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                        fontWeight: 700,
                        fontFamily: "Quicksand",
                        lineHeight: "50px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: "50%",
                          right: "-10px",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "10px solid transparent",
                          borderBottom: "10px solid transparent",
                          borderLeft: "10px solid #d8d8d8",
                        },
                      }}
                      fontSize={{ md: "40px", xs: "25px" }}
                    >
                      <motion.div style={{ display: "flex", gap: "5px" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          Speak
                          {[...Array(3)].map((_, i) => (
                            <motion.span
                              key={i}
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "black",
                              }}
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </Box>
                      </motion.div>
                    </Typography>
                    <Avatar
                      src={studentImg}
                      sx={{ bgcolor: "green", height: "60px", width: "60px" }}
                    >
                      N
                    </Avatar>
                  </Box>
                )}
                {matchedChar &&
                  (level === 3 ? (
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                        fontWeight: 700,
                        fontFamily: "Quicksand",
                        lineHeight: "50px",
                        //background: "#FFF0BD",
                        color: "black",
                      }}
                    >
                      {words}
                    </Typography>
                  ) : (
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
                      {highlightWords(
                        words,
                        matchedChar,
                        getAnswerColor(answer)
                      )}
                    </Box>
                  ))}
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
                  {/* <Box sx={{ cursor: "pointer" }} onClick={playAudio}>
                    <ListenButton />
                  </Box> */}
                  {isPlaying ? (
                    <div>
                      <Box
                        sx={{
                          //marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          //minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          cursor: "pointer",
                          //marginLeft: getMarginLeft(0),
                        }}
                        onClick={() => {
                          stopPlayback();
                          //setIsPlaying(false);
                        }}
                      >
                        <img
                          src={spinnerStop}
                          alt="Audio"
                          style={{
                            height: "70px",
                            width: "70px",
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
                          //minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          //cursor: `url(${clapImage}) 32 24, auto`,
                          //marginLeft: getMarginLeft(0),
                        }}
                        onClick={() => {
                          playRecordings();
                          //setIsPlaying(true);
                        }}
                        //disabled={!recordedAudioBlob}
                      >
                        <img
                          src={listenImg2}
                          alt="Audio"
                          style={{
                            height: "70px",
                            width: "70px",
                            cursor: "pointer",
                          }}
                        />
                        {/* <ListenButton height={50} width={50} /> */}
                      </Box>
                    </div>
                  )}
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
              audioLink={audioLink ? audioLink : null}
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
