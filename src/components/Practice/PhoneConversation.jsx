import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
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

const PhoneConversation = ({
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
  const [showQuestion, setShowQuestion] = useState(false);
  const [conversationData, setConversationData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [audioInstance, setAudioInstance] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [recording, setRecording] = useState("no");

  steps = 1;

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data || [];
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

  // const playAudio = (audioKey) => {
  //   if (Assets[audioKey]) {
  //     const audio = new Audio(Assets[audioKey]);
  //     audio.play();
  //   } else {
  //     console.error("Audio file not found:", audioKey);
  //   }
  // };

  const playAudio = (audioKey) => {
    if (audioInstance) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(null);
      setAudioInstance(null);
    }
    if (isPlaying !== audioKey) {
      if (Assets[audioKey]) {
        const audio = new Audio(Assets[audioKey]);

        audio.onended = () => {
          setIsPlaying(null);
          setAudioInstance(null);
        };

        audio.play();
        setAudioInstance(audio);
        setIsPlaying(audioKey);
      } else {
        console.error("Audio file not found:", audioKey);
      }
    }
  };

  const data = {
    data: {
      instructions: {
        type: "chat",
        content: [
          {
            role: "System",
            message:
              "Start at the bus stop near the supermarket. Walk straight on George Street for about five minutes. You will see a bank on your left and a coffee shop on your right. Keep walking until you reach the traffic signal. Turn right at the signal and walk past the park. The library is next to the school, on the left side of the street. You will see a banyan tree in front of the library. The library has a big blue sign, so it is easy to find!",
            audio: "level12P1Audio",
          },
        ],
      },
      tasks: [
        {
          question: {
            type: "text",
            value: "Where do you start your journey?",
          },
          options: [
            {
              type: "text",
              id: "option1",
              value: "At the school",
            },
            {
              type: "text",
              id: "option2",
              value: "At the bus stop",
            },

            {
              type: "text",
              id: "option3",
              value: "At the library",
            },
          ],
          answer: "option2",
        },
        {
          question: {
            type: "text",
            value: "Which street do you walk on?",
          },
          options: [
            {
              type: "text",
              id: "option1",
              value: "George Street",
            },
            {
              type: "text",
              id: "option2",
              value: "East Street",
            },
            {
              type: "text",
              id: "option3",
              value: "North Street",
            },
          ],
          answer: "option1",
        },
        {
          question: {
            type: "text",
            value: "How long should you walk on George Street?",
          },
          options: [
            {
              type: "text",
              id: "option1",
              value: "Two minutes",
            },
            {
              type: "text",
              id: "option2",
              value: "Five minutes",
            },
            {
              type: "text",
              id: "option3",
              value: "Ten minutes",
            },
          ],
          answer: "option2",
        },
        {
          question: {
            type: "text",
            value: "What is on your left after walking for a while?",
          },
          options: [
            {
              type: "text",
              id: "option1",
              value: "A park",
            },
            {
              type: "text",
              id: "option2",
              value: "A bank",
            },
            {
              type: "text",
              id: "option3",
              value: "A school",
            },
          ],
          answer: "option2",
        },
        {
          question: {
            type: "text",
            value: "What is on your right after walking for a while?",
          },
          options: [
            {
              type: "text",
              id: "option1",
              value: "A bank",
            },
            {
              type: "text",
              id: "option2",
              value: "A coffee shop",
            },
            {
              type: "text",
              id: "option3",
              value: "A supermarket",
            },
          ],
          answer: "option2",
        },
      ],
    },
  };

  useEffect(() => {
    setConversationData(conversation?.instructions?.content);
    setTasks(conversation?.tasks);
    setCurrentTaskIndex(0);
  }, []);

  useEffect(() => {
    setConversationData(conversation?.instructions?.content || []);
    setTasks(conversation?.tasks || []);
    setCurrentTaskIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowConfetti(false);
    setShowQuestion(false);
  }, [currentLevel]);

  console.log("m10", tasks, currentTaskIndex, currentLevel, evaluationResults);

  const handleNextClick = () => {
    setShowQuestion(true);
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    //if (selectedOption !== null) return;

    if (currentLevel === "S1" || currentLevel === "S2") {
      const questionText = tasks[currentTaskIndex]?.question?.value;
      const isAnswerCorrect = optionId === tasks[currentTaskIndex].answer;

      setEvaluationResults((prevResults) => ({
        ...prevResults,
        [questionText]: isAnswerCorrect ? "Correct" : "Wrong",
      }));
      setRecording("recording");

      console.log("Evaluation Results:", {
        ...evaluationResults,
        [questionText]: isAnswerCorrect ? "Correct" : "Wrong",
      });
      return;
    }

    //setSelectedOption(optionId);

    if (optionId === tasks[currentTaskIndex].answer) {
      setIsCorrect(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setRecording("recording");
        //handleNext();
      }, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        resetState();
      }, 2000);
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const loadNextTask = () => {
    handleNext();
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      resetState();
    } else {
      setCurrentTaskIndex(0);
      resetState();
    }
  };

  const styles = {
    mainContainer: {
      background:
        "linear-gradient(0deg, rgba(241, 153, 32, 0.32) 0%, rgba(243, 159, 39, 0.32) 23%, rgba(247, 176, 59, 0.32) 58%, rgba(254, 204, 92, 0.32) 100%)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      overflowX: "hidden",
      position: "relative",
    },
    innerContainer: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "20px",
      width: "100%",
      position: "relative",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      overflowX: "hidden",
      height: "80vh",
      overflowY: "hidden",
      marginBottom: "40px",
    },
    phoneIcon: {
      marginLeft: "40px",
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "18px",
    },
    messageContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      marginTop: "35px",
    },
    message: {
      padding: "10px",
      borderRadius: "10px",
      maxWidth: "60%",
      fontSize: "16px",
      position: "relative",
      whiteSpace: "pre-wrap",
      marginLeft: "100px",
    },
    selectedNeutralOption: {
      backgroundColor: "#f0f0f0",
      //borderColor: '#aaa',
    },
    sonMessage: {
      //backgroundColor: "#fde4b2",
      alignSelf: "flex-start",
      width: "300px",
      marginLeft: "80px",
    },
    callerMessage: {
      //backgroundColor: "#f1f1f1",
      alignSelf: "flex-end",
      width: "280px",
      marginRight: "180px",
      marginBottom: "-60px",
    },
    boldText: {
      fontWeight: "bold",
    },
    highlighted: {
      backgroundColor: "#f8d7da",
      padding: "2px 4px",
      borderRadius: "4px",
    },
    audioIcon: {
      //width: "30px",
      height: "70px",
      cursor: "pointer",
      marginTop: "50px",
    },
    profileIcon: {
      width: "25px",
      height: "25px",
      borderRadius: "50%",
    },
    boyIcon: {
      width: "25px",
      height: "25px",
      position: "absolute",
      left: "-30px",
      bottom: "10%",
      transform: "translateY(50%)",
    },
    callerIconsContainer: {
      position: "absolute",
      right: "-80px",
      bottom: "10%",
      transform: "translateY(50%)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    nextButton: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      width: "50px",
      height: "50px",
      cursor: "pointer",
    },
    questionBox: {
      backgroundColor: "#f8f2ff",
      borderRadius: "20px",
      padding: "20px",
      fontWeight: "bold",
      //display: "relative",
      border: "1px dashed #d8b6ff",
      fontSize: "25px",
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      //marginLeft: "400px",
      marginTop: "50px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      //minHeight: "100px",
    },
    optionsContainer: {
      marginTop: "40px",
      display: "grid",
      gridTemplateColumns:
        tasks[currentTaskIndex]?.options?.length === 4 ||
        tasks[currentTaskIndex]?.options?.length === 5
          ? "repeat(2, 1fr)"
          : "repeat(2, 1fr)",
      gap: "20px",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "20px",
      position: "relative",
    },

    option: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      cursor: "pointer",
      textAlign: "center",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      fontSize: "18px",
      transition: "background-color 0.3s ease",
    },

    thirdOption: {
      gridColumn: "1 / -1",
      justifySelf: "center",
      width: "50%",
    },

    correctOption: {
      backgroundColor: "#d4edda",
    },
    incorrectOption: {
      backgroundColor: "#FF7F361A",
    },
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
      <div style={styles.mainContainer}>
        {showConfetti && <Confetti />}
        <div style={styles.innerContainer}>
          {!showQuestion ? (
            <>
              {/* <div style={styles.phoneIcon}>
                <img
                  src={phoneImg}
                  alt="Phone Icon"
                  style={{ width: "24px", marginRight: "5px" }}
                />
                <strong>Phone rings...</strong>
              </div> */}
              <div
                style={{
                  ...styles.messageContainer,
                  height: "400px",
                  overflowY: "auto",
                }}
              >
                {conversationData?.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(msg.role === "System"
                        ? styles.sonMessage
                        : styles.callerMessage),
                    }}
                  >
                    {/* <span style={styles.boldText}>{msg.role}: </span>
                    {msg.message} */}
                    {msg?.role === "System" && (
                      <div
                        style={{
                          marginLeft: "-50px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={Assets.boyimg}
                          alt="Boy"
                          width={"25px"}
                          height={"25px"}
                        />
                        <img
                          src={
                            isPlaying === msg.audio
                              ? Assets.stopVoiceNote
                              : Assets.startVoiceNote
                          }
                          alt="Audio"
                          style={{
                            height: "40px",
                            width: "190px",
                            cursor: "pointer",
                          }}
                          onClick={() => playAudio(msg?.audio)}
                        />
                      </div>
                    )}
                    {msg?.role === "User" && (
                      <div style={styles.callerIconsContainer}>
                        <img
                          src={
                            isPlaying === msg.audio
                              ? Assets.stopVoiceNote
                              : Assets.startVoiceNote
                          }
                          alt="Audio"
                          style={{
                            height: "40px",
                            width: "190px",
                            cursor: "pointer",
                          }}
                          onClick={() => playAudio(msg?.audio)}
                        />
                        <img
                          src={Assets.boyimg}
                          alt="Boy"
                          width={"25px"}
                          height={"25px"}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <img
                src={Assets.nextimg}
                alt="Next"
                style={styles.nextButton}
                onClick={handleNextClick}
              />
            </>
          ) : (
            tasks[currentTaskIndex] && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={isPlaying ? Assets.stopVoiceNote : Assets.startVoiceNote}
                  alt="Audio"
                  style={{
                    height: "40px",
                    width: "190px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  onClick={() => playAudio(conversationData[0].audio)}
                />
                <div style={styles.questionBox}>
                  {tasks[currentTaskIndex]?.question?.value}
                </div>
                {recording === "no" && (
                  <div style={styles.optionsContainer}>
                    {tasks[currentTaskIndex]?.options.map((option, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.option,
                          ...(selectedOption === option.id &&
                            (currentLevel === "S1" || currentLevel === "S2") &&
                            styles.selectedNeutralOption),
                          ...(currentLevel !== "S1" &&
                            currentLevel !== "S2" &&
                            selectedOption === option.id &&
                            isCorrect === true &&
                            styles.correctOption),
                          ...(currentLevel !== "S1" &&
                            currentLevel !== "S2" &&
                            selectedOption === option.id &&
                            isCorrect === false &&
                            styles.incorrectOption),
                          ...(tasks[currentTaskIndex].options.length === 3 &&
                            index === 2 &&
                            styles.thirdOption),
                        }}
                        onClick={() => handleOptionClick(option.id)}
                      >
                        {option.value}
                      </div>
                    ))}
                  </div>
                )}
                {recording === "recording" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "80px",
                      marginTop: "15px",
                    }}
                  >
                    <img
                      onClick={() => {
                        setRecording("startRec");
                      }}
                      src={Assets.pzMic}
                      alt="mic"
                      style={{ width: "70px", height: "70px" }}
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
                      marginTop: "15px",
                    }}
                  >
                    <img
                      src={Assets.spinnerWave}
                      alt="Wave"
                      style={{ width: "300px", height: "80px" }}
                    />
                    <img
                      onClick={() => {
                        setRecording("no");
                        loadNextTask();
                      }}
                      src={Assets.spinnerStop}
                      alt="Stop"
                      style={{
                        width: "60px",
                        height: "60px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )}
                {/* {(currentLevel === "S1" ||
                  currentLevel === "S2" ||
                  isCorrect) &&
                  selectedOption !== null && recording === "no" && (
                    <img
                      src={nextimg}
                      alt="Next"
                      style={styles.nextButton}
                      onClick={loadNextTask}
                    />
                  )} */}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PhoneConversation;
