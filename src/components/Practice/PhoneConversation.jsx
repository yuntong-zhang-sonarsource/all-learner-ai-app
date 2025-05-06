import React, { useEffect, useState, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import Confetti from "react-confetti";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import listenImg2 from "../../assets/listen.png";
import spinnerStop from "../../assets/pause.png";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
} from "../../utils/constants";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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
  fluency,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  isNextButtonCalled,
  setIsNextButtonCalled,
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
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState("");
  const [completeAudio, setCompleteAudio] = useState(null);
  const [imageData, setImageData] = useState({});
  const [loader, setLoader] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;
    console.log("Live Transcript:", transcript);
  }, [transcript]);

  console.log("showcases", isShowCase, startShowCase);

  //steps = 1;

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
    if (tasks[currentTaskIndex]) {
      const currentTask = tasks[currentTaskIndex];
      const correctOption =
        currentTask.options.find((opt) => opt.id === currentTask.answer)
          ?.value || "Unknown";
      const question = currentTask.question.value;

      setCorrectAnswerText(correctOption);
      setQuestionText(question);
    }
  }, [currentTaskIndex, tasks]);

  const playAudio = (audioKey) => {
    if (audioInstance) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(null);
      setAudioInstance(null);
    }
    if (isPlaying !== audioKey) {
      if (getAssetAudioUrl(s3Assets[audioKey]) || Assets[audioKey]) {
        const audio = new Audio(
          getAssetAudioUrl(s3Assets[audioKey]) || Assets[audioKey]
        );

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

  useEffect(() => {
    setVisibleMessages([]);
    indexRef.current = 0;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (indexRef.current < conversationData.length) {
          setVisibleMessages((prev) => [
            ...prev,
            conversationData[indexRef.current],
          ]);
          indexRef.current++;
          const audio = new Audio(correctSound);
          audio.play();
        } else {
          clearInterval(intervalRef.current);
        }
      }, 1500);
    };

    if (!isShowCase || (isShowCase && startShowCase)) {
      startInterval();
    }

    return () => clearInterval(intervalRef.current);
  }, [conversationData, isShowCase, startShowCase]);

  // Stop interval if showQuestion is true
  useEffect(() => {
    if (showQuestion) {
      clearInterval(intervalRef.current);
    }
  }, [showQuestion]);

  console.log("m1011", currentLevel, selectedOption, recAudio);

  const handleStartRecording = () => {
    // if (!browserSupportsSpeechRecognition) {
    //   //alert("Speech recognition is not supported in your browser.");
    //   return;
    // }
    setRecAudio(null);
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcriptRef.current);
    setIsRecording(false);
    //console.log("Final Transcript:", transcriptRef.current);
  };

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  const handleNextClick = () => {
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
      setAudioInstance(null);
    }
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

    if (optionId === tasks[currentTaskIndex].answer) {
      setIsCorrect(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setRecording("recording");
      }, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        resetState();
      }, 500);
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const loadNextTask = async () => {
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
      setAudioInstance(null);
    }
    setIsLoading(true);

    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";

    if (currentLevel === "S1" || currentLevel === "S2") {
      const options = {
        originalText: correctAnswerText,
        questionText: questionText,
        contentType: contentType,
        contentId: contentId,
      };

      responseText = await fetchASROutput(recAudio, options, setLoader);
      setApiResponse(responseText);
    }
    await callTelemetryApi(
      correctAnswerText,
      sessionId,
      currentStep - 1,
      recAudio,
      responseStartTime,
      responseText?.responseText || ""
    );

    setTimeout(() => {
      setRecAudio(null);
      const audio = new Audio(correctSound);
      audio.play();
      handleNext();
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        resetState();
      } else {
        setCurrentTaskIndex(0);
        resetState();
      }
      setIsLoading(false);
      setRecording("no");
    }, 2000);
  };

  const styles = {
    mainContainer: {
      background:
        "linear-gradient(0deg, rgba(241, 153, 32, 0.32) 0%, rgba(243, 159, 39, 0.32) 23%, rgba(247, 176, 59, 0.32) 58%, rgba(254, 204, 92, 0.32) 100%)",
      height: "100%",
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
      //height: "80vh",
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
      //borderRadius: "24px",
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
      backgroundColor: "#fde4b2",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
      borderBottomRightRadius: "24px",
      borderBottomLeftRadius: "1px",
      alignSelf: "flex-start",
      width: "300px",
      marginLeft: "80px",
    },
    callerMessage: {
      backgroundColor: "#f1f1f1",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: "24px",
      borderBottomRightRadius: "1px",
      borderBottomLeftRadius: "24px",
      alignSelf: "flex-end",
      width: "280px",
      marginRight: "180px",
      marginBottom: "-30px",
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
      left: "-70px",
      bottom: "10%",
      display: "flex",
      alignItems: "center",
      transform: "translateY(50%)",
      gap: "10px",
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
      marginRight: "30px",
      marginBottom: "20px",
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

  const MessageBubble = ({
    msg,
    isPlaying,
    playAudio,
    styles,
    Assets,
    isLast,
  }) => {
    const [showMessage, setShowMessage] = useState(!isLast);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 1000);

      return () => clearTimeout(timer);
    }, [isLast]);

    return (
      <div
        style={{
          ...styles.message,
          ...(msg.role === "System" ? styles.sonMessage : styles.callerMessage),
        }}
      >
        {showMessage ? (
          <>
            <span style={styles.boldText}>{msg.name}: </span>
            {msg.message}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //height: "40px",
            }}
          >
            <img
              src={Assets.chatLoader}
              alt="Loading"
              style={{ height: "15px", margin: "15px 0px" }}
            />
          </div>
        )}

        {msg?.role === "System" && (
          <div style={styles.boyIcon}>
            <img
              src={isPlaying === msg.audio ? spinnerStop : listenImg2}
              alt="Audio"
              style={{ height: "25px", width: "25px", cursor: "pointer" }}
              onClick={() => playAudio(msg?.audio)}
            />
            <img
              src={Assets.avatar1}
              alt="Boy"
              width={"25px"}
              height={"25px"}
            />
          </div>
        )}

        {msg?.role === "User" && (
          <div style={styles.callerIconsContainer}>
            <img
              src={Assets.avatar2}
              alt="Boy"
              width={"25px"}
              height={"25px"}
            />
            <img
              src={isPlaying === msg.audio ? spinnerStop : listenImg2}
              alt="Audio"
              style={{ height: "25px", width: "25px", cursor: "pointer" }}
              onClick={() => playAudio(msg?.audio)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m8"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      fluency={false}
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
        isShowCase,
        startShowCase,
        setStartShowCase,
        livesData,
        gameOverData,
        setIsNextButtonCalled,
      }}
    >
      <div style={styles.mainContainer}>
        {showConfetti && <Confetti height={"350px"} />}
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
                {/* {visibleMessages?.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(msg.role === "System"
                        ? styles.sonMessage
                        : styles.callerMessage),
                    }}
                  >
                    <span style={styles.boldText}>{msg.name}: </span>
                    {msg.message}
                    {msg?.role === "System" && (
                      <div style={styles.boyIcon}>
                        <img
                          src={
                            isPlaying === msg.audio ? spinnerStop : listenImg2
                          }
                          alt="Audio"
                          style={{
                            height: "25px",
                            width: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => playAudio(msg?.audio)}
                        />
                        <img
                          src={Assets.avatar1}
                          alt="Boy"
                          width={"25px"}
                          height={"25px"}
                        />
                      </div>
                    )}
                    {msg?.role === "User" && (
                      <div style={styles.callerIconsContainer}>
                        <img
                          src={Assets.avatar2}
                          alt="Boy"
                          width={"25px"}
                          height={"25px"}
                        />
                        <img
                          src={
                            isPlaying === msg.audio ? spinnerStop : listenImg2
                          }
                          alt="Audio"
                          style={{
                            height: "25px",
                            width: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => playAudio(msg?.audio)}
                        />
                      </div>
                    )}
                  </div>
                ))} */}
                {visibleMessages.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    msg={msg}
                    isPlaying={isPlaying}
                    playAudio={playAudio}
                    styles={styles}
                    Assets={Assets}
                    isLast={index === visibleMessages.length - 1}
                  />
                ))}
              </div>
              {/* <img
                src={Assets.nextimg}
                alt="Next"
                style={styles.nextButton}
                onClick={handleNextClick}
              /> */}
              <div onClick={handleNextClick} style={styles.nextButton}>
                <NextButtonRound height={50} width={50} />
              </div>
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
                {!["S1", "S2"].includes(currentLevel) && (
                  <img
                    src={
                      isPlaying ? Assets.stopVoiceNote : Assets.startVoiceNote
                    }
                    alt="Audio"
                    style={{
                      height: "40px",
                      width: "190px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                    onClick={() =>
                      playAudio(conversation?.instructions?.completeAudio)
                    }
                  />
                )}
                <div style={styles.questionBox}>
                  {tasks[currentTaskIndex]?.question?.value}
                </div>
                {/* {recording === "no" && ( */}
                {currentLevel !== "S1" && currentLevel !== "S2" && (
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
                        onClick={() => {
                          if (!showConfetti) {
                            handleOptionClick(option.id);
                          }
                        }}
                      >
                        {option.value}
                      </div>
                    ))}
                  </div>
                )}
                {/* {recording === "recording" && ( */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop:
                      currentLevel === "S1" || currentLevel === "S2"
                        ? "35px"
                        : "30px",
                    gap: "10px",
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                    </Box>
                  ) : (
                    <>
                      {((currentLevel !== "S1" &&
                        currentLevel !== "S2" &&
                        selectedOption) ||
                        currentLevel === "S1" ||
                        currentLevel === "S2") && (
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
                          handleStartRecording={handleStartRecording}
                          handleStopRecording={handleStopRecording}
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
                      )}
                      {currentLevel !== "S1" && currentLevel !== "S2"
                        ? selectedOption !== null &&
                          recAudio && (
                            <div
                              onClick={loadNextTask}
                              style={{
                                cursor: "pointer",
                                marginLeft: "23px",
                              }}
                            >
                              <NextButtonRound height={45} width={45} />
                            </div>
                          )
                        : recAudio && (
                            <div
                              onClick={loadNextTask}
                              style={{
                                cursor: "pointer",
                                marginLeft: "23px",
                              }}
                            >
                              <NextButtonRound height={45} width={45} />
                            </div>
                          )}
                    </>
                  )}
                </div>
                {/* // )} */}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PhoneConversation;
