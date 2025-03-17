import React, { useState, useEffect } from "react";
import beerImg from "../../assets/beer.svg";
import pandaImg from "../../assets/panda.svg";
import modalImg from "../../assets/moddal.svg";
import sunImg from "../../assets/sun.svg";
import cloudImg from "../../assets/clouud.png";
import playImg from "../../assets/plaay.svg";
import sandImg from "../../assets/sand.svg";
import cloudPandaImg from "../../assets/cloudpanda.svg";
import mikeImg from "../../assets/miiike.svg";
import pauseImg from "../../assets/paaaause.svg";
import effectImg from "../../assets/efffect.svg";
import clockImg from "../../assets/cloock.svg";
import cloudyImg from "../../assets/cloudyy.svg";
import { practiceSteps, getLocalData } from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const content = {
  conversation: [
    {
      speaker: "Good morning, dear! How can I help you?",
      user: "Good morning, sir.\nI need some potatoes",
    },
    { speaker: "How many kilos do you want?", user: "Two kilograms, please." },
    {
      speaker: "One kilo of potatoes costs Rs. 30.",
      user: "That’s fine. I also need half a kilo of carrots and beans.",
    },
    {
      speaker: "Anything else?",
      user: "No, that’s all. What is the total amount?",
    },
    {
      speaker: "The total amount is Rs. 100",
      user: "Here is the money. Thank you, sir.",
    },
  ],
};

const AskMoreM14 = ({
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
  const [currentSteps, setCurrentStep] = useState(-1);
  const [isMikeClicked, setIsMikeClicked] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [cloudText, setCloudText] = useState("......");
  const [showPandaText, setShowPandaText] = useState(false);
  const [showClock, setShowClock] = useState(false);

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data?.conversation || [];
  };

  steps = 1;

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

  console.log(
    "levelM14",
    level,
    currentStep,
    currentLevel,
    conversation,
    steps
  );

  useEffect(() => {
    setCurrentStep(-1);
    setIsMikeClicked(false);
    setShowModal(true);
    setCloudText("......");
    setShowPandaText(false);
    setShowClock(false);
  }, [currentLevel]);

  useEffect(() => {
    if (currentSteps >= 0 && currentSteps < conversation.length) {
      if (currentSteps === 0) {
        setTimeout(() => {
          setCloudText(conversation[0].speaker);
          setShowPandaText(true);
        }, 2000);
      } else {
        setCloudText(conversation[currentSteps].speaker);
        setShowPandaText(true);
      }
    }
  }, [currentSteps]);

  const generateCloudPositions = () => {
    const positions = [];
    const cloudCount = 6;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < cloudCount; i++) {
      const top = i % 2 === 0 ? screenHeight * 0.1 : screenHeight * 0.0;
      const left = (i * (screenWidth / cloudCount)) % screenWidth;
      positions.push({ top, left });
    }

    return positions;
  };

  const cloudPositions = generateCloudPositions();

  const handlePauseClick = () => {
    if (currentSteps < conversation.length - 1) {
      setCurrentStep((prev) => prev + 1);
      handleNext();
    } else {
      setCurrentStep(conversation.length);
      //console.log('texxxxxt');
      //handleNext();
      // for (let i = 0; i < 5; i++) {
      //   handleNext();
      // }
    }
    setIsMikeClicked(false);
    setShowClock(false);
  };

  const handleMikeClick = () => {
    setIsMikeClicked(true);
    setShowClock(true);
  };

  const handlePlayClick = () => {
    setShowModal(false);
    setCurrentStep(0);
    setShowPandaText(false);
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
          position: "relative",
          height: "100vh",
          background: "#B6E4FA",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cloudPositions?.map((pos, index) => (
          <img
            key={index}
            src={cloudyImg}
            alt="Cloudy Background"
            style={{
              position: "absolute",
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: "200px",

              opacity: 0.7,
            }}
          />
        ))}
        {showModal && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "17px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Ask More!
            </span>
            <img src={modalImg} alt="Modal" style={{ width: "500px" }} />
            <img
              src={playImg}
              alt="Play Button"
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                width: "120px",
              }}
              onClick={handlePlayClick}
            />
          </div>
        )}
        {/* {showClock && (
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src={clockImg} alt="Clock" style={{ width: '30px' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333F61' }}>00:10</span>
        </div>
      )} */}
        <img
          src={sunImg}
          alt="Sun"
          style={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "100px",
          }}
        />
        <img
          src={beerImg}
          alt="Left Character"
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            width: "210px",
            zIndex: 2,
          }}
        />
        <img
          src={pandaImg}
          alt="Right Character"
          style={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            width: "210px",
            zIndex: 2,
          }}
        />

        {currentSteps >= 0 && currentSteps < conversation.length ? (
          <>
            <div
              style={{
                position: "absolute",
                top: "19%",
                left: "17%",
                width: "250px",
                textAlign: "center",
              }}
            >
              <img src={cloudImg} alt="Cloud" style={{ width: "100%" }} />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#333F61",
                  textAlign: "center",
                }}
              >
                {cloudText}
              </span>
            </div>

            {showPandaText && (
              <div
                style={{
                  position: "absolute",
                  top: "18%",
                  right: "21%",
                  width: "195px",
                  textAlign: "center",
                }}
              >
                <img
                  src={cloudPandaImg}
                  alt="Cloud Panda"
                  style={{ width: "130%" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "33%",
                    left: "60%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "#333F61",
                    textAlign: "center",
                    wordBreak: "wrap",
                    width: "165px",
                  }}
                >
                  {conversation[currentSteps].user}
                </span>
                {!isMikeClicked ? (
                  <img
                    src={mikeImg}
                    alt="Microphone"
                    style={{
                      position: "absolute",
                      top: "85%",
                      left: "65%",
                      transform: "translate(-50%, -50%)",
                      width: "35px",
                      cursor: "pointer",
                    }}
                    onClick={handleMikeClick}
                  />
                ) : (
                  <>
                    <img
                      src={effectImg}
                      alt="Effect"
                      style={{
                        position: "absolute",
                        top: "64%",
                        left: "65%",
                        transform: "translate(-50%, -50%)",
                        width: "130px",
                      }}
                    />
                    <img
                      src={pauseImg}
                      alt="Pause"
                      style={{
                        position: "absolute",
                        top: "85%",
                        left: "65%",
                        transform: "translate(-50%, -50%)",
                        width: "35px",
                        cursor: "pointer",
                      }}
                      onClick={handlePauseClick}
                    />
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          !showModal && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Conversation Complete!
            </div>
          )
        )}

        <img
          src={sandImg}
          alt="Sand"
          style={{
            position: "relative",
            bottom: "0",
            width: "100%",
            height: "auto",
            marginTop: "450px",
          }}
        />
      </div>
    </MainLayout>
  );
};

export default AskMoreM14;
