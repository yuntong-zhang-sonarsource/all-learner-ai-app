import React, { useState, useRef, useEffect } from "react";
import listenImg from "../../assets/listenmike.svg";
import clockImg from "../../assets/chronometer.svg";
import wordImg from "../../assets/words.svg";
import chairImg from "../../assets/chair.svg";
import correctTick from "../../assets/correctTick.svg";
import r3Next from "../../assets/r3Next.svg";
import dogGif from "../../assets/dogGif.gif";
import r3Reset from "../../assets/r3Reset.svg";
import r3WrongTick from "../../assets/r3WrongTick.svg";
import mikeImg from "../../assets/mikeee.svg";
import pauseImg from "../../assets/paaauuse.svg";
import effectImg from "../../assets/effects.svg";
import buttonImg from "../../assets/buton.png";
import coinsImg from "../../assets/coiins.svg";
import headerImg from "../../assets/headers.svg";
import shipImg from "../../assets/sheep.svg";
import shipAudio1 from "../../assets/ship1.mp3";
import shipAudio from "../../assets/ship.wav";
import shipAudio2 from "../../assets/ship2.mp3";
import shipAudio3 from "../../assets/ship3.mp3";
import audioIcon from "../../assets/audioIcon.svg";
import handIconGif from "../../assets/handIconGif.gif";
import musicIcon from "../../assets/musicIcon.svg";
import Confetti from "react-confetti";
import stepThreeTextR from "../../assets/stepThreeTextR.svg";
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
} from "../../utils/constants";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const content = {
  question: {
    text: "Which announcement is about showing respect to teachers and classmates?",
    type: "text",
  },
  answer: "audio1",
  options: [
    { id: "audio1", value: "level10P7OneAudio1", type: "audio" },
    { id: "audio2", value: "level10P7OneAudio2", type: "audio" },
    { id: "audio3", value: "level10P7OneAudio3", type: "audio" },
  ],
};

const colors = ["#4CC5FF", "#C20281", "#710EDC"];

const styles = [
  {
    background: "linear-gradient(279.15deg, #0780B9 0%, #4CC5FF 90.43%)",
    boxShadow: "0px 0px 20px 8px #40B9F357",
  },
  {
    background: "linear-gradient(278.71deg, #C20281 0%, #FF4BC2 84.1%)",
    boxShadow: "0px 0px 20px 8px #FF4BC257",
  },
  {
    background: "linear-gradient(279.36deg, #710EDC 0%, #A856FF 100%)",
    boxShadow: "0px 0px 24px 8px #8224E757",
  },
];

