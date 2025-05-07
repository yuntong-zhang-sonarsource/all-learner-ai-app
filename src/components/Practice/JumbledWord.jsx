import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  Button,
} from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import Confetti from "react-confetti";
import pause from "../../assets/pause.png";
import Mic from "../../assets/mikee.svg";
import Stop from "../../assets/pausse.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  WordRedCircle,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  RetryIconn,
} from "../../utils/constants";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const JumbledWord = ({
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
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);
  const [currentSteps, setCurrentSteps] = useState("step3");
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const audioRef = useRef(null);
  const [audioInstance, setAudioInstance] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const mimeType = "audio/webm;codecs=opus";

  const startAudioRecording = useCallback(async () => {
    setRecordedBlob(null);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.error("MIME type not supported:", mimeType);
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordedChunksRef.current.length === 0) {
          console.warn("No audio data captured.");
          setRecordedBlob(null);
          return;
        }

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Emit data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData(); // Flush remaining data
      recorder.stop();
      setIsRecording(false);
    }
  }, []);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const content = {
    L1: [
      {
        correctWord: [
          { audio: "fillingImg", correctSentence: "We play in the park" },
        ],
        jumbledWords: ["We", "in", "the", "park", "play"],
      },

      {
        correctWord: [
          {
            audio: "parkImg",
            correctSentence: "children playing near a swing",
          },
        ],
        jumbledWords: ["children", "near", "a", "swing", "playing"],
      },
    ],
  };

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data[currentStep - 1] || [];
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

  //const conversation = contentM13[level]?.[currentLevel]?.conversation || content?.conversation;

  const conversation = getConversation(level, currentLevel);

  const levelData = getConversation(level, currentLevel);
  //const levelData = content.L1[0];

  console.log("lData", levelData);

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);
    console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      levelData?.correctWord[0]?.correctSentence,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      responseText?.responseText || ""
    );
  };

  let audioElement =
    getAssetAudioUrl(s3Assets[levelData?.correctWord?.[0]?.audio]) ||
    Assets[levelData?.correctWord?.[0]?.audio];

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsRecordingStopped(false);
    } else {
      setIsRecording(false);
      setIsRecordingStopped(true);
    }
  };

  const playAudios = (audioKey) => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
      } else {
        audioRef.current.src = audioKey;
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  const stopCompleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopCompleteAudio();
    } else {
      playAudios(audioElement);
    }
  };

  //   useEffect(() => {
  //     const handleAudioEnd = () => {
  //       setIsAudioPlaying(false);
  //       setIsPaused(false);
  //     };

  //     audioElement.addEventListener("ended", handleAudioEnd);

  //     return () => {
  //       audioElement.removeEventListener("ended", handleAudioEnd);
  //     };
  //   }, []);

  const resetStates = () => {
    setIsRecording(false);
    setIsAudioPlaying(false);
    setIsPaused(false);
    setIsRecordingStopped(false);
    setCurrentSteps("step3");
    setSelectedDiv(null);
    setIncorrectWords([]);
    setSelectedWords([]);
    setIsCorrect(false);
    setIsRecording3(false);
    setIsRecordingStopped3(false);
  };

  const goToNextStep = () => {
    callTelemetry();
    stopCompleteAudio();
    handleNext();
    resetStates();
  };

  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording3, setIsRecording3] = useState(false);
  const [isRecordingStopped3, setIsRecordingStopped3] = useState(false);

  useEffect(() => {
    if (
      currentSteps === "step3" &&
      selectedWords.length === levelData?.jumbledWords?.length
    ) {
      const userSentence = selectedWords.join(" ");
      if (userSentence === levelData?.correctWord[0]?.correctSentence) {
        const audio = new Audio(correctSound);
        audio.play();
        setIsCorrect(true);
        setIncorrectWords([]);
      } else {
        const incorrect = selectedWords.filter(
          (word, index) => word !== levelData?.jumbledWords[index]
        );
        setIncorrectWords(incorrect);
        setTimeout(() => {
          const audio = new Audio(wrongSound);
          audio.play();
        }, 500);
        setTimeout(() => {
          setIncorrectWords([]);
          setSelectedWords([]);
        }, 2000);
      }
    }
  }, [selectedWords]);

  // const handleWordClick = (word, index) => {
  //   if (
  //     currentSteps === "step3" &&
  //     selectedWords.length < levelData?.jumbledWords?.length
  //   ) {
  //     const audio = new Audio(correctSound);
  //     audio.play();
  //     setSelectedWords((prevSelectedWords) => {
  //       if (!prevSelectedWords.includes(word)) {
  //         return [...prevSelectedWords, word];
  //       }
  //       return prevSelectedWords;
  //     });
  //   }
  // };

  const handleWordClick = (word, index) => {
    if (currentSteps === "step3") {
      const audio = new Audio(correctSound);
      audio.play();
      setSelectedWords((prevSelectedWords) => {
        if (prevSelectedWords.includes(word)) {
          // If the word is already in selectedWords, remove it
          const updatedWords = prevSelectedWords.filter(
            (selectedWord) => selectedWord !== word
          );
          return updatedWords;
        } else {
          // Otherwise, add the word to selectedWords
          if (selectedWords.length < levelData?.jumbledWords?.length) {
            return [...prevSelectedWords, word];
          }
          return prevSelectedWords;
        }
      });
    }
  };

  const handleMicClick3 = () => {
    if (isRecording3) {
      // If currently recording, stop it
      stopAudioRecording();
      setIsRecordingStopped3(true);
    } else {
      // If not recording, start it
      startAudioRecording();
    }
    // Toggle recording state
    setIsRecording3((prev) => !prev);
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
          width: "100%",
          height: "100v%",
          backgroundColor: "#eae6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0px",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "90%",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #d9d2fc",
            padding: "30px 0px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentSteps === "step3" && (
              <div
                className="game-container"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!isCorrect && !isRecording3 && !isRecordingStopped3 && (
                  <div>
                    <Box
                      className="walkthrough-step-1"
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                      }}
                      onClick={toggleAudio}
                    >
                      {isAudioPlaying ? (
                        <StopButton height={50} width={50} />
                      ) : (
                        <ListenButton height={50} width={50} />
                      )}
                    </Box>
                  </div>
                )}
                <div
                  className="sentence-placeholder"
                  style={{
                    margin: "20px 0",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isCorrect && !isRecording3 && !isRecordingStopped3 ? (
                    <>
                      <img
                        src={Assets.tickImg}
                        alt="Correct"
                        style={{ width: "30px", marginRight: "10px" }}
                      />
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "24px",
                          //marginRight: "10px",
                        }}
                      >
                        {levelData?.correctWord[0]?.correctSentence}
                      </span>

                      {/* <Box
                        className="walkthrough-step-1"
                        sx={{
                          marginTop: "7px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minWidth: { xs: "50px", sm: "60px", md: "70px" },
                          //cursor: `url(${clapImage}) 32 24, auto`,
                          //marginLeft: getMarginLeft(0),
                        }}
                        onClick={handleMicClick3}
                      >
                        <ListenButton height={50} width={50} />
                      </Box> */}
                    </>
                  ) : isRecording3 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "35px",
                          marginBottom: "10px",
                        }}
                      >
                        {levelData.correctWord[0].correctSentence}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "40px",
                          //position: "relative",
                        }}
                      >
                        <Box>
                          <RecordVoiceVisualizer />
                        </Box>
                        <Box
                          sx={{
                            marginTop: "50px",
                            //position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: { xs: "50px", sm: "60px", md: "70px" },
                            cursor: "pointer",
                            //marginLeft: getMarginLeft(0),
                          }}
                          onClick={handleMicClick3}
                        >
                          <StopButton height={50} width={50} />
                        </Box>
                      </div>
                    </div>
                  ) : isRecordingStopped3 ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <p
                        style={{
                          fontSize: "36px",
                          fontWeight: "bold",
                          color: "green",
                          lineHeight: "1.2",
                          //letterSpacing: "3px",
                        }}
                      >
                        {levelData?.correctWord[0]?.correctSentence}
                      </p>
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "30px",
                        }}
                        onClick={goToNextStep}
                      >
                        <NextButtonRound height={50} width={50} />
                      </button>
                    </div>
                  ) : (
                    levelData?.jumbledWords?.map((_, index) => (
                      <span
                        key={index}
                        onClick={() =>
                          handleWordClick(selectedWords[index], index)
                        }
                        style={{
                          margin: "0 13px",
                          borderBottom: "1.6px solid #754F4F80",
                          minWidth: "80px",
                          display: "inline-block",
                          textAlign: "center",
                          height: "30px",
                          lineHeight: "30px",
                          cursor: "pointer",
                        }}
                      >
                        {selectedWords[index] || ""}
                      </span>
                    ))
                  )}
                </div>

                {isCorrect && !isRecording3 && !isRecordingStopped3 && (
                  <div
                    style={{ marginTop: "30px", gap: "10px", display: "flex" }}
                  >
                    <Box
                      className="walkthrough-step-1"
                      sx={{
                        //position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                      }}
                      onClick={toggleAudio}
                    >
                      {isAudioPlaying ? (
                        <StopButton height={50} width={50} />
                      ) : (
                        <ListenButton height={50} width={50} />
                      )}
                    </Box>
                    <Box
                      sx={{
                        //position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                      }}
                      onClick={handleMicClick3}
                    >
                      <SpeakButton height={50} width={50} />
                    </Box>
                  </div>
                )}

                {!isCorrect && (
                  <div
                    className="word-container"
                    style={{
                      marginTop: "40px",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "22px",
                      width: "100%",
                      //marginLeft: "auto",
                      marginRight: "auto",
                      overflowX: "auto",
                    }}
                  >
                    {levelData?.jumbledWords?.map((word, index) => (
                      <div
                        key={index}
                        onClick={() => handleWordClick(word)}
                        style={{
                          padding: "10px 20px",
                          fontSize: "18px",
                          border: "1px solid #1CB0F6",
                          borderRadius: "5px",
                          cursor: selectedWords.includes(word)
                            ? "not-allowed"
                            : "pointer",
                          backgroundColor:
                            incorrectWords.length > 0
                              ? "#FF00001A"
                              : selectedWords.includes(word)
                              ? "#1CB0F61A"
                              : "white",
                          textAlign: "center",
                          minWidth: "40px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                          borderBottom: "3px solid #1CB0F6",
                          paddingBottom: "10px",
                          transition: "all 0.3s ease",
                          color: selectedWords.includes(word)
                            ? "transparent"
                            : "black",
                          userSelect: "none",
                        }}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <audio
          ref={audioRef}
          onEnded={stopCompleteAudio}
          src={audioElement}
          hidden
        />
      </div>
    </MainLayout>
  );
};

export default JumbledWord;
