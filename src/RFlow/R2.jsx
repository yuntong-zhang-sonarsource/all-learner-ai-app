import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import * as s3Assets from "../utils/s3Links";
import { getAssetUrl } from "../utils/s3Links";
import { getAssetAudioUrl } from "../utils/s3Links";
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

// const content = {
//   L1: [
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.panRImg,
//         type: "text",
//       },
//       answer: "panRAudio",
//       options: [
//         { id: "panRAudio", value: "panRAudio", type: "audio" },
//         { id: "dogR1OneAudio", value: "dogR1OneAudio", type: "audio" },
//         { id: "capR1OneAudio", value: "capR1OneAudio", type: "audio" },
//       ],
//       flowName: "P1",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.batRImg,
//         type: "text",
//       },
//       answer: "batRAudio",
//       options: [
//         { id: "eggR1OneAudio", value: "eggR1OneAudio", type: "audio" },
//         { id: "batRAudio", value: "batRAudio", type: "audio" },
//         { id: "nestR1OneAudio ", value: "nestR1OneAudio", type: "audio" },
//       ],
//       flowName: "P2",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.puzzleRImg,
//         type: "text",
//       },
//       answer: "puzzleRAudio",
//       options: [
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "dogR1OneAudio", value: "dogR1OneAudio", type: "audio" },
//         { id: "puzzleRAudio", value: "puzzleRAudio", type: "audio" },
//       ],
//       flowName: "P3",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.lemonRImg,
//         type: "text",
//       },
//       answer: "lemonRAudio",
//       options: [
//         { id: "vanR1OneAudio", value: "vanR1OneAudio", type: "audio" },
//         { id: "lemonRAudio", value: "lemonRAudio", type: "audio" },
//         { id: "bellR1OneAudio", value: "bellR1OneAudio", type: "audio" },
//       ],
//       flowName: "P4",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.kingRImg,
//         type: "text",
//       },
//       answer: "kingRAudio",
//       options: [
//         { id: "kingRAudio", value: "kingRAudio", type: "audio" },
//         { id: "capR1OneAudio", value: "capR1OneAudio", type: "audio" },
//         { id: "vanR1OneAudio", value: "vanR1OneAudio", type: "audio" },
//       ],
//       flowName: "P5",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.ladderRImg,
//         type: "text",
//       },
//       answer: "ladderRAudio",
//       options: [
//         { id: "maskR1OneAudio", value: "maskR1OneAudio", type: "audio" },
//         { id: "jugR1OneAudio", value: "jugR1OneAudio", type: "audio" },
//         { id: "ladderRAudio", value: "ladderRAudio", type: "audio" },
//       ],
//       flowName: "P6",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.drumRImg,
//         type: "text",
//       },
//       answer: "drumRAudio",
//       options: [
//         { id: "goatR1OneAudio", value: "goatR1OneAudio", type: "audio" },
//         { id: "fanR1OneAudio", value: "fanR1OneAudio", type: "audio" },
//         { id: "drumRAudio", value: "drumRAudio", type: "audio" },
//       ],
//       flowName: "P7",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.coffeeRImg,
//         type: "text",
//       },
//       answer: "coffeeRAudio",
//       options: [
//         { id: "coffeeRAudio", value: "coffeeRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "appleR1OneAudio", value: "appleR1OneAudio", type: "audio" },
//       ],
//       flowName: "P8",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.busRImg,
//         type: "text",
//       },
//       answer: "busRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "busRAudio", value: "busRAudio", type: "audio" },
//         { id: "appleR1OneAudio", value: "appleR1OneAudio", type: "audio" },
//       ],
//       flowName: "P9",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.graphRImg,
//         type: "text",
//       },
//       answer: "graphRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "graphRAudio", value: "graphRAudio", type: "audio" },
//       ],
//       flowName: "P10",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.ovenRImg,
//         type: "text",
//       },
//       answer: "ovenRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "ovenRAudio", value: "ovenRAudio", type: "audio" },
//       ],
//       flowName: "P11",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.tableRImg,
//         type: "text",
//       },
//       answer: "tableRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "tableRAudio", value: "tableRAudio", type: "audio" },
//       ],
//       flowName: "P12",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.basketRImg,
//         type: "text",
//       },
//       answer: "basketRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "basketRAudio", value: "basketRAudio", type: "audio" },
//       ],
//       flowName: "P13",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.cardRImg,
//         type: "text",
//       },
//       answer: "cardRAudio",
//       options: [
//         { id: "cardRAudio", value: "cardRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "appleR1OneAudio", value: "appleR1OneAudio", type: "audio" },
//       ],
//       flowName: "P14",
//     },
//     {
//       question: {
//         text: "Which fruit has red color?",
//         img: Assets.frogRImg,
//         type: "text",
//       },
//       answer: "frogRAudio",
//       options: [
//         { id: "frogRAudio", value: "frogRAudio", type: "audio" },
//         { id: "ropeR1OneAudio", value: "ropeR1OneAudio", type: "audio" },
//         { id: "appleR1OneAudio", value: "appleR1OneAudio", type: "audio" },
//       ],
//       flowName: "P15",
//     },
//   ],
// };

