import React, { useState } from "react";
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
import { practiceSteps, getLocalData } from "../../utils/constants";

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
        padding: "10px",
        width: "89%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={Assets[word.img]}
        alt={word.text}
        style={{ width: "120px", height: "150px" }}
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
      }}
    >
      {word.text}
    </div>
  </div>
);

// function Step1({ onNext }) {
//   const { question, image, correctAnswer } = content.L1[0];
//   const [showPause, setShowPause] = useState(false);
//   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
//   const [showGreatJob, setShowGreatJob] = useState(false);
//   const [showNext, setShowNext] = useState(false);

//   const handleMikeClick = () => setShowPause(true);
//   const handlePauseClick = () => {
//     setShowPause(false);
//     setShowCorrectAnswer(true);
//     setTimeout(() => {
//       setShowCorrectAnswer(false);
//       setShowGreatJob(true);
//       setTimeout(() => {
//         setShowGreatJob(false);
//         setShowNext(true);
//       }, 2000);
//     }, 2000);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         background: "#F2F8FF",
//         height: "100vh",
//         justifyContent: "center",
//         position: "relative",
//       }}
//     >
//       <img
//         src={profileImg}
//         alt="Profile"
//         style={{
//           position: "absolute",
//           top: "20px",
//           left: "20px",
//           width: "50px",
//           height: "50px",
//           borderRadius: "50%",
//           zIndex: 3,
//         }}
//       />

//       <h2
//         style={{ color: "#1E1E1E", position: "relative", marginBottom: "50px" }}
//       >
//         {question}
//       </h2>

//       <div
//         style={{
//           position: "relative",
//           background: "#FFFFFF",
//           boxShadow: "0px 0px 24px 0px #00000040",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "470px",
//           height: "281px",
//           overflow: "visible",
//           marginBottom: "130px",
//         }}
//       >
//         <img
//           src={image}
//           alt="Scene"
//           style={{ width: "50%", height: "100%", objectFit: "cover" }}
//         />
//         <Tape
//           position={{
//             top: "-27px",
//             left: "-25px",
//             transform: "rotate(107deg)",
//           }}
//         />
//         <Tape
//           position={{
//             top: "-21px",
//             right: "-27px",
//             width: "110px",
//             transform: "rotate(1deg)",
//           }}
//         />
//         <Tape
//           position={{
//             bottom: "-22px",
//             left: "-19px",
//             width: "95px",
//             transform: "rotate(-1deg)",
//           }}
//         />
//         <Tape
//           position={{
//             bottom: "-26px",
//             right: "-24px",
//             width: "99px",
//             transform: "rotate(110deg)",
//           }}
//         />
//       </div>

//       <BottomBar>
//         {!showPause && !showCorrectAnswer && !showGreatJob && !showNext && (
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               padding: "5px",
//             }}
//             onClick={handleMikeClick}
//           >
//             <img
//               src={micImg}
//               alt="Microphone"
//               style={{
//                 width: "45px",
//                 backgroundColor: "white",
//                 borderRadius: "50%",
//               }}
//             />
//           </button>
//         )}

//         {showPause && (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <img
//               src={effectImg}
//               alt="Effect"
//               style={{ width: "150px", marginRight: "10px" }}
//             />
//             <button
//               style={{
//                 background: "none",
//                 border: "none",
//                 padding: "5px",
//               }}
//               onClick={handlePauseClick}
//             >
//               <img
//                 src={pauseImg}
//                 alt="Pause"
//                 style={{
//                   width: "45px",
//                   backgroundColor: "white",
//                   borderRadius: "50%",
//                 }}
//               />
//             </button>
//           </div>
//         )}

//         {showCorrectAnswer && (
//           <div
//             style={{
//               background: "white",
//               padding: "10px 20px",
//               fontSize: "24px",
//               fontWeight: "bold",
//               fontFamily: "quicksand",
//               color: "#333F61",
//             }}
//           >
//             {correctAnswer}
//           </div>
//         )}

//         {showGreatJob && (
//           <div
//             style={{
//               background: "white",
//               padding: "10px 20px",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "#333F61",
//             }}
//           >
//             Great job!
//           </div>
//         )}

//         {showNext && (
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               padding: "5px",
//             }}
//             onClick={onNext}
//           >
//             <img
//               src={nextImg}
//               alt="Next"
//               style={{
//                 width: "120px",
//                 borderRadius: "30%",
//               }}
//             />
//           </button>
//         )}
//       </BottomBar>
//     </div>
//   );
// }

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
      word.text === conversation[currentStep]?.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowMessage(isAnswerCorrect);

    if (isAnswerCorrect) {
      setTimeout(() => {
        setShowMessage(false);
        setFinalState(true);
      }, 2000);
    } else {
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
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <img
          src={profileImg}
          alt="Profile"
          style={{ width: "40px", height: "40px" }}
        />
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
              {conversation[currentStep]?.hints}
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
          fontSize: "24px",
          margin: "20px 0",
          fontWeight: "bold",
          textAlign: "center",
          whiteSpace: "pre-line",
          marginBottom: "20px",
        }}
      >
        <p>
          {finalState
            ? conversation[currentStep]?.finalQuestion
            : conversation[currentStep]?.question}
        </p>
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
          ? conversation[currentStep]?.allwords.map((word, index) => (
              <AnswerBox
                key={index}
                word={word}
                isSelected={selectedAnswer === word.text}
                isCorrect={isCorrect}
                onClick={() => handleSelect(word)}
              />
            ))
          : conversation[currentStep]?.allwords
              .filter(
                (word) => word.text === conversation[currentStep]?.correctAnswer
              )
              .map((word, index) => <AnswerBox key={index} word={word} />)}
      </div>

      <BottomBar>
        {showMessage && (
          <div
            style={{
              background: "white",
              padding: "10px 20px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "10px",
            }}
          >
            Great job!
          </div>
        )}

        {finalState && (
          <>
            {showMic && (
              <button
                onClick={handleMicClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "5px",
                }}
              >
                <img
                  src={micImg}
                  alt="Microphone"
                  style={{
                    width: "45px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                />
              </button>
            )}

            {showPause && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {showEffect && (
                  <img
                    src={effectImg}
                    alt="Effect"
                    style={{ width: "160px" }}
                  />
                )}
                <button
                  onClick={handlePauseClick}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "5px",
                  }}
                >
                  <img
                    src={pauseImg}
                    alt="Pause"
                    style={{
                      width: "45px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                </button>
              </div>
            )}

            {showNext && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  padding: "3px",
                }}
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
              >
                <img
                  src={nextImg}
                  alt="Next"
                  style={{
                    width: "130px",
                    borderRadius: "30%",
                  }}
                />
              </button>
            )}
          </>
        )}
      </BottomBar>
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

  steps = 1;

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
        {/* {currentStep === 1 && <Step1 onNext={handleNextStep} />} */}
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
