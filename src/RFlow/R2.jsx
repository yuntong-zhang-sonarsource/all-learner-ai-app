import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.png";
// import Mic from "assets/mikee.svg";
// import Stop from "assets/pausse.svg";
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
import chairImg from "../assets/chair.svg";
import correctTick from "../assets/correctTick.svg";
import r3Next from "../assets/r3Next.svg";
import dogGif from "../assets/dogGif.gif";
import r3Reset from "../assets/r3Reset.svg";
import r3WrongTick from "../assets/r3WrongTick.svg";
import mikeImg from "../assets/mikeee.svg";
import pauseImg from "../assets/paaauuse.svg";
import effectImg from "../assets/effects.svg";
import buttonImg from "../assets/buton.png";
import coinsImg from "../assets/coiins.svg";
import headerImg from "../assets/headers.svg";
import shipImg from "../assets/sheep.svg";
import shipAudio1 from "../assets/ship1.mp3";
import shipAudio from "../assets/ship.wav";
import shipAudio2 from "../assets/ship2.mp3";
import shipAudio3 from "../assets/ship3.mp3";
import audioIcon from "../assets/audioIcon.svg";
import handIconGif from "../assets/handIconGif.gif";
import musicIcon from "../assets/musicIcon.svg";
import stepThreeTextR from "../assets/stepThreeTextR.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../utils/levelData";

const content = {
  L1: [
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.kiteR1OneImg,
        type: "text",
      },
      answer: "kiteR1OneAudio",
      options: [
        { id: "kiteR1OneAudio", value: "kiteR1OneAudio", type: "audio" },
        { id: "dogR1OneAudio", value: "dogR1OneAudio", type: "audio" },
        { id: "capR1OneAudio", value: "capR1OneAudio", type: "audio" },
      ],
      flowName: "P1",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.mangoR1OneImg,
        type: "text",
      },
      answer: "MangoR1OneAudio",
      options: [
        { id: "eggR1OneAudio", value: "eggR1OneAudio", type: "audio" },
        { id: "MangoR1OneAudio", value: "MangoR1OneAudio", type: "audio" },
        { id: "nestR1OneAudio ", value: "nestR1OneAudio", type: "audio" },
      ],
      flowName: "P2",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.nestR1OneImg,
        type: "text",
      },
      answer: "nestR1OneAudio",
      options: [
        { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
        { id: "dogR1OneAudio", value: "dogR1OneAudio", type: "audio" },
        { id: "nestR1OneAudio", value: "nestR1OneAudio", type: "audio" },
      ],
      flowName: "P3",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.ratR1OneImg,
        type: "text",
      },
      answer: "ratR1OneAudio",
      options: [
        { id: "vanR1OneAudio", value: "vanR1OneAudio", type: "audio" },
        { id: "ratR1OneAudio", value: "ratR1OneAudio", type: "audio" },
        { id: "bellR1OneAudio", value: "bellR1OneAudio", type: "audio" },
      ],
      flowName: "P4",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.vanR1OneImg,
        type: "text",
      },
      answer: "vanR1OneAudio",
      options: [
        { id: "nestR1OneAudio", value: "nestR1OneAudio", type: "audio" },
        { id: "capR1OneAudio", value: "capR1OneAudio", type: "audio" },
        { id: "vanR1OneAudio", value: "vanR1OneAudio", type: "audio" },
      ],
      flowName: "P5",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.maskR1OneImg,
        type: "text",
      },
      answer: "maskR1OneAudio",
      options: [
        { id: "maskR1OneAudio", value: "maskR1OneAudio", type: "audio" },
        { id: "jugR1OneAudio", value: "jugR1OneAudio", type: "audio" },
        { id: "knifeR1OneAudio", value: "knifeR1OneAudio", type: "audio" },
      ],
      flowName: "P6",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.onionR1OneImg,
        type: "text",
      },
      answer: "onionR1OneAudio",
      options: [
        { id: "goatR1OneAudio", value: "goatR1OneAudio", type: "audio" },
        { id: "fanR1OneAudio", value: "fanR1OneAudio", type: "audio" },
        { id: "onionR1OneAudio", value: "onionR1OneAudio", type: "audio" },
      ],
      flowName: "P7",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.fanR1OneImg,
        type: "text",
      },
      answer: "fanRoneAudio",
      options: [
        { id: "fanRoneAudio", value: "fanRoneAudio", type: "audio" },
        { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
        { id: "appleR1OneAudio", value: "appleR1OneAudio", type: "audio" },
      ],
      flowName: "P8",
    },
  ],
};