const content = {
  L1: [
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.panRImg) || Assets.panRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.panRAudio) || Assets.panRAudio,
      options: [
        {
          id: "panRAudio",
          value: getAssetAudioUrl(s3Assets.panRAudio) || Assets.panRAudio,
          type: "audio",
        },
        {
          id: "dogR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.dogR1OneAudio) || Assets.dogR1OneAudio,
          type: "audio",
        },
        {
          id: "capR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.capR1OneAudio) || Assets.capR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P1",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.batRImg) || Assets.batRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.batRAudio) || Assets.batRAudio,
      options: [
        {
          id: "eggR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.eggR1OneAudio) || Assets.eggR1OneAudio,
          type: "audio",
        },
        {
          id: "batRAudio",
          value: getAssetAudioUrl(s3Assets.batRAudio) || Assets.batRAudio,
          type: "audio",
        },
        {
          id: "nestR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.nestR1OneAudio) || Assets.nestR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P2",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.puzzleRImg) || Assets.puzzleRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.puzzleRAudio) || Assets.puzzleRAudio,
      options: [
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "dogR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.dogR1OneAudio) || Assets.dogR1OneAudio,
          type: "audio",
        },
        {
          id: "puzzleRAudio",
          value: getAssetAudioUrl(s3Assets.puzzleRAudio) || Assets.puzzleRAudio,
          type: "audio",
        },
      ],
      flowName: "P3",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.lemonRImg) || Assets.lemonRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.lemonRAudio) || Assets.lemonRAudio,
      options: [
        {
          id: "vanR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.vanR1OneAudio) || Assets.vanR1OneAudio,
          type: "audio",
        },
        {
          id: "lemonRAudio",
          value: getAssetAudioUrl(s3Assets.lemonRAudio) || Assets.lemonRAudio,
          type: "audio",
        },
        {
          id: "bellR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.bellR1OneAudio) || Assets.bellR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P4",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.kingRImg) || Assets.kingRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.kingRAudio) || Assets.kingRAudio,
      options: [
        {
          id: "kingRAudio",
          value: getAssetAudioUrl(s3Assets.kingRAudio) || Assets.kingRAudio,
          type: "audio",
        },
        {
          id: "capR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.capR1OneAudio) || Assets.capR1OneAudio,
          type: "audio",
        },
        {
          id: "vanR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.vanR1OneAudio) || Assets.vanR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P5",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.ladderRImg) || Assets.ladderRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.ladderRAudio) || Assets.ladderRAudio,
      options: [
        {
          id: "maskR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.maskR1OneAudio) || Assets.maskR1OneAudio,
          type: "audio",
        },
        {
          id: "jugR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.jugR1OneAudio) || Assets.jugR1OneAudio,
          type: "audio",
        },
        {
          id: "ladderRAudio",
          value: getAssetAudioUrl(s3Assets.ladderRAudio) || Assets.ladderRAudio,
          type: "audio",
        },
      ],
      flowName: "P6",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.drumRImg) || Assets.drumRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.drumRAudio) || Assets.drumRAudio,
      options: [
        {
          id: "goatR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.goatR1OneAudio) || Assets.goatR1OneAudio,
          type: "audio",
        },
        {
          id: "fanR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.fanR1OneAudio) || Assets.fanR1OneAudio,
          type: "audio",
        },
        {
          id: "drumRAudio",
          value: getAssetAudioUrl(s3Assets.drumRAudio) || Assets.drumRAudio,
          type: "audio",
        },
      ],
      flowName: "P7",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.coffeeRImg) || Assets.coffeeRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.coffeeRAudio) || Assets.coffeeRAudio,
      options: [
        {
          id: "coffeeRAudio",
          value: getAssetAudioUrl(s3Assets.coffeeRAudio) || Assets.coffeeRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "appleR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.appleR1OneAudio) ||
            Assets.appleR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P8",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.busRImg) || Assets.busRImg,
        type: "text",
      },
      answer: Assets.busRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        { id: "busRAudio", value: Assets.busRAudio, type: "audio" },
        {
          id: "appleR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.appleR1OneAudio) ||
            Assets.appleR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P9",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: Assets.graphRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.graphRAudio) || Assets.graphRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "graphRAudio",
          value: getAssetAudioUrl(s3Assets.graphRAudio) || Assets.graphRAudio,
          type: "audio",
        },
      ],
      flowName: "P10",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.ovenRImg) || Assets.ovenRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.ovenRAudio) || Assets.ovenRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "ovenRAudio",
          value: getAssetAudioUrl(s3Assets.ovenRAudio) || Assets.ovenRAudio,
          type: "audio",
        },
      ],
      flowName: "P11",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.tableRImg) || Assets.tableRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.tableRAudio) || Assets.tableRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "tableRAudio",
          value: getAssetAudioUrl(s3Assets.tableRAudio) || Assets.tableRAudio,
          type: "audio",
        },
      ],
      flowName: "P12",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.basketRImg) || Assets.basketRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.basketRAudio) || Assets.basketRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "basketRAudio",
          value: getAssetAudioUrl(s3Assets.basketRAudio) || Assets.basketRAudio,
          type: "audio",
        },
      ],
      flowName: "P13",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.cardRImg) || Assets.cardRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
      options: [
        {
          id: "cardRAudio",
          value: getAssetAudioUrl(s3Assets.cardRAudio) || Assets.cardRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "appleR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.appleR1OneAudio) ||
            Assets.appleR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P14",
    },
    {
      question: {
        text: "Which fruit has red color?",
        img: getAssetUrl(s3Assets.frogRImg) || Assets.frogRImg,
        type: "text",
      },
      answer: getAssetAudioUrl(s3Assets.frogRAudio) || Assets.frogRAudio,
      options: [
        {
          id: "frogRAudio",
          value: getAssetAudioUrl(s3Assets.frogRAudio) || Assets.frogRAudio,
          type: "audio",
        },
        {
          id: "ropeR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          type: "audio",
        },
        {
          id: "appleR1OneAudio",
          value:
            getAssetAudioUrl(s3Assets.appleR1OneAudio) ||
            Assets.appleR1OneAudio,
          type: "audio",
        },
      ],
      flowName: "P15",
    },
  ],
};

