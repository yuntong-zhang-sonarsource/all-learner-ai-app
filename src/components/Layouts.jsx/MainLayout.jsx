import { Box, Card, CardContent, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import practicebgstone from "../../assets/images/practice-bg-stone.svg";
import practicebgstone2 from "../../assets/images/practice-bg-stone2.svg";
import practicebgstone3 from "../../assets/images/practice-bg-stone3.svg";
import practicebg from "../../assets/images/practice-bg.svg";
import practicebg2 from "../../assets/images/practice-bg2.svg";
import practicebg3 from "../../assets/images/practice-bg3.svg";
import gameWon from "../../assets/images/gameWon.svg";
import clouds from "../../assets/images/clouds.svg";
import catLoading from "../../assets/images/catLoading.gif";
import textureImage from "../../assets/images/textureImage.png";
import timer from "../../assets/images/timer.svg";
import playButton from "../../assets/listen.png";
import pauseButton from "../../assets/pause.png";
import {
  GreenTick,
  HeartBlack,
  Diamond,
  LevelEight,
  LevelFive,
  LevelFour,
  LevelNine,
  LevelOne,
  LevelSeven,
  LevelSix,
  LevelThree,
  LevelTwo,
  NextButton,
  callConfettiSnow,
  levelConfig,
  practiceSteps,
  getLocalData,
  LevelTen,
  LevelEleven,
  LevelTwelve,
  LevelThirteen,
  LevelFourteen,
  LevelFifteen,
  ROneImg,
  setLocalData,
} from "../../utils/constants";

import { ProfileHeader } from "../Assesment/Assesment";
import Confetti from "react-confetti";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import gameLoseAudio from "../../assets/audio/gameLose.wav";
import * as Assets from "../../utils/imageAudioLinks";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { levelMapping } from "../../utils/levelData";
import { jwtDecode } from "jwt-decode";
import rOneImg from "../../assets/R1.png";
import rTwoMileImage from "../../assets/r2mile.png";
import rThreeMileImage from "../../assets/r3mile.png";
import rFourMileImage from "../../assets/r4mile.png";
import zIndex from "@mui/material/styles/zIndex";

const MainLayout = (props) => {
  const levelsImages = {
    1: {
      milestone: <LevelOne />,
      backgroundAddOn: practicebgstone,
      background: practicebg,
    },
    2: {
      milestone: <LevelTwo />,
      backgroundAddOn: practicebgstone2,
      background: practicebg2,
    },
    3: {
      milestone: <LevelThree />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
    },
    4: {
      milestone: <LevelFour />,
      backgroundAddOn: practicebgstone,
      background: practicebg3,
      backgroundColor: `${levelConfig[4].color}60`,
    },
    5: {
      milestone: <LevelFive />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[5].color}60`,
    },
    6: {
      milestone: <LevelSix />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[6].color}60`,
    },
    7: {
      milestone: <LevelSeven />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[7].color}60`,
    },
    8: {
      milestone: <LevelEight />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[8].color}60`,
    },
    9: {
      milestone: <LevelNine />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    10: {
      milestone: <LevelTen />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    11: {
      milestone: <LevelEleven />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    12: {
      milestone: <LevelTwelve />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    13: {
      milestone: <LevelThirteen />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    14: {
      milestone: <LevelFourteen />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    15: {
      milestone: <LevelFifteen />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
  };

  const rFlow = getLocalData("rFlow");
  const mFlow = getLocalData("mFail");
  const allCompleted = getLocalData("allCompleted");

  let LEVEL = props?.level;

  let flowNames = props?.flowNames;
  let activeFlow = props?.activeFlow;

  const virtualId = String(getLocalData("virtualId"));

  if (levelMapping[virtualId] !== undefined) {
    LEVEL = levelMapping[virtualId];
  } else {
    const token = getLocalData("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const emisUsername = String(decoded.emis_username);

        if (levelMapping[emisUsername] !== undefined) {
          LEVEL = levelMapping[emisUsername];
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }

  console.log("Assigned LEVEL:", LEVEL, props.rStep);

  const {
    handleNext,
    enableNext,
    showNext = true,
    showTimer = true,
    // showScore = true,
    nextLessonAndHome = false,
    cardBackground,
    backgroundImage,
    points = 0,
    progressData,
    showProgress,
    setOpenLangModal,
    lang,
    handleBack,
    disableScreen,
    isShowCase,
    startShowCase,
    contentType,
    percentage,
    fluency,
    setStartShowCase,
    livesData,
    gameOverData,
    loading,
    storedData,
    resetStoredData,
    isRecordingComplete,
    answer,
    isCorrect,
  } = props;

  const [shake, setShake] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const audioRefs = useRef([]);

  const handleAudioPlay = (index) => {
    const audioElem = audioRefs.current[index];

    if (!audioElem) {
      return;
    }

    if (audioPlaying !== null && audioPlaying !== index) {
      const previousAudioElem = audioRefs.current[audioPlaying];
      if (previousAudioElem) {
        previousAudioElem.pause();
      }
    }

    if (audioElem.paused) {
      audioElem.play();
      setAudioPlaying(index);
      audioElem.onended = () => {
        setAudioPlaying(null);
      };
    } else {
      audioElem.pause();
      setAudioPlaying(null);
    }
  };

  const [audioCache, setAudioCache] = useState({});

  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const urls = [LevelCompleteAudio, gameLoseAudio];
        const cache = {};

        for (const url of urls) {
          const response = await fetch(url);
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          cache[url] = audioUrl;
        }

        setAudioCache(cache);
      } catch (error) {
        console.error("Error preloading audio:", error);
      }
    };

    preloadAudio();

    return () => {
      Object.values(audioCache).forEach((audioUrl) =>
        URL.revokeObjectURL(audioUrl)
      );
    };
  }, []);

  console.log("isCo", isCorrect);

  useEffect(() => {
    if (isRecordingComplete && answer && isCorrect) {
      callConfettiSnow();
    }
  }, []);

  useEffect(() => {
    if (isShowCase && gameOverData) {
      setShake(gameOverData.userWon ?? true);

      let audioSrc;
      if (gameOverData) {
        audioSrc = gameOverData.userWon
          ? audioCache[LevelCompleteAudio]
          : audioCache[gameLoseAudio];
      } else {
        audioSrc = audioCache[LevelCompleteAudio];
      }

      if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });

        if (!gameOverData?.userWon) {
          callConfettiSnow();
        }
      }

      const shakeTimeout = setTimeout(() => {
        setShake(false);
      }, 4000);

      return () => {
        clearTimeout(shakeTimeout);
      };
    }
  }, [startShowCase, isShowCase, gameOverData, audioCache]);

  let currentPracticeStep = progressData?.currentPracticeStep;

  const sectionStyle = {
    width: "100%",
    backgroundImage: `url(${
      backgroundImage ? backgroundImage : levelsImages?.[LEVEL]?.background
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    paddingTop: { md: "0px", xs: "20px" },
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    background: props?.background || levelsImages?.[LEVEL]?.backgroundColor,
    position: "relative",
  };

  const steps = props.steps;
  const currentStep = props.currentStep;
  const stepsArr = [...Array(steps || 0).keys()];
  let width = window.innerWidth * 0.85;

  const blackLivesToShow =
    livesData?.blackLivesToShow > 0 ? livesData?.blackLivesToShow : 0;

  const redLivesToShow =
    livesData?.redLivesToShow !== undefined
      ? livesData?.redLivesToShow > 0
        ? livesData?.redLivesToShow
        : 0
      : livesData?.lives;

  const navigate = useNavigate();
  return (
    <Box sx={sectionStyle}>
      <ProfileHeader
        {...{ level: LEVEL, setOpenLangModal, lang, points, handleBack }}
      />

      {LEVEL && (
        <Box
          sx={{
            position: "absolute",
            bottom: "70px",
            left:
              LEVEL === 1
                ? "3px"
                : LEVEL === 2
                ? "40px"
                : LEVEL === 3
                ? "78px"
                : "78px",
          }}
        >
          <img
            src={levelsImages?.[LEVEL]?.backgroundAddOn}
            alt="backgroundAddOn"
          />
        </Box>
      )}
      <Box sx={{ position: "absolute", top: "15px", right: "80px" }}></Box>
      {loading ? (
        <Card
          sx={{
            width: "85vw",
            minHeight: "80vh",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${cardBackground || textureImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "round",
            boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
            backdropFilter: "blur(25px)",
            mt: "50px",
          }}
        >
          <Box>
            <img src={catLoading} alt="catLoading" />
          </Box>
        </Card>
      ) : (
        <>
          {(!isShowCase || (isShowCase && startShowCase)) &&
            !gameOverData &&
            !allCompleted && (
              <Card
                sx={{
                  position: { xs: "absolute", md: "relative" },
                  left: { xs: "0px", md: "auto" },
                  width: { xs: "100%", md: "85vw" },
                  minHeight: "80vh",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundImage: `url(${cardBackground || textureImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                  backdropFilter: "blur(25px)",
                  mt: "75px",
                }}
              >
                <Box>
                  {isRecordingComplete && answer && isCorrect && (
                    <Confetti width={width} height={"600px"} />
                  )}
                </Box>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    opacity: disableScreen ? 0.25 : 1,
                    pointerEvents: disableScreen ? "none" : "initial",
                  }}
                >
                  {showTimer && (
                    <Box sx={{ position: "absolute" }}>
                      <img
                        src={timer}
                        alt="timer"
                        style={{ height: "58px", width: "58px" }}
                      />
                    </Box>
                  )}
                  {props.children}
                </CardContent>
                {steps > 0 && (
                  <Box
                    sx={{
                      width: { xs: "100%", md: "85vw" },
                      position: "absolute",
                      display: "flex",
                      top: "0",
                    }}
                  >
                    {stepsArr?.map((step, index) => {
                      const showGreen = step + 1 <= currentStep;
                      return (
                        <Box
                          key={index}
                          index={index}
                          sx={{
                            height: "8px",
                            width: `${100 / steps}%`,
                            background: showGreen ? "#18DE2C" : "#C1C6CC",
                            marginLeft: "3px",
                          }}
                        ></Box>
                      );
                    })}
                  </Box>
                )}
                {contentType &&
                  contentType.toLowerCase() !== "word" &&
                  startShowCase && (
                    <Box
                      position={"absolute"}
                      top={20}
                      left={20}
                      justifyContent={"center"}
                    >
                      <Box display={"flex"}>
                        {[
                          ...Array(Math.max(0, redLivesToShow) || 0).keys(),
                        ]?.map((elem) => (
                          <Diamond />
                        ))}

                        {[
                          ...Array(Math.max(0, blackLivesToShow) || 0).keys(),
                        ]?.map((elem) => (
                          <HeartBlack />
                        ))}
                      </Box>
                      <span
                        style={{
                          marginLeft: "5px",
                          color: "#000000",
                          fontWeight: 700,
                          fontSize: "24px",
                          lineHeight: "30px",
                          fontFamily: "Quicksand",
                        }}
                      >
                        {`You have ${redLivesToShow} lives`}
                      </span>
                    </Box>
                  )}
                <Box sx={{ height: "110px", position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      bottom: "-2px",
                      zIndex: "9999",
                    }}
                  >
                    <footer>
                      {rFlow === "true" ? (
                        LEVEL == 1 ? (
                          <img
                            src={Assets.rOneMileImage}
                            alt="R One"
                            height={"250px"}
                          />
                        ) : LEVEL === 2 ? (
                          <img
                            src={
                              props.rStep === 2
                                ? Assets.r2MileImg
                                : props.rStep === 3
                                ? Assets.r3MileImg
                                : props.rStep === 4
                                ? Assets.r4MileImg
                                : null
                            }
                            alt={`R Step ${props.rStep}`}
                            height={"200px"}
                          />
                        ) : null
                      ) : (
                        LEVEL && levelsImages?.[LEVEL]?.milestone
                      )}
                    </footer>
                  </Box>
                  <Box
                    sx={{
                      borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                      width: "100%",
                    }}
                  ></Box>
                  {showNext && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: currentPracticeStep
                          ? "center"
                          : "right",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {showProgress && rFlow !== "true" && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            {" "}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "48px",
                                border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                ml: {
                                  xs: 10,
                                  sm: 15,
                                  lg: 25,
                                  md: 18,
                                },
                                borderRadius: "30px",
                                background: "white",
                              }}
                            >
                              {practiceSteps.map((elem, i) => {
                                return (
                                  <Box
                                    key={i}
                                    sx={{
                                      width: {
                                        xs: "24px",
                                        sm: "26px",
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      height: {
                                        xs: "24px",
                                        sm: "26px",
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      background:
                                        currentPracticeStep > i
                                          ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                          : currentPracticeStep === i
                                          ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                          : "rgba(0, 0, 0, 0.04)",
                                      ml: {
                                        xs: 0.5,
                                        sm: 0.5,
                                        md: 1.5,
                                        lg: 2,
                                      },
                                      mr:
                                        i === practiceSteps?.length - 1 ? 2 : 0,
                                      borderRadius: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {currentPracticeStep > i ? (
                                      <GreenTick />
                                    ) : (
                                      <span
                                        style={{
                                          color:
                                            currentPracticeStep === i
                                              ? "white"
                                              : "#1E2937",
                                          fontWeight: 600,
                                          lineHeight: "20px",
                                          fontSize: "16px",
                                          fontFamily: "Quicksand",
                                        }}
                                      >
                                        {LEVEL === 1
                                          ? elem.title
                                          : LEVEL === 2
                                          ? elem.titleNew
                                          : LEVEL === 3
                                          ? elem.titleThree
                                          : elem.name}
                                      </span>
                                    )}
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {rFlow == "true" && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "48px",
                                border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                ml: { xs: 10, sm: 15, lg: 25, md: 18 },
                                borderRadius: "30px",
                                background: "white",
                              }}
                            >
                              {flowNames?.map((flow, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: {
                                      xs: "24px",
                                      sm: "26px",
                                      md: "28px",
                                      lg: "36px",
                                    },
                                    height: {
                                      xs: "24px",
                                      sm: "26px",
                                      md: "28px",
                                      lg: "36px",
                                    },
                                    background:
                                      flow === activeFlow
                                        ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                        : flowNames?.indexOf(flow) <
                                          flowNames?.indexOf(activeFlow)
                                        ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                        : "rgba(0, 0, 0, 0.04)",
                                    ml: { xs: 0.5, sm: 0.5, md: 1.5, lg: 2 },
                                    mr: i === flowNames?.length - 1 ? 2 : 0,
                                    borderRadius: "30px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {flowNames?.indexOf(flow) <
                                  flowNames?.indexOf(activeFlow) ? (
                                    <GreenTick />
                                  ) : (
                                    <span
                                      style={{
                                        color:
                                          flow === activeFlow
                                            ? "white"
                                            : "#1E2937",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        fontFamily: "Quicksand",
                                      }}
                                    >
                                      {flow}
                                    </span>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                  {nextLessonAndHome && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 4,
                        ml: 4,
                        mr: 4,
                      }}
                    >
                      <Box
                        sx={{
                          cursor: "pointer",
                          background:
                            "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
                          minWidth: "100px",
                          height: "55px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0px 24px 0px 20px",
                        }}
                        onClick={() => handleNext()}
                      >
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: "20px",
                            fontFamily: "Quicksand",
                          }}
                        >
                          {"Next Lesson"}
                        </span>
                      </Box>
                      {enableNext ? (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleNext()}
                        >
                          <NextButton />
                        </Box>
                      ) : (
                        <Box sx={{ cursor: "pointer" }}>
                          <NextButton disabled />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Card>
            )}
          {((isShowCase && !startShowCase) || gameOverData) &&
            !allCompleted && (
              <Card
                sx={{
                  width: "85vw",
                  minHeight: "80vh",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundImage: `url(${cardBackground || textureImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "round",
                  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                  backdropFilter: "blur(25px)",
                  mt: "50px",
                }}
              >
                <Box>
                  {shake && <Confetti width={width} height={"602px"} />}
                </Box>
                <CardContent
                  sx={{
                    width: "82vw",
                    minHeight: "100%",
                    opacity: disableScreen ? 0.25 : 1,
                    pointerEvents: disableScreen ? "none" : "initial",
                  }}
                >
                  {isShowCase && !startShowCase && !gameOverData && (
                    <>
                      <Typography
                        className="successHeader"
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        Hurray!!!
                      </Typography>
                      <Typography
                        sx={{
                          mb: 1,
                          mt: 1,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#50507D",
                            fontWeight: 600,
                            fontSize: "20px",
                            lineHeight: "37px",
                            letterSpacing: "2%",
                            fontFamily: "Quicksand",
                          }}
                        >
                          {"Ready for Challenge?"}
                        </span>
                      </Typography>
                    </>
                  )}
                  {gameOverData && (
                    <>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "-120px",
                          left: "-70px",
                        }}
                      >
                        {!gameOverData?.userWon && (
                          <img
                            src={clouds}
                            alt="clouds"
                            style={{ zIndex: -999 }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          position: "relative",
                          zIndex: "100",
                        }}
                      >
                        {gameOverData?.userWon ? (
                          <img
                            src={gameWon}
                            alt="gameWon"
                            style={{ zIndex: 9999, height: 340 }}
                          />
                        ) : (
                          <Stack
                            justifyContent="center"
                            alignItems="center"
                            direction={"row"}
                            zIndex={100}
                          >
                            <Stack justifyContent="center" alignItems="center">
                              <img
                                src={`https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.3/src/assets/images/gameLost.svg`}
                                alt="gameLost"
                                style={{ height: 340 }}
                              />
                              <Typography
                                sx={{ mb: 1, mt: 1, textAlign: "center" }}
                              >
                                {!props.pageName === "m8" && (
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "24px",
                                      lineHeight: "1.5",
                                      letterSpacing: "1px",
                                      fontFamily: "Quicksand",
                                      backgroundColor: "rgb(237, 134, 0)",
                                      padding: "6px 12px",
                                      color: "#fff",
                                      borderRadius: "20px",
                                      boxShadow:
                                        "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.5)",
                                    }}
                                  >
                                    {percentage <= 0 ? 0 : percentage}/100
                                  </span>
                                )}
                                <br />

                                {!fluency ? (
                                  <Typography textAlign="center" sx={{ mt: 2 }}>
                                    Good try! Need more speed.
                                  </Typography>
                                ) : (
                                  <Typography textAlign="center" sx={{ mt: 2 }}>
                                    You need{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      {Math.abs(70 - percentage)}
                                    </span>{" "}
                                    more.
                                  </Typography>
                                )}
                              </Typography>
                            </Stack>
                            {/* second stack below*/}
                            <Stack
                              direction={"column"}
                              alignItems="center"
                              spacing={2}
                              marginLeft={"10px"}
                            >
                              <Stack
                                sx={{
                                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                                  paddingY: "49px",
                                  paddingX: "30px",
                                  borderRadius: "13px",
                                  marginLeft: "80px",
                                  bgcolor: "#FFFFFF",
                                  zIndex: 100,
                                }}
                                direction={"row"}
                              >
                                <Stack
                                  sx={{
                                    paddingRight:
                                      (props.pageName === "wordsorimage" ||
                                        props.pageName === "m5") &&
                                      !fluency
                                        ? "20px"
                                        : "0px",
                                    borderRight:
                                      (props.pageName === "wordsorimage" ||
                                        props.pageName === "m5") &&
                                      !fluency
                                        ? "1px dashed grey"
                                        : "none",
                                  }}
                                >
                                  {(props.pageName === "wordsorimage" ||
                                    props.pageName === "m5") &&
                                    storedData?.map((elem, index) => (
                                      <Stack
                                        key={index}
                                        justifyContent={"start"}
                                        alignItems={"center"}
                                        direction={"row"}
                                        mt={index > 0 ? "25px" : 0}
                                      >
                                        <Box
                                          sx={{
                                            marginLeft: "35px",
                                            marginRight: "5px",
                                          }}
                                        >
                                          {elem?.audioUrl ? (
                                            <button
                                              onClick={() =>
                                                handleAudioPlay(index)
                                              }
                                              style={{
                                                height: "30px",
                                                cursor: "pointer",
                                                background: "none",
                                                border: "none",
                                                padding: "0",
                                              }}
                                              aria-label={
                                                audioPlaying === index
                                                  ? "Pause audio"
                                                  : "Play audio"
                                              }
                                            >
                                              <img
                                                src={
                                                  audioPlaying === index
                                                    ? pauseButton
                                                    : playButton
                                                }
                                                alt={
                                                  audioPlaying === index
                                                    ? "Pause"
                                                    : "Play"
                                                }
                                                style={{ height: "30px" }}
                                              />
                                            </button>
                                          ) : (
                                            <Box></Box>
                                          )}
                                          <audio
                                            ref={(el) =>
                                              (audioRefs.current[index] = el)
                                            }
                                            src={elem?.audioUrl}
                                          />
                                        </Box>

                                        {elem?.correctAnswer === false ? (
                                          <img
                                            src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/wrong.svg"
                                            alt="wrongImage"
                                          />
                                        ) : (
                                          <img
                                            src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/correct.svg"
                                            alt="correctImage"
                                          />
                                        )}
                                        <span
                                          style={{
                                            marginLeft: "8px",
                                            color: "#1E2937",
                                            fontWeight: 700,
                                            lineHeight: "30px",
                                            fontSize: "15px",
                                            fontFamily: "Quicksand",
                                            minWidth: "100px",
                                          }}
                                        >
                                          {elem.selectedAnswer || "Binocular"}
                                        </span>
                                      </Stack>
                                    ))}
                                </Stack>
                                {(fluency ||
                                  [10, 11, 12, 13, 14, 15].includes(LEVEL)) && (
                                  <Stack
                                    sx={{
                                      paddingLeft:
                                        (props.pageName === "wordsorimage" ||
                                          props.pageName === "m5") &&
                                        !fluency
                                          ? "20px"
                                          : "0px",
                                    }}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                  >
                                    <img
                                      src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/turtle.svg"
                                      alt="turtleImage"
                                    />
                                    <span
                                      style={{
                                        marginTop: "12px",
                                        color: "#1E2937",
                                        fontWeight: 700,
                                        lineHeight: "25px",
                                        fontSize: "20px",
                                        fontFamily: "Quicksand",
                                      }}
                                    >
                                      {"Oops, a bit slow!"}
                                    </span>
                                  </Stack>
                                )}
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                  backgroundColor: "#F8EAD2",
                                  border: "2px solid yellow",
                                  borderRadius: "40px",
                                  padding: "10px 20px",
                                  //maxWidth: "100%",
                                }}
                              >
                                <img
                                  src={Assets.starNewImg}
                                  alt="Star"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                    maxWidth: "150px",
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    fontFamily: "Quicksand",
                                  }}
                                >
                                  Let’s practice more
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
                <Box sx={{ height: "120px", position: "relative" }}>
                  <Box
                    sx={{
                      borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                      width: "100%",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: currentPracticeStep ? "center" : "right",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: currentPracticeStep
                            ? "center"
                            : "right",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {showProgress && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              {" "}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "48px",
                                  border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                  ml: {
                                    lg: 25,
                                    md: 18,
                                  },
                                  borderRadius: "30px",
                                  background: "white",
                                }}
                              >
                                {practiceSteps.map((elem, i) => {
                                  return (
                                    <Box
                                      key={i}
                                      sx={{
                                        width: {
                                          md: "28px",
                                          lg: "36px",
                                        },
                                        height: {
                                          md: "28px",
                                          lg: "36px",
                                        },
                                        background:
                                          currentPracticeStep > i
                                            ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                            : currentPracticeStep === i
                                            ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                            : "rgba(0, 0, 0, 0.04)",
                                        ml: {
                                          md: 1.5,
                                          lg: 2,
                                        },
                                        mr:
                                          i === practiceSteps?.length - 1
                                            ? 2
                                            : 0,
                                        borderRadius: "30px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      {currentPracticeStep > i ? (
                                        <GreenTick />
                                      ) : (
                                        <span
                                          style={{
                                            color:
                                              currentPracticeStep === i
                                                ? "white"
                                                : "#1E2937",
                                            fontWeight: 600,
                                            lineHeight: "20px",
                                            fontSize: "16px",
                                            fontFamily: "Quicksand",
                                          }}
                                        >
                                          {LEVEL === 1 ? elem.title : elem.name}
                                        </span>
                                      )}
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Box>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "right",
                            mr: 4,
                          }}
                        >
                          <Box
                            sx={{
                              cursor: "pointer",
                              background:
                                "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
                              minWidth: "160px",
                              height: "55px",
                              borderRadius: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "0px 24px 0px 20px",
                            }}
                            onClick={() => {
                              if (
                                ((LEVEL === 1 || LEVEL === 2) &&
                                  mFlow === true) ||
                                mFlow === "true"
                              ) {
                                console.log("mFlow value:", mFlow);
                                setLocalData("rFlow", true);
                              }
                              if (
                                props.pageName === "wordsorimage" ||
                                props.pageName === "m5"
                              ) {
                                resetStoredData();
                              }
                              if (
                                isShowCase &&
                                !startShowCase &&
                                !gameOverData
                              ) {
                                setStartShowCase(true);
                              }
                              if (gameOverData) {
                                gameOverData.link
                                  ? navigate(gameOverData.link)
                                  : navigate("/_practice");
                              }
                            }}
                          >
                            <Typography
                              style={{
                                color: "#FFFFFF",
                                fontWeight: 600,
                                fontSize: "20px",
                                fontFamily: "Quicksand",
                              }}
                              fontSize={{ md: "14px", xs: "10px" }}
                            >
                              {!gameOverData ? "Start Game ➜" : "Practice ➜"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  </Box>
                </Box>
              </Card>
            )}
          {LEVEL === 15 && allCompleted && (
            <Card
              sx={{
                width: "65%",
                //height: "100%",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundImage: `url(${cardBackground || textureImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "round",
                boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                backdropFilter: "blur(25px)",
                mt: "100px",
              }}
            >
              <img
                src={Assets.allLevCompleted}
                width={"100%"}
                height={"100%"}
              />
              <Box sx={{ height: "120px", position: "relative" }}>
                <Box
                  sx={{
                    borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                    width: "100%",
                  }}
                ></Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {showProgress && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "48px",
                                border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                // ml: {
                                //   lg: 25,
                                //   md: 18,
                                // },
                                borderRadius: "30px",
                                background: "white",
                              }}
                            >
                              {practiceSteps.map((elem, i) => {
                                return (
                                  <Box
                                    key={i}
                                    sx={{
                                      width: {
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      height: {
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      background:
                                        "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)",
                                      ml: {
                                        md: 1.5,
                                        lg: 2,
                                      },
                                      mr:
                                        i === practiceSteps?.length - 1 ? 2 : 0,
                                      borderRadius: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* {currentPracticeStep > i ? ( */}
                                    <GreenTick />
                                    {/* ) : (
                                        <span
                                          style={{
                                            color:
                                              currentPracticeStep === i
                                                ? "white"
                                                : "#1E2937",
                                            fontWeight: 600,
                                            lineHeight: "20px",
                                            fontSize: "16px",
                                            fontFamily: "Quicksand",
                                          }}
                                        >
                                          {LEVEL === 1 ? elem.title : elem.name}
                                        </span>
                                      )} */}
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  }
                </Box>
              </Box>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

MainLayout.propTypes = {
  contentType: PropTypes.string,
  handleBack: PropTypes.func,
  isRecordingComplete: PropTypes.bool,
  answer: PropTypes.string,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  showProgress: PropTypes.bool,
  setOpenLangModal: PropTypes.func,
  points: PropTypes.number,
  handleNext: PropTypes.any,
  enableNext: PropTypes.bool,
  showNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  nextLessonAndHome: PropTypes.bool,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  loading: PropTypes.bool,
  storedData: PropTypes.array,
  resetStoredData: PropTypes.func,
  pageName: PropTypes.string,
  gameOverData: PropTypes.shape({
    userWon: PropTypes.bool,
  }),
};

export default MainLayout;
