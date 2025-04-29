import React, { useState, useEffect, useRef } from "react";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import Confetti from "react-confetti";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
} from "../../utils/constants";
import r3WrongTick from "../../assets/r3WrongTick.svg";
import bingoReset from "../../assets/bingoReset.svg";
import Mic from "../../assets/mikee.svg";
import Stop from "../../assets/pausse.svg";
import Play from "../../assets/playButton.svg";
import RecordVisualizer from "../../assets/recordVisualizer.svg";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MainLayout from "../Layouts.jsx/MainLayout";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

// const isChrome =
//   /Chrome/.test(navigator.userAgent) &&
//   /Google Inc/.test(navigator.vendor) &&
//   !/Edg/.test(navigator.userAgent);

const isChrome = true;

const BingoCard = ({
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
  const [showHint, setShowHint] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [winEffect, setWinEffect] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showWrongWord, setShowWrongWord] = useState(false);
  const [highlightCorrectWords, setHighlightCorrectWords] = useState(false);
  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(-1);
  const [showCoinsImg, setShowCoinsImg] = useState(false);
  const [showEmptyImg, setShowEmptyImg] = useState(false);
  const [hideCoinsImg, setHideCoinsImg] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showInitialEffect, setShowInitialEffect] = useState(false);
  const [startGame, setStartGame] = useState(true);
  const [showRecording, setShowRecording] = useState(false);
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

  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const [recAudio, setRecAudio] = useState("");

  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentIsSelected, setCurrentIsSelected] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedWordsNew, setSelectedWordsNew] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState({});
  const [isMicOn, setIsMicOn] = useState(false);
  const [syllAudios, setSyllAudios] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (showWrongWord) {
      setShowWrongTick(true);
      timer = setTimeout(() => {
        setShowWrongTick(false);
      }, 2000);
    } else {
      setShowWrongTick(true);
    }

    return () => clearTimeout(timer);
  }, [showWrongWord]);

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
    setIsRecording(true);
    setCurrentWord(word);
    setCurrentIsSelected(isSelected);
  };

  const stopRecording = () => {
    if (isChrome) {
      SpeechRecognition.stopListening();
      const finalTranscript = transcriptRef.current;
      setIsMicOn(false);
      setIsRecording(false);
      setIsProcessing(false);
    } else {
      // if (recognition) {
      //   recognition.stop();
      // }
      setIsProcessing(true);
    }
    setIsRecording(false);
    setShowRecording(false);
    const audio = new Audio(correctSound);
    audio.play();
    setShowHint(false);
    setWinEffect(true);
    setShowConfetti(true);
    setCoins((prevCoins) => prevCoins + 100);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);

    setTimeout(() => {
      setShowCoinsImg(true);

      setTimeout(() => {
        setShowEmptyImg(true);
        setShowNextButton(true);
        setShowCoinsImg(false);
      }, 1000);
    }, 2000);

    setTimeout(() => {
      setSelectedWords([]);
      setWinEffect(false);
      setShowEmptyImg(false);
    }, 3000);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // useEffect(() => {
  //   if (isRecording && recognition && recognition.state !== "recording") {
  //     recognition.start();
  //   }
  // }, [isRecording, recognition]);

  // useEffect(() => {
  //   if (!isChrome) {
  //     initializeRecognition();
  //   }
  // }, []);

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.titleNew || "L1";

  console.log("loggslevel", currentLevel, currentPracticeStep);

  useEffect(() => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setCoins(0);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setHighlightedButtonIndex(-1);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setCurrentWordIndex(0);
    setShowInitialEffect(false);
    setStartGame(true);
    setShowRecording(false);
    setShowWrongTick(true);
    setWordsAfterSplit([]);
    setRecAudio("");
    setIsRecordingComplete(false);
    setIsRecording(false);
    setIsProcessing(false);
    setCurrentWord("");
    setCurrentIsSelected(false);
    setRecognition(null);
    setSelectedWordsNew([]);
    setIncorrectWords({});
    setIsMicOn(false);
    setSyllAudios([]);
    setIsPlaying(false);
    setScale(1);
  }, [currentLevel]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const levels = {
  //   L1: {
  //     words: [
  //       "MAN",
  //       "WA",
  //       "GO",
  //       "CIL",
  //       "MO",
  //       "THER",
  //       "FA",
  //       "TER",
  //       "SIS",
  //       "BRO",
  //       "PEN",
  //       "E",
  //     ],
  //     imageAudioMap: {
  //       MANGO: {
  //         image: Assets.mangoR1OneImg,
  //         audio: Assets.mangoNewAudio,
  //       },
  //       WATER: {
  //         image: Assets.waterImg,
  //         audio: Assets.waterNewAudio,
  //       },
  //       MOTHER: {
  //         image: Assets.motherImg,
  //         audio: Assets.motherNewAudio,
  //       },
  //       FATHER: {
  //         image: Assets.fatherImg,
  //         audio: Assets.fatherNewAudio,
  //       },
  //       PENCIL: {
  //         image: Assets.pencilImg,
  //         audio: Assets.pencilNewAudio,
  //       },
  //     },
  //     arrM: ["MANGO", "WATER", "MOTHER", "FATHER", "PENCIL"],
  //   },
  //   L2: {
  //     words: [
  //       "MAR",
  //       "BAS",
  //       "DOW",
  //       "TOR",
  //       "KET",
  //       "CRICK",
  //       "DOC",
  //       "WIN",
  //       "BOT",
  //       "CHER",
  //       "TLE",
  //       "ET",
  //     ],
  //     imageAudioMap: {
  //       DOCTOR: {
  //         image: Assets.doctorImg,
  //         audio: Assets.doctorNewAudio,
  //       },
  //       MARKET: {
  //         image: Assets.marketImg,
  //         audio: Assets.marketNewAudio,
  //       },
  //       BASKET: {
  //         image: Assets.basketImg,
  //         audio: Assets.basketNewAudio,
  //       },
  //       CRICKET: {
  //         image: Assets.cricketImg,
  //         audio: Assets.cricketNewAudio,
  //       },
  //       WINDOW: {
  //         image: Assets.WindowNewImg,
  //         audio: Assets.windowNewAudio,
  //       },
  //     },
  //     arrM: ["DOCTOR", "MARKET", "BASKET", "CRICKET", "WINDOW"],
  //   },
  //   L3: {
  //     words: [
  //       "BAL",
  //       "CLE",
  //       "GAR",
  //       "DLE",
  //       "LOON",
  //       "CAN",
  //       "TEM",
  //       "SCOO",
  //       "CY",
  //       "DEN",
  //       "TER",
  //       "PLE",
  //     ],
  //     imageAudioMap: {
  //       BALLOON: {
  //         image: Assets.balloonImg,
  //         audio: Assets.balloonNewAudio,
  //       },
  //       GARDEN: {
  //         image: Assets.gardenImg,
  //         audio: Assets.gardenNewAudio,
  //       },
  //       CANDLE: {
  //         image: Assets.candleImg,
  //         audio: Assets.candleNewAudio,
  //       },
  //       SCOOTER: {
  //         image: Assets.scooterImg,
  //         audio: Assets.scooterNewAudio,
  //       },
  //       CYCLE: {
  //         image: Assets.bicycleRImg,
  //         audio: Assets.cycleNewAudio,
  //       },
  //     },
  //     arrM: ["BALLOON", "GARDEN", "CANDLE", "SCOOTER", "CYCLE"],
  //   },
  //   L4: {
  //     words: [
  //       "FLOW",
  //       "PY",
  //       "MUS",
  //       "OL",
  //       "ER",
  //       "PUP",
  //       "PER",
  //       "STU",
  //       "IC",
  //       "DENT",
  //       "SCHO",
  //       "PA",
  //     ],
  //     imageAudioMap: {
  //       FLOWER: {
  //         image: Assets.flowerRImg,
  //         audio: Assets.flowerNewAudio,
  //       },
  //       MUSIC: {
  //         image: Assets.musicImg,
  //         audio: Assets.musicNewAudio,
  //       },
  //       PUPPY: {
  //         image: Assets.puppyImg,
  //         audio: Assets.puppyNewAudio,
  //       },
  //       STUDENT: {
  //         image: Assets.studentImg,
  //         audio: Assets.studentNewAudio,
  //       },
  //       PAPER: {
  //         image: Assets.paperImg,
  //         audio: Assets.paperNewAudio,
  //       },
  //     },
  //     arrM: ["FLOWER", "MUSIC", "PUPPY", "STUDENT", "PAPER"],
  //   },
  // };

  const levels = {
    L1: {
      words: [
        "MAN",
        "WA",
        "GO",
        "CIL",
        "MO",
        "THER",
        "FA",
        "TER",
        "SIS",
        "BRO",
        "PEN",
        "E",
      ],
      imageAudioMap: {
        MANGO: {
          image: getAssetUrl(s3Assets.mangoR1OneImg) || Assets.mangoR1OneImg,
          audio:
            getAssetAudioUrl(s3Assets.mangoNewAudio) || Assets.mangoNewAudio,
        },
        WATER: {
          image: getAssetUrl(s3Assets.waterImg) || Assets.waterImg,
          audio:
            getAssetAudioUrl(s3Assets.waterNewAudio) || Assets.waterNewAudio,
        },
        MOTHER: {
          image: Assets.motherImg,
          audio:
            getAssetAudioUrl(s3Assets.motherNewAudio) || Assets.motherNewAudio,
        },
        FATHER: {
          image: Assets.fatherImg,
          audio:
            getAssetAudioUrl(s3Assets.fatherNewAudio) || Assets.fatherNewAudio,
        },
        PENCIL: {
          image: getAssetUrl(s3Assets.pencilImg) || Assets.pencilImg,
          audio:
            getAssetAudioUrl(s3Assets.pencilNewAudio) || Assets.pencilNewAudio,
        },
      },
      arrM: ["MANGO", "WATER", "MOTHER", "FATHER", "PENCIL"],
    },
    L2: {
      words: [
        "MAR",
        "BAS",
        "DOW",
        "TOR",
        "KET",
        "CRICK",
        "DOC",
        "WIN",
        "BOT",
        "CHER",
        "TLE",
        "ET",
      ],
      imageAudioMap: {
        DOCTOR: {
          image: getAssetUrl(s3Assets.doctorImg) || Assets.doctorImg,
          audio:
            getAssetAudioUrl(s3Assets.doctorNewAudio) || Assets.doctorNewAudio,
        },
        MARKET: {
          image: getAssetUrl(s3Assets.marketImg) || Assets.marketImg,
          audio:
            getAssetAudioUrl(s3Assets.marketNewAudio) || Assets.marketNewAudio,
        },
        BASKET: {
          image: getAssetUrl(s3Assets.basketImg) || Assets.basketImg,
          audio:
            getAssetAudioUrl(s3Assets.basketNewAudio) || Assets.basketNewAudio,
        },
        CRICKET: {
          image: getAssetUrl(s3Assets.cricketImg) || Assets.cricketImg,
          audio:
            getAssetAudioUrl(s3Assets.cricketNewAudio) ||
            Assets.cricketNewAudio,
        },
        WINDOW: {
          image: getAssetUrl(s3Assets.WindowNewImg) || Assets.WindowNewImg,
          audio:
            getAssetAudioUrl(s3Assets.windowNewAudio) || Assets.windowNewAudio,
        },
      },
      arrM: ["DOCTOR", "MARKET", "BASKET", "CRICKET", "WINDOW"],
    },
    L3: {
      words: [
        "BAL",
        "CLE",
        "GAR",
        "DLE",
        "LOON",
        "CAN",
        "TEM",
        "SCOO",
        "CY",
        "DEN",
        "TER",
        "PLE",
      ],
      imageAudioMap: {
        BALLOON: {
          image: getAssetUrl(s3Assets.balloonImg) || Assets.balloonImg,
          audio:
            getAssetAudioUrl(s3Assets.balloonNewAudio) ||
            Assets.balloonNewAudio,
        },
        GARDEN: {
          image: getAssetUrl(s3Assets.gardenImg) || Assets.gardenImg,
          audio:
            getAssetAudioUrl(s3Assets.gardenNewAudio) || Assets.gardenNewAudio,
        },
        CANDLE: {
          image: getAssetUrl(s3Assets.candleImg) || Assets.candleImg,
          audio:
            getAssetAudioUrl(s3Assets.candleNewAudio) || Assets.candleNewAudio,
        },
        SCOOTER: {
          image: getAssetUrl(s3Assets.scooterImg) || Assets.scooterImg,
          audio:
            getAssetAudioUrl(s3Assets.scooterNewAudio) ||
            Assets.scooterNewAudio,
        },
        CYCLE: {
          image: getAssetUrl(s3Assets.bicycleRImg) || Assets.bicycleRImg,
          audio:
            getAssetAudioUrl(s3Assets.cycleNewAudio) || Assets.cycleNewAudio,
        },
      },
      arrM: ["BALLOON", "GARDEN", "CANDLE", "SCOOTER", "CYCLE"],
    },
    L4: {
      words: [
        "FLOW",
        "PY",
        "MUS",
        "OL",
        "ER",
        "PUP",
        "PER",
        "STU",
        "IC",
        "DENT",
        "SCHO",
        "PA",
      ],
      imageAudioMap: {
        FLOWER: {
          image: getAssetUrl(s3Assets.flowerRImg) || Assets.flowerRImg,
          audio:
            getAssetAudioUrl(s3Assets.flowerNewAudio) || Assets.flowerNewAudio,
        },
        MUSIC: {
          image: getAssetUrl(s3Assets.musicImg) || Assets.musicImg,
          audio:
            getAssetAudioUrl(s3Assets.musicNewAudio) || Assets.musicNewAudio,
        },
        PUPPY: {
          image: getAssetUrl(s3Assets.puppyImg) || Assets.puppyImg,
          audio:
            getAssetAudioUrl(s3Assets.puppyNewAudio) || Assets.puppyNewAudio,
        },
        STUDENT: {
          image: Assets.studentImg,
          audio:
            getAssetAudioUrl(s3Assets.studentNewAudio) ||
            Assets.studentNewAudio,
        },
        PAPER: {
          image: Assets.paperImg,
          audio:
            getAssetAudioUrl(s3Assets.paperNewAudio) || Assets.paperNewAudio,
        },
      },
      arrM: ["FLOWER", "MUSIC", "PUPPY", "STUDENT", "PAPER"],
    },
  };

  const currentData =
    levels[currentLevel]?.imageAudioMap[
      levels[currentLevel]?.arrM[currentWordIndex]
    ];
  const currentImage = currentData?.image;

  const startAudio = (index) => {
    const currentData =
      levels[currentLevel]?.imageAudioMap[levels[currentLevel]?.arrM[index]];
    const audio = new Audio(currentData?.audio);
    audio
      .play()
      .then(() => {
        setShowInitialEffect(true);
        audio.onended = () => {
          setShowInitialEffect(false);
        };
      })
      .catch((error) => console.error("Audio play failed:", error));
    setStartGame(false);
    setShowInitialEffect(true);
  };

  const handleHintClick = () => {
    setShowHint(true);
    setHideButtons(true);
    setTimeout(() => {
      setShowHint(false);
      setHideButtons(false);
    }, 2500);
  };

  useEffect(() => {
    levels[currentLevel]?.words.forEach((_, index) => {
      setTimeout(() => {
        setHighlightedButtonIndex(index);
      }, index * 500);
    });

    setTimeout(() => {
      setHighlightedButtonIndex(-1);
    }, levels[currentLevel]?.words.length * 500);
  }, []);

  const getSize = () =>
    screenWidth < 480 ? "40px" : screenWidth < 768 ? "50px" : "60px";

  const handleWordClick = (word) => {
    // if (!selectedWords.includes(word)) {
    //   const updatedWords = [...selectedWords, word];
    //   setSelectedWords(updatedWords);
    // }

    let updatedWords;

    if (selectedWords.includes(word)) {
      updatedWords = selectedWords.filter((w) => w !== word);
      setSelectedWords(updatedWords);
    } else {
      updatedWords = [...selectedWords, word];
      setSelectedWords(updatedWords);
    }

    const validPairs = {
      MANGO: ["MAN", "GO"],
      WATER: ["WA", "TER"],
      MOTHER: ["MO", "THER"],
      FATHER: ["FA", "THER"],
      PENCIL: ["PEN", "CIL"],
      DOCTOR: ["DOC", "TOR"],
      MARKET: ["MAR", "KET"],
      BASKET: ["BAS", "KET"],
      TABLE: ["TA", "BLE"],
      WINDOW: ["WIN", "DOW"],
      POCKET: ["POCK", "ET"],
      WINDOW: ["WIN", "DOW"],
      CRICKET: ["CRICK", "ET"],
      BALLOON: ["BAL", "LOON"],
      GARDEN: ["GAR", "DEN"],
      CANDLE: ["CAN", "DLE"],
      SCOOTER: ["SCOO", "TER"],
      CYCLE: ["CY", "CLE"],
      FLOWER: ["FLOW", "ER"],
      MUSIC: ["MUS", "IC"],
      PUPPY: ["PUP", "PY"],
      STUDENT: ["STU", "DENT"],
      PAPER: ["PA", "PER"],
    };

    const currentWord = levels[currentLevel]?.arrM[currentWordIndex];

    // const isCorrectPair = validPairs[currentWord]?.every((part) =>
    //   updatedWords.includes(part)
    // );

    const requiredParts = validPairs[currentWord] || [];

    const isCorrectPair =
      updatedWords.length === requiredParts.length &&
      requiredParts.every((part) => updatedWords.includes(part));

    if (isCorrectPair) {
      setShowRecording(true);
    } else if (updatedWords.length >= requiredParts.length && !winEffect) {
      setShowHint(false);
      setShowWrongWord(true);
      const audio = new Audio(wrongSound);
      audio.play();
    }
  };

  const handleReset = () => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setShowInitialEffect(true);
    startAudio(currentWordIndex);
  };

  const retry = () => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setShowInitialEffect(true);
  };

  useEffect(() => {
    if (showEmptyImg) {
      const timer = setTimeout(() => {
        setHideCoinsImg(true);
      });

      return () => clearTimeout(timer);
    }
  }, [showEmptyImg]);

  const handleNextButton = () => {
    if (currentWordIndex < levels[currentLevel]?.arrM.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowNextButton(false);
      setShowHint(false);
      setSelectedWords([]);
      setShowEmptyImg(false);
      setShowCoinsImg(false);
      startAudio(currentWordIndex + 1);
      handleNext();
    } else {
      handleNext();
    }
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
      <div
        style={{
          width: "100%",
          height: "85vh",
          position: "relative",
          overflowX: "hidden",
          backgroundColor: "#1CB0F6",
          filter: "brightness(1.1)",
          overflowY: "hidden",
        }}
      >
        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        <style>
          {`
          .focusHint {
            animation: hintPulse 1s ease-in-out;
          }
          @keyframes hintPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0px rgba(188, 182, 66, 0.8);
            }
            50% {
              transform: scale(1.2);
              box-shadow: 0 0 0px rgb(236, 204, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0px rgba(255, 208, 0, 0.8);
            }
          }
        `}
        </style>
        <div
          style={{
            position: "absolute",
            width: "95%",
            height: "83%",
            backgroundColor: "#FFFFFF40",
            zIndex: 1,
            top: "10%",
            left: "2.5%",
            borderRadius: "33px",
          }}
        ></div>

        {showEmptyImg && (
          <div
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "30%" : "280px",
              bottom: screenWidth < 768 ? "220px" : "318px",
              width: screenWidth < 768 ? "140px" : "240px",
              height: screenWidth < 768 ? "90px" : "130px",
              zIndex: 1000,
            }}
          >
            <img
              src={Assets.emptyImg}
              alt="Empty Placeholder"
              style={{
                transform: "translateX(-50%)",
                //width: screenWidth < 768 ? "120px" : "170px",
                height: screenWidth < 768 ? "90px" : "165px",
                zIndex: 100,
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", marginTop: "10px", gap: "15px" }}>
              <button
                style={{
                  position: "absolute",
                  right: "90%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: "5",
                }}
                onClick={handleReset}
              >
                <RetryIcon
                  height={screenWidth < 768 ? 40 : 50}
                  width={screenWidth < 768 ? 40 : 50}
                />
              </button>

              {showNextButton && (
                <button
                  style={{
                    position: "absolute",
                    right: "55%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: "5",
                  }}
                  onClick={handleNextButton}
                >
                  <NextButtonRound
                    height={screenWidth < 768 ? 40 : 50}
                    width={screenWidth < 768 ? 40 : 50}
                  />
                </button>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: screenWidth < 768 ? "20%" : "10px",
            bottom: screenWidth < 768 ? "13%" : "0%",
            height: screenWidth < 768 ? "200px" : "390px",
            width: screenWidth < 768 ? "200px" : "390px",
            zIndex: "2",
            transform: screenWidth < 768 ? "translateX(-50%)" : "none",
          }}
        >
          <img
            src={showWrongWord ? Assets.sadBear : Assets.monkeyImg}
            alt="Monkey"
            style={{
              width: screenWidth < 768 ? "150px" : "250px",
              height: screenWidth < 768 ? "250px" : "450px",
              cursor: "pointer",
            }}
          />
          {!hideButtons &&
            !showWrongWord &&
            !winEffect &&
            !showCoinsImg &&
            !showEmptyImg &&
            !showInitialEffect &&
            !showInitialEffect &&
            startGame && (
              <img
                onClick={() => {
                  startAudio(currentWordIndex);
                }}
                src={Assets.play}
                alt="Start"
                style={{
                  width: screenWidth < 768 ? "40px" : "50px",
                  height: screenWidth < 768 ? "40px" : "50px",
                  position: "absolute",
                  left: screenWidth < 768 ? "72%" : "51%",
                  top: screenWidth < 768 ? "10%" : "5%",
                  //transform: "translateX(-50%)",
                  transform: `scale(${scale})`,
                  transition: "transform 0.5s ease-in-out",
                  zIndex: 100,
                  padding: screenWidth < 768 ? "8px 16px" : "10px 20px",
                  cursor: "pointer",
                }}
              />
            )}
          {!hideButtons &&
            !showWrongWord &&
            !winEffect &&
            !showCoinsImg &&
            !showEmptyImg &&
            showInitialEffect &&
            !startGame && (
              <img
                src={Assets.emptyImg}
                alt="Empty Placeholder"
                style={{
                  position: "absolute",
                  left: screenWidth < 768 ? "85%" : "72%",
                  top: screenWidth < 768 ? "-19%" : "-20%",
                  transform: "translateX(-50%)",
                  //width: screenWidth < 768 ? "120px" : "170px",
                  height: screenWidth < 768 ? "90px" : "175px",
                  zIndex: 10,
                }}
              />
            )}
          {!hideButtons &&
            !showWrongWord &&
            !winEffect &&
            !showCoinsImg &&
            !showEmptyImg &&
            !showInitialEffect &&
            !startGame &&
            !showRecording && (
              <>
                <button
                  style={{
                    position: "absolute",
                    left: "55%",
                    top: screenWidth < 768 ? "10%" : "5%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={handleHintClick}
                >
                  <img
                    src={Assets.hintImg}
                    alt="Hint"
                    style={{
                      width: screenWidth < 768 ? "40px" : "50px",
                      height: screenWidth < 768 ? "40px" : "70px",
                    }}
                  />
                </button>
                <button
                  style={{
                    position: "absolute",
                    left: screenWidth < 768 ? "80%" : "55%",
                    top: screenWidth < 768 ? "10%" : "25%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={handleReset}
                >
                  <RetryIcon
                    height={screenWidth < 768 ? 40 : 50}
                    width={screenWidth < 768 ? 40 : 50}
                  />
                </button>
              </>
            )}
        </div>

        {showWrongWord && (
          <div
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "30%" : "280px",
              bottom: screenWidth < 768 ? "220px" : "318px",
              width: screenWidth < 768 ? "140px" : "240px",
              height: screenWidth < 768 ? "90px" : "130px",
              zIndex: 1000,
            }}
          >
            <img
              src={Assets.emptyImg}
              alt="Empty Placeholder"
              style={{
                transform: "translateX(-50%)",
                //width: screenWidth < 768 ? "120px" : "170px",
                height: screenWidth < 768 ? "90px" : "165px",
                zIndex: 100,
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", marginTop: "10px", gap: "15px" }}>
              <button
                style={{
                  position: "absolute",
                  right: "90%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: "5",
                }}
                onClick={handleReset}
              >
                <RetryIcon
                  height={screenWidth < 768 ? 40 : 50}
                  width={screenWidth < 768 ? 40 : 50}
                />
              </button>

              {/* {showNextButton && ( */}
              <button
                style={{
                  position: "absolute",
                  right: "55%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: "5",
                }}
                onClick={() => {
                  retry();
                  handleNextButton();
                }}
              >
                <NextButtonRound
                  height={screenWidth < 768 ? 40 : 50}
                  width={screenWidth < 768 ? 40 : 50}
                />
              </button>
              {/* )} */}
            </div>
          </div>
        )}

        {showHint && !winEffect && (
          <div
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "20%" : "15%",
              bottom: screenWidth < 768 ? "220px" : "330px",
              width: screenWidth < 768 ? "140px" : "240px",
              height: screenWidth < 768 ? "90px" : "130px",
              zIndex: 1000,
            }}
          >
            <img
              src={Assets.cloudText}
              alt="Cloud"
              style={{
                //width: screenWidth < 768 ? "170px" : "230px",
                height: screenWidth < 768 ? "100px" : "185px",
                zIndex: 21,
                cursor: "pointer",
              }}
            />
            <img
              src={currentImage}
              alt={levels[currentLevel]?.arrM[currentWordIndex]}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                height: screenWidth < 768 ? "40px" : "100px",
                zIndex: 22,
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {showRecording &&
          (!isRecording && !isProcessing ? (
            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "20%" : "15%",
                bottom: screenWidth < 768 ? "220px" : "320px",
                //width: screenWidth < 768 ? "140px" : "240px",
                //height: screenWidth < 768 ? "90px" : "130px",
                zIndex: 1000,
              }}
            >
              <img
                src={Assets.cloudText}
                alt="Cloud"
                style={{
                  width: screenWidth < 768 ? "170px" : "230px",
                  //height: screenWidth < 768 ? "85px" : "160px",
                  zIndex: 21,
                  cursor: "pointer",
                }}
              />
              <img
                src={Assets.mic}
                alt={"Start Recording"}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "45%",
                  transform: "translate(-50%, -50%)",
                  height: screenWidth < 786 ? "40px" : "50px",
                  zIndex: 22,
                  cursor: "pointer",
                }}
                onClick={() =>
                  startRecording(levels[currentLevel]?.arrM[currentWordIndex])
                }
              />
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "20%" : "15%",
                bottom: screenWidth < 768 ? "220px" : "320px",
                //width: screenWidth < 768 ? "140px" : "240px",
                //height: screenWidth < 768 ? "90px" : "130px",
                zIndex: 1000,
              }}
            >
              <img
                src={Assets.cloudText}
                alt="Cloud"
                style={{
                  width: screenWidth < 768 ? "170px" : "230px",
                  //height: screenWidth < 768 ? "85px" : "160px",
                  zIndex: 21,
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <img
                  src={Assets.graph}
                  alt={"Start Visualizer"}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "30%",
                    transform: "translate(-50%, -50%)",
                    height: screenWidth < 786 ? "15px" : "30px",
                    zIndex: 22,
                    cursor: "pointer",
                  }}
                />
                <img
                  src={Assets.pause}
                  alt={"Start Recording"}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "60%",
                    transform: "translate(-50%, -50%)",
                    height: screenWidth < 786 ? "40px" : "50px",
                    zIndex: 22,
                    cursor: "pointer",
                  }}
                  onClick={() => stopRecording()}
                />
              </div>
            </div>
          ))}

        {winEffect && (
          <>
            {showConfetti && (
              <Confetti
                width={200}
                height={100}
                numberOfPieces={50}
                recycle={false}
                particleSize={10}
                gravity={0.3}
                style={{
                  position: "absolute",
                  left: "180px",
                  bottom: "420px",
                  zIndex: 25,
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "30%" : "170px",
                bottom: screenWidth < 768 ? "220px" : "310px",
                display: "flex",
                gap: screenWidth < 768 ? "10px" : "20px",
                zIndex: 20,
                transform: screenWidth < 768 ? "translateX(-50%)" : "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={Assets.rockImg}
                  alt="Rock Word"
                  style={{
                    width: screenWidth < 768 ? "130px" : "220px",
                    height: screenWidth < 768 ? "90px" : "140px",
                    zIndex: 21,
                  }}
                />
                <p
                  style={{
                    position: "absolute",
                    top: "42%",
                    left: "52%",
                    transform: "translate(-50%, -50%)",
                    color: "#333F61",
                    fontWeight: "700",
                    fontSize: screenWidth < 768 ? "12px" : "18px",
                  }}
                >
                  {levels[currentLevel]?.arrM[currentWordIndex]}
                </p>
              </div>

              <img
                src={Assets.etImg}
                alt="Et Word"
                style={{
                  width: screenWidth < 768 ? "80px" : "100px",
                  height: screenWidth < 768 ? "90px" : "120px",
                  zIndex: 22,
                  marginLeft: screenWidth < 768 ? "-120px" : "-160px",
                }}
              />
            </div>
          </>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: screenWidth < 768 ? "10px 30px" : "20px 50px",
            position: "absolute",
            right: screenWidth < 768 ? "10%" : "10%",
            top: screenWidth < 768 ? "15%" : "17%",
            //transform: screenWidth < 768 ? "translateX(50%)" : "none",
            zIndex: 1,
          }}
        >
          {levels[currentLevel]?.words.map((word, index) => {
            const validPairs = {
              MANGO: ["MAN", "GO"],
              WATER: ["WA", "TER"],
              MOTHER: ["MO", "THER"],
              FATHER: ["FA", "THER"],
              PENCIL: ["PEN", "CIL"],
              DOCTOR: ["DOC", "TOR"],
              MARKET: ["MAR", "KET"],
              BASKET: ["BAS", "KET"],
              TABLE: ["TA", "BLE"],
              WINDOW: ["WIN", "DOW"],
              CRICKET: ["CRICK", "ET"],
              BALLOON: ["BAL", "LOON"],
              GARDEN: ["GAR", "DEN"],
              CANDLE: ["CAN", "DLE"],
              SCOOTER: ["SCOO", "TER"],
              CYCLE: ["CY", "CLE"],
              FLOWER: ["FLOW", "ER"],
              MUSIC: ["MUS", "IC"],
              PUPPY: ["PUP", "PY"],
              STUDENT: ["STU", "DENT"],
              PAPER: ["PA", "PER"],
            };

            const isCorrectWord =
              highlightCorrectWords &&
              validPairs[
                levels[currentLevel]?.levels[currentLevel]?.arrM[
                  currentWordIndex
                ]
              ].includes(word);

            return (
              <div
                key={index}
                style={{
                  width: getSize(),
                  height: getSize(),
                  backgroundColor: isCorrectWord
                    ? "#58CC02"
                    : selectedWords.includes(word)
                    ? showConfetti
                      ? "#58CC02"
                      : showWrongWord
                      ? "#FF7F36"
                      : "#58CC02"
                    : "#ffffff",
                  color:
                    selectedWords.includes(word) || isCorrectWord
                      ? "#ffffff"
                      : "#1CB0F6",
                  borderRadius: "30% 70% 30% 70% / 70% 30% 70% 30%",
                  boxShadow:
                    "0 6px 8px rgba(0, 0, 0, 0.2), 0 -4px 6px rgba(255, 255, 255, 0.5) inset",
                  transform: "rotate(-12deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize:
                    screenWidth < 480
                      ? "14px"
                      : screenWidth < 768
                      ? "16px"
                      : "18px",
                  fontWeight: "bold",
                  border:
                    highlightedButtonIndex === index
                      ? "0.3px solid #4DBD25"
                      : "0.3px solid #000000",
                  fontFamily: "Quicksand",
                  cursor:
                    showRecording ||
                    startGame ||
                    isCorrectWord ||
                    showWrongWord ||
                    showInitialEffect ||
                    showCoinsImg ||
                    winEffect ||
                    showNextButton
                      ? "not-allowed"
                      : "pointer",
                  zIndex: 2,
                }}
                onClick={() => {
                  if (
                    !(
                      showRecording ||
                      startGame ||
                      isCorrectWord ||
                      showWrongWord ||
                      showInitialEffect ||
                      showCoinsImg ||
                      winEffect ||
                      showNextButton
                    )
                  ) {
                    handleWordClick(word);
                  }
                }}
              >
                <p
                  style={{
                    transform: "rotate(12deg)",
                    fontSize:
                      screenWidth < 480
                        ? "10px"
                        : screenWidth < 768
                        ? "12px"
                        : "15px",
                  }}
                >
                  {word}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default BingoCard;
