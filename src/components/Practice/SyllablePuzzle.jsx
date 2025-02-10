import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import janwarImg from "../../assets/Janwar.svg";
import hintImg from "../../assets/hintNew.svg";
import hintbackImg from "../../assets/hintbackground.png";
import audioImg from "../../assets/audio.svg";
import clockImg from "../../assets/clock.svg";
import logoImg from "../../assets/logo.svg";
import appleeeeImg from "../../assets/appleimg.svg";
import candleImg from "../../assets/Candle.png";
import appleaudio from "../../assets/Apple.wav";
import candleaudio from "../../assets/CandleAudio.wav";
import sunsetaudio from "../../assets/sunsetAudio.wav";
import bottleaudio from "../../assets/BottleAudio.wav";
import ballonaudio from "../../assets/BallonAudio.wav";
import thumdownimg from "../../assets/thumbbdown.svg";
import patternimg1 from "../../assets/Pattern1.svg";
import patternimg2 from "../../assets/Pattern2.svg";
import patternimg3 from "../../assets/Pattern3.svg";
import sunsetImg from "../../assets/sunsetimg.png";
import ballonImg from "../../assets/ballons.jpg";
import bottleImg from "../../assets/bottle.png";
import juiceImg from "../../assets/juice.png";
import juiceAudio from "../../assets/juice.wav";
import paperImg from "../../assets/paperImg.png";
import PaperAudio from "../../assets/PaperAudio.wav";
import grapeImg from "../../assets/grape.jpg";
import GrapeAudio from "../../assets/GrapeAudio.wav";
import foodImg from "../../assets/food.jpg";
import foodAudio from "../../assets/Food.wav";
import coneImg from "../../assets/cone.jpg";
import ConeAudio from "../../assets/Cone.wav";
import moonImg from "../../assets/Moon.png";
import MoonAudio from "../../assets/Moon.wav";
import trainImg from "../../assets/Train.png";
import TrainAudio from "../../assets/train.wav";
import sliceImg from "../../assets/slice.png";
import sliceAudio from "../../assets/slice.wav";
import flameImg from "../../assets/flame.jpg";
import flameAudio from "../../assets/flame.wav";
import glassImg from "../../assets/glass.png";
import glassAudio from "../../assets/glass.wav";
import cakeImg from "../../assets/Cake.png";
import cakeAudio from "../../assets/cake.wav";
import dollImg from "../../assets/doll.jpg";
import dollAudio from "../../assets/doll.wav";
import foxImg from "../../assets/fox.png";
import foxAudio from "../../assets/fox.wav";
import bellImg from "../../assets/bell.jpg";
import bellAudio from "../../assets/bell.wav";
import sunImg from "../../assets/sun.png";
import sunAudio from "../../assets/sun.wav";
import { practiceSteps, getLocalData } from "../../utils/constants";

