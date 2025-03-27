import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import listenImg2 from "../../assets/listen.png";
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
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
} from "../../utils/constants";
import spinnerStop from "../../assets/pause.png";
import raMic from "../../assets/listen.png";
import raStop from "../../assets/pause.png";
import VoiceAnalyser from "../../utils/VoiceAnalyser";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const McqFlow = ({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [recording, setRecording] = useState("no");
  const [step, setStep] = useState("initiate");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const utteranceRef = useRef(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState("");
  const [completeAudio, setCompleteAudio] = useState(null);
  const [imageData, setImageData] = useState({});

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

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

  const handleHintClick = () => {
    setStep("start");
  };

  const playAudio = (audioKey) => {
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    } else {
      if (Assets[audioKey]) {
        const audio = new Audio(Assets[audioKey]);

        audio.onended = () => setIsPlaying(false);

        audio.play();
        setAudioInstance(audio);
        setIsPlaying(true);
      } else {
        console.error("Audio file not found:", audioKey);
      }
    }
  };

  const data = {
    data: {
      instruction: {
        content: [
          {
            type: "image",
            value: "childrenDayImg",
          },
        ],
      },
      tasks: [
        {
          question: "Children’s Day is celebrated on ______ (date).",
          options: [
            { id: "option1", value: "November 14" },
            { id: "option2", value: "January 26" },
            { id: "option3", value: "August 15" },
          ],
          answer: "option1",
        },
        {
          question: "The celebration takes place at ______ (school name).",
          options: [
            { id: "option1", value: "ABC Public School" },
            { id: "option2", value: "GHSS, Pudhur" },
            { id: "option3", value: "DEF International School" },
          ],
          answer: "option1",
        },
        {
          question:
            "Some fun activities include speech competitions, cultural programs, ______, and prize distribution.",
          options: [
            { id: "option1", value: "games" },
            { id: "option2", value: "exams" },
            { id: "option3", value: "homework" },
          ],
          answer: "option1",
        },
        {
          question:
            "The picture shows children playing happily in a ______ (place).",
          options: [
            { id: "option1", value: "park" },
            { id: "option2", value: "classroom" },
            { id: "option3", value: "library" },
          ],
          answer: "option1",
        },
        {
          question:
            "The message at the bottom of the image says: ______ are the heart of our Nation!’",
          options: [
            { id: "option1", value: "Children" },
            { id: "option2", value: "Teachers" },
            { id: "option3", value: "Parents" },
          ],
          answer: "option1",
        },
        {
          question: "One child in the picture is hanging on a ______.",
          options: [
            { id: "option1", value: "rope" },
            { id: "option2", value: "tree" },
            { id: "option3", value: "ladder" },
          ],
          answer: "option1",
        },
      ],
    },
  };

  useEffect(() => {
    setConversationData(conversation?.instructions?.content);
    //setImageData(conversation?.instructions);
    setCompleteAudio(conversation?.instructions?.content[0]?.audio);
    setTasks(conversation?.tasks);
    setCurrentTaskIndex(0);
  }, []);

  useEffect(() => {
    setConversationData(conversation?.instructions?.content || []);
    setImageData(conversation?.instructions);
    setTasks(conversation?.tasks || []);
    setCurrentTaskIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowConfetti(false);
    setShowQuestion(false);
  }, [currentLevel]);

  console.log(
    "m10",
    tasks,
    currentTaskIndex,
    currentLevel,
    evaluationResults,
    recAudio
  );

  const allTexts = conversationData[0]?.message;

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
      }, 3000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        resetState();
      }, 1000);
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const loadNextTask = () => {
    setRecAudio(null);
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
      alignItems: "flex-end",
      padding: "0px 20px",
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
      gap: "50px",
      marginTop: "15px",
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
      padding: "15px",
      fontWeight: "bold",
      //display: "relative",
      border: "1px dashed #d8b6ff",
      fontSize: "24px",
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      //marginLeft: "400px",
      marginTop: "20px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      //minHeight: "100px",
    },
    optionsContainer: {
      marginTop: "20px",
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
      padding: "10px",
      position: "relative",
    },

    option: {
      backgroundColor: "#fff",
      padding: "15px",
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
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            margin: "30px 30px",
          }}
        >
          {/* Image on the left */}
          <img
            src={Assets[data.data.instruction.content[0].value]}
            alt="Children's Day"
            style={{ width: "250px", height: "250px", borderRadius: "15px" }}
          />

          {/* MCQ Section on the right */}
          <div>
            <h3>{data.data.tasks[currentStep]?.question}</h3>
            <div>
              {data.data.tasks[currentStep]?.options.map((option) => (
                <div
                  key={option.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    name="mcq"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.5)",
                      cursor: "pointer",
                    }}
                  />
                  <label style={{ fontSize: "16px", cursor: "pointer" }}>
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedOption && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop:
                currentLevel === "S1" || currentLevel === "S2"
                  ? "30px"
                  : "10px",
              gap: "10px",
            }}
          >
            <VoiceAnalyser
              pageName={"m8"}
              setVoiceText={setVoiceText}
              onAudioProcessed={handleRecordingComplete}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={true}
              handleNext={handleNext}
              enableNext={enableNext}
              originalText={parentWords}
              audioLink={audio ? audio : completeAudio}
              buttonAnimation={selectedOption}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                isShowCase,
                setEnableNext,
                //showOnlyListen: answer !== "correct",
                showOnlyListen: false,
                setOpenMessageDialog,
              }}
            />
            {currentLevel !== "S1" && currentLevel !== "S2"
              ? selectedOption !== null &&
                recAudio && (
                  <div
                    onClick={loadNextTask}
                    style={{ cursor: "pointer", marginLeft: "35px" }}
                  >
                    <NextButtonRound height={45} width={45} />
                  </div>
                )
              : recAudio && (
                  <div
                    onClick={loadNextTask}
                    style={{ cursor: "pointer", marginLeft: "35px" }}
                  >
                    <NextButtonRound height={45} width={45} />
                  </div>
                )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default McqFlow;