const boxShadows = [
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(255, 99, 132) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(54, 162, 235) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(255, 206, 86) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(75, 192, 192) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(153, 102, 255) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(255, 159, 64) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(201, 203, 207) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(0, 255, 127) 0px 6px 0px 1px",
  "rgb(245, 245, 255) 0px 0px 0px 1px, rgb(255, 0, 255) 0px 6px 0px 1px",
];

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
}) => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [error, setError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("1");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMatch, setIsMatch] = useState(null);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [step3Correct, setStep3Correct] = useState(false);
  const [step3Wrong, setStep3Wrong] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTextThree, setSelectedTextThree] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [audioInstance, setAudioInstance] = useState(null);
  const [handPhase, setHandPhase] = useState("audio");
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

  steps = 5;

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data.tasks || [];
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

  //   useEffect(() => {
  //     if (interimTranscript) {
  //       transcriptRef.current = interimTranscript;
  //     } else {
  //       transcriptRef.current = transcript;
  //     }
  //   }, [interimTranscript, transcript]);

  const stopLoader = () => {
    setSelectedCheckbox(null);
    setIsMatch(false);
    setShowRecordButton(true);
    setTimeout(() => {
      setShowReset(true);
    }, 3000);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) =>
  //       prev < conversation[currentStep - 1]?.options.length - 1 ? prev + 1 : 0
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          stopLoader();
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const handleCheckboxChange = (text) => {
    setSelectedCheckbox(text);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (selectedCheckbox) {
      handleAudioClick(selectedCheckbox);
      setShowNextButton(false);
    }
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const startRecording = () => {
    setIsRecording(true);
    console.log("Recording started...");
    // if (!browserSupportsSpeechRecognition) {
    //   //alert("Speech recognition is not supported in your browser.");
    //   return;
    // }
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  const stopRecording = () => {
    console.log("Recording stopped...");
    SpeechRecognition.stopListening();
    const finalTranscript = transcriptRef.current;
    setIsRecording(false);
  };

  console.log("transcript", currentStep, conversation);

  const toggleModal = () => {
    stopRecording();
    setIsOpen(!isOpen);
  };

  const playAudio = (audioKey) => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (getAssetAudioUrl(s3Assets[audioKey]) || Assets[audioKey]) {
      const audioElement = new Audio(
        getAssetAudioUrl(s3Assets[audioKey]) || Assets[audioKey]
      );
      setHandPhase("audio");
      audioElement.play();
      setTimeout(() => {
        setHandPhase("checkbox");
      }, 1500);
      setAudioInstance(audioElement);
      setIsAudioPlaying(true);
      //audioElement.onended = () =>
      audioElement.onended = () => {
        setIsAudioPlaying(false);
        setTimeout(() => {
          setActiveIndex(
            (prev) => (prev + 1) % conversation[currentStep - 1]?.options.length
          );
          setHandPhase("audio");
        }, 1500);
      };
    } else {
      console.error("Audio file not found:", audioKey);
    }
  };

  const handleAudioClick = (text) => {
    setSelectedText(text);
    setSelectedCheckbox(null);
    if (text === conversation[currentStep - 1]?.answer) {
      const audio = new Audio(correctSound);
      audio.play();
      setIsMatch(true);
      setShowConfetti(true);
      setShowRecordButton(true);
      setTimeout(() => {
        setIsMatch(null);
        setSelectedText(null);
        setShowConfetti(false);
        setShowRecordButton(false);
        setShowReset(false);
        handleNext();
        reset();
      }, 4000);
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

  const reset = () => {
    //showNextButton(false);
    setIsMatch(null);
    setSelectedText(null);
    setShowReset(false);
    setShowRecordButton(false);
    setProgress(0);
    setActiveIndex(0);
    setHandPhase("audio");
  };

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
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // background:
          //   "linear-gradient(128.49deg, rgb(158, 197, 255) 0%, rgb(225, 166, 248) 100%)",
          backgroundColor: "#FFFFFF",
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
                  src={Assets.dogGif}
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
                background: "#FF7F361A",
                borderRadius: "20px",
                padding: "20px 50px",
                maxWidth: "50%",
                border: "2px dotted var(--Button-Orange, #FF7F36)",
                //boxShadow: "0px 6px 0px 1px rgb(245, 245, 255)",
                // boxShadow:
                //   "rgb(245, 245, 255) 0px 6px 0px 1px, rgb(102, 102, 133) 0px 11px 0px 1px",
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
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    fontStyle: "Quicksand",
                    color: "##000000",
                  }}
                >
                  {conversation[currentStep - 1]?.question?.text}
                </span>
                {/* <img
                  src={listenImg}
                  alt="Listen"
                  style={{ width: "30px", cursor: "pointer" }}
                  onClick={() => playAudio(content.L1[0].stepOne.correctAudio)}
                /> */}
              </div>
            </div>

            {!showRecordButton && (
              <div
                style={{
                  display: "flex",
                  gap: "50px",
                  marginTop: "20px",
                }}
              >
                {conversation[currentStep - 1]?.options.map((audio, index) => {
                  const style = styles[index % styles.length];

                  return (
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
                          src={Assets.hintGif}
                          alt="Hint"
                          style={{
                            position: "absolute",
                            ...(handPhase === "audio"
                              ? {
                                  bottom: "40px",
                                  left: "-30px",
                                  transform: "rotate(-120deg)",
                                }
                              : {
                                  bottom: "-50px",
                                  left: "-30px",
                                  transform: "rotate(-120deg)",
                                }),
                            height: "80px",
                            zIndex: "9999",
                            transition: "all 0.3s ease",
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          //border: "2px solid white",
                          gap: "10px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#000000",
                            fontFamily: "Quicksand",
                            fontWeight: 700,
                            fontSize: "36px",
                            lineHeight: "60px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {index + 1}
                        </span>

                        <div
                          style={{
                            gap: "5px",
                            width: "80px",
                            height: "80px",
                            background:
                              selectedText === audio.id
                                ? isMatch
                                  ? "#58CC02"
                                  : "#FF0000"
                                : style.background,
                            boxShadow:
                              selectedText === audio.id
                                ? "none"
                                : style.boxShadow,
                            borderRadius: "50%",
                            display: "flex",
                            //border: "2px solid white",
                            alignItems: "center",
                            justifyContent: "center",
                            //fontSize: "30px",
                            fontWeight: "bold",
                            filter:
                              activeIndex !== index
                                ? "brightness(50%)"
                                : "none",
                            transition: "filter 0.3s ease",
                            cursor: "pointer",
                            color: "#FFFFFF",
                          }}
                          onClick={() => {
                            setActiveIndex(index);
                            playAudio(audio.value);
                          }}
                        >
                          <img
                            src={Assets.musicIcon}
                            alt="Mike"
                            style={{
                              width: "40px",
                              height: "40px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
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
                          marginLeft: "30px",
                        }}
                        onClick={() => handleCheckboxChange(audio.id)}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${audio.id}`}
                          checked={selectedCheckbox === audio.id}
                          readOnly
                          style={{
                            display: "none",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "36px",
                            fontWeight: "900",
                            color: "white",
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                {/* <img
                  src={r3Next}
                  alt="Listen"
                  style={{ height: "80px", cursor: "pointer" }}
                  onClick={handleNextClick}
                /> */}
                <div onClick={handleNextClick} style={{ cursor: "pointer" }}>
                  <NextButtonRound height={60} width={60} />
                </div>
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
                  src={isMatch ? Assets.correctTick : Assets.r3WrongTick}
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
                  src={Assets.r3Reset}
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

            {/* {showRecordButton && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
                {isRecording && (
                <img
                  src={effectImg}
                  alt="Effect"
                  style={{
                    width: "170px",
                    height: "130px",
                    //position: "absolute",
                    //bottom: "140px",
                    transition: "opacity 0.4s ease-in-out",
                  }}
                />
              )}
              <img
                src={isRecording ? pauseImg : mikeImg}
                alt="Mike"
                style={{
                  width: "45px",
                  height: "45px",
                  cursor: "pointer",
                }}
                onClick={isRecording ? toggleModal : startRecording}
              />
            </div>
          )} */}
          </div>
        )}

        {/* Modal */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "50px 15px 15px",
                borderRadius: "30px",
                width: "250px",
                textAlign: "center",
                position: "relative",
                height: "240px",
                boxShadow: "0px 7px 0px 1px rgb(245, 245, 255)",
              }}
            >
              <img
                src={headerImg}
                alt="Header"
                style={{
                  position: "absolute",
                  top: "-128px",
                  left: "51%",
                  transform: "translateX(-50%)",
                  width: "359px",
                }}
              />

              <h2
                style={{
                  fontSize: "23px",
                  fontWeight: "bold",
                  color: "#60A5FA",
                  margin: "45px 0 8px",
                  fontFamily: "digitalt",
                }}
              >
                REWARD
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  marginTop: "21px",
                }}
              >
                <img src={coinsImg} alt="Coins" style={{ width: "60px" }} />
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#2563EB",
                  }}
                >
                  15
                </span>
              </div>

              <img
                src={buttonImg}
                alt="Next Exercise"
                onClick={() => {
                  toggleModal();
                  //setStep(step === "1" ? "2" : step === "2" ? "3" : "1");
                  setShowRecordButton(false);
                  setShowReset(false);
                  // if (step === "3") {
                  //   handleNext();
                  // }
                  handleNext();
                  reset();
                }}
                style={{
                  width: "200px",
                  marginTop: "35px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default R3;
