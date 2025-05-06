import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import * as s3Assets from "../utils/s3Links";
import { getAssetUrl } from "../utils/s3Links";
import { getAssetAudioUrl } from "../utils/s3Links";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.png";
// import Mic from "../assets/mikee.svg";
// import Stop from "../assets/pausse.svg";
import correctSound from "../assets/correct.wav";
import wrongSound from "../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
} from "../utils/constants";
import { useNavigate } from "react-router-dom";

// const content = {
//   L1: [
//     {
//       allwords: [
//         { img: Assets.shopImg, text: "Shop" },
//         { img: Assets.whaleRImg, text: "Whale" },
//         { img: Assets.pillowR1ThreeImg, text: "Mug" },
//       ],
//       correctWord: "Whale",
//       audio: Assets.whaleRAudio,
//       flowName: "P1",
//     },
//     {
//       allwords: [
//         { img: Assets.aimRImg, text: "Aim" },
//         { img: Assets.ropeR1OneImg, text: "Rope" },
//         { img: Assets.ropeR1ThreeImg, text: "Pen" },
//       ],
//       correctWord: "Aim",
//       audio: Assets.aimRAudio,
//       flowName: "P2",
//     },
//     {
//       allwords: [
//         { img: Assets.boatRImg, text: "Boat" },
//         { img: Assets.bagR1TwoImg, text: "Shoes" },
//         { img: Assets.bagR1ThreeImg, text: "Watch" },
//       ],
//       correctWord: "Boat",
//       audio: Assets.boatRAudio,
//       flowName: "P3",
//     },
//     {
//       allwords: [
//         { img: Assets.capR1TwoImg, text: "Belt" },
//         { img: Assets.phoneRImg, text: "Phone" },
//         { img: Assets.capR1ThreeImg, text: "Tie" },
//       ],
//       correctWord: "Phone",
//       audio: Assets.phoneRAudio,
//       flowName: "P4",
//     },
//     {
//       allwords: [
//         { img: Assets.orangeRImg, text: "Orange" },
//         { img: Assets.dogR1TwoImg, text: "Cat" },
//         { img: Assets.dogR1ThreeImg, text: "Horse" },
//       ],
//       correctWord: "Orange",
//       audio: Assets.orangeRAudio,
//       flowName: "P5",
//     },
//     {
//       allwords: [
//         { img: Assets.eggR1TwoImg, text: "Fan" },
//         { img: Assets.clockRImg, text: "Clock" },
//         { img: Assets.eggR1ThreeImg, text: "Goat" },
//       ],
//       correctWord: "Clock",
//       audio: Assets.clockRAudio,
//       flowName: "P6",
//     },
//     {
//       allwords: [
//         { img: Assets.fanR1OneImg, text: "Fan" },
//         { img: Assets.flowerRImg, text: "Flower" },
//         { img: Assets.fanR1ThreeImg, text: "Lamp" },
//       ],
//       correctWord: "Flower",
//       audio: Assets.flowerRAudio,
//       flowName: "P7",
//     },
//     {
//       allwords: [
//         { img: Assets.glassRImg, text: "Glass" },
//         { img: Assets.hatR1TwoImg, text: "Bat" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Glass",
//       audio: Assets.glassRAudio,
//       flowName: "P8",
//     },
//     {
//       allwords: [
//         { img: Assets.plantRImg, text: "Plant" },
//         { img: Assets.hatR1TwoImg, text: "Bat" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Plant",
//       audio: Assets.plantRAudio,
//       flowName: "P9",
//     },
//     {
//       allwords: [
//         { img: Assets.glassRImg, text: "Glass" },
//         { img: Assets.sleepRImg, text: "Sleep" },
//         { img: Assets.fanR1ThreeImg, text: "Lamp" },
//       ],
//       correctWord: "Sleep",
//       audio: Assets.sleepRAudio,
//       flowName: "P10",
//     },
//     {
//       allwords: [
//         { img: Assets.elephantRImg, text: "Elephant" },
//         { img: Assets.aimRImg, text: "Aim" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Elephant",
//       audio: Assets.elephantRAudio,
//       flowName: "P11",
//     },
//     {
//       allwords: [
//         { img: Assets.fanR1ThreeImg, text: "Lamp" },
//         { img: Assets.hatR1TwoImg, text: "Bat" },
//         { img: Assets.muscleRImg, text: "Muscle" },
//       ],
//       correctWord: "Muscle",
//       audio: Assets.muscleRAudio,
//       flowName: "P12",
//     },
//     {
//       allwords: [
//         { img: Assets.capR1TwoImg, text: "Belt" },
//         { img: Assets.fieldRImg, text: "Field" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Field",
//       audio: Assets.fieldRAudio,
//       flowName: "P13",
//     },
//     {
//       allwords: [
//         { img: Assets.bicycleRImg, text: "Cycle" },
//         { img: Assets.ropeR1ThreeImg, text: "Pen" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Cycle",
//       audio: Assets.bicycleRAudio,
//       flowName: "P14",
//     },
//     {
//       allwords: [
//         { img: Assets.plantRImg, text: "Plant" },
//         { img: Assets.mathsRImg, text: "Maths" },
//         { img: Assets.eggR1ThreeImg, text: "Goat" },
//       ],
//       correctWord: "Maths",
//       audio: Assets.mathsRAudio,
//       flowName: "P15",
//     },
//   ],
// };

