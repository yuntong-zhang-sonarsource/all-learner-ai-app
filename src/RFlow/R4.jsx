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
//         { img: Assets.Apple, text: "Apple" },
//         { img: Assets.StarRImg, text: "Star" },
//         { img: Assets.jugR1OneImg, text: "Mug" },
//       ],
//       correctWord: "Star",
//       audio: Assets.starRAudio,
//       flowName: "P1",
//     },
//     {
//       allwords: [
//         { img: Assets.sunsetImg, text: "Sunset" },
//         { img: Assets.basketImg, text: "Basket" },
//         { img: Assets.spinRImg, text: "Spin" },
//       ],
//       correctWord: "Spin",
//       audio: Assets.spinRAudio,
//       flowName: "P2",
//     },
//     {
//       allwords: [
//         { img: Assets.skyRImg, text: "Sky" },
//         { img: Assets.bagR1TwoImg, text: "Shoes" },
//         { img: Assets.bagR1ThreeImg, text: "Watch" },
//       ],
//       correctWord: "Sky",
//       audio: Assets.skyRAudio,
//       flowName: "P3",
//     },
//     {
//       allwords: [
//         { img: Assets.capR1TwoImg, text: "Belt" },
//         { img: Assets.treeRImg, text: "Tree" },
//         { img: Assets.capR1ThreeImg, text: "Tie" },
//       ],
//       correctWord: "Tree",
//       audio: Assets.treeRAudio,
//       flowName: "P4",
//     },
//     {
//       allwords: [
//         { img: Assets.dragonRImg, text: "Dragon" },
//         { img: Assets.dogR1TwoImg, text: "Cat" },
//         { img: Assets.dogR1ThreeImg, text: "Horse" },
//       ],
//       correctWord: "Dragon",
//       audio: Assets.dragonRAudio,
//       flowName: "P5",
//     },
//     {
//       allwords: [
//         { img: Assets.eggR1TwoImg, text: "Fan" },
//         { img: Assets.oilRImg, text: "Oil" },
//         { img: Assets.eggR1ThreeImg, text: "Goat" },
//       ],
//       correctWord: "Oil",
//       audio: Assets.oilRAudio,
//       flowName: "P6",
//     },
//     {
//       allwords: [
//         { img: Assets.streetRImg, text: "Street" },
//         { img: Assets.fanR1TwoImg, text: "Table" },
//         { img: Assets.fanR1ThreeImg, text: "Lamp" },
//       ],
//       correctWord: "Street",
//       audio: Assets.streetRAudio,
//       flowName: "P7",
//     },
//     {
//       allwords: [
//         { img: Assets.pantherRImg, text: "Panther" },
//         { img: Assets.hatR1TwoImg, text: "Bat" },
//         { img: Assets.hatR1ThreeImg, text: "Carpet" },
//       ],
//       correctWord: "Panther",
//       audio: Assets.pantherRAudio,
//       flowName: "P8",
//     },
//     {
//       allwords: [
//         { img: Assets.shopImg, text: "Shop" },
//         { img: Assets.listenRImg, text: "Listen" },
//         { img: Assets.pillowR1ThreeImg, text: "Mug" },
//       ],
//       correctWord: "Listen",
//       audio: Assets.listenRAudio,
//       flowName: "P9",
//     },
//     {
//       allwords: [
//         { img: Assets.threeRImg, text: "Three" },
//         { img: Assets.ropeR1OneImg, text: "Rope" },
//         { img: Assets.ropeR1ThreeImg, text: "Pen" },
//       ],
//       correctWord: "Three",
//       audio: Assets.threeRAudio,
//       flowName: "P10",
//     },
//     {
//       allwords: [
//         { img: Assets.drawRImg, text: "Draw" },
//         { img: Assets.bagR1TwoImg, text: "Shoes" },
//         { img: Assets.bagR1ThreeImg, text: "Watch" },
//       ],
//       correctWord: "Draw",
//       audio: Assets.drawRAudio,
//       flowName: "P11",
//     },
//     {
//       allwords: [
//         { img: Assets.capR1TwoImg, text: "Belt" },
//         { img: Assets.scratchRImg, text: "Scratch" },
//         { img: Assets.capR1ThreeImg, text: "Tie" },
//       ],
//       correctWord: "Scratch",
//       audio: Assets.scratchRAudio,
//       flowName: "P12",
//     },
//     {
//       allwords: [
//         { img: Assets.treasureRImg, text: "Treasure" },
//         { img: Assets.dogR1TwoImg, text: "Cat" },
//         { img: Assets.dogR1ThreeImg, text: "Horse" },
//       ],
//       correctWord: "Treasure",
//       audio: Assets.treasureRAudio,
//       flowName: "P13",
//     },
//     {
//       allwords: [
//         { img: Assets.eggR1TwoImg, text: "Fan" },
//         { img: Assets.deskRImg, text: "Desk" },
//         { img: Assets.eggR1ThreeImg, text: "Goat" },
//       ],
//       correctWord: "Desk",
//       audio: Assets.deskRAudio,
//       flowName: "P14",
//     },
//     {
//       allwords: [
//         { img: Assets.fanR1OneImg, text: "Fan" },
//         { img: Assets.shoutRImg, text: "Shout" },
//         { img: Assets.fanR1ThreeImg, text: "Lamp" },
//       ],
//       correctWord: "Shout",
//       audio: Assets.shoutRAudio,
//       flowName: "P15",
//     },
//   ],
// };