const colors = ["#4CDAFE", "#FC8AFF", "#FFB213"];

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
  const [handPhase, setHandPhase] = useState("audio");
  const [audioInstance, setAudioInstance] = useState(null);
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) =>
  //       prev < content?.L1[currentQuestionIndex + 1]?.options.length - 1
  //         ? prev + 1
  //         : 0
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
      setProgress(0);
      handleAudioClick(selectedCheckbox);
      setShowNextButton(false);
    }
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const playAudio = (audioKey) => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (audioKey) {
      const audioElement = new Audio(audioKey);
      setHandPhase("audio");
      audioElement.play();
      setTimeout(() => {
        setHandPhase("checkbox");
      }, 1500);
      setAudioInstance(audioElement);
      setIsAudioPlaying(true);
      //audioElement.onended = () => setIsAudioPlaying(false);
      audioElement.onended = () => {
        setIsAudioPlaying(false);
        setTimeout(() => {
          setActiveIndex(
            (prev) =>
              (prev + 1) % content?.L1[currentQuestionIndex]?.options.length
          );
          setHandPhase("audio");
        }, 1500);
      };
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
    setActiveIndex(0);
    setHandPhase("audio");
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
                  height: "120px",
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
                      gap: "50px",
                      marginTop: "20px",
                    }}
                  >
                    {content?.L1[currentQuestionIndex]?.options.map(
                      (audio, index) => {
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
                                    selectedText === audio.value
                                      ? isMatch
                                        ? "#58CC02"
                                        : "#FF0000"
                                      : style.background,
                                  borderRadius: "50%",
                                  display: "flex",
                                  //border: "2px solid white",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  boxShadow:
                                    selectedText === audio.value
                                      ? "none"
                                      : style.boxShadow,
                                  cursor: "pointer",
                                  color: "#FFFFFF",
                                  filter:
                                    activeIndex !== index
                                      ? "brightness(50%)"
                                      : "none",
                                  transition: "filter 0.3s ease",
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
                                {/* {index + 1} */}
                              </div>
                            </div>
                            {/* <input
                              type="checkbox"
                              id={`checkbox-${audio.id}`}
                              checked={selectedCheckbox === audio.value}
                              onChange={() => handleCheckboxChange(audio.value)}
                              style={{
                                width: "60px",
                                height: "60px",
                                appearance: "none",
                                backgroundColor:
                                  selectedCheckbox === audio.value
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
                            /> */}
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor:
                                  selectedCheckbox === audio.value
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
                              onClick={() => handleCheckboxChange(audio.value)}
                            >
                              <input
                                type="checkbox"
                                id={`checkbox-${audio.id}`}
                                checked={selectedCheckbox === audio.value}
                                readOnly
                                style={{
                                  display: "none", // hide the native checkbox
                                }}
                              />
                              {/* {selectedCheckbox === audio.value && ( */}
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
                              {/* )} */}
                            </div>

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
                        );
                      }
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
