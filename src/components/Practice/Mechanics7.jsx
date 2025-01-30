import { Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
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
} from "../../utils/constants";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const isChrome =
  /Chrome/.test(navigator.userAgent) &&
  /Google Inc/.test(navigator.vendor) &&
  !/Edg/.test(navigator.userAgent);

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

  const currentWordRef = useRef(currentWord);
  const currentIsSelectedRef = useRef(currentIsSelected);
  const wordsRef = useRef(words);
  const selectedWordsRef = useRef(selectedWords);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playCompleteAudio = () => {
    if (completeAudio) {
      audioRef.current.src = completeAudio;
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

        handleWordsLogic(currentWordRef.current, transcript, currentIsSelected);
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
      if (!browserSupportsSpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
      }
      resetTranscript();
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
    if (isChrome) {
      SpeechRecognition.stopListening();
      const finalTranscript = transcriptRef.current;
      handleWordsLogic(
        currentWordRef.current,
        finalTranscript,
        currentIsSelected
      );
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
    const matchPercentage = phoneticMatch(word, transcribedText);

    if (matchPercentage < 49 && !isSelected) {
      setIncorrectWords((prevState) => ({ ...prevState, [word]: true }));
    } else {
      setIncorrectWords((prevState) => ({ ...prevState, [word]: false }));
    }

    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    if (
      selectedWordsRef.current?.length + 1 !== wordsAfterSplit?.length ||
      isSelected
    ) {
      let audio = new Audio(isSelected ? removeSound : addSound);
      audio.play();
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

      if (selectedWordsRef.current.length + 1 === wordsAfterSplit?.length) {
        let audio = new Audio(
          [...selectedWordsRef.current, word].join(" ") === parentWords
            ? correctSound
            : wrongSound
        );
        audio.play();
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
    return wordsRef.current.length === 1 && wIndex === 0 ? "290px" : "0px";
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

  console.log("audios", completeAudio);

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
      {isRecordingComplete && (
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
            src={frame}
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
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: !isRecordingComplete && !isRecording && !isProcessing ? 1 : 4,
          mt: 2,
        }}
      >
        <Box
          sx={{
            minWidth: "230px",
            minHeight: "37px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            borderRadius: "15px",
            border: `2px solid ${getBorderColor()}`,
            cursor: "pointer",
            letterSpacing: answer != "correct" ? "5px" : "normal",
            background: "#FBFBFB",
            paddingX: type === "word" ? 0 : "20px",
          }}
        >
          {selectedWordsRef.current?.map((elem, index) => {
            const parentWordsArray =
              typeof parentWords === "string"
                ? parentWords.split(" ")
                : parentWords;

            let remainingParts = parentWordsArray.filter(
              (word) => !selectedWordsRef.current.includes(word)
            );

            const isIncorrect = incorrectWords[elem];

            const colors = getColor(type, isIncorrect, answer);

            return (
              <span
                role="button"
                tabIndex={0}
                onClick={() => handleWordsLogic(elem, "", true)}
                className={
                  answer === "wrong"
                    ? `audioSelectedWrongWord ${shake ? "shakeImage" : ""}`
                    : ""
                }
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                style={{
                  borderRadius: "12px",
                  padding: answer === "correct" ? "0px" : "5px 10px 5px 10px",
                  border: getBorder(),
                  color: colors,
                  fontWeight: type === "word" ? 600 : 700,
                  fontSize: "22px",
                  fontFamily: "Quicksand",
                  cursor: "pointer",
                  marginLeft:
                    type === "word" ? 0 : answer != "correct" ? "20px" : 0,
                }}
              >
                {elem}
                {remainingParts.length > 0 && (
                  <span
                    style={{
                      color: "#1897DE1A",
                      fontWeight: 700,
                      fontSize: "22px",
                      fontFamily: "Quicksand",
                      marginLeft: "5px",
                      role: "button",
                    }}
                  >
                    {remainingParts.join(" ")}
                  </span>
                )}
              </span>
            );
          })}
        </Box>
      </Box>
      {!isRecordingComplete && !isRecording && !isProcessing && (
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
            height={"85px"}
            style={{
              zIndex: 2,
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          //mb: 2,
          mt: 2,
        }}
      >
        {wordsRef.current?.map((elem, wIndex) => (
          <React.Fragment key={elem}>
            {type === "word" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: getDynamicMarginLeft(wIndex),
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
                      wIndex === 0 ? `url(${clapImage}) 32 24, auto` : "auto",
                    //   borderRadius: "12px",
                    //   border: "5px solid #10618E",
                    fontSize: {
                      xs: "30px",
                      sm: "30px",
                      md: "40px",
                      lg: "40px",
                    },
                    marginLeft: getMarginLeft(wIndex),
                  }}
                >
                  {wIndex == 0 && (
                    <Box sx={{ position: "absolute" }}>
                      <WordRedCircle height={getCircleHeight(elem)} />
                    </Box>
                  )}
                  {wIndex == 0 && (
                    <Box
                      onClick={(e) => {
                        if (
                          !isRecordingComplete &&
                          !isRecording &&
                          !isProcessing
                        ) {
                          e.stopPropagation();
                          handlePlayAudio(elem);
                        } else {
                          e.stopPropagation();
                        }
                      }}
                      sx={{
                        zIndex: "99999",
                        position: "absolute",
                        left:
                          wordsRef.current?.length > 1 ? "-150px" : undefined,
                        right:
                          wordsRef.current?.length == 1 ? "-180px" : undefined,
                        mb: "18px",
                      }}
                    >
                      <img
                        src={
                          !(
                            !isRecordingComplete &&
                            !isRecording &&
                            !isProcessing
                          )
                            ? Assets.bulbHintDisabled
                            : Assets.bulbHint
                        }
                        alt="bulbHint"
                      />
                    </Box>
                  )}
                  {elem?.split("")?.map((char, index) => (
                    <span
                      style={{
                        color: wIndex == 0 ? "#1897DE" : "#000000",
                        fontWeight: 700,
                        fontSize: "25px",
                        lineHeight: "87px",
                        letterSpacing: "2%",
                        fontFamily: "Quicksand",
                        marginLeft: index > 0 ? "12px" : undefined,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </Box>
                {/* 
                {wIndex === 0 &&
                  (!recordingStates[elem] &&
                  !isRecordingComplete &&
                  !isRecording &&
                  !isProcessing ? (
                    <Box
                      sx={{
                        marginTop: "7px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        //height: { xs: "30px", sm: "40px", md: "50px" },
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                        cursor: `url(${clapImage}) 32 24, auto`,
                        marginLeft: getMarginLeft(wIndex),
                      }}
                      onClick={() => handleWords(elem)}
                    >
                      <SpeakButton height={45} width={45} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        marginTop: "7px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        //height: { xs: "30px", sm: "40px", md: "50px" },
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                        cursor: `url(${clapImage}) 32 24, auto`,
                        marginLeft: getMarginLeft(wIndex),
                      }}
                      onClick={() => stopRecording(elem)}
                    >
                      <StopButton height={45} width={45} />
                    </Box>
                  ))} */}
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

      {words &&
        words.length > 0 &&
        (!isRecordingComplete && !isRecording && !isProcessing ? (
          <Box
            sx={{
              marginBottom: "25px",
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
                  <StopButton height={45} width={45} />
                </Box>
              </div>
            ) : (
              <div>
                <Box
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
                  onClick={playCompleteAudio}
                >
                  <ListenButton height={45} width={45} />
                </Box>
              </div>
            )}
            <Box
              sx={{
                position: "relative",
                width: "90px",
                height: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "7px",
                marginLeft: getMarginLeft(0),
                cursor: `url(${clapImage}) 32 24, auto`,
              }}
              onClick={() => handleWords(wordsRef?.current[0])}
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
                <SpeakButton height={45} width={45} />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
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
                marginTop: "7px",
                marginLeft: getMarginLeft(0),
                cursor: `url(${clapImage}) 32 24, auto`,
                borderRadius: "50%",
              }}
              onClick={() => stopRecording(wordsRef?.current[0])}
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
                <StopButton height={45} width={45} />
              </Box>
            </Box>
          </Box>
        ))}

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        src={completeAudio}
        hidden
      />

      {words && words.length === 0 && !isRecording && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "15px" }}>
          <VoiceAnalyser
            pageName={"m7"}
            setVoiceText={setVoiceText}
            onAudioProcessed={handleRecordingComplete}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            dontShowListen={type === "image" || isDiscover}
            handleNext={handleNext}
            enableNext={enableNext}
            originalText={parentWords}
            audioLink={audio ? audio : completeAudio}
            {...{
              contentId,
              contentType,
              currentLine: currentStep - 1,
              playTeacherAudio,
              callUpdateLearner,
              isShowCase,
              setEnableNext,
              showOnlyListen: answer !== "correct",
              setOpenMessageDialog,
            }}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export default Mechanics7;
