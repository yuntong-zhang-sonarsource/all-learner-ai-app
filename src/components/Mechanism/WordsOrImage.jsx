import { Box, CardContent, Typography, CircularProgress } from "@mui/material";
import { createRef, useState, useEffect, useRef } from "react";
import v11 from "../../assets/audio/V10.mp3";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
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
import { metaphone } from "metaphone";

const phoneticMatch = (str1, str2) => {
  //console.log('sss', str1, str2);

  const phonetic1 = metaphone(str1);
  const phonetic2 = metaphone(str2);
  const distance = levenshtein(phonetic1, phonetic2);
  //console.log(`Phonetic 1: ${phonetic1}, Phonetic 2: ${phonetic2}`);
  const maxLength = Math.max(phonetic1.length, phonetic2.length);
  return ((maxLength - distance) / maxLength) * 100;
};

const levenshtein = (a, b) => {
  const tmp = [];
  let i,
    j,
    alen = a.length,
    blen = b.length,
    res;

  if (alen === 0) {
    return blen;
  }
  if (blen === 0) {
    return alen;
  }

  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      res = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + res
      );
    }
  }

  return tmp[alen][blen];
};

const WordsOrImage = ({
  handleNext,
  background,
  header,
  type,
  words,
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
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [storedData, setStoredData] = useState([]);

  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [recordingStates, setRecordingStates] = useState({});
  const [showSpeakButton, setShowSpeakButton] = useState(true);
  const [showStopButton, setShowStopButton] = useState(false);
  const [showListenRetryButtons, setShowListenRetryButtons] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);

  const audioRef = useRef(null);
  const currentWordRef = useRef(null);
  const currentIsSelected = useRef(false);

  let mediaRecorder;
  let recordedChunks = [];

  const initializeRecognition = () => {
    //console.log('Initializing speech recognition...');
    let recognitionInstance;

    if ("webkitSpeechRecognition" in window) {
      recognitionInstance = new window.webkitSpeechRecognition();
    } else if ("SpeechRecognition" in window) {
      recognitionInstance = new window.SpeechRecognition();
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
        //console.log('Speech recognition started...');
        startAudioRecording();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);
        setIsRecording(false);
        setShowStopButton(false);
        setShowListenRetryButtons(true);
        //console.log('Transcript:', transcript);

        const matchPercentage = phoneticMatch(
          currentWordRef.current,
          transcript
        );
        //console.log("matching data:", matchPercentage);

        if (matchPercentage < 49) {
          //console.log("Pronunciation does not match, dropping the word.");
          setAnswer(false);
        } else {
          setAnswer(true);
        }
        setIsProcessing(false);
        stopAudioRecording();
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        setIsProcessing(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          //console.log('No speech detected. Please speak clearly.');
        } else if (event.error === "aborted") {
          //console.log('Speech recognition aborted. Restarting...');
          recognitionInstance.start();
        }
      };

      recognitionInstance.onend = () => {
        //console.log('Speech recognition service disconnected');
        setIsProcessing(false);
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
        //console.log('Audio recording started...');
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
        //console.log('Audio Blob ready:', audioBlob);
        setRecordedAudioBlob(audioBlob);
        recordedChunks = [];
      };
    }
  };

  useEffect(() => {
    if (recordedAudioBlob) {
      //console.log('Audio blob is stored:', recordedAudioBlob);
      const audioURL = URL.createObjectURL(recordedAudioBlob);
      //console.log('Audio URL:', audioURL);
    }
  }, [recordedAudioBlob]);

  const startRecording = (word, isSelected) => {
    setRecordingStates((prev) => ({ ...prev, [word]: true }));
    setIsRecording(true);
    setShowSpeakButton(false);
    setShowStopButton(true);
    setRecordedText("");
    setCurrentWord(word);
    currentWordRef.current = word;
    currentIsSelected.current = isSelected;
  };

  const stopRecording = (word) => {
    setRecordingStates((prev) => ({ ...prev, [word]: false }));
    setIsRecording(false);
    setIsProcessing(true);
    setShowStopButton(false);
    setShowListenRetryButtons(true);
    if (recognition) {
      recognition.stop();
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
    //tartRecording(word, isSelected);
  };

  useEffect(() => {
    if (isRecording && recognition) {
      recognition.start();
    }
  }, [isRecording, recognition]);

  useEffect(() => {
    initializeRecognition();
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
  const [currrentProgress, setCurrrentProgress] = useState(0);

  const playAudio = () => {
    if (recordedAudioBlob && audioRef.current) {
      const audioBlobUrl = URL.createObjectURL(recordedAudioBlob);
      audioRef.current.src = audioBlobUrl;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  //console.log("wordsORimage", level, storedData, recordedText, answer, isShowCase);

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
      <CardContent
        sx={{
          overflow: "hidden",
          pt: "100px",
          opacity: disableScreen ? 0.25 : 1,
          pointerEvents: disableScreen ? "none" : "initial",
        }}
      >
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
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onCanPlay={(e) => {
                  setIsReady(true);
                }}
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  setCurrrentProgress(e.currentTarget.currentTime);
                }}
              >
                <source type="audio/mp3" src={v11} />
              </audio>
              {/* <AudioPlayerSvg color="#FFA132" /> */}

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
                  {isReady && (
                    <>
                      {isPlaying ? (
                        <StopAudioButton color="#FFA132" />
                      ) : (
                        <PlayAudioButton color="#FFA132" />
                      )}
                    </>
                  )}
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
          <Box>
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
                  color:
                    answer === true
                      ? "green"
                      : answer === false
                      ? "red"
                      : "#333F61",
                  textAlign: "center",
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  // lineHeight: "normal",
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
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {highlightWords(words, matchedChar)}
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {level === 1 && !isShowCase ? (
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
              // updateStory={updateStory}
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
  // background: PropTypes.string,
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