const content = {
  L1: [
    {
      allwords: [
        { img: getAssetUrl(s3Assets.shopImg) || Assets.shopImg, text: "Shop" },
        {
          img: getAssetUrl(s3Assets.whaleRImg) || Assets.whaleRImg,
          text: "Whale",
        },
        {
          img:
            getAssetUrl(s3Assets.pillowR1ThreeImg) || Assets.pillowR1ThreeImg,
          text: "Mug",
        },
      ],
      correctWord: "Whale",
      audio: getAssetAudioUrl(s3Assets.whaleRAudio) || Assets.whaleRAudio,
      flowName: "P1",
    },
    {
      allwords: [
        { img: getAssetUrl(s3Assets.aimRImg) || Assets.aimRImg, text: "Aim" },
        {
          img: getAssetUrl(s3Assets.ropeR1OneImg) || Assets.ropeR1OneImg,
          text: "Rope",
        },
        {
          img: getAssetUrl(s3Assets.ropeR1ThreeImg) || Assets.ropeR1ThreeImg,
          text: "Pen",
        },
      ],
      correctWord: "Aim",
      audio: getAssetAudioUrl(s3Assets.aimRAudio) || Assets.aimRAudio,
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatRImg) || Assets.boatRImg,
          text: "Boat",
        },
        {
          img: getAssetUrl(s3Assets.bagR1TwoImg) || Assets.bagR1TwoImg,
          text: "Shoes",
        },
        {
          img: getAssetUrl(s3Assets.bagR1ThreeImg) || Assets.bagR1ThreeImg,
          text: "Watch",
        },
      ],
      correctWord: "Boat",
      audio: getAssetAudioUrl(s3Assets.boatRAudio) || Assets.boatRAudio,
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.capR1TwoImg) || Assets.capR1TwoImg,
          text: "Belt",
        },
        {
          img: getAssetUrl(s3Assets.phoneRImg) || Assets.phoneRImg,
          text: "Phone",
        },
        {
          img: getAssetUrl(s3Assets.capR1ThreeImg) || Assets.capR1ThreeImg,
          text: "Tie",
        },
      ],
      correctWord: "Phone",
      audio: getAssetAudioUrl(s3Assets.phoneRAudio) || Assets.phoneRAudio,
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.orangeRImg) || Assets.orangeRImg,
          text: "Orange",
        },
        {
          img: getAssetUrl(s3Assets.dogR1TwoImg) || Assets.dogR1TwoImg,
          text: "Cat",
        },
        {
          img: getAssetUrl(s3Assets.dogR1ThreeImg) || Assets.dogR1ThreeImg,
          text: "Horse",
        },
      ],
      correctWord: "Orange",
      audio: getAssetAudioUrl(s3Assets.orangeRAudio) || Assets.orangeRAudio,
      flowName: "P5",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.eggR1TwoImg) || Assets.eggR1TwoImg,
          text: "Fan",
        },
        {
          img: getAssetUrl(s3Assets.clockRImg) || Assets.clockRImg,
          text: "Clock",
        },
        {
          img: getAssetUrl(s3Assets.eggR1ThreeImg) || Assets.eggR1ThreeImg,
          text: "Goat",
        },
      ],
      correctWord: "Clock",
      audio: getAssetAudioUrl(s3Assets.clockRAudio) || Assets.clockRAudio,
      flowName: "P6",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fanR1OneImg) || Assets.fanR1OneImg,
          text: "Fan",
        },
        {
          img: getAssetUrl(s3Assets.flowerRImg) || Assets.flowerRImg,
          text: "Flower",
        },
        {
          img: getAssetUrl(s3Assets.fanR1ThreeImg) || Assets.fanR1ThreeImg,
          text: "Lamp",
        },
      ],
      correctWord: "Flower",
      audio: getAssetAudioUrl(s3Assets.flowerRAudio) || Assets.flowerRAudio,
      flowName: "P7",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.glassRImg) || Assets.glassRImg,
          text: "Glass",
        },
        {
          img: getAssetUrl(s3Assets.hatR1TwoImg) || Assets.hatR1TwoImg,
          text: "Bat",
        },
        {
          img: getAssetUrl(s3Assets.hatR1ThreeImg) || Assets.hatR1ThreeImg,
          text: "Carpet",
        },
      ],
      correctWord: "Glass",
      audio: getAssetAudioUrl(s3Assets.glassRAudio) || Assets.glassRAudio,
      flowName: "P8",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.gardenImg) || Assets.gardenImg,
          text: "Plant",
        },
        {
          img: getAssetUrl(s3Assets.hatR1TwoImg) || Assets.hatR1TwoImg,
          text: "Bat",
        },
        {
          img: getAssetUrl(s3Assets.hatR1ThreeImg) || Assets.hatR1ThreeImg,
          text: "Carpet",
        },
      ],
      correctWord: "Plant",
      audio: getAssetAudioUrl(s3Assets.plantRAudio) || Assets.plantRAudio,
      flowName: "P9",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.glassRImg) || Assets.glassRImg,
          text: "Glass",
        },
        {
          img: getAssetUrl(s3Assets.sleepRImg) || Assets.sleepRImg,
          text: "Sleep",
        },
        {
          img: getAssetUrl(s3Assets.fanR1ThreeImg) || Assets.fanR1ThreeImg,
          text: "Lamp",
        },
      ],
      correctWord: "Sleep",
      audio: getAssetAudioUrl(s3Assets.sleepRAudio) || Assets.sleepRAudio,
      flowName: "P10",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.elephantRImg) || Assets.elephantRImg,
          text: "Elephant",
        },
        { img: getAssetUrl(s3Assets.aimRImg) || Assets.aimRImg, text: "Aim" },
        {
          img: getAssetUrl(s3Assets.hatR1ThreeImg) || Assets.hatR1ThreeImg,
          text: "Carpet",
        },
      ],
      correctWord: "Elephant",
      audio: getAssetAudioUrl(s3Assets.elephantRAudio) || Assets.elephantRAudio,
      flowName: "P11",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fanR1ThreeImg) || Assets.fanR1ThreeImg,
          text: "Lamp",
        },
        {
          img: getAssetUrl(s3Assets.hatR1TwoImg) || Assets.hatR1TwoImg,
          text: "Bat",
        },
        {
          img: getAssetUrl(s3Assets.muscleRImg) || Assets.muscleRImg,
          text: "Muscle",
        },
      ],
      correctWord: "Muscle",
      audio: getAssetAudioUrl(s3Assets.muscleRAudio) || Assets.muscleRAudio,
      flowName: "P12",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.capR1TwoImg) || Assets.capR1TwoImg,
          text: "Belt",
        },
        {
          img: getAssetUrl(s3Assets.fieldRImg) || Assets.fieldRImg,
          text: "Field",
        },
        {
          img: getAssetUrl(s3Assets.hatR1ThreeImg) || Assets.hatR1ThreeImg,
          text: "Carpet",
        },
      ],
      correctWord: "Field",
      audio: getAssetAudioUrl(s3Assets.fieldRAudio) || Assets.fieldRAudio,
      flowName: "P13",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.bicycleRImg) || Assets.bicycleRImg,
          text: "Cycle",
        },
        {
          img: getAssetUrl(s3Assets.ropeR1ThreeImg) || Assets.ropeR1ThreeImg,
          text: "Pen",
        },
        {
          img: getAssetUrl(s3Assets.hatR1ThreeImg) || Assets.hatR1ThreeImg,
          text: "Carpet",
        },
      ],
      correctWord: "Cycle",
      audio: getAssetAudioUrl(s3Assets.bicycleRAudio) || Assets.bicycleRAudio,
      flowName: "P14",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.gardenImg) || Assets.gardenImg,
          text: "Plant",
        },
        {
          img: getAssetUrl(s3Assets.mathsRImg) || Assets.mathsRImg,
          text: "Maths",
        },
        {
          img: getAssetUrl(s3Assets.eggR1ThreeImg) || Assets.eggR1ThreeImg,
          text: "Goat",
        },
      ],
      correctWord: "Maths",
      audio: getAssetAudioUrl(s3Assets.mathsRAudio) || Assets.mathsRAudio,
      flowName: "P15",
    },
  ],
};