const SyllablePuzzle = ({
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
  const [selectedWordRounded, setSelectedWordRounded] = useState(null);
  const [selectedWordDashed, setSelectedWordDashed] = useState(null);
  const [showAppleHint, setShowAppleHint] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrectPair, setIsCorrectPair] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCorrectImage, setShowCorrectImage] = useState(false);
  const [correctWordDisplay, setCorrectWordDisplay] = useState(false);
  const [resetGame, setResetGame] = useState(false);
  const [incorrectPair, setIncorrectPair] = useState(false);
  const [incorrectWord, setIncorrectWord] = useState(null);

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

  console.log("lvlData", currentPracticeStep, currentStep, currentLevel, level);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentLevel]);

  const playAudio = () => {
    const audio = new Audio(content[currentLevel][currentIndex].audioSrc);
    audio.play();
  };

  const handleHintClick = () => {
    setShowAppleHint(true);
    setTimeout(() => {
      setShowAppleHint(false);
    }, 3000);
  };

  const handleWordClick = (word) => {
    if (!selectedWordRounded) {
      setSelectedWordRounded(word);
    } else if (!selectedWordDashed) {
      setSelectedWordDashed(word);
    }
  };

  useEffect(() => {
    if (selectedWordRounded && selectedWordDashed) {
      const selectedPair = [
        selectedWordRounded.text,
        selectedWordDashed.text,
      ].join("");
      const correctPair =
        content[currentLevel][currentIndex].corrrectWordPair.join("");

      if (selectedPair === correctPair) {
        setIsCorrectPair(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);

        setTimeout(() => {
          setShowCorrectImage(true);
          setCorrectWordDisplay(true);
          setResetGame(true);
        }, 2000);
      } else {
        setIsCorrectPair(false);
        setIncorrectPair(true);

        // Determine which words are incorrect
        const correctWords =
          content[currentLevel][currentIndex].corrrectWordPair;
        const incorrectWords = [];
        if (selectedWordRounded.text !== correctWords[0]) {
          incorrectWords.push(selectedWordRounded.text); // Rounded word is incorrect
        }
        if (selectedWordDashed.text !== correctWords[1]) {
          incorrectWords.push(selectedWordDashed.text); // Dashed word is incorrect
        }

        setIncorrectWord(incorrectWords); // Set the incorrect words

        setTimeout(() => {
          setIncorrectPair(false);
          setSelectedWordRounded(null);
          setSelectedWordDashed(null);
          setIncorrectWord([]); // Reset incorrect words
        }, 2000);
      }
    }
  }, [selectedWordRounded, selectedWordDashed, currentIndex]);

  useEffect(() => {
    if (resetGame) {
      setTimeout(() => {
        setSelectedWordRounded(null);
        setSelectedWordDashed(null);
        setShowCorrectImage(false);
        setCorrectWordDisplay(false);
        setResetGame(false);
        setCurrentIndex(currentIndex + 1);
        handleNext();
      }, 1000);
    }
  }, [resetGame]);

  const content = {
    L1: [
      {
        allwords: [
          { text: "AP", color: "#3CB9FF", number: 1 },
          { text: "TA", color: "#F45A2B", number: 2 },
          { text: "TI", color: "#31A746", number: 3 },
          { text: "GER", color: "#F45A2B", number: 4 },
          { text: "PLE", color: "#31A746", number: 5 },
          { text: "BLE", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: appleeeeImg,
        corrrectWord: "APPLE",
        corrrectWordPair: ["AP", "PLE"],
        audioSrc: appleaudio,
      },
      {
        allwords: [
          { text: "CAN", color: "#2D8EF8", number: 1 },
          { text: "TA", color: "#F45A2B", number: 2 },
          { text: "TI", color: "#31A746", number: 3 },
          { text: "GER", color: "#F45A2B", number: 4 },
          { text: "DLE", color: "#31A746", number: 5 },
          { text: "BLE", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: candleImg,
        corrrectWord: "CANDLE",
        corrrectWordPair: ["CAN", "DLE"],
        audioSrc: candleaudio,
      },
      {
        allwords: [
          { text: "SUN", color: "#2D8EF8", number: 1 },
          { text: "CAT", color: "#F45A2B", number: 2 },
          { text: "ICE", color: "#31A746", number: 3 },
          { text: "DOG", color: "#F45A2B", number: 4 },
          { text: "SET", color: "#31A746", number: 5 },
          { text: "FAT", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: sunsetImg,
        corrrectWord: "SUNSET",
        corrrectWordPair: ["SUN", "SET"],
        audioSrc: sunsetaudio,
      },
      {
        allwords: [
          { text: "TAB", color: "#2D8EF8", number: 1 },
          { text: "APP", color: "#F45A2B", number: 2 },
          { text: "BAL", color: "#31A746", number: 3 },
          { text: "DOG", color: "#F45A2B", number: 4 },
          { text: "LON", color: "#31A746", number: 5 },
          { text: "TOL", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: ballonImg,
        corrrectWord: "BALLON",
        corrrectWordPair: ["BAL", "LON"],
        audioSrc: ballonaudio,
      },
      {
        allwords: [
          { text: "TAB", color: "#2D8EF8", number: 1 },
          { text: "TLE", color: "#F45A2B", number: 2 },
          { text: "BAL", color: "#31A746", number: 3 },
          { text: "BOT", color: "#F45A2B", number: 4 },
          { text: "LON", color: "#31A746", number: 5 },
          { text: "TOL", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: bottleImg,
        corrrectWord: "BOTTLE",
        corrrectWordPair: ["BOT", "TLE"],
        audioSrc: bottleaudio,
      },
    ],
    L2: [
      {
        allwords: [
          { text: "JU", color: "#3CB9FF", number: 1 },
          { text: "ICE", color: "#F45A2B", number: 2 },
          { text: "TO", color: "#31A746", number: 3 },
          { text: "FU", color: "#F45A2B", number: 4 },
          { text: "LL", color: "#31A746", number: 5 },
          { text: "SL", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: juiceImg,
        corrrectWord: "JUICE",
        corrrectWordPair: ["JU", "ICE"],
        audioSrc: juiceAudio,
      },
      {
        allwords: [
          { text: "PA", color: "#3CB9FF", number: 1 },
          { text: "PER", color: "#F45A2B", number: 2 },
          { text: "BA", color: "#31A746", number: 3 },
          { text: "NA", color: "#F45A2B", number: 4 },
          { text: "NA", color: "#31A746", number: 5 },
          { text: "PAN", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: paperImg,
        corrrectWord: "PAPER",
        corrrectWordPair: ["PA", "PER"],
        audioSrc: PaperAudio,
      },
      {
        allwords: [
          { text: "GR", color: "#3CB9FF", number: 1 },
          { text: "APE", color: "#F45A2B", number: 2 },
          { text: "TO", color: "#31A746", number: 3 },
          { text: "AD", color: "#F45A2B", number: 4 },
          { text: "CO", color: "#31A746", number: 5 },
          { text: "AN", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: grapeImg,
        corrrectWord: "GRAPE",
        corrrectWordPair: ["GR", "APE"],
        audioSrc: GrapeAudio,
      },
      {
        allwords: [
          { text: "FO", color: "#3CB9FF", number: 1 },
          { text: "OD", color: "#F45A2B", number: 2 },
          { text: "RO", color: "#31A746", number: 3 },
          { text: "CK", color: "#F45A2B", number: 4 },
          { text: "PL", color: "#31A746", number: 5 },
          { text: "NT", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: foodImg,
        corrrectWord: "FOOD",
        corrrectWordPair: ["FO", "OD"],
        audioSrc: foodAudio,
      },
      {
        allwords: [
          { text: "CO", color: "#3CB9FF", number: 1 },
          { text: "NE", color: "#F45A2B", number: 2 },
          { text: "TR", color: "#31A746", number: 3 },
          { text: "EE", color: "#F45A2B", number: 4 },
          { text: "TO", color: "#31A746", number: 5 },
          { text: "MA", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: coneImg,
        corrrectWord: "CONE",
        corrrectWordPair: ["CO", "NE"],
        audioSrc: ConeAudio,
      },
    ],
    L3: [
      {
        allwords: [
          { text: "MO", color: "#3CB9FF", number: 1 },
          { text: "ON", color: "#F45A2B", number: 2 },
          { text: "PL", color: "#31A746", number: 3 },
          { text: "AN", color: "#F45A2B", number: 4 },
          { text: "ET", color: "#31A746", number: 5 },
          { text: "RO", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: moonImg,
        corrrectWord: "MOON",
        corrrectWordPair: ["MO", "ON"],
        audioSrc: MoonAudio,
      },
      {
        allwords: [
          { text: "TR", color: "#3CB9FF", number: 1 },
          { text: "AIN", color: "#F45A2B", number: 2 },
          { text: "SH", color: "#31A746", number: 3 },
          { text: "IP", color: "#F45A2B", number: 4 },
          { text: "RA", color: "#31A746", number: 5 },
          { text: "IL", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: trainImg,
        corrrectWord: "TRAIN",
        corrrectWordPair: ["TR", "AIN"],
        audioSrc: TrainAudio,
      },
      {
        allwords: [
          { text: "SL", color: "#3CB9FF", number: 1 },
          { text: "ICE", color: "#F45A2B", number: 2 },
          { text: "CLO", color: "#31A746", number: 3 },
          { text: "CK", color: "#F45A2B", number: 4 },
          { text: "FA", color: "#31A746", number: 5 },
          { text: "ST", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: sliceImg,
        corrrectWord: "SLICE",
        corrrectWordPair: ["SL", "ICE"],
        audioSrc: sliceAudio,
      },
      {
        allwords: [
          { text: "FL", color: "#3CB9FF", number: 1 },
          { text: "AME", color: "#F45A2B", number: 2 },
          { text: "GL", color: "#31A746", number: 3 },
          { text: "ASS", color: "#F45A2B", number: 4 },
          { text: "BR", color: "#31A746", number: 5 },
          { text: "IG", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: flameImg,
        corrrectWord: "FLAME",
        corrrectWordPair: ["FL", "AME"],
        audioSrc: flameAudio,
      },
      {
        allwords: [
          { text: "GL", color: "#3CB9FF", number: 1 },
          { text: "ASS", color: "#F45A2B", number: 2 },
          { text: "CH", color: "#31A746", number: 3 },
          { text: "AT", color: "#F45A2B", number: 4 },
          { text: "TO", color: "#31A746", number: 5 },
          { text: "PZ", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: glassImg,
        corrrectWord: "GLASS",
        corrrectWordPair: ["GL", "ASS"],
        audioSrc: glassAudio,
      },
    ],
    L4: [
      {
        allwords: [
          { text: "CA", color: "#3CB9FF", number: 1 },
          { text: "KE", color: "#F45A2B", number: 2 },
          { text: "MO", color: "#31A746", number: 3 },
          { text: "ON", color: "#F45A2B", number: 4 },
          { text: "BA", color: "#31A746", number: 5 },
          { text: "LL", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: cakeImg,
        corrrectWord: "CAKE",
        corrrectWordPair: ["CA", "KE"],
        audioSrc: cakeAudio,
      },
      {
        allwords: [
          { text: "DO", color: "#3CB9FF", number: 1 },
          { text: "LL", color: "#F45A2B", number: 2 },
          { text: "ST", color: "#31A746", number: 3 },
          { text: "AR", color: "#F45A2B", number: 4 },
          { text: "PA", color: "#31A746", number: 5 },
          { text: "RK", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: dollImg,
        corrrectWord: "DOLL",
        corrrectWordPair: ["DO", "LL"],
        audioSrc: dollAudio,
      },
      {
        allwords: [
          { text: "FO", color: "#3CB9FF", number: 1 },
          { text: "X", color: "#F45A2B", number: 2 },
          { text: "MO", color: "#31A746", number: 3 },
          { text: "P", color: "#F45A2B", number: 4 },
          { text: "LA", color: "#31A746", number: 5 },
          { text: "NE", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: foxImg,
        corrrectWord: "FOX",
        corrrectWordPair: ["FO", "X"],
        audioSrc: foxAudio,
      },
      {
        allwords: [
          { text: "BE", color: "#3CB9FF", number: 1 },
          { text: "LL", color: "#F45A2B", number: 2 },
          { text: "TO", color: "#31A746", number: 3 },
          { text: "AD", color: "#F45A2B", number: 4 },
          { text: "JU", color: "#31A746", number: 5 },
          { text: "MP", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: bellImg,
        corrrectWord: "BELL",
        corrrectWordPair: ["BE", "LL"],
        audioSrc: bellAudio,
      },
      {
        allwords: [
          { text: "SU", color: "#3CB9FF", number: 1 },
          { text: "N", color: "#F45A2B", number: 2 },
          { text: "FL", color: "#31A746", number: 3 },
          { text: "OW", color: "#F45A2B", number: 4 },
          { text: "ER", color: "#31A746", number: 5 },
          { text: "MO", color: "#2D8EF8", number: 6 },
        ],
        HintImg: hintbackImg,
        correctImage: sunImg,
        corrrectWord: "SUN",
        corrrectWordPair: ["SU", "N"],
        audioSrc: sunAudio,
      },
    ],
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#fdfdfd",
        padding: "16px",
        overflowX: "hidden",
      }}
    >
      {incorrectPair && (
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "30%",
            background:
              "linear-gradient(0deg, #FF7F36 -29.24%, rgba(255, 127, 54, 0) 100%)",
            zIndex: "0",
          }}
        ></div>
      )}
      {showConfetti && <Confetti />}
      <div
        style={{
          position: "absolute",
          top: "16px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <img
          src={logoImg}
          alt="Logo"
          style={{ width: "50px", height: "50px" }}
        />
      </div>

      {!showCorrectImage && (
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "55px",
            height: "55px",
            position: "absolute",
            top: "90px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={playAudio}
        >
          <img
            src={audioImg}
            alt="Audio"
            style={{ width: "35px", height: "35px" }}
          />
        </motion.div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          height: "100px",
          position: "relative",
        }}
      >
        {!showCorrectImage && (
          <>
            <div
              style={{
                width: "100px",
                height: "70px",
                borderRadius: "7px",
                backgroundColor: incorrectWord?.includes(
                  selectedWordRounded?.text
                )
                  ? "#FF7F364D"
                  : selectedWordRounded
                  ? selectedWordRounded.color
                  : "#eaf2f8",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: incorrectWord?.includes(selectedWordRounded?.text)
                  ? "0"
                  : "22px",
                fontWeight: "bold",
                color: "white",
                marginTop: "48px",
                border: incorrectWord?.includes(selectedWordRounded?.text)
                  ? "2px solid #FF7F364D"
                  : selectedWordRounded
                  ? "none"
                  : "2px solid #3CB9FF",
                boxShadow: selectedWordRounded
                  ? `2px 3px 6px 1px ${selectedWordRounded.color}80`
                  : "none",
              }}
            >
              {selectedWordRounded && selectedWordRounded.text}

              {selectedWordRounded && (
                <img
                  src={
                    selectedWordRounded.number === 1 ||
                    selectedWordRounded.number === 6
                      ? patternimg1
                      : selectedWordRounded.number === 2 ||
                        selectedWordRounded.number === 4
                      ? patternimg2
                      : patternimg3
                  }
                  alt="Pattern"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    opacity: 0.6,
                    objectFit: "cover",
                    borderRadius: "7px",
                  }}
                />
              )}
            </div>

            <div
              style={{
                width: "100px",
                height: "70px",
                borderRadius: "7px",
                backgroundColor: incorrectWord?.includes(
                  selectedWordDashed?.text
                )
                  ? "#FF7F364D"
                  : selectedWordDashed
                  ? selectedWordDashed.color
                  : "#eaf2f8",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: incorrectWord?.includes(selectedWordDashed?.text)
                  ? "0"
                  : "22px",
                fontWeight: "bold",
                color: "white",
                marginTop: "48px",
                border: incorrectWord?.includes(selectedWordDashed?.text)
                  ? "2px solid #FF7F364D"
                  : selectedWordDashed
                  ? "none"
                  : "3px dashed #3CB9FF33",
                boxShadow: selectedWordDashed
                  ? `3px 3px 6px 1px ${selectedWordDashed.color}80`
                  : "none",
              }}
            >
              {selectedWordDashed && selectedWordDashed.text}

              {selectedWordDashed && (
                <img
                  src={
                    selectedWordDashed.number === 1 ||
                    selectedWordDashed.number === 6
                      ? patternimg1
                      : selectedWordDashed.number === 2 ||
                        selectedWordDashed.number === 4
                      ? patternimg2
                      : patternimg3
                  }
                  alt="Pattern"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    opacity: 0.6,
                    objectFit: "cover",
                    borderRadius: "7px",
                  }}
                />
              )}
            </div>
          </>
        )}

        {showCorrectImage && (
          <>
            <img
              src={content[currentLevel][currentIndex].correctImage}
              alt="Correct"
              style={{ width: "50px", height: "50px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333F61",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                position: "relative",
                top: "20%",
                left: "5%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {content[currentLevel][currentIndex].corrrectWord}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          marginTop: "58px",
        }}
      >
        {content[currentLevel] &&
          content[currentLevel][currentIndex] &&
          content[currentLevel][currentIndex]?.allwords.map((word, index) => {
            let patternImg = null;

            if (index === 0 || index === 5) {
              patternImg = patternimg1;
            } else if (index === 1 || index === 3) {
              patternImg = patternimg2;
            } else if (index === 2 || index === 4) {
              patternImg = patternimg3;
            }

            const isIncorrectWord = incorrectWord === word.text;

            return (
              <motion.div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100px",
                  height: "70px",
                  borderRadius: "12px",
                  backgroundColor: isIncorrectWord
                    ? "#FF7F364D"
                    : selectedWordRounded?.text === word.text ||
                      selectedWordDashed?.text === word.text
                    ? "rgb(192 215 232)"
                    : word.color,
                  color: isIncorrectWord
                    ? "transparent"
                    : selectedWordRounded?.text === word.text ||
                      selectedWordDashed?.text === word.text
                    ? "transparent"
                    : "white",
                  fontSize: "22px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: isIncorrectWord
                    ? "none"
                    : selectedWordRounded?.text === word.text ||
                      selectedWordDashed?.text === word.text
                    ? "none"
                    : `3px 3px 6px 1px ${word.color}80`,
                  textShadow: isIncorrectWord
                    ? "none"
                    : selectedWordRounded?.text === word.text ||
                      selectedWordDashed?.text === word.text
                    ? "none"
                    : "0 1px 2px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  border: isIncorrectWord ? "2px solid #FF7F364D" : "none",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordClick(word)}
              >
                {word.text}

                {patternImg && (
                  <img
                    src={patternImg}
                    alt="Pattern"
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      opacity: 0.6,
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
      </div>

      <div style={{ position: "absolute", bottom: "150px", left: "0px" }}>
        <img
          src={janwarImg}
          alt="Monkey"
          style={{ width: "100px", height: "100px" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "260px",
          left: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {!incorrectPair && showAppleHint && (
          <div
            style={{ position: "relative", width: "110px", height: "120px" }}
          >
            <img
              src={content[currentLevel][currentIndex]?.HintImg}
              alt="Hint Background"
              style={{ width: "100%", height: "100%" }}
            />
            <img
              src={content[currentLevel][currentIndex]?.correctImage}
              alt="Hint Overlay"
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "30px",
                height: "30px",
              }}
            />
          </div>
        )}

        {!incorrectPair && (
          <div
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              cursor: "pointer",
            }}
            onClick={handleHintClick}
          >
            <img
              src={hintImg}
              alt="Hint"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        )}

        {incorrectPair && (
          <img
            src={thumdownimg}
            alt="Thumbs Down"
            style={{ width: "100px", height: "100px" }}
          />
        )}
      </div>
    </div>
  );
};

export default SyllablePuzzle;
