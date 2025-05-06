import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import Confetti from "react-confetti";
import listenImg from "../../assets/listen.png";
import pause from "../../assets/pause.png";
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
  ListenButton,
  StopButton,
} from "../../utils/constants";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";

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
  const [isPlaying, setIsPlaying] = useState(false);
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

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  let currentLevel = practiceSteps?.[currentPracticeStep]?.titleThree || "L1";

  if (
    String(level) === "10" ||
    String(level) === "12" ||
    String(level) === "13"
  ) {
    currentLevel = practiceSteps?.[currentPracticeStep]?.name;
  }

  const getInitialStep = (level) => {
    return level === "L1" || level === "L3" ? "step1" : "step2";
  };

  const [currentSteps, setCurrentSteps] = useState(
    getInitialStep(currentLevel)
  );

  console.log("m3", currentLevel, level);

  const content = {
    L1: [
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
              text: "Sun Shines",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.sunShinesAudio) || Assets.sunShinesAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
              text: "We Play",
            },
            {
              img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
              text: "Sun Shines",
            },
            {
              img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
              text: "He Dances",
            },
          ],
          correctWordTwo: "Sun Shines",
          audio:
            getAssetAudioUrl(s3Assets.sunShinesAudio) || Assets.sunShinesAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
              text: "Fish Swim",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
            {
              img: getAssetUrl(s3Assets.fishSwimImg) || Assets.fishSwimImg,
              text: "Fish Swim",
            },
            {
              img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
              text: "It Rains",
            },
          ],
          correctWordTwo: "Fish Swim",
          audio:
            getAssetAudioUrl(s3Assets.fishSwimAudio) || Assets.fishSwimAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
              text: "Birds Fly",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
              text: "She Reads",
            },
            {
              img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
              text: "Birds Fly",
            },
            {
              img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
              text: "We Win",
            },
          ],
          correctWordTwo: "Birds Fly",
          audio:
            getAssetAudioUrl(s3Assets.birdsFlyAudio) || Assets.birdsFlyAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
              text: "She Smiles",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.sheSmilesAudio) || Assets.sheSmilesAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
              text: "Baby Cries",
            },
            {
              img: getAssetUrl(s3Assets.sheSmilesImg) || Assets.sheSmilesImg,
              text: "She Smiles",
            },
            {
              img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
              text: "He Eats",
            },
          ],
          correctWordTwo: "She Smiles",
          audio:
            getAssetAudioUrl(s3Assets.sheSmilesAudio) || Assets.sheSmilesAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
              text: "They Laugh",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.theyLaughAudio) || Assets.theyLaughAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
              text: "You Cook",
            },
            {
              img: getAssetUrl(s3Assets.theyLaughImg) || Assets.theyLaughImg,
              text: "They Laugh",
            },
            {
              img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
              text: "We Play",
            },
          ],
          correctWordTwo: "They Laugh",
          audio:
            getAssetAudioUrl(s3Assets.theyLaughAudio) || Assets.theyLaughAudio,
        },
      },
    ],

    L2: [
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
              text: "We Play",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.wePlayAudio) || Assets.wePlayAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
              text: "Sun Shines",
            },
            {
              img: getAssetUrl(s3Assets.wePlayImg) || Assets.wePlayImg,
              text: "We Play",
            },
            {
              img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
              text: "He Dances",
            },
          ],
          correctWordTwo: "We Play",
          audio: getAssetAudioUrl(s3Assets.wePlayAudio) || Assets.wePlayAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
              text: "He Dances",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.heDancesAudio) || Assets.heDancesAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
              text: "Clocks Tick",
            },
            {
              img: getAssetUrl(s3Assets.heDancesImg) || Assets.heDancesImg,
              text: "He Dances",
            },
            {
              img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
              text: "She Sings",
            },
          ],
          correctWordTwo: "He Dances",
          audio:
            getAssetAudioUrl(s3Assets.heDancesAudio) || Assets.heDancesAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
              text: "She Sings",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.sheSingsAudio) || Assets.sheSingsAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img:
                getAssetUrl(s3Assets.flowersBloomImg) || Assets.flowersBloomImg,
              text: "Flowers Bloom",
            },
            {
              img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
              text: "She Sings",
            },
            {
              img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
              text: "It Rains",
            },
          ],
          correctWordTwo: "She Sings",
          audio:
            getAssetAudioUrl(s3Assets.sheSingsAudio) || Assets.sheSingsAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
              text: "We Win",
            },
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
            {
              img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
              text: "Baby Cries",
            },
          ],
          correctWordTwo: "Dogs Bark",
          audio:
            getAssetAudioUrl(s3Assets.dogsBarkAudio) || Assets.dogsBarkAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
              text: "It Rains",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
              text: "Birds Fly",
            },
            {
              img: getAssetUrl(s3Assets.itRainsImg) || Assets.itRainsImg,
              text: "It Rains",
            },
            {
              img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
              text: "I Sleep",
            },
          ],
          correctWordTwo: "It Rains",
          audio: getAssetAudioUrl(s3Assets.itRainsAudio) || Assets.itRainsAudio,
        },
      },
    ],

    L3: [
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
              text: "You Swim",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
              text: "He Eats",
            },
            {
              img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
              text: "You Swim",
            },
            {
              img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
              text: "She Reads",
            },
          ],
          correctWordTwo: "You Swim",
          audio: getAssetAudioUrl(s3Assets.youSwimAudio) || Assets.youSwimAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
              text: "I Sleep",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
              text: "Clocks Tick",
            },
            {
              img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
              text: "I Sleep",
            },
            {
              img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
              text: "Sun Shines",
            },
          ],
          correctWordTwo: "I Sleep",
          audio: getAssetAudioUrl(s3Assets.iSleepAudio) || Assets.iSleepAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
              text: "He Eats",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.heEatsAudio) || Assets.heEatsAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img:
                getAssetUrl(s3Assets.flowersBloomImg) || Assets.flowersBloomImg,
              text: "Flowers Bloom",
            },
            {
              img: getAssetUrl(s3Assets.heEatsImg) || Assets.heEatsImg,
              text: "He Eats",
            },
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
          ],
          correctWordTwo: "He Eats",
          audio: getAssetAudioUrl(s3Assets.heEatsAudio) || Assets.heEatsAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
              text: "She Reads",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.sheReadsAudio) || Assets.sheReadsAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
              text: "You Cook",
            },
            {
              img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
              text: "She Reads",
            },
            {
              img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
              text: "Baby Cries",
            },
          ],
          correctWordTwo: "She Reads",
          audio:
            getAssetAudioUrl(s3Assets.sheReadsAudio) || Assets.sheReadsAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
              text: "Clocks Tick",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.clocksTickAudio) ||
            Assets.clocksTickAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.sheSingsImg) || Assets.sheSingsImg,
              text: "She Sings",
            },
            {
              img: getAssetUrl(s3Assets.clocksTickImg) || Assets.clocksTickImg,
              text: "Clocks Tick",
            },
            {
              img: getAssetUrl(s3Assets.iSleepImg) || Assets.iSleepImg,
              text: "I Sleep",
            },
          ],
          correctWordTwo: "Clocks Tick",
          audio:
            getAssetAudioUrl(s3Assets.clocksTickAudio) ||
            Assets.clocksTickAudio,
        },
      },
    ],

    L4: [
      {
        step1: {
          allwords: [
            {
              img:
                getAssetUrl(s3Assets.flowersBloomImg) || Assets.flowersBloomImg,
              text: "Flowers Bloom",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.flowersBloomAudio) ||
            Assets.flowersBloomAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.youSwimImg) || Assets.youSwimImg,
              text: "You Swim",
            },
            {
              img:
                getAssetUrl(s3Assets.flowersBloomImg) || Assets.flowersBloomImg,
              text: "Flowers Bloom",
            },
            {
              img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
              text: "Fire Burns",
            },
          ],
          correctWordTwo: "Flowers Bloom",
          audio:
            getAssetAudioUrl(s3Assets.flowersBloomAudio) ||
            Assets.flowersBloomAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
              text: "Fire Burns",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.fireBurnsAudio) || Assets.fireBurnsAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
              text: "Birds Fly",
            },
            {
              img: getAssetUrl(s3Assets.fireBurnsImg) || Assets.fireBurnsImg,
              text: "Fire Burns",
            },
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
          ],
          correctWordTwo: "Fire Burns",
          audio:
            getAssetAudioUrl(s3Assets.fireBurnsAudio) || Assets.fireBurnsAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
              text: "Baby Cries",
            },
          ],
          audio:
            getAssetAudioUrl(s3Assets.babyCriesAudio) || Assets.babyCriesAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
              text: "We Win",
            },
            {
              img: getAssetUrl(s3Assets.babyCriesImg) || Assets.babyCriesImg,
              text: "Baby Cries",
            },
            {
              img: getAssetUrl(s3Assets.sunShinesImg) || Assets.sunShinesImg,
              text: "Sun Shines",
            },
          ],
          correctWordTwo: "Baby Cries",
          audio:
            getAssetAudioUrl(s3Assets.babyCriesAudio) || Assets.babyCriesAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
              text: "You Cook",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.youCookAudio) || Assets.youCookAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.birdsFlyImg) || Assets.birdsFlyImg,
              text: "Birds Fly",
            },
            {
              img: getAssetUrl(s3Assets.youCookImg) || Assets.youCookImg,
              text: "You Cook",
            },
            {
              img:
                getAssetUrl(s3Assets.flowersBloomImg) || Assets.flowersBloomImg,
              text: "Flowers Bloom",
            },
          ],
          correctWordTwo: "You Cook",
          audio: getAssetAudioUrl(s3Assets.youCookAudio) || Assets.youCookAudio,
        },
      },
      {
        step1: {
          allwords: [
            {
              img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
              text: "We Win",
            },
          ],
          audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
        },
        step2: {
          allwordsTwo: [
            {
              img: getAssetUrl(s3Assets.dogsBarkImg) || Assets.dogsBarkImg,
              text: "Dogs Bark",
            },
            {
              img: getAssetUrl(s3Assets.weWinImg) || Assets.weWinImg,
              text: "We Win",
            },
            {
              img: getAssetUrl(s3Assets.sheReadsImg) || Assets.sheReadsImg,
              text: "She Reads",
            },
          ],
          correctWordTwo: "We Win",
          audio: getAssetAudioUrl(s3Assets.weWinAudio) || Assets.weWinAudio,
        },
      },
    ],

    P4: [
      {
        step1: {
          allwords: [{ img: "textbookImg", text: "Open Textbooks" }],
          audio: "openTextbookAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "textbookImg", text: "Open Textbooks" },
            { img: "classroomImg", text: "Classroom" },
            { img: "teacherImg", text: "Teacher" },
          ],
          correctWordTwo: "Open Textbooks",
          audio: "openTextbookAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "listenImg", text: "Listen Carefully" }],
          audio: "listenAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "listenImg", text: "Listen Carefully" },
            { img: "blackboardImg", text: "Blackboard" },
            { img: "notebookImg", text: "Notebook" },
          ],
          correctWordTwo: "Listen Carefully",
          audio: "listenAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "raiseHandImg", text: "Raise Hand" }],
          audio: "raiseHandAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "raiseHandImg", text: "Raise Hand" },
            { img: "deskImg", text: "Desk" },
            { img: "studentImg", text: "Students" },
          ],
          correctWordTwo: "Raise Hand",
          audio: "raiseHandAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "workPairImg", text: "Work in Pairs" }],
          audio: "workPairAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "workPairImg", text: "Work in Pairs" },
            { img: "exerciseImg", text: "Exercise" },
            { img: "classroomImg", text: "Classroom" },
          ],
          correctWordTwo: "Work in Pairs",
          audio: "workPairAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "writeDateImg", text: "Write Date" }],
          audio: "writeDateAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "writeDateImg", text: "Write Date" },
            { img: "notebookImg", text: "Notebook" },
            { img: "penImg", text: "Pen" },
          ],
          correctWordTwo: "Write Date",
          audio: "writeDateAudio",
        },
      },
    ],

    P3: [
      {
        step1: {
          allwords: [{ img: "schoolCourtyardImg", text: "Open Courtyard" }],
          audio: "schoolCourtyardAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "schoolCourtyardImg", text: "School Courtyard" },
            { img: "busImg", text: "Bus" },
            { img: "lunchBoxImg", text: "Lunch Box" },
          ],
          correctWordTwo: "School Courtyard",
          audio: "schoolCourtyardAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "busImg", text: "Open Bus" }],
          audio: "busAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "ticketImg", text: "Ticket" },
            { img: "busImg", text: "Bus" },
            { img: "trainImg", text: "Train" },
          ],
          correctWordTwo: "Bus",
          audio: "busAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "airplaneImg", text: "Airplane" }],
          audio: "airplaneAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "airplaneImg", text: "Airplane" },
            { img: "boardingPassImg", text: "Boarding Pass" },
            { img: "trainStationImg", text: "Train Station" },
          ],
          correctWordTwo: "Airplane",
          audio: "airplaneAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
          audio: "discountTagAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "shoppingCartImg", text: "Shopping Cart" },
            { img: "discountTagImg", text: "Discount Tag" },
            { img: "restaurantImg", text: "Restaurant" },
          ],
          correctWordTwo: "Discount Tag",
          audio: "discountTagAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
          audio: "exitSignAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "hospitalImg", text: "Hospital" },
            { img: "exitSignImg", text: "Exit Sign" },
            { img: "ambulanceImg", text: "Ambulance" },
          ],
          correctWordTwo: "Exit Sign",
          audio: "exitSignAudio",
        },
      },
    ],

    P7: [
      {
        step1: {
          allwords: [{ img: "discountTagImg", text: "Discount Tag" }],
          audio: "discountTagAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "fruitsImg", text: "Fruits" },
            { img: "vegetablesImg", text: "Vegetables" },
            { img: "discountTagImg", text: "Discount Tag" },
          ],
          correctWordTwo: "Discount Tag",
          audio: "discountTagAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "salmonDishImg", text: "Grilled Salmon" }],
          audio: "grilledSalmonAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "salmonDishImg", text: "Grilled Salmon" },
            { img: "potatoesImg", text: "Mashed Potatoes" },
            { img: "restaurantImg", text: "Restaurant" },
          ],
          correctWordTwo: "Grilled Salmon",
          audio: "grilledSalmonAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "exitSignImg", text: "Exit Sign" }],
          audio: "libraryClosingAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "libraryImg", text: "Library" },
            { img: "bookImg", text: "Book" },
            { img: "exitSignImg", text: "Exit Sign" },
          ],
          correctWordTwo: "Exit Sign",
          audio: "libraryClosingAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "trainImg", text: "Train" }],
          audio: "trainArrivalAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "trainImg", text: "Train" },
            { img: "platformImg", text: "Platform" },
            { img: "ticketImg", text: "Ticket" },
          ],
          correctWordTwo: "Train",
          audio: "trainArrivalAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "concertStageImg", text: "Concert Stage" }],
          audio: "concertAnnouncementAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "audienceImg", text: "Audience" },
            { img: "concertStageImg", text: "Concert Stage" },
            { img: "TelephoneNewImg", text: "Mobile Phone" },
          ],
          correctWordTwo: "Concert Stage",
          audio: "concertAnnouncementAudio",
        },
      },
    ],

    P8: [
      {
        step1: {
          allwords: [
            { img: "underlineImg", text: "Underline Important Points" },
          ],
          audio: "underlineAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "underlineImg", text: "Underline Important Points" },
            { img: "sitProperlyImg", text: "Sit Properly" },
            { img: "notebookImg", text: "Notebook" },
          ],
          correctWordTwo: "Notebook",
          audio: "underlineAudio",
        },
      },
      {
        step1: {
          allwords: [
            { img: "readInstructionsImg", text: "Read Instructions Carefully" },
          ],
          audio: "readInstructionsAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "pencilImg", text: "Question Paper" },
            { img: "penImg", text: "Pen" },
            { img: "readInstructionsImg", text: "Read Instructions Carefully" },
          ],
          correctWordTwo: "Read Instructions Carefully",
          audio: "readInstructionsAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "sitProperlyImg", text: "Sit Properly" }],
          audio: "sitProperlyAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "sitProperlyImg", text: "Sit Properly" },
            { img: "deskImg", text: "Desk" },
            { img: "pillowImg", text: "Pillow" },
          ],
          correctWordTwo: "Sit Properly",
          audio: "sitProperlyAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "notebookImg", text: "Take Out Notebooks" }],
          audio: "noteBookAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "penImg", text: "Pen" },
            { img: "notebookImg", text: "Take Out Notebooks" },
            { img: "textbookImg", text: "Textbook" },
          ],
          correctWordTwo: "Take Out Notebooks",
          audio: "noteBookAudio",
        },
      },
      {
        step1: {
          allwords: [{ img: "submitHomeworkImg", text: "Submit Homework" }],
          audio: "submitHomeworkAudio",
        },
        step2: {
          allwordsTwo: [
            { img: "submitHomeworkImg", text: "Submit Homework" },
            { img: "bellImg", text: "Bell" },
            { img: "questionPaperImg", text: "Teacher’s Desk" },
          ],
          correctWordTwo: "Submit Homework",
          audio: "submitHomeworkAudio",
        },
      },
    ],
  };

  //const levelData = content?.[currentLevel][currentWordIndex][currentSteps];
  const levelData = content?.[currentLevel]?.[currentWordIndex]?.[currentSteps];

  console.log("dataP410", levelData, currentLevel);

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

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);
    console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      currentSteps === "step1"
        ? levelData?.allwords[0]?.text
        : levelData?.correctWordTwo,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      responseText?.responseText || ""
    );
  };

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      startAudioRecording();
      setIsRecordingStopped(false);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setIsRecording(false);
      stopAudioRecording();
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
      callTelemetry();
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
      callTelemetry();
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
  const [audioInstance, setAudioInstance] = useState(null);

  const handleMicClick2 = () => {
    if (!isRecording2) {
      setIsRecording2(true);
      startAudioRecording();
      setIsRecordingStopped2(false);
    } else {
      setIsRecording2(false);
      stopAudioRecording();
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
    if (isPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsPlaying(false);
    } else {
      const audioElement = new Audio(
        level === 3
          ? levelData?.audio
          : getAssetAudioUrl(s3Assets[levelData?.audio]) ||
            Assets[levelData?.audio]
      );
      audioElement.play();
      setAudioInstance(audioElement);
      setIsPlaying(true);
      audioElement.onended = () => {
        setIsPlaying(false);
      };
    }
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
            height: "100%",
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
              padding: "50px 0px",
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
                      {isPlaying ? (
                        <Box
                          sx={{
                            marginTop: "7px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: { xs: "50px", sm: "60px", md: "70px" },
                            cursor: "pointer",
                          }}
                          onClick={playAudio2}
                        >
                          <StopButton height={45} width={45} />
                        </Box>
                      ) : (
                        <Box
                          //className="walkthrough-step-1"
                          sx={{
                            marginTop: "7px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: { xs: "50px", sm: "60px", md: "70px" },
                            cursor: "pointer",
                            //cursor: `url(${clapImage}) 32 24, auto`,
                          }}
                          onClick={playAudio2}
                        >
                          <ListenButton height={50} width={50} />
                        </Box>
                      )}
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
                            src={
                              level === 3
                                ? item.img
                                : getAssetUrl(s3Assets[item.img]) ||
                                  Assets[item.img]
                            }
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
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
                      </div>
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
                        {isPlaying ? (
                          <Box
                            sx={{
                              marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: "pointer",
                            }}
                            onClick={playAudio2}
                          >
                            <StopButton height={45} width={45} />
                          </Box>
                        ) : (
                          <Box
                            //className="walkthrough-step-1"
                            sx={{
                              marginTop: "7px",
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "50px", sm: "60px", md: "70px" },
                              cursor: "pointer",
                              //cursor: `url(${clapImage}) 32 24, auto`,
                            }}
                            onClick={playAudio2}
                          >
                            <ListenButton height={50} width={50} />
                          </Box>
                        )}
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
                                level === 3
                                  ? levelData?.allwordsTwo.find(
                                      (item) =>
                                        item.text === levelData?.correctWordTwo
                                    ).img
                                  : getAssetUrl(
                                      s3Assets[
                                        levelData?.allwordsTwo.find(
                                          (item) =>
                                            item.text ===
                                            levelData?.correctWordTwo
                                        ).img
                                      ]
                                    ) ||
                                    Assets[
                                      levelData?.allwordsTwo.find(
                                        (item) =>
                                          item.text ===
                                          levelData?.correctWordTwo
                                      ).img
                                    ]
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
                                  src={
                                    level === 3
                                      ? item.img
                                      : getAssetUrl(s3Assets[item.img]) ||
                                        Assets[item.img]
                                  }
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
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
                      </div>
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
