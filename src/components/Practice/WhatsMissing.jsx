import React, { useState } from "react";
import { Box } from "@mui/material";
import schoolsImg from "../../assets/schools.svg";
import parkImg from "../../assets/park.svg";
import marketImg from "../../assets/market.svg";
import hintsImg from "../../assets/hints.svg";
import profileImg from "../../assets/prfile.svg";
import micImg from "../../assets/mike1.svg";
import pauseImg from "../../assets/paus.svg";
import effectImg from "../../assets/efect.svg";
import nextImg from "../../assets/nextImg.svg";
import bandImg from "../../assets/band.svg";
import kiteImg from "../../assets/kiteimage.svg";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  StopButton,
  SpeakButton,
  ListenButton,
} from "../../utils/constants";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const content = {
  L1: [
    {
      question: "What is missing in this picture?",
      correctAnswer: "KITE",
      image: kiteImg,
    },
    {
      question: "She went to the ________ to study",
      finalQuestion: "Why did you choose this word?",
      allwords: [
        { img: schoolsImg, text: "School" },
        { img: parkImg, text: "Park" },
        { img: marketImg, text: "Market" },
      ],
      correctAnswer: "School",
      hints: " Where do people study?",
    },
  ],
};

const BottomBar = ({ children }) => (
  <div
    style={{
      //position: "absolute",
      bottom: "0",
      width: "100%",
      height: "120px",
      background: "#49A2F3",
      borderTopLeftRadius: "50% 50px",
      borderTopRightRadius: "50% 50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

const AnswerBox = ({ word, isSelected, isCorrect, onClick }) => (
  <div
    onClick={onClick}
    style={{
      textAlign: "center",
      width: "180px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: "8px",
      backgroundColor: isSelected
        ? isCorrect
          ? "#58CC023D"
          : "#FF000033"
        : "transparent",
      transition: "background-color 0.5s ease",
    }}
  >
    <div
      style={{
        border: "0.1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        width: "89%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={getAssetUrl(s3Assets[word.img]) || Assets[word.img]}
        alt={word.text}
        style={{ width: "140px", height: "140px", marginBottom: "40px" }}
      />
    </div>
    <div
      style={{
        width: "100%",
        height: "30px",
        background: "#FF7F361A",
        marginTop: "-30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        borderTop: "none",
        borderLeft: "0.5px solid #ccc",
        borderRight: "0.5px solid #ccc",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    >
      {word.text}
    </div>
  </div>
);

function Step2({ handleNext, level, currentStep }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [finalState, setFinalState] = useState(false);
  const [showMic, setShowMic] = useState(true);
  const [showPause, setShowPause] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [showRedRectangle, setShowRedRectangle] = useState(false);

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data?.data || [];
  };

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.name || "P1";

  //const conversation = contentM14[level]?.[currentLevel]?.conversation || content?.conversation;

  const conversation = getConversation(level, currentLevel);

  console.log("lvlstep", currentPracticeStep);

  const handleSelect = (word) => {
    setSelectedAnswer(word.text);
    const isAnswerCorrect =
      word.text === conversation[currentStep - 1]?.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowMessage(isAnswerCorrect);

    if (isAnswerCorrect) {
      const audio = new Audio(correctSound);
      audio.play();
      setTimeout(() => {
        setShowMessage(false);
        setFinalState(true);
      }, 2000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setShowRedRectangle(true);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowRedRectangle(false);
      }, 2000);
    }
  };

  const handleMicClick = () => {
    setShowMic(false);
    setShowPause(true);
    setShowEffect(true);
  };

  const handlePauseClick = () => {
    setShowPause(false);
    setShowNext(true);
    setShowEffect(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px",
        }}
      >
        {/* <img
          src={profileImg}
          alt="Profile"
          style={{ width: "40px", height: "40px" }}
        /> */}
        {showRedRectangle && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                height: "35px",
                padding: "0px 15px",
                minWidth: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#333F61",
                fontWeight: "bold",
                border: "1px solid white",
                borderTopRightRadius: "13px",
                borderBottomRightRadius: "13px",
                borderBottomLeftRadius: "13px",
                borderTopLeftRadius: "13px",
                position: "relative",
                borderRight: "none",
                boxShadow: "0px 0px 8px 1px #60C8F999",
                opacity: "0.5px",
                marginTop: "3px",
                textAlign: "center",
              }}
            >
              {conversation[currentStep - 1]?.hints}
            </div>
            <img
              src={hintsImg}
              alt="Hints"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "600",
          fontFamily: "Quicksand",
          textAlign: "center",
          whiteSpace: "pre-line",
          marginBottom: "50px",
          marginTop: "30px",
          color: "#333F61",
        }}
      >
        {finalState
          ? conversation[currentStep - 1]?.finalQuestion
          : conversation[currentStep - 1]?.question}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "80px",
        }}
      >
        {!finalState
          ? conversation[currentStep - 1]?.allwords.map((word, index) => (
              <AnswerBox
                key={index}
                word={word}
                isSelected={selectedAnswer === word.text}
                isCorrect={isCorrect}
                onClick={() => handleSelect(word)}
              />
            ))
          : conversation[currentStep - 1]?.allwords
              .filter(
                (word) =>
                  word.text === conversation[currentStep - 1]?.correctAnswer
              )
              .map((word, index) => <AnswerBox key={index} word={word} />)}
      </div>

      {/* <BottomBar> */}
      {showMessage && (
        <div
          style={{
            background: "white",
            padding: "10px 20px",
            fontSize: "48px",
            fontWeight: "700",
            borderRadius: "10px",
            color: "#333F61",
            fontFamily: "Quicksand",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Great job!
        </div>
      )}

      {finalState && (
        <>
          {showMic && (
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
                  //marginLeft: getMarginLeft(0),
                }}
                onClick={handleMicClick}
              >
                <SpeakButton height={45} width={45} />
              </Box>
            </div>
          )}

          {showPause && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Box>
                <RecordVoiceVisualizer />
              </Box>
              <div>
                <Box
                  sx={{
                    marginTop: "35px",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: { xs: "50px", sm: "60px", md: "70px" },
                    cursor: "pointer",
                    //marginLeft: getMarginLeft(0),
                  }}
                  onClick={handlePauseClick}
                >
                  <StopButton height={45} width={45} />
                </Box>
              </div>
            </div>
          )}

          {showNext && (
            <div
              onClick={() => {
                handleNext();
                setSelectedAnswer(null);
                setIsCorrect(null);
                setShowMessage(false);
                setFinalState(false);
                setShowMic(true);
                setShowPause(false);
                setShowNext(false);
                setShowEffect(false);
                setShowRedRectangle(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NextButtonRound height={50} width={50} />
            </div>
            // <button
            //   style={{
            //     background: "none",
            //     border: "none",
            //     padding: "3px",
            //   }}
            //   onClick={() => {
            //     handleNext();
            //     setSelectedAnswer(null);
            //     setIsCorrect(null);
            //     setShowMessage(false);
            //     setFinalState(false);
            //     setShowMic(true);
            //     setShowPause(false);
            //     setShowNext(false);
            //     setShowEffect(false);
            //     setShowRedRectangle(false);
            //   }}
            // >
            //   <img
            //     src={nextImg}
            //     alt="Next"
            //     style={{
            //       width: "130px",
            //       borderRadius: "30%",
            //     }}
            //   />

            // </button>
          )}
        </>
      )}
      {/* </BottomBar> */}
    </div>
  );
}
function WhatsMissing({
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
}) {
  const [currentSteps, setCurrentSteps] = useState(2);

  const handleNextStep = () => setCurrentSteps(2);

  console.log("lvls", currentStep);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
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
      <div>
        {/* {currentStep - 1 === 1 && <Step1 onNext={handleNextStep} />} */}
        {currentSteps === 2 && (
          <Step2
            handleNext={handleNext}
            level={level}
            currentStep={currentStep}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default WhatsMissing;