const colors = ["#4CDAFE", "#FC8AFF", "#FFB213"];

const R2 = ({
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
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("1");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMatch, setIsMatch] = useState(null);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [step3Correct, setStep3Correct] = useState(false);
  const [step3Wrong, setStep3Wrong] = useState(false);
  //const [showConfetti, setShowConfetti] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTextThree, setSelectedTextThree] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
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

  steps = 1;

  const currentQuestion = content?.L1[currentQuestionIndex];

  const flowNames = [...new Set(content?.L1?.map((item) => item.flowName))];
  const activeFlow =
    content?.L1[currentQuestionIndex]?.flowName || flowNames[0];

  const stopLoader = () => {
    setSelectedCheckbox(null);
    setIsMatch(false);
    setShowRecordButton(true);
    setTimeout(() => {
      setShowReset(true);
    }, 3000);
  };

  console.log("cq", currentQuestion, rStep);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev < content?.L1[currentQuestionIndex + 1]?.options.length - 1
          ? prev + 1
          : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          stopLoader();
          return 100;
        }
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const handleCheckboxChange = (text) => {
    setSelectedCheckbox(text);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    if (selectedCheckbox) {
      setProgress(0);
      handleAudioClick(selectedCheckbox);
      setShowNextButton(false);
    }
  };

  const playAudio = (audioKey) => {
    if (Assets[audioKey]) {
      const audioElement = new Audio(Assets[audioKey]);
      audioElement.play();
      setIsAudioPlaying(true);
      audioElement.onended = () => setIsAudioPlaying(false);
    } else {
      console.error("Audio file not found:", audioKey);
    }
  };

  const reset = () => {
    setIsMatch(null);
    setSelectedText(null);
    setShowReset(false);
    setShowRecordButton(false);
    setProgress(0);
  };

  const handleAudioClick = (text) => {
    setSelectedText(text);
    setSelectedCheckbox(null);
    if (text === content?.L1[currentQuestionIndex]?.answer) {
      setIsMatch(true);
      setShowConfetti(true);
      setShowRecordButton(true);
      const audio = new Audio(correctSound);
      audio.play();
      setRecording("no");
      setTimeout(() => {
        setIsMatch(null);
        setSelectedText(null);
        setShowConfetti(false);
        setShowRecordButton(false);
        if (currentQuestionIndex === content?.L1.length - 1) {
          // setLocalData("rFlow", false);
          // if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          //   navigate("/");
          // } else {
          //   navigate("/discover-start");
          // }
          onComplete();
        } else {
          console.log("contents", content);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setSelectedCheckbox(null);
      setIsMatch(false);
      setShowRecordButton(true);
      setTimeout(() => {
        setShowReset(true);
      }, 3000);
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
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
      rStep={rStep}
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
      {currentQuestion?.question ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(128.49deg, rgb(158, 197, 255) 0%, rgb(225, 166, 248) 100%)",
          }}
        >
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}

          {step === "1" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {!showRecordButton && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  {/* Dog Image - Moves with Progress */}
                  <img
                    src={dogGif}
                    alt="Dog"
                    style={{
                      position: "relative",
                      left: `${(progress / 100) * 260}px`,
                      width: "50px",
                      height: "55px",
                      transition: "left 0.2s linear",
                      marginBottom: "-10px",
                      marginLeft: "-10px",
                    }}
                  />

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "280px",
                      height: "15px",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #F39F27",
                      position: "relative",
                    }}
                  >
                    {/* Progress Fill */}
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(0deg, #F19920 0%, #F39F27 23%, #F7B03B 58%, #FECC5C 100%)",
                        transition: "width 0.2s linear",
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  background: "white",
                  borderRadius: "20px",
                  padding: "20px 50px",
                  maxWidth: "50%",
                  height: "120px",
                  //boxShadow: "0px 6px 0px 1px rgb(245, 245, 255)",
                  boxShadow:
                    "rgb(245, 245, 255) 0px 6px 0px 1px, rgb(102, 102, 133) 0px 11px 0px 1px",
                }}
              >
                {/* <img
                        src={content.L1[0].stepOne.img}
                        alt="Ship"
                        style={{ width: "210px", height: "auto" }}
                      /> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    maxWidth: "80%",
                    textAlign: "center",
                  }}
                >
                  {/* <span
                          style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            fontStyle: "Digitalt",
                            color: "#08B9FF",
                          }}
                        >
                          {content?.L1[currentQuestionIndex]?.question?.text}

                        </span> */}
                  <img
                    src={content?.L1[currentQuestionIndex]?.question?.img}
                    alt="Hint"
                    style={{
                      //position: "absolute",
                      //top: "-40px",
                      //left: "-30px",
                      //transform: "rotate(-45deg)",
                      height: "100px",
                    }}
                  />
                  {/* <img
                          src={listenImg}
                          alt="Listen"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={() => playAudio(content.L1[0].stepOne.correctAudio)}
                        /> */}
                </div>
              </div>

              {!showRecordButton &&
                content?.L1[currentQuestionIndex]?.options?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    {content?.L1[currentQuestionIndex]?.options.map(
                      (audio, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {index === activeIndex && (
                            <img
                              src={handIconGif}
                              alt="Hint"
                              style={{
                                position: "absolute",
                                top: "-40px",
                                left: "-30px",
                                transform: "rotate(-45deg)",
                                height: "80px",
                              }}
                            />
                          )}
                          <div
                            style={{
                              gap: "5px",
                              width: "90px",
                              height: "60px",
                              background:
                                selectedText === audio.id
                                  ? isMatch
                                    ? "#58CC02"
                                    : "#FF0000"
                                  : colors[index % colors.length],
                              borderRadius: "8px",
                              display: "flex",
                              border: "2px solid white",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "30px",
                              fontWeight: "bold",
                              boxShadow: `0px 4px 0px 0px ${
                                colors[index % colors.length]
                              }90`,
                              cursor: "pointer",
                              color: "#FFFFFF",
                            }}
                            onClick={() => playAudio(audio.value)}
                          >
                            <img
                              src={musicIcon}
                              alt="Mike"
                              style={{
                                width: "45px",
                                height: "45px",
                                cursor: "pointer",
                              }}
                            />
                            {index + 1}
                          </div>
                          <input
                            type="checkbox"
                            id={`checkbox-${audio.id}`}
                            checked={selectedCheckbox === audio.id}
                            onChange={() => handleCheckboxChange(audio.id)}
                            style={{
                              width: "60px",
                              height: "60px",
                              appearance: "none",
                              backgroundColor:
                                selectedCheckbox === audio.id
                                  ? "#58CC02"
                                  : "#BB81D066",
                              border: "2px solid white",
                              borderRadius: "8px",
                              cursor: "pointer",
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "15px",
                            }}
                          />

                          {/* {selectedCheckbox === audio.text && (
                            <div
                              style={{
                                position: "absolute",
                                width: "60px",
                                height: "245px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )} */}
                        </div>
                      )
                    )}
                  </div>
                )}

              {showNextButton && (
                <div
                  style={{
                    position: "fixed",
                    bottom: "180px",
                    right: "60px",
                    zIndex: 1000,
                  }}
                >
                  <img
                    src={r3Next}
                    alt="Listen"
                    style={{ height: "80px", cursor: "pointer" }}
                    onClick={handleNextClick}
                  />
                </div>
              )}

              {showRecordButton && !showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={isMatch ? correctTick : r3WrongTick}
                    alt="Effect"
                    style={{
                      height: "80px",
                      transition: "opacity 0.4s ease-in-out",
                    }}
                  />
                </div>
              )}

              {showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={r3Reset}
                    alt="Effect"
                    style={{
                      height: "80px",
                      transition: "opacity 0.4s ease-in-out",
                      cursor: "pointer",
                    }}
                    onClick={reset}
                  />
                </div>
              )}
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

export default R2;