const R3 = ({
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
  rStep,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  steps = 1;

  const handleWordClick = (word) => {
    setSelectedWord(word);
    const currentQuestion = content.L1[currentQuestionIndex];

    if (word === currentQuestion.correctWord) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongWord(null);
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedWord(null);
        // setCurrentQuestionIndex(
        //   (prevIndex) => (prevIndex + 1) % content.L1.length
        // );
        setRecording("recording");
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 2000);
    }
  };

  const currentQuestion = content.L1[currentQuestionIndex];

  const flowNames = [...new Set(content.L1.map((item) => item.flowName))];
  const activeFlow = content.L1[currentQuestionIndex]?.flowName || flowNames[0];

  const correctImage = currentQuestion?.allwords?.find(
    (word) => word.text === currentQuestion?.correctWord
  )?.img;

  let currentAudio = null;

  const handlePlayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    currentAudio = new Audio(content.L1[currentQuestionIndex].audio);

    currentAudio.play();
    setIsPlaying(true);
    setIsAudioPlayedOnce(true);

    currentAudio.onended = () => {
      setIsPlaying(false);
    };
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
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
      rStep={rStep}
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
      {currentQuestion?.allwords ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "97vh",
            background: "linear-gradient(180deg, #91E7EF 0%, #42C6FF 100%)",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {recording === "no" && (
            <>
              {showConfetti && <Confetti />}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {[
                  { top: "10%", left: "5%" },
                  { top: "25%", left: "30%" },
                  { top: "10%", left: "55%" },
                  { top: "25%", left: "80%" },
                ].map((pos, index) => (
                  <img
                    key={index}
                    src={Assets.cloudNewImg}
                    alt={`Cloud ${index + 1}`}
                    style={{
                      position: "absolute",
                      width: "150px",
                      height: "auto",
                      ...pos,
                    }}
                  />
                ))}
              </div>

              {selectedWord === currentQuestion?.correctWord ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    marginBottom: "75px",
                  }}
                >
                  <img
                    src={Assets.tickImg}
                    alt="Tick"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ) : wrongWord ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "60%",
                    backgroundColor: "rgba(255, 127, 54, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "4px solid #FFFFFF",
                    marginBottom: "75px",
                  }}
                >
                  <img
                    src={Assets.xImg}
                    alt="Wrong"
                    style={{ width: "25px", height: "25px" }}
                  />
                </div>
              ) : (
                <button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  style={{
                    position: "relative",
                    marginBottom: "75px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={
                      isPlaying ? Assets.pauseButtonImg : Assets.playButtonImg
                    }
                    alt="Audio"
                    style={{
                      width: "55px",
                      height: "55px",
                      transform: `scale(${scale})`,
                      transition: "transform 0.5s ease-in-out",
                    }}
                  />
                </button>
              )}

              <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
                {currentQuestion?.allwords.map((item, index) => {
                  const isCorrect =
                    selectedWord === currentQuestion?.correctWord &&
                    item.text === selectedWord;
                  const isWrong = wrongWord === item.text;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: isCorrect
                          ? "rgba(117, 209, 0, 0.6)"
                          : isWrong
                          ? "rgba(255, 127, 54, 0.8)"
                          : "#FFFFFF",
                        padding: "8px",
                        borderRadius: "24px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                        width: "128px",
                        height: "128px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(56px)",
                        WebkitBackdropFilter: "blur(56px)",
                        cursor: isAudioPlayedOnce ? "pointer" : "not-allowed",
                        opacity: isAudioPlayedOnce ? 1 : 0.7,
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      onClick={() => {
                        if (isAudioPlayedOnce) {
                          handleWordClick(item.text);
                        }
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.text}
                        style={{ width: "110px", height: "110px" }}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {recording === "recording" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "80px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <img
                onClick={() => {
                  setRecording("startRec");
                }}
                src={Assets.pzMic}
                alt="mic"
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
              />
            </div>
          )}
          {recording === "startRec" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "80px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
                <RecordVoiceVisualizer />
              </Box>
              <img
                onClick={() => {
                  const audio = new Audio(correctSound);
                  audio.play();
                  setRecording("no");
                  setIsPlaying(false);
                  if (currentQuestionIndex === content.L1.length - 1) {
                    // setLocalData("rFlow", false);
                    // if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                    //   navigate("/");
                    // } else {
                    //   navigate("/discover-start");
                    // }
                    setIsAudioPlayedOnce(false);
                    onComplete();
                  } else {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    setIsAudioPlayedOnce(false);
                  }
                }}
                src={Assets.pause}
                alt="Stop"
                style={{ width: "60px", height: "60px", cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px" }}>{currentQuestion.word}</h2>
          {currentQuestion.img && (
            <img
              src={currentQuestion.img}
              alt={currentQuestion.word}
              style={{ width: "120px", height: "120px" }}
            />
          )}
          <div style={{ marginTop: "20px" }}>
            {recording === "no" ? (
              <img
                onClick={() => setRecording("startRec")}
                src={Assets.mic}
                alt="Start Recording"
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "80px",
                  margin: "20px 20px",
                }}
              >
                <RecordVoiceVisualizer />
                <img
                  onClick={() => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    if (currentQuestionIndex === content.L1.length - 1) {
                      // setLocalData("rFlow", false);
                      // if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                      //   navigate("/");
                      // } else {
                      //   navigate("/discover-start");
                      // }
                      onComplete();
                    } else {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    }
                  }}
                  src={Assets.pause}
                  alt="Stop Recording"
                  style={{ width: "60px", height: "60px", cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default R3;
