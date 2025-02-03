import React, { useState, useEffect } from "react";
import monkeyImg from "../../assets/Monkey.svg";
import RocketAudio from "../../assets/rocketAudio.wav";
import BasketAudio from "../../assets/basketAudio.wav";
import PencilAudio from "../../assets/pencilAudio.wav";
import SunsetAudio from "../../assets/sunsetAudio.wav";
import LemonAudio from "../../assets/lemonAudio.wav";
import DinnerAudio from "../../assets/dinnerAudio.wav";
import PaperAudio from "../../assets/PaperAudio.wav";
import TigerAudio from "../../assets/TigerAudio.wav";
import HappyAudio from "../../assets/HappyAudio.wav";
import PuppetAudio from "../../assets/PuppetAudio.wav";
import TicketAudio from "../../assets/TicketAudio.wav";
import JacketAudio from "../../assets/JacketAudio.wav";
import CandleAudio from "../../assets/CandleAudio.wav";
import FlowerAudio from "../../assets/FlowerAudio.wav";
import BottleAudio from "../../assets/BottleAudio.wav";
import ButtonAudio from "../../assets/ButtonAudio.wav";
import LaptopAudio from "../../assets/LaptopAudio.wav";
import PillowAudio from "../../assets/PillowAudio.wav";
import TabletAudio from "../../assets/TabletAudio.wav";
import GardenAudio from "../../assets/GardenAudio.wav";
import WinterAudio from "../../assets/WinterAudio.wav";
import TurtleAudio from "../../assets/TurtleAudio.wav";
import RabbitAudio from "../../assets/RabbitAudio.wav";
import HungryAudio from "../../assets/HungryAudio.wav";
import bottleImg from "../../assets/bottleImg.jpg";
import buttonImg from "../../assets/buttonImg.png";
import laptopImg from "../../assets/laptopImg.png";
import pillowImg from "../../assets/pillowImg.png";
import candleImg from "../../assets/candleImg.jpeg";
import flowerImg from "../../assets/flowerImg.jpeg";
import tabletImg from "../../assets/tabletImg.png";
import gardenImg from "../../assets/gardenImg.png";
import winterImg from "../../assets/winterImg.png";
import turtleImg from "../../assets/turtleImg.png";
import rabbitImg from "../../assets/rabbitImg.jpeg";
import hungryImg from "../../assets/hungryImg.png";
import hintImg from "../../assets/HintButton.svg";
import startImg from "../../assets/play-button.svg";
import resetImg from "../../assets/ResetButton.svg";
import cloudText from "../../assets/cloudText.png";
import rockImg from "../../assets/Cloud.png";
import rocketImg from "../../assets/rocketImg.svg";
import lemonImg from "../../assets/lemonImg.svg";
import basketImg from "../../assets/basketImg.svg";
import sunsetImg from "../../assets/sunsetImg.svg";
import dinnerImg from "../../assets/dinnerImg.svg";
import pencilImg from "../../assets/pencilImg.svg";
import paperImg from "../../assets/paperImg.png";
import happyImg from "../../assets/happyImg.jpeg";
import tigerImg from "../../assets/tigerImg.jpeg";
import puppetImg from "../../assets/puppetImg.png";
import ticketImg from "../../assets/ticketImg.png";
import jacketImg from "../../assets/jacketImg.jpg";
import etImg from "../../assets/win.svg";
import wrongWordImg from "../../assets/wrongWord.svg";
import textCoinsImg from "../../assets/100.svg";
import emptyImg from "../../assets/Empty.svg";
import Confetti from "react-confetti";
import coinssImg from "../../assets/Coinss.svg";
import chillarImg from "../../assets/chillar.png";
import nextImg from "../../assets/next.png";
import { practiceSteps, getLocalData } from "../../utils/constants";

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
        ROCKET: { image: rocketImg, audio: RocketAudio },
        PENCIL: { image: pencilImg, audio: PencilAudio },
        DINNER: { image: dinnerImg, audio: DinnerAudio },
        SUNSET: { image: sunsetImg, audio: SunsetAudio },
        BASKET: { image: basketImg, audio: BasketAudio },
        LEMON: { image: lemonImg, audio: LemonAudio },
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
        PAPER: { image: paperImg, audio: PaperAudio },
        HAPPY: { image: happyImg, audio: HappyAudio },
        TIGER: { image: tigerImg, audio: TigerAudio },
        PUPPET: { image: puppetImg, audio: PuppetAudio },
        TICKET: { image: ticketImg, audio: TicketAudio },
        JACKETS: { image: jacketImg, audio: JacketAudio },
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
        BOTTLE: { image: bottleImg, audio: BottleAudio },
        BUTTON: { image: buttonImg, audio: ButtonAudio },
        LAPTOP: { image: laptopImg, audio: LaptopAudio },
        PILLOW: { image: pillowImg, audio: PillowAudio },
        CANDLE: { image: candleImg, audio: CandleAudio },
        FLOWER: { image: flowerImg, audio: FlowerAudio },
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
        TABLET: { image: tabletImg, audio: TabletAudio },
        GARDEN: { image: gardenImg, audio: GardenAudio },
        WINTER: { image: winterImg, audio: WinterAudio },
        TURTLE: { image: turtleImg, audio: TurtleAudio },
        RABBIT: { image: rabbitImg, audio: RabbitAudio },
        HUNGRY: { image: hungryImg, audio: HungryAudio },
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
          top: screenWidth < 768 ? "10%" : "14%",
          left: "2.5%",
          borderRadius: "33px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "5%",
          width: "58px",
          height: "18px",
          paddingLeft: "12px",
          background: "rgba(144, 57, 3, 1)",
          borderRadius: "50px 30px 30px 50px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#FF8506",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "4px solid #FCAE1E",
        }}
      >
        <img
          src={chillarImg}
          alt="Coin"
          style={{
            height: "37px",
            position: "absolute",
            left: "-7px",
            borderRadius: "32px",
            zIndex: 0,
            top: "-12px",
          }}
        />
        <span style={{ color: "white" }}>{coins}</span>
      </div>

      {showEmptyImg && (
        <>
          <img
            src={emptyImg}
            alt="Empty Placeholder"
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "47%" : "21%",
              bottom: screenWidth < 768 ? "31%" : "50%",
              transform: "translateX(-50%)",
              width: screenWidth < 768 ? "120px" : "170px",
              height: screenWidth < 768 ? "90px" : "125px",
              zIndex: 100,
            }}
          />
          <button
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "40%" : "17%",
              top: screenWidth < 768 ? "76%" : "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              zIndex: "5",
            }}
            onClick={handleReset}
          >
            <img
              src={resetImg}
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
                left: screenWidth < 768 ? "60%" : "25%",
                top: screenWidth < 768 ? "76%" : "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                zIndex: "5",
              }}
              onClick={handleNextButton}
            >
              <img
                src={nextImg}
                alt="Next"
                style={{
                  width: screenWidth < 768 ? "40px" : "50px",
                  height: screenWidth < 768 ? "40px" : "50px",
                }}
              />
            </button>
          )}
        </>
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
            src={coinssImg}
            alt="Coins Animation"
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <img
            src={textCoinsImg}
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
          src={monkeyImg}
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
              src={startImg}
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
              src={emptyImg}
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
          !startGame && (
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
                  src={hintImg}
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
                  src={resetImg}
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
        <>
          <img
            src={wrongWordImg}
            alt="Wrong Word"
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "46%" : "12%",
              bottom: screenWidth < 768 ? "29%" : "52%",
              width: screenWidth < 768 ? "140px" : "190px",
              height: screenWidth < 768 ? "80px" : "100px",
              zIndex: 10,
              transform: screenWidth < 768 ? "translateX(-50%)" : "none",
            }}
          />
          <button
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "40%" : "17%",
              top: screenWidth < 768 ? "75%" : "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              zIndex: "5",
            }}
            onClick={handleReset}
          >
            <img
              src={resetImg}
              alt="Reset"
              style={{
                width: screenWidth < 768 ? "40px" : "50px",
                height: screenWidth < 768 ? "40px" : "50px",
              }}
            />
          </button>
        </>
      )}

      {showHint && !winEffect && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            left: screenWidth < 768 ? "61%" : "160px",
            top: screenWidth < 768 ? "475px" : "110px",
            transform: screenWidth < 768 ? "translateX(-50%)" : "none",
          }}
        >
          <img
            src={cloudText}
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
              top: "40%",
              transform: "translate(-50%, -50%)",
              height: screenWidth < 768 ? "50px" : "70px",
              zIndex: 22,
            }}
          />
        </div>
      )}

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
                src={rockImg}
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
              src={etImg}
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
          gridTemplateColumns:
            screenWidth < 768 ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
          gap: screenWidth < 768 ? "10px 30px" : "20px 50px",
          position: "absolute",
          right: screenWidth < 768 ? "50%" : "10%",
          top: screenWidth < 768 ? "15%" : "20%",
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