const content = {
  L1: [
    {
      allwords: [
        { img: getAssetUrl(s3Assets.Apple) || Assets.Apple, text: "Apple" },
        { img: Assets.StarRImg, text: "Star" },
        {
          img: getAssetUrl(s3Assets.jugR1OneImg) || Assets.jugR1OneImg,
          text: "Mug",
        },
      ],
      correctWord: "Star",
      audio: getAssetAudioUrl(s3Assets.starRAudio) || Assets.starRAudio,
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.sunsetImg) || Assets.sunsetImg,
          text: "Sunset",
        },
        {
          img: getAssetUrl(s3Assets.basketImg) || Assets.basketImg,
          text: "Basket",
        },
        {
          img: getAssetUrl(s3Assets.spinRImg) || Assets.spinRImg,
          text: "Spin",
        },
      ],
      correctWord: "Spin",
      audio: getAssetAudioUrl(s3Assets.spinRAudio) || Assets.spinRAudio,
      flowName: "P2",
    },
    {
      allwords: [
        { img: getAssetUrl(s3Assets.skyRImg) || Assets.skyRImg, text: "Sky" },
        {
          img: getAssetUrl(s3Assets.bagR1TwoImg) || Assets.bagR1TwoImg,
          text: "Shoes",
        },
        {
          img: getAssetUrl(s3Assets.bagR1ThreeImg) || Assets.bagR1ThreeImg,
          text: "Watch",
        },
      ],
      correctWord: "Sky",
      audio: getAssetAudioUrl(s3Assets.skyRAudio) || Assets.skyRAudio,
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.capR1TwoImg) || Assets.capR1TwoImg,
          text: "Belt",
        },
        {
          img: getAssetUrl(s3Assets.treeRImg) || Assets.treeRImg,
          text: "Tree",
        },
        {
          img: getAssetUrl(s3Assets.capR1ThreeImg) || Assets.capR1ThreeImg,
          text: "Tie",
        },
      ],
      correctWord: "Tree",
      audio: getAssetAudioUrl(s3Assets.treeRAudio) || Assets.treeRAudio,
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dragonRImg) || Assets.dragonRImg,
          text: "Dragon",
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
      correctWord: "Dragon",
      audio: getAssetAudioUrl(s3Assets.dragonRAudio) || Assets.dragonRAudio,
      flowName: "P5",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.eggR1TwoImg) || Assets.eggR1TwoImg,
          text: "Fan",
        },
        { img: getAssetUrl(s3Assets.oilRImg) || Assets.oilRImg, text: "Oil" },
        {
          img: getAssetUrl(s3Assets.eggR1ThreeImg) || Assets.eggR1ThreeImg,
          text: "Goat",
        },
      ],
      correctWord: "Oil",
      audio: getAssetAudioUrl(s3Assets.oilRAudio) || Assets.oilRAudio,
      flowName: "P6",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.streetRImg) || Assets.streetRImg,
          text: "Street",
        },
        {
          img: getAssetUrl(s3Assets.fanR1TwoImg) || Assets.fanR1TwoImg,
          text: "Table",
        },
        {
          img: getAssetUrl(s3Assets.fanR1ThreeImg) || Assets.fanR1ThreeImg,
          text: "Lamp",
        },
      ],
      correctWord: "Street",
      audio: getAssetAudioUrl(s3Assets.streetRAudio) || Assets.streetRAudio,
      flowName: "P7",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pantherRImg) || Assets.pantherRImg,
          text: "Panther",
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
      correctWord: "Panther",
      audio: getAssetAudioUrl(s3Assets.pantherRAudio) || Assets.pantherRAudio,
      flowName: "P8",
    },
    {
      allwords: [
        { img: getAssetUrl(s3Assets.shopImg) || Assets.shopImg, text: "Shop" },
        {
          img: getAssetUrl(s3Assets.listenRImg) || Assets.listenRImg,
          text: "Listen",
        },
        {
          img:
            getAssetUrl(s3Assets.pillowR1ThreeImg) || Assets.pillowR1ThreeImg,
          text: "Mug",
        },
      ],
      correctWord: "Listen",
      audio: getAssetAudioUrl(s3Assets.listenRAudio) || Assets.listenRAudio,
      flowName: "P9",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.threeRImg) || Assets.threeRImg,
          text: "Three",
        },
        {
          img: getAssetUrl(s3Assets.ropeR1OneImg) || Assets.ropeR1OneImg,
          text: "Rope",
        },
        {
          img: getAssetUrl(s3Assets.ropeR1ThreeImg) || Assets.ropeR1ThreeImg,
          text: "Pen",
        },
      ],
      correctWord: "Three",
      audio: getAssetAudioUrl(s3Assets.threeRAudio) || Assets.threeRAudio,
      flowName: "P10",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.drawRImg) || Assets.drawRImg,
          text: "Draw",
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
      correctWord: "Draw",
      audio: getAssetAudioUrl(s3Assets.drawRAudio) || Assets.drawRAudio,
      flowName: "P11",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.capR1TwoImg) || Assets.capR1TwoImg,
          text: "Belt",
        },
        {
          img: getAssetUrl(s3Assets.scratchRImg) || Assets.scratchRImg,
          text: "Scratch",
        },
        {
          img: getAssetUrl(s3Assets.capR1ThreeImg) || Assets.capR1ThreeImg,
          text: "Tie",
        },
      ],
      correctWord: "Scratch",
      audio: getAssetAudioUrl(s3Assets.scratchRAudio) || Assets.scratchRAudio,
      flowName: "P12",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.treasureRImg) || Assets.treasureRImg,
          text: "Treasure",
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
      correctWord: "Treasure",
      audio: getAssetAudioUrl(s3Assets.treasureRAudio) || Assets.treasureRAudio,
      flowName: "P13",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.eggR1TwoImg) || Assets.eggR1TwoImg,
          text: "Fan",
        },
        {
          img: getAssetUrl(s3Assets.deskRImg) || Assets.deskRImg,
          text: "Desk",
        },
        {
          img: getAssetUrl(s3Assets.eggR1ThreeImg) || Assets.eggR1ThreeImg,
          text: "Goat",
        },
      ],
      correctWord: "Desk",
      audio: getAssetAudioUrl(s3Assets.deskRAudio) || Assets.deskRAudio,
      flowName: "P14",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fanR1OneImg) || Assets.fanR1OneImg,
          text: "Fan",
        },
        {
          img: getAssetUrl(s3Assets.shoutRImg) || Assets.shoutRImg,
          text: "Shout",
        },
        {
          img: getAssetUrl(s3Assets.fanR1ThreeImg) || Assets.fanR1ThreeImg,
          text: "Lamp",
        },
      ],
      correctWord: "Shout",
      audio: getAssetAudioUrl(s3Assets.shoutRAudio) || Assets.shoutRAudio,
      flowName: "P15",
    },
  ],
};

const R4 = ({
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
                  setIsAudioPlayedOnce(false);
                  if (currentQuestionIndex === content.L1.length - 1) {
                    setLocalData("rFlow", false);
                    setLocalData("mFail", false);
                    setLocalData("rStep", 0);
                    //window.location.reload();
                    if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                      navigate("/");
                    } else {
                      navigate("/discover-start");
                    }
                  } else {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
                    setIsPlaying(false);
                    if (currentQuestionIndex === content.L1.length - 1) {
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      setLocalData("rStep", 0);
                      //window.location.reload();
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
                      }
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

export default R4;
