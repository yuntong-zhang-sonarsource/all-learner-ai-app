import React, { useState, useEffect, useRef } from "react";
import * as Assets from "../../utils/imageAudioLinks";
import Confetti from "react-confetti";
import { practiceSteps, getLocalData } from "../../utils/constants";
import Mic from "../../assets/mic.svg";
import Stop from "../../assets/stop.svg";
import Play from "../../assets/playButton.svg";
import RecordVisualizer from "../../assets/recordVisualizer.svg";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const isChrome =
  /Chrome/.test(navigator.userAgent) &&
  /Google Inc/.test(navigator.vendor) &&
  !/Edg/.test(navigator.userAgent);

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
        setIsProcessing(false);
        setIsMicOn(false);
        const matchPercentage = phoneticMatch(
          levels[currentLevel]?.arrM[currentWordIndex],
          transcript
        );
        console.log("matchPercentage", matchPercentage);
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
      if (recognition) {
        recognition.stop();
      }
      setIsProcessing(true);
    }
    setIsRecording(false);
    setShowRecording(false);
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
    }, 3000);

    setTimeout(() => {
      setSelectedWords([]);
      setWinEffect(false);
      setShowEmptyImg(false);
    }, 3000);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  useEffect(() => {
    if (isRecording && recognition && recognition.state !== "recording") {
      recognition.start();
    }
  }, [isRecording, recognition]);

  useEffect(() => {
    if (!isChrome) {
      initializeRecognition();
    }
  }, []);

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.title || "L1";

  useEffect(() => {
    setStartGame(true);
    setCurrentWordIndex(0);
  }, [currentLevel]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const levels = {
    L1: {
      words: [
        "BAS",
        "KET",
        "ROCK",
        "SUN",
        "SET",
        "ET",
        "PEN",
        "LE",
        "MON",
        "CIL",
        "DIN",
        "NER",
      ],
      imageAudioMap: {
        ROCKET: { image: Assets.rocketImg, audio: Assets.RocketAudio },
        PENCIL: { image: Assets.pencilImg, audio: Assets.PencilAudio },
        DINNER: { image: Assets.dinnerImg, audio: Assets.DinnerAudio },
        SUNSET: { image: Assets.sunsetImg, audio: Assets.SunsetAudio },
        BASKET: { image: Assets.basketImg, audio: Assets.BasketAudio },
        LEMON: { image: Assets.lemonImg, audio: Assets.LemonAudio },
      },
      arrM: ["ROCKET", "PENCIL", "DINNER", "SUNSET", "BASKET", "LEMON"],
    },
    L2: {
      words: [
        "PAP",
        "ER",
        "HAP",
        "PY",
        "TI",
        "GER",
        "PUP",
        "PET",
        "TICK",
        "ET",
        "JACK",
        "ETS",
      ],
      imageAudioMap: {
        PAPER: { image: Assets.paperImg, audio: Assets.PaperAudio },
        HAPPY: { image: Assets.happyImg, audio: Assets.HappyAudio },
        TIGER: { image: Assets.tigerImg, audio: Assets.TigerAudio },
        PUPPET: { image: Assets.puppetImg, audio: Assets.PuppetAudio },
        TICKET: { image: Assets.ticketImg, audio: Assets.TicketAudio },
        JACKETS: { image: Assets.jacketImg, audio: Assets.JacketAudio },
      },
      arrM: ["PAPER", "HAPPY", "TIGER", "PUPPET", "TICKET", "JACKETS"],
    },
    L3: {
      words: [
        "BOT",
        "TLE",
        "BUT",
        "TON",
        "LAP",
        "TOP",
        "PIL",
        "LOW",
        "CAN",
        "DLE",
        "FLOW",
        "ER",
      ],
      imageAudioMap: {
        BOTTLE: { image: Assets.bottleImg, audio: Assets.BottleAudio },
        BUTTON: { image: Assets.buttonImg, audio: Assets.ButtonAudio },
        LAPTOP: { image: Assets.laptopImg, audio: Assets.LaptopAudio },
        PILLOW: { image: Assets.pillowImg, audio: Assets.PillowAudio },
        CANDLE: { image: Assets.candleImg, audio: Assets.CandleAudio },
        FLOWER: { image: Assets.flowerImg, audio: Assets.FlowerAudio },
      },
      arrM: ["BOTTLE", "BUTTON", "LAPTOP", "PILLOW", "CANDLE", "FLOWER"],
    },
    L4: {
      words: [
        "TAB",
        "LET",
        "GAR",
        "DEN",
        "WIN",
        "TER",
        "TUR",
        "TLE",
        "RAB",
        "BIT",
        "HUN",
        "GRY",
      ],
      imageAudioMap: {
        TABLET: { image: Assets.tabletImg, audio: Assets.TabletAudio },
        GARDEN: { image: Assets.gardenImg, audio: Assets.GardenAudio },
        WINTER: { image: Assets.winterImg, audio: Assets.WinterAudio },
        TURTLE: { image: Assets.turtleImg, audio: Assets.TurtleAudio },
        RABBIT: { image: Assets.rabbitImg, audio: Assets.RabbitAudio },
        HUNGRY: { image: Assets.hungryImg, audio: Assets.HungryAudio },
      },
      arrM: ["TABLET", "GARDEN", "WINTER", "TURTLE", "RABBIT", "HUNGRY"],
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

  const handleWordClick = (word) => {
    if (!selectedWords.includes(word)) {
      const updatedWords = [...selectedWords, word];
      setSelectedWords(updatedWords);
      const validPairs = {
        ROCKET: ["ROCK", "ET"],
        PENCIL: ["PEN", "CIL"],
        DINNER: ["DIN", "NER"],
        SUNSET: ["SUN", "SET"],
        BASKET: ["BAS", "KET"],
        LEMON: ["LE", "MON"],
        PAPER: ["PAP", "ER"],
        HAPPY: ["HAP", "PY"],
        TIGER: ["TI", "GER"],
        PUPPET: ["PUP", "PET"],
        TICKET: ["TICK", "ET"],
        JACKET: ["JACK", "ETS"],
        BOTTLE: ["BOT", "TLE"],
        BUTTON: ["BUT", "TON"],
        LAPTOP: ["LAP", "TOP"],
        PILLOW: ["PIL", "LOW"],
        CANDLE: ["CAN", "DLE"],
        FLOWER: ["FLOW", "ER"],
        TABLET: ["TAB", "LET"],
        GARDEN: ["GAR", "DEN"],
        WINTER: ["WIN", "TER"],
        TURTLE: ["TUR", "TLE"],
        RABBIT: ["RAB", "BIT"],
        HUNGRY: ["HUN", "GRY"],
      };

      const currentWord = levels[currentLevel]?.arrM[currentWordIndex];

      const isCorrectPair = validPairs[currentWord]?.every((part) =>
        updatedWords.includes(part)
      );

      if (isCorrectPair) {
        setShowRecording(true);
        // setShowHint(false);
        // setWinEffect(true);
        // setShowConfetti(true);
        // setCoins((prevCoins) => prevCoins + 100);
        // setShowWrongWord(false);
        // setHighlightCorrectWords(false);

        // setTimeout(() => {
        //   setShowCoinsImg(true);

        //   setTimeout(() => {
        //     setShowEmptyImg(true);
        //     setShowNextButton(true);
        //     setShowCoinsImg(false);
        //   }, 1000);
        // }, 3000);

        // setTimeout(() => {
        //   setSelectedWords([]);
        //   setWinEffect(false);
        //   setShowEmptyImg(false);
        // }, 3000);

        // setTimeout(() => {
        //   setShowConfetti(false);
        // }, 3000);
      } else if (updatedWords.length === 2 && !winEffect) {
        setShowHint(false);
        setShowWrongWord(true);
      }
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
    <div
      style={{
        width: "100%",
        height: "100vh",
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
          height: "80%",
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
            left: screenWidth < 768 ? "50%" : "270px",
            bottom: screenWidth < 768 ? "220px" : "308px",
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
              width: screenWidth < 768 ? "120px" : "170px",
              height: screenWidth < 768 ? "90px" : "125px",
              zIndex: 100,
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
              <img
                src={Assets.resetImg}
                alt="Reset"
                style={{
                  width: screenWidth < 768 ? "40px" : "50px",
                  height: screenWidth < 768 ? "40px" : "50px",
                }}
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
                <img
                  src={Assets.nextImg}
                  alt="Next"
                  style={{
                    width: screenWidth < 768 ? "40px" : "50px",
                    height: screenWidth < 768 ? "40px" : "50px",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {showCoinsImg && (
        <div
          style={{
            position: "absolute",
            left: screenWidth < 768 ? "50%" : "157px",
            bottom: screenWidth < 768 ? "220px" : "308px",
            width: screenWidth < 768 ? "140px" : "240px",
            height: screenWidth < 768 ? "90px" : "130px",
            zIndex: 0,
            animation: "moveCoins 0s linear forwards",
            transform: screenWidth < 768 ? "translateX(-50%)" : "none",
          }}
        >
          <img
            src={Assets.coinssImg}
            alt="Coins Animation"
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <img
            src={Assets.textCoinsImg}
            alt="Text Coins"
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: screenWidth < 768 ? "20%" : "15%",
            }}
          />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: screenWidth < 768 ? "30%" : "10px",
          bottom: screenWidth < 768 ? "13%" : "0%",
          height: screenWidth < 768 ? "200px" : "390px",
          width: screenWidth < 768 ? "200px" : "390px",
          zIndex: "2",
          transform: screenWidth < 768 ? "translateX(-50%)" : "none",
        }}
      >
        <img
          src={Assets.monkeyImg}
          alt="Monkey"
          style={{
            width: screenWidth < 768 ? "150px" : "250px",
            height: screenWidth < 768 ? "250px" : "450px",
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
              src={Play}
              alt="Start"
              style={{
                width: screenWidth < 768 ? "40px" : "50px",
                height: screenWidth < 768 ? "40px" : "50px",
                position: "absolute",
                left: screenWidth < 768 ? "75%" : "55%",
                top: screenWidth < 768 ? "10%" : "5%",
                transform: "translateX(-50%)",
                zIndex: 100,
                padding: screenWidth < 768 ? "8px 16px" : "10px 20px",
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
                left: screenWidth < 768 ? "85%" : "65%",
                top: screenWidth < 768 ? "-19%" : "-7%",
                transform: "translateX(-50%)",
                width: screenWidth < 768 ? "120px" : "170px",
                height: screenWidth < 768 ? "90px" : "125px",
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
                    width: screenWidth < 768 ? "40px" : "60px",
                    height: screenWidth < 768 ? "40px" : "50px",
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
              >
                <img
                  src={Assets.resetImg}
                  alt="Reset"
                  style={{
                    width: screenWidth < 768 ? "40px" : "50px",
                    height: screenWidth < 768 ? "40px" : "70px",
                  }}
                />
              </button>
            </>
          )}
      </div>

      {showWrongWord && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
            left: screenWidth < 768 ? "50%" : "145px",
            bottom: screenWidth < 768 ? "220px" : "280px",
            width: screenWidth < 768 ? "140px" : "240px",
            height: screenWidth < 768 ? "90px" : "130px",
            zIndex: 1000,
          }}
        >
          <img
            src={Assets.wrongWordImg}
            alt="Wrong Word"
            style={{
              width: screenWidth < 768 ? "140px" : "190px",
              height: screenWidth < 768 ? "80px" : "100px",
              zIndex: 10,
              transform: screenWidth < 768 ? "translateX(-50%)" : "none",
            }}
          />
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              zIndex: "5",
            }}
            onClick={handleReset}
          >
            <img
              src={Assets.resetImg}
              alt="Reset"
              style={{
                width: screenWidth < 768 ? "40px" : "50px",
                height: screenWidth < 768 ? "40px" : "50px",
              }}
            />
          </button>
        </div>
      )}

      {showHint && !winEffect && (
        <div
          style={{
            position: "absolute",
            left: screenWidth < 768 ? "50%" : "175px",
            bottom: screenWidth < 768 ? "220px" : "320px",
            width: screenWidth < 768 ? "140px" : "240px",
            height: screenWidth < 768 ? "90px" : "130px",
            zIndex: 1000,
          }}
        >
          <img
            src={Assets.cloudText}
            alt="Cloud"
            style={{
              width: screenWidth < 768 ? "170px" : "230px",
              height: screenWidth < 768 ? "85px" : "160px",
              zIndex: 21,
            }}
          />
          <img
            src={currentImage}
            alt={levels[currentLevel]?.arrM[currentWordIndex]}
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              transform: "translate(-50%, -50%)",
              height: screenWidth < 768 ? "50px" : "70px",
              zIndex: 22,
            }}
          />
        </div>
      )}

      {showRecording &&
        (!isRecording && !isProcessing ? (
          <div
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "50%" : "175px",
              bottom: screenWidth < 768 ? "220px" : "320px",
              width: screenWidth < 768 ? "140px" : "240px",
              height: screenWidth < 768 ? "90px" : "130px",
              zIndex: 1000,
            }}
          >
            <img
              src={Assets.cloudText}
              alt="Cloud"
              style={{
                width: screenWidth < 768 ? "170px" : "230px",
                height: screenWidth < 768 ? "85px" : "160px",
                zIndex: 21,
              }}
            />
            <img
              src={Mic}
              alt={"Start Recording"}
              style={{
                position: "absolute",
                left: "50%",
                top: "45%",
                transform: "translate(-50%, -50%)",
                height: "50px",
                zIndex: 22,
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
              left: screenWidth < 768 ? "50%" : "175px",
              bottom: screenWidth < 768 ? "220px" : "320px",
              width: screenWidth < 768 ? "140px" : "240px",
              height: screenWidth < 768 ? "90px" : "130px",
              zIndex: 1000,
            }}
          >
            <img
              src={Assets.cloudText}
              alt="Cloud"
              style={{
                width: screenWidth < 768 ? "170px" : "230px",
                height: screenWidth < 768 ? "85px" : "160px",
                zIndex: 21,
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <img
                src={RecordVisualizer}
                alt={"Start Visualizer"}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "35%",
                  transform: "translate(-50%, -50%)",
                  height: "30px",
                  zIndex: 22,
                }}
              />
              <img
                src={Stop}
                alt={"Start Recording"}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "70%",
                  transform: "translate(-50%, -50%)",
                  height: "50px",
                  zIndex: 22,
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
              left: screenWidth < 768 ? "45%" : "170px",
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
                  width: screenWidth < 768 ? "130px" : "200px",
                  height: screenWidth < 768 ? "90px" : "130px",
                  zIndex: 21,
                }}
              />
              <p
                style={{
                  position: "absolute",
                  top: "42%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#333F61",
                  fontWeight: "700",
                  fontSize: screenWidth < 768 ? "16px" : "20px",
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
          right: screenWidth < 768 ? "50%" : "10%",
          top: screenWidth < 768 ? "15%" : "17%",
          transform: screenWidth < 768 ? "translateX(50%)" : "none",
          zIndex: 1,
        }}
      >
        {levels[currentLevel]?.words.map((word, index) => {
          const validPairs = {
            ROCKET: ["ROCK", "ET"],
            PENCIL: ["PEN", "CIL"],
            DINNER: ["DIN", "NER"],
            SUNSET: ["SUN", "SET"],
            BASKET: ["BAS", "KET"],
            LEMON: ["LE", "MON"],
            PAPER: ["PAP", "ER"],
            HAPPY: ["HAP", "PY"],
            TIGER: ["TI", "GER"],
            PUPPET: ["PUP", "PET"],
            TICKET: ["TICK", "ET"],
            JACKET: ["JACK", "ETS"],
            BOTTLE: ["BOT", "TLE"],
            BUTTON: ["BUT", "TON"],
            LAPTOP: ["LAP", "TOP"],
            PILLOW: ["PIL", "LOW"],
            CANDLE: ["CAN", "DLE"],
            FLOWER: ["FLOW", "ER"],
            TABLET: ["TAB", "LET"],
            GARDEN: ["GAR", "DEN"],
            WINTER: ["WIN", "TER"],
            TURTLE: ["TUR", "TLE"],
            RABBIT: ["RAB", "BIT"],
            HUNGRY: ["HUN", "GRY"],
          };

          const isCorrectWord =
            highlightCorrectWords &&
            validPairs[
              levels[currentLevel]?.levels[currentLevel]?.arrM[currentWordIndex]
            ].includes(word);

          return (
            <div
              key={index}
              style={{
                width: screenWidth < 768 ? "65px" : "75px",
                height: screenWidth < 768 ? "65px" : "75px",
                backgroundColor: isCorrectWord
                  ? "#93E908"
                  : selectedWords.includes(word)
                  ? showConfetti
                    ? "#00FF00"
                    : showWrongWord
                    ? "#FF2D55"
                    : "#1CB0F6"
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
                fontSize: screenWidth < 768 ? "16px" : "22px",
                fontWeight: "bold",
                border:
                  highlightedButtonIndex === index
                    ? "0.3px solid #4DBD25"
                    : "0.3px solid #000000",
                fontFamily: "Quicksand",
                cursor: "pointer",
                zIndex: 2,
              }}
              onClick={() => handleWordClick(word)}
            >
              <p
                style={{
                  transform: "rotate(12deg)",
                  fontSize: screenWidth < 768 ? "16px" : "22px",
                }}
              >
                {word}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BingoCard;
