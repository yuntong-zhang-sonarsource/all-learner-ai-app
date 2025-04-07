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
  const [step, setStep] = useState("initiate");
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

  const playAudio = () => {
    const audio = new Audio(correctSound);
    audio.play();
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

  const conversation = getConversation(level, currentLevel);

  useEffect(() => {
    setConversationData(conversation?.instructions?.content);
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

  console.log("mcqFlow", conversation, currentStep);

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

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      parentWords={parentWords}
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
          display: "flex",
          flexDirection: "column",
          //justifyContent: "center",
          alignItems: "center",
          //gap: "20px",
          //margin: "30px 30px",
        }}
      >
        {conversation?.instruction?.content[0]?.text && (
          <span
            style={{
              fontFamily: "Quicksand",
              fontWeight: "600",
              fontSize: "28px",
              marginTop: "30px",
            }}
          >
            {conversation?.instruction?.content[0]?.text}
          </span>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            width: "90%",
            margin: "30px 30px",
          }}
        >
          {/* Image on the left */}

          {conversation?.instruction?.content[0]?.value && (
            <img
              src={Assets[conversation?.instruction?.content[0]?.value]}
              alt="Children's Day"
              style={{ width: "250px", height: "250px", borderRadius: "15px" }}
            />
          )}

          {/* MCQ Section on the right */}
          <div style={{ width: "50%" }}>
            {typeof tasks?.[currentStep - 1]?.question === "string" ? (
              <h3
                style={{
                  fontFamily: "Quicksand",
                  fontSize: "22px",
                  fontWeight: "800",
                }}
              >
                {tasks[currentStep - 1].question}
              </h3>
            ) : null}

            <div>
              {conversation?.tasks[currentStep - 1]?.options.map((option) => (
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
                    onChange={() => {
                      setSelectedOption(option.id);
                      playAudio();
                    }}
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.5)",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    style={{
                      fontSize: "17px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontFamily: "Quicksand",
                    }}
                  >
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
