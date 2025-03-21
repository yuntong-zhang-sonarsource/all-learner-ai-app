import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import Confetti from "react-confetti";
import listenImg from "../../assets/listen.png";
import Mic from "../../assets/mikee.svg";
import Stop from "../../assets/pausse.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
} from "../../utils/constants";

const theme = createTheme();

const PhrasesInAction = ({
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);
  //const [currentSteps, setCurrentSteps] = useState(getInitialStep(currentLevel));
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [isCorrectImageSelected, setIsCorrectImageSelected] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.titleThree || "L1";

  const getInitialStep = (level) => {
    return level === "L1" || level === "L3" ? "step1" : "step2";
  };

  const [currentSteps, setCurrentSteps] = useState(
    getInitialStep(currentLevel)
  );

  console.log("m3", currentLevel);

  const content = {
    L1: [
      {
        step1: {
          allwords: [{ img: Assets.sunShinesImg, text: "Sun Shines" }],
          audio: Assets.sunShinesAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.wePlayImg, text: "We Play" },
            { img: Assets.sunShinesImg, text: "Sun Shines" },
            { img: Assets.heDancesImg, text: "He Dances" },
          ],
          correctWordTwo: "Sun Shines",
          audio: Assets.sunShinesAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.fishSwimImg, text: "Fish Swim" }],
          audio: Assets.fishSwimAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.dogsBarkImg, text: "Dogs Bark" },
            { img: Assets.fishSwimImg, text: "Fish Swim" },
            { img: Assets.itRainsImg, text: "It Rains" },
          ],
          correctWordTwo: "Fish Swim",
          audio: Assets.fishSwimAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.birdsFlyImg, text: "Birds Fly" }],
          audio: Assets.birdsFlyAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.sheReadsImg, text: "She Reads" },
            { img: Assets.birdsFlyImg, text: "Birds Fly" },
            { img: Assets.weWinImg, text: "We Win" },
          ],
          correctWordTwo: "Birds Fly",
          audio: Assets.birdsFlyAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.sheSmilesImg, text: "She Smiles" }],
          audio: Assets.sheSmilesAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.babyCriesImg, text: "Baby Cries" },
            { img: Assets.sheSmilesImg, text: "She Smiles" },
            { img: Assets.heEatsImg, text: "He Eats" },
          ],
          correctWordTwo: "She Smiles",
          audio: Assets.sheSmilesAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.theyLaughImg, text: "They Laugh" }],
          audio: Assets.theyLaughAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.youCookImg, text: "You Cook" },
            { img: Assets.theyLaughImg, text: "They Laugh" },
            { img: Assets.wePlayImg, text: "We Play" },
          ],
          correctWordTwo: "They Laugh",
          audio: Assets.theyLaughAudio,
        },
      },
    ],

    L2: [
      {
        step1: {
          allwords: [{ img: Assets.wePlayImg, text: "We Play" }],
          audio: Assets.wePlayAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.sunShinesImg, text: "Sun Shines" },
            { img: Assets.wePlayImg, text: "We Play" },
            { img: Assets.heDancesImg, text: "He Dances" },
          ],
          correctWordTwo: "We Play",
          audio: Assets.wePlayAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.heDancesImg, text: "He Dances" }],
          audio: Assets.heDancesAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.clocksTickImg, text: "Clocks Tick" },
            { img: Assets.heDancesImg, text: "He Dances" },
            { img: Assets.sheSingsImg, text: "She Sings" },
          ],
          correctWordTwo: "He Dances",
          audio: Assets.heDancesAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.sheSingsImg, text: "She Sings" }],
          audio: Assets.sheSingsAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.flowersBloomImg, text: "Flowers Bloom" },
            { img: Assets.sheSingsImg, text: "She Sings" },
            { img: Assets.itRainsImg, text: "It Rains" },
          ],
          correctWordTwo: "She Sings",
          audio: Assets.sheSingsAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.dogsBarkImg, text: "Dogs Bark" }],
          audio: Assets.dogsBarkAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.weWinImg, text: "We Win" },
            { img: Assets.dogsBarkImg, text: "Dogs Bark" },
            { img: Assets.babyCriesImg, text: "Baby Cries" },
          ],
          correctWordTwo: "Dogs Bark",
          audio: Assets.dogsBarkAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.itRainsImg, text: "It Rains" }],
          audio: Assets.itRainsAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.birdsFlyImg, text: "Birds Fly" },
            { img: Assets.itRainsImg, text: "It Rains" },
            { img: Assets.iSleepImg, text: "I Sleep" },
          ],
          correctWordTwo: "It Rains",
          audio: Assets.itRainsAudio,
        },
      },
    ],

    L3: [
      {
        step1: {
          allwords: [{ img: Assets.youSwimImg, text: "You Swim" }],
          audio: Assets.youSwimAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.heEatsImg, text: "He Eats" },
            { img: Assets.youSwimImg, text: "You Swim" },
            { img: Assets.sheReadsImg, text: "She Reads" },
          ],
          correctWordTwo: "You Swim",
          audio: Assets.youSwimAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.iSleepImg, text: "I Sleep" }],
          audio: Assets.iSleepAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.clocksTickImg, text: "Clocks Tick" },
            { img: Assets.iSleepImg, text: "I Sleep" },
            { img: Assets.sunShinesImg, text: "Sun Shines" },
          ],
          correctWordTwo: "I Sleep",
          audio: Assets.iSleepAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.heEatsImg, text: "He Eats" }],
          audio: Assets.heEatsAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.flowersBloomImg, text: "Flowers Bloom" },
            { img: Assets.heEatsImg, text: "He Eats" },
            { img: Assets.dogsBarkImg, text: "Dogs Bark" },
          ],
          correctWordTwo: "He Eats",
          audio: Assets.heEatsAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.sheReadsImg, text: "She Reads" }],
          audio: Assets.sheReadsAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.youCookImg, text: "You Cook" },
            { img: Assets.sheReadsImg, text: "She Reads" },
            { img: Assets.babyCriesImg, text: "Baby Cries" },
          ],
          correctWordTwo: "She Reads",
          audio: Assets.sheReadsAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.clocksTickImg, text: "Clocks Tick" }],
          audio: Assets.clocksTickAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.sheSingsImg, text: "She Sings" },
            { img: Assets.clocksTickImg, text: "Clocks Tick" },
            { img: Assets.iSleepImg, text: "I Sleep" },
          ],
          correctWordTwo: "Clocks Tick",
          audio: Assets.clocksTickAudio,
        },
      },
    ],

    L4: [
      {
        step1: {
          allwords: [{ img: Assets.flowersBloomImg, text: "Flowers Bloom" }],
          audio: Assets.flowersBloomAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.youSwimImg, text: "You Swim" },
            { img: Assets.flowersBloomImg, text: "Flowers Bloom" },
            { img: Assets.fireBurnsImg, text: "Fire Burns" },
          ],
          correctWordTwo: "Flowers Bloom",
          audio: Assets.flowersBloomAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.fireBurnsImg, text: "Fire Burns" }],
          audio: Assets.fireBurnsAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.birdsFlyImg, text: "Birds Fly" },
            { img: Assets.fireBurnsImg, text: "Fire Burns" },
            { img: Assets.dogsBarkImg, text: "Dogs Bark" },
          ],
          correctWordTwo: "Fire Burns",
          audio: Assets.fireBurnsAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.babyCriesImg, text: "Baby Cries" }],
          audio: Assets.babyCriesAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.weWinImg, text: "We Win" },
            { img: Assets.babyCriesImg, text: "Baby Cries" },
            { img: Assets.sunShinesImg, text: "Sun Shines" },
          ],
          correctWordTwo: "Baby Cries",
          audio: Assets.babyCriesAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.youCookImg, text: "You Cook" }],
          audio: Assets.youCookAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.birdsFlyImg, text: "Birds Fly" },
            { img: Assets.youCookImg, text: "You Cook" },
            { img: Assets.flowersBloomImg, text: "Flowers Bloom" },
          ],
          correctWordTwo: "You Cook",
          audio: Assets.youCookAudio,
        },
      },
      {
        step1: {
          allwords: [{ img: Assets.weWinImg, text: "We Win" }],
          audio: Assets.weWinAudio,
        },
        step2: {
          allwordsTwo: [
            { img: Assets.fireBurnsImg, text: "Fire Burns" },
            { img: Assets.weWinImg, text: "We Win" },
            { img: Assets.sheReadsImg, text: "She Reads" },
          ],
          correctWordTwo: "We Win",
          audio: Assets.weWinAudio,
        },
      },
    ],
  };

  //const levelData = content?.[currentLevel][currentWordIndex][currentSteps];
  const levelData = content?.[currentLevel]?.[currentWordIndex]?.[currentSteps];

  let audioElement = new Audio(levelData?.audio);

  useEffect(() => {
    //setStartGame(true);
    setCurrentSteps(getInitialStep(currentLevel));
    setCurrentWordIndex(0);
    setSelectedDiv(null); // Reset selection
    setIncorrectWords([]); // Clear incorrect words
    setIsCorrectImageSelected(false); // Reset selection status
    setIsMatched(false); // Reset matching status
    setTextColor("#1a1a1a"); // Reset text color
    setIsAnswerIncorrect(false); // Reset incorrect answer flag
    setIsRecording(false); // Reset recording
    setIsRecordingStopped(false); // Reset recording stop state
    setIsRecording2(false); // Reset second recording state
    setIsRecordingStopped2(false); // Reset second recording stop state
    setSelectedDiv2(null);
  }, [currentLevel]);

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsRecordingStopped(false);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setIsRecording(false);
      setIsRecordingStopped(true);
    }
  };

  const playAudio = () => {
    audioElement.play();
    setIsAudioPlaying(true);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    audioElement.pause();
    setIsAudioPlaying(false);
    setIsPaused(true);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const goToNextStep = () => {
    if (currentWordIndex < content[currentLevel]?.length - 1) {
      handleNext();
      //setCurrentSteps(getInitialStep(currentLevel));
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedDiv(null); // Reset selection
      setIncorrectWords([]); // Clear incorrect words
      setIsCorrectImageSelected(false); // Reset selection status
      setIsMatched(false); // Reset matching status
      setTextColor("#1a1a1a"); // Reset text color
      setIsAnswerIncorrect(false); // Reset incorrect answer flag
      setIsRecording(false); // Reset recording
      setIsRecordingStopped(false); // Reset recording stop state
      setIsRecording2(false); // Reset second recording state
      setIsRecordingStopped2(false); // Reset second recording stop state
      setSelectedDiv2(null);
    } else {
      handleNext();
      setSelectedDiv(null); // Reset selection
      setIncorrectWords([]); // Clear incorrect words
      setIsCorrectImageSelected(false); // Reset selection status
      setIsMatched(false); // Reset matching status
      setTextColor("#1a1a1a"); // Reset text color
      setIsAnswerIncorrect(false); // Reset incorrect answer flag
      setIsRecording(false); // Reset recording
      setIsRecordingStopped(false); // Reset recording stop state
      setIsRecording2(false); // Reset second recording state
      setIsRecordingStopped2(false); // Reset second recording stop state
      setSelectedDiv2(null);
    }
  };

  const [isRecording2, setIsRecording2] = useState(false);
  const [selectedDiv2, setSelectedDiv2] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [textColor, setTextColor] = useState("#1a1a1a");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isRecordingStopped2, setIsRecordingStopped2] = useState(false);
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);

  const handleMicClick2 = () => {
    if (!isRecording2) {
      setIsRecording2(true);
      setIsRecordingStopped2(false);
    } else {
      setIsRecording2(false);
      setIsRecordingStopped2(true);
    }
  };

  const handleDivClick = (divText) => {
    if (divText === levelData?.correctWordTwo) {
      setSelectedDiv(divText);
      setIsMatched(false);
      const audio = new Audio(correctSound);
      audio.play();

      setTimeout(() => {
        setIsMatched(true);
        setTextColor("#333F61");
        setIsCorrectImageSelected(true);

        if (currentLevelIndex < content[currentLevel].length - 1) {
          setCurrentLevelIndex(currentLevelIndex + 1);
        } else {
          // goToNextStep();
        }
      }, 1000);
    } else {
      const tempSelectedDiv = selectedDiv;
      setSelectedDiv(divText);
      const audio = new Audio(wrongSound);
      audio.play();

      setTimeout(() => {
        setSelectedDiv(tempSelectedDiv);
      }, 1000);
    }
  };

  const playAudio2 = () => {
    const audioElement = new Audio(levelData?.audio);
    audioElement.play();
  };

  // Step 3
  const [selectedWords, setSelectedWords] = useState([]);
  const [shuffledWords] = useState(
    currentSteps === "step3"
      ? [...levelData?.allsentence].sort(() => Math.random() - 0.5)
      : []
  );
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording3, setIsRecording3] = useState(false);
  const [isRecordingStopped3, setIsRecordingStopped3] = useState(false);

  useEffect(() => {
    if (
      currentSteps === "step3" &&
      selectedWords.length === levelData?.allsentence.length
    ) {
      const userSentence = selectedWords.join(" ");
      if (userSentence === levelData?.allwordsthree[0].correctSentence) {
        setIsCorrect(true);
        setIsAnswerIncorrect(false);
        setIncorrectWords([]);
      } else {
        setIsCorrect(false);
        setIsAnswerIncorrect(true);
        const incorrect = selectedWords.filter(
          (word, index) => word !== levelData?.allsentence[index]
        );
        setIncorrectWords(incorrect);
        setTimeout(() => {
          setIncorrectWords([]);
          setSelectedWords([]);
          setIsAnswerIncorrect(false);
        }, 2000);
      }
    }
  }, [selectedWords]);

  const handleWordClick = (word) => {
    if (
      currentSteps === "step3" &&
      selectedWords.length < levelData?.allsentence.length
    ) {
      setSelectedWords((prevSelectedWords) => {
        if (!prevSelectedWords.includes(word)) {
          return [...prevSelectedWords, word];
        }
        return prevSelectedWords;
      });
    }
  };

  const handleMicClick3 = () => {
    if (isRecording3) {
      setIsRecordingStopped3(true);
    }
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
      <ThemeProvider theme={theme}>
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#eae6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0px",
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
            }}
          >
            {/* <img
            src={levelImg}
            alt="Level"
            style={{
              position: "absolute",
              top: isMobile ? "14px" : "36px",
              left: "65px",
              width: isMobile ? "180px" : "220px",

              height: "auto",
            }}
          /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {currentSteps === "step1" && (
                <>
                  {!isRecordingStopped && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#1a1a1a",
                        letterSpacing: "3px",
                        position: "relative",
                        marginBottom: "20px",
                      }}
                    >
                      <span style={{ margin: "0 10px" }}>
                        {levelData?.allwords[0]?.text}
                      </span>
                      <img
                        src={listenImg}
                        alt="Audio Control"
                        style={{
                          width: "40px",
                          height: "40px",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={playAudio2}
                      />
                    </div>
                  )}

                  {isRecordingStopped && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={Assets.tickImg}
                          alt="Tick"
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: "#1a1a1a",
                            letterSpacing: "3px",
                          }}
                        >
                          {levelData?.allwords[0]?.text}
                        </p>
                      </div>
                      <div
                        onClick={goToNextStep}
                        style={{ cursor: "pointer", marginTop: "30px" }}
                      >
                        <NextButtonRound height={50} width={50} />
                      </div>
                    </div>
                  )}

                  {!isRecordingStopped && !isPaused && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        margin: "20px 0",
                      }}
                    >
                      {levelData?.allwords?.map((item) => (
                        <div
                          key={item.text}
                          style={{
                            width: "200px",
                            height: "220px",
                            border: "1px solid #000",
                            margin: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            flexDirection: "column",
                          }}
                          onClick={() => setSelectedDiv(item.text)}
                        >
                          <img
                            src={item.img}
                            alt={item.text}
                            style={{
                              width: "200px",
                              height: "230px",
                              objectFit: "contain",
                              border: "1px solid #00000033",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {isRecording && (
                      <>
                        <Box
                          style={{ marginTop: "10px", marginBottom: "50px" }}
                        >
                          <RecordVoiceVisualizer />
                        </Box>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "10px",
                          }}
                          onClick={handleMicClick}
                        >
                          <img
                            src={Assets.pause}
                            alt="Stop Recording"
                            style={{ width: "60px", height: "60px" }}
                          />
                        </button>
                      </>
                    )}

                    {!isRecording && !isRecordingStopped && (
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "10px",
                        }}
                        onClick={handleMicClick}
                      >
                        <img
                          src={Assets.mic}
                          alt="Start Recording"
                          style={{ width: "60px", height: "60px" }}
                        />
                      </button>
                    )}
                  </div>
                </>
              )}

              {currentSteps === "step2" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {!isRecordingStopped2 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: isMobile
                            ? "24px"
                            : isTablet
                            ? "30px"
                            : "36px",
                          fontWeight: "bold",
                          color: "#1a1a1a",
                          letterSpacing: "3px",
                          position: "relative",
                          marginBottom: "20px",
                        }}
                      >
                        <span style={{ margin: "0 10px", color: textColor }}>
                          {levelData?.correctWordTwo}
                        </span>
                        <img
                          src={listenImg}
                          alt="Listen"
                          style={{
                            width: isMobile
                              ? "30px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            height: isMobile
                              ? "30px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            marginLeft: "10px",
                            cursor: "pointer",
                          }}
                          onClick={playAudio2}
                        />
                      </div>

                      {isMatched ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            margin: "20px 0",
                          }}
                        >
                          <div
                            style={{
                              width: isMobile
                                ? "110px"
                                : isTablet
                                ? "150px"
                                : "200px",
                              height: isMobile
                                ? "170px"
                                : isTablet
                                ? "200px"
                                : "220px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              flexDirection: "column",
                              background: "none",
                              border: "none",
                            }}
                          >
                            <img
                              src={
                                levelData?.allwordsTwo.find(
                                  (item) =>
                                    item.text === levelData?.correctWordTwo
                                ).img
                              }
                              alt={levelData?.correctWordTwo}
                              style={{
                                width: isMobile
                                  ? "110px"
                                  : isTablet
                                  ? "150px"
                                  : "200px",
                                height: isMobile
                                  ? "170px"
                                  : isTablet
                                  ? "200px"
                                  : "230px",
                                objectFit: "contain",
                                border: "1px solid #00000033",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <Grid
                          container
                          spacing={isMobile ? 1 : isTablet ? 2 : 4}
                          justifyContent="center"
                          style={{
                            margin: isMobile
                              ? "-10px 0"
                              : isTablet
                              ? "0"
                              : "8px 0",
                            paddingLeft: isMobile ? "95px" : "0",
                          }}
                        >
                          {levelData?.allwordsTwo?.map((item) => (
                            <Grid item key={item.text} xs={12} sm={4} md={4}>
                              <div
                                style={{
                                  width: isMobile ? "58%" : "95%",
                                  height: isMobile
                                    ? "123px"
                                    : isTablet
                                    ? "170px"
                                    : "220px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  flexDirection: "column",
                                  background:
                                    selectedDiv === item.text
                                      ? item.text === levelData?.correctWordTwo
                                        ? "linear-gradient(90deg, rgba(88, 204, 2, 0.2) 0%, rgba(88, 204, 2, 0) 100%)"
                                        : "linear-gradient(90deg, rgba(255, 127, 54, 0.2) 0%, rgba(255, 127, 54, 0) 100%)"
                                      : "none",
                                  border:
                                    selectedDiv === item.text
                                      ? item.text === levelData?.correctWordTwo
                                        ? "1.3px solid #58CC02"
                                        : "1.3px solid #FF7F36"
                                      : "none",
                                }}
                                onClick={() => handleDivClick(item.text)}
                              >
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  style={{
                                    width: isMobile
                                      ? "110px"
                                      : isTablet
                                      ? "150px"
                                      : "198px",
                                    height: isMobile
                                      ? "130px"
                                      : isTablet
                                      ? "170px"
                                      : "230px",
                                    objectFit: "contain",
                                    border: "1px solid #00000033",
                                  }}
                                />
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {isRecording2 && (
                      <>
                        <Box
                          style={{ marginTop: "10px", marginBottom: "50px" }}
                        >
                          <RecordVoiceVisualizer />
                        </Box>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "10px",
                          }}
                          onClick={handleMicClick2}
                        >
                          <img
                            src={Assets.pause}
                            alt="Stop Recording"
                            style={{
                              width: isMobile
                                ? "40px"
                                : isTablet
                                ? "50px"
                                : "60px",
                              height: isMobile
                                ? "40px"
                                : isTablet
                                ? "50px"
                                : "60px",
                            }}
                          />
                        </button>
                      </>
                    )}

                    {isCorrectImageSelected &&
                      !isRecording2 &&
                      !isRecordingStopped2 && (
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "10px",
                          }}
                          onClick={handleMicClick2}
                        >
                          <img
                            src={Assets.mic}
                            alt="Start Recording"
                            style={{
                              width: isMobile
                                ? "40px"
                                : isTablet
                                ? "50px"
                                : "60px",
                              height: isMobile
                                ? "40px"
                                : isTablet
                                ? "50px"
                                : "60px",
                            }}
                          />
                        </button>
                      )}
                  </div>

                  {isRecordingStopped2 && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={Assets.tickImg}
                          alt="Tick"
                          style={{
                            width: isMobile
                              ? "30px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            height: isMobile
                              ? "30px"
                              : isTablet
                              ? "35px"
                              : "40px",
                            marginRight: "10px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: isMobile
                              ? "24px"
                              : isTablet
                              ? "28px"
                              : "36px",
                            fontWeight: "bold",
                            color: "#1a1a1a",
                            letterSpacing: "3px",
                          }}
                        >
                          {levelData?.correctWordTwo}
                        </p>
                      </div>
                      <div
                        onClick={goToNextStep}
                        style={{ cursor: "pointer", marginTop: "30px" }}
                      >
                        <NextButtonRound height={50} width={50} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default PhrasesInAction;
