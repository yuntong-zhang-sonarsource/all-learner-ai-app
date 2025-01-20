import React, { useEffect, useState } from "react";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";
import { useNavigate } from "react-router-dom";
import {
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  setLocalData,
} from "../../utils/constants";
import axios from "axios";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { splitGraphemes } from "split-graphemes";
import { Typography } from "@mui/material";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../../components/Assesment/Assesment";
import { Log } from "../../services/telementryService";
import Mechanics6 from "../../components/Practice/Mechanics6";
import Mechanics7 from "../../components/Practice/Mechanics7";
import Tiger from "../../assets/Tiger.svg";
import Pencil from "../../assets/pencil.svg";
import Rocket from "../../assets/rocket.svg";
import Rabbit from "../../assets/rabbit.svg";
import Apple from "../../assets/Apple.svg";
import Banana from "../../assets/Banana.svg";
import Tomato from "../../assets/Tomato.svg";
import Orange from "../../assets/orange.svg";
import Table from "../../assets/Table.svg";
import Lemon from "../../assets/Lemon.svg";
import Basket from "../../assets/Basket.svg";
import Tunnel from "../../assets/Tunnel.svg";
import Sunset from "../../assets/Sunset.svg";
import Candle from "../../assets/Candle.svg";
import Button from "../../assets/Button.svg";
import Tablet from "../../assets/Tablet.svg";
import Pocket from "../../assets/Pocket.svg";
import Picnic from "../../assets/Picnic.svg";
import Kitten from "../../assets/Kitten.svg";
import Jacket from "../../assets/Jacket.svg";
import Ti from "../../assets/Ti.wav";
import Ger from "../../assets/ger.wav";
import Pen from "../../assets/Pen.wav";
import Cil from "../../assets/cil.wav";
import Rab from "../../assets/Rab.wav";
import Bit from "../../assets/bit.wav";
import Rock from "../../assets/Rock.wav";
import Et from "../../assets/et.wav";
import Ap from "../../assets/Ap.wav";
import Ple from "../../assets/ple.wav";
import Ba from "../../assets/Ba.wav";
import Nana from "../../assets/Na.wav";
import To from "../../assets/To.wav";
import Ma from "../../assets/ma.wav";
import Or from "../../assets/Or.wav";
import Ange from "../../assets/ange.wav";
import Ta from "../../assets/Ta.wav";
import Ble from "../../assets/ble.wav";
import Le from "../../assets/Le.wav";
import Mon from "../../assets/mon.wav";
import Bas from "../../assets/Bas.wav";
import Ket from "../../assets/ket.wav";
import Tun from "../../assets/Tun.wav";
import Nel from "../../assets/nel.wav";
import Sun from "../../assets/Sun.wav";
import Set from "../../assets/set.wav";
import Can from "../../assets/Can.wav";
import Dle from "../../assets/dle.wav";
import But from "../../assets/But.wav";
import Ton from "../../assets/ton.wav";
import Tab from "../../assets/Tab.wav";
import Let from "../../assets/let.wav";
import Pic from "../../assets/Pic.wav";
import Nic from "../../assets/nic.wav";
import Kit from "../../assets/Kit.wav";
import Ten from "../../assets/ten.wav";
import Jack from "../../assets/Jack.wav";
import Pock from "../../assets/Pock.wav";
import TigerS from "../../assets/Tiger.wav";
import PencilS from "../../assets/Pencil.wav";
import RabbitS from "../../assets/Rabbit.wav";
import RocketS from "../../assets/Rocket.wav";
import AppleS from "../../assets/Apple.wav";
import BananaS from "../../assets/Banana.wav";
import TomatoS from "../../assets/Tomato.wav";
import OrangeS from "../../assets/Orange.wav";
import TableS from "../../assets/Table.wav";
import LemonS from "../../assets/Lemon.wav";
import BasketS from "../../assets/Basket.wav";
import TunnelS from "../../assets/Tunnel.wav";
import SunsetS from "../../assets/Sunset.wav";
import CandleS from "../../assets/Candle.wav";
import ButtonS from "../../assets/Button.wav";
import TabletS from "../../assets/Tablet.wav";
import PicnicS from "../../assets/Picnic.wav";
import KittenS from "../../assets/Kitten.wav";
import JacketS from "../../assets/Jacket.wav";
import PocketS from "../../assets/Pocket.wav";
import { PutBucketInventoryConfigurationRequestFilterSensitiveLog } from "@aws-sdk/client-s3";
import usePreloadAudio from "../../hooks/usePreloadAudio";

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [parentWords, setParentWords] = useState({});
  const [levelOneWord, setLevelOneWord] = useState("");
  const [level, setLevel] = useState(0);
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  const limit = 5;
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");

  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const lang = getLocalData("lang");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [fluency, setFluency] = useState(false);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);

  const levels = {
    L1: [
      {
        completeWord: "Tiger",
        syllable: ["Ti", "ger"],
        img: Tiger,
        syllablesAudio: [
          { name: "Ti", audio: Ti },
          { name: "Ger", audio: Ger },
        ],
        completeAudio: TigerS,
      },
      {
        completeWord: "Pencil",
        syllable: ["Pen", "cil"],
        img: Pencil,
        syllablesAudio: [
          { name: "Pen", audio: Pen },
          { name: "Cil", audio: Cil },
        ],
        completeAudio: PencilS,
      },
      {
        completeWord: "Rabbit",
        syllable: ["Rab", "bit"],
        img: Rabbit,
        syllablesAudio: [
          { name: "Rab", audio: Rab },
          { name: "Bit", audio: Bit },
        ],
        completeAudio: RabbitS,
      },
      {
        completeWord: "Rocket",
        syllable: ["Rock", "et"],
        img: Rocket,
        syllablesAudio: [
          { name: "Rock", audio: Rock },
          { name: "Et", audio: Et },
        ],
        completeAudio: RocketS,
      },
      {
        completeWord: "Apple",
        syllable: ["Ap", "ple"],
        img: Apple,
        syllablesAudio: [
          { name: "Ap", audio: Ap },
          { name: "Ple", audio: Ple },
        ],
        completeAudio: AppleS,
      },
    ],
    L2: [
      {
        completeWord: "Candle",
        syllable: ["Can", "dle"],
        img: Candle,
        syllablesAudio: [
          { name: "Can", audio: Can },
          { name: "Dle", audio: Dle },
        ],
        completeAudio: CandleS,
      },
      {
        completeWord: "Tablet",
        syllable: ["Tab", "let"],
        img: Tablet,
        syllablesAudio: [
          { name: "Tab", audio: Tab },
          { name: "Let", audio: Let },
        ],
        completeAudio: TabletS,
      },
      {
        completeWord: "Orange",
        syllable: ["Or", "ange"],
        img: Orange,
        syllablesAudio: [
          { name: "Or", audio: Or },
          { name: "Ange", audio: Ange },
        ],
        completeAudio: OrangeS,
      },
      {
        completeWord: "Table",
        syllable: ["Ta", "ble"],
        img: Table,
        syllablesAudio: [
          { name: "Ta", audio: Ta },
          { name: "Ble", audio: Ble },
        ],
        completeAudio: TableS,
      },
      {
        completeWord: "Lemon",
        syllable: ["Le", "mon"],
        img: Lemon,
        syllablesAudio: [
          { name: "Le", audio: Le },
          { name: "Mon", audio: Mon },
        ],
        completeAudio: LemonS,
      },
    ],
    P1: [
      { completeWord: "Tiger", syllable: ["Ti", "ger"] },
      { completeWord: "Pencil", syllable: ["Pen", "cil"] },
      { completeWord: "Rocket", syllable: ["Rock", "et"] },
      { completeWord: "Banana", syllable: ["Ba", "na", "na"] },
      { completeWord: "Orange", syllable: ["Or", "ange"] },
    ],
    P2: [
      { completeWord: "Rabbit", syllable: ["Rab", "bit"] },
      { completeWord: "Table", syllable: ["Ta", "ble"] },
      { completeWord: "Lemon", syllable: ["Le", "mon"] },
      { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
      { completeWord: "Apple", syllable: ["Ap", "ple"] },
    ],
    S1: [
      { completeWord: "Tiger", syllable: ["Ti", "ger"] },
      { completeWord: "Rocket", syllable: ["Rock", "et"] },
      { completeWord: "Lemon", syllable: ["Le", "mon"] },
      { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
      { completeWord: "Mango", syllable: ["Man", "go"] },
    ],
    L3: [
      {
        completeWord: "Basket",
        syllable: ["Bas", "ket"],
        img: Basket,
        syllablesAudio: [
          { name: "Bas", audio: Bas },
          { name: "Ket", audio: Ket },
        ],
        completeAudio: BasketS,
      },
      {
        completeWord: "Tunnel",
        syllable: ["Tun", "nel"],
        img: Tunnel,
        syllablesAudio: [
          { name: "Tun", audio: Tun },
          { name: "Nel", audio: Nel },
        ],
        completeAudio: TunnelS,
      },
      {
        completeWord: "Sunset",
        syllable: ["Sun", "set"],
        img: Sunset,
        syllablesAudio: [
          { name: "Sun", audio: Sun },
          { name: "Set", audio: Set },
        ],
        completeAudio: SunsetS,
      },
      {
        completeWord: "Candle",
        syllable: ["Can", "dle"],
        img: Candle,
        syllablesAudio: [
          { name: "Can", audio: Can },
          { name: "Dle", audio: Dle },
        ],
        completeAudio: CandleS,
      },
      {
        completeWord: "Button",
        syllable: ["But", "ton"],
        img: Button,
        syllablesAudio: [
          { name: "But", audio: But },
          { name: "Ton", audio: Ton },
        ],
        completeAudio: ButtonS,
      },
    ],
    L4: [
      {
        completeWord: "Tablet",
        syllable: ["Tab", "let"],
        img: Tablet,
        syllablesAudio: [
          { name: "Tab", audio: Tab },
          { name: "Let", audio: Let },
        ],
        completeAudio: TabletS,
      },
      {
        completeWord: "Picnic",
        syllable: ["Pic", "nic"],
        img: Picnic,
        syllablesAudio: [
          { name: "Pic", audio: Pic },
          { name: "Nic", audio: Nic },
        ],
        completeAudio: PicnicS,
      },
      {
        completeWord: "Kitten",
        syllable: ["Kit", "ten"],
        img: Kitten,
        syllablesAudio: [
          { name: "Kit", audio: Kit },
          { name: "Ten", audio: Ten },
        ],
        completeAudio: KittenS,
      },
      {
        completeWord: "Jacket",
        syllable: ["Jack", "et"],
        img: Jacket,
        syllablesAudio: [
          { name: "Jack", audio: Jack },
          { name: "Et", audio: Et },
        ],
        completeAudio: JacketS,
      },
      {
        completeWord: "Pocket",
        syllable: ["Pock", "et"],
        img: Pocket,
        syllablesAudio: [
          { name: "Pock", audio: Pock },
          { name: "Et", audio: Et },
        ],
        completeAudio: PocketS,
      },
    ],
    P3: [
      { completeWord: "Basket", syllable: ["Bas", "ket"] },
      { completeWord: "Tunnel", syllable: ["Tun", "nel"] },
      { completeWord: "Sunset", syllable: ["Sun", "set"] },
      { completeWord: "Candle", syllable: ["Can", "dle"] },
      { completeWord: "Button", syllable: ["But", "ton"] },
    ],
    P4: [
      { completeWord: "Pocket", syllable: ["Pock", "et"] },
      { completeWord: "Dinner", syllable: ["Din", "ner"] },
      { completeWord: "Tunnel", syllable: ["Tun", "nel"] },
      { completeWord: "Sunset", syllable: ["Sun", "set"] },
      { completeWord: "Tablet", syllable: ["Tab", "let"] },
    ],
    S2: [
      { completeWord: "Basket", syllable: ["Bas", "ket"] },
      { completeWord: "Tablet", syllable: ["Tab", "let"] },
      { completeWord: "Sunset", syllable: ["Sun", "set"] },
      { completeWord: "Button", syllable: ["But", "ton"] },
      { completeWord: "Window", syllable: ["Win", "dow"] },
    ],
  };

  useEffect(() => {
    if (
      progressData?.currentPracticeStep !== undefined &&
      progressData?.currentPracticeStep !== null
    ) {
      const currentLevel =
        practiceSteps[progressData.currentPracticeStep]?.title;
      const currentImage =
        practiceSteps[progressData.currentPracticeStep]?.title;
      const levelData = levels[currentLevel];
      const levelImage = levels[currentImage];
      const currentWord = levelData[currentQuestion];

      setCurrentImage(levelImage[currentQuestion]);
      setParentWords(currentWord.syllable.join(" "));
      setLevelOneWord(levelImage[currentQuestion]?.completeWord);
    }
  }, [progressData]);

  const gameOver = (data, isUserPass) => {
    const userWon = isUserPass;
    const meetsFluencyCriteria = livesData?.meetsFluencyCriteria;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria });
  };

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);

  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);

  const callConfettiAndPlay = () => {
    const audio = new Audio(levelCompleteAudioSrc);
    audio.play();
    callConfetti();
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion === 0 &&
      !fromBack
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        setOpenMessageDialog({
          message: `You have successfully completed ${practiceSteps[currentPracticeStep].fullName} `,
        });
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setVoiceText("");
    }
  }, [voiceText]);

  const send = (score) => {
    if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
      window.parent.postMessage(
        {
          score: score,
          message: "all-test-rig-score",
        },
        "*"
      );
    }
  };

  const checkFluency = (contentType, fluencyScore) => {
    switch (contentType.toLowerCase()) {
      case "word":
        setFluency(fluencyScore < 2);
        break;
      case "sentence":
        setFluency(fluencyScore < 6);
        break;
      case "paragraph":
        setFluency(fluencyScore < 10);
        break;
      default:
        setFluency(true);
    }
  };

  const handleNext = async (isGameOver) => {
    setIsNextButtonCalled(true);
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress?.[virtualId]) {
        currentPracticeStep = practiceProgress[virtualId].currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      let newPracticeStep =
        currentQuestion === questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      newPracticeStep = Number(newPracticeStep);
      let newQuestionIndex =
        currentQuestion === questions.length - 1 ? 0 : currentQuestion + 1;

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[newPracticeStep]?.name
      );

      if (currentQuestion === questions.length - 1 || isGameOver) {
        let currentPracticeStep =
          practiceProgress[virtualId].currentPracticeStep;
        let isShowCase = currentPracticeStep === 4 || currentPracticeStep === 9; // P4 or P8

        if (localStorage.getItem("contentSessionId") !== null) {
          setPoints(1);
          if (isShowCase) {
            send(5);
          }
        } else {
          const pointsRes = await axios.post(
            `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_POINTER}`,
            {
              userId: localStorage.getItem("virtualId"),
              sessionId: localStorage.getItem("sessionId"),
              points: 1,
              language: lang,
              milestone: `m${level}`,
            }
          );
          setPoints(pointsRes?.data?.result?.totalLanguagePoints || 0);
        }

        if (isShowCase || isGameOver) {
          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await axios.post(
            `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
            {
              sub_session_id: sub_session_id,
              contentType: currentContentType,
              session_id: sessionId,
              user_id: virtualId,
              totalSyllableCount: totalSyllableCount,
              language: localStorage.getItem("lang"),
              is_mechanics: mechanism && mechanism?.id ? true : false,
            }
          );
          const { data: getSetData } = getSetResultRes;
          const data = JSON.stringify(getSetData?.data);
          Log(data, "practice", "ET");
          setPercentage(getSetData?.data?.percentage);
          checkFluency(currentContentType, getSetData?.data?.fluency);
          if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
            await axios.post(
              `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
              {
                userId: virtualId,
                sessionId: sessionId,
                subSessionId: sub_session_id,
                milestoneLevel: getSetData?.data?.currentLevel,
                totalSyllableCount: totalSyllableCount,
                language: localStorage.getItem("lang"),
              }
            );
          }
          setLocalData("previous_level", getSetData.data.previous_level);
          if (getSetData.data.sessionResult === "pass") {
            try {
              await axios.post(
                `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
                {
                  userId: virtualId,
                  sessionId: sessionId,
                  milestone: `practice`,
                  lesson: "0",
                  progress: 0,
                  language: lang,
                  milestoneLevel: getSetData.data.currentLevel,
                }
              );
              gameOver({ link: "/assesment-end" }, true);
              return;
            } catch (e) {
              // catch error
            }
          }
        }

        let quesArr = [];

        if (newPracticeStep === 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }

        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: `practice`,
            lesson: newPracticeStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );

        if (newPracticeStep === 0 || newPracticeStep === 5 || isGameOver) {
          gameOver();
          return;
        }
        const resGetContent = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
            (currentGetContent?.mechanism?.id
              ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
              : "") +
            (currentGetContent?.competency
              ? `&level_competency=${currentGetContent?.competency}`
              : "") +
            (currentGetContent?.tags
              ? `&tags=${currentGetContent?.tags}`
              : "") +
            (currentGetContent?.storyMode
              ? `&story_mode=${currentGetContent?.storyMode}`
              : "")
        );

        //TODO: required only for S1 and S2

        setTotalSyllableCount(resGetContent?.data?.totalSyllableCount);
        setLivesData({
          ...livesData,
          totalTargets: resGetContent?.data?.totalSyllableCount,
          targetsForLives:
            resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
          targetPerLive:
            (resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) /
            LIVES,
        });

        let showcaseLevel =
          currentPracticeStep === 3 || currentPracticeStep === 8;
        setIsShowCase(showcaseLevel);

        // TODO: API returns contents if 200 status
        quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
        setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
        setCurrentCollectionId(resGetContent?.data?.content?.[0]?.collectionId);

        // TODO: not required - not using this anywhere
        setAssessmentResponse(resGetContent);

        setCurrentQuestion(0);

        // TODO: not required - we are geting this data from API
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
        localStorage.setItem("storyTitle", resGetContent?.name);

        setQuestions(quesArr);

        // TODO: needs to revisit this logic
        setTimeout(() => {
          setMechanism(currentGetContent.mechanism);
        }, 1000);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    let audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
        )
      );
    });
  };

  const fetchDetails = async () => {
    let quesArr = [];
    try {
      setLoading(true);
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      let sessionId = getLocalData("sessionId");

      if (!sessionId) {
        sessionId = uniqueId();
        localStorage.setItem("sessionId", sessionId);
      }

      const getMilestoneDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
      );

      // TODO: validate the getMilestoneDetails API return

      setLocalData(
        "getMilestone",
        JSON.stringify({ ...getMilestoneDetails.data })
      );

      let level =
        Number(
          getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
        ) || 1;

      setLevel(level);

      const resLessons = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}/${virtualId}?language=${lang}`
      );

      // TODO: Handle Error for lessons - no lesson progress - starting point should be P1

      if (
        process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
        localStorage.getItem("contentSessionId") !== null
      ) {
        const getPointersDetails = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
        );

        // TODO: Just Opss icon - we are trying to fetch the score for you
        setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);
      }

      let userState = Number.isInteger(
        Number(resLessons.data?.result?.result?.lesson)
      )
        ? Number(resLessons.data?.result?.result?.lesson)
        : 0;

      // TODO: revisit this - looks like not required
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress: (userState / practiceSteps.length) * 100,
        currentPracticeStep: userState || 0,
      };

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[userState].name
      );

      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
          (currentGetContent?.mechanism?.id
            ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
            : "") +
          (currentGetContent?.competency
            ? `&level_competency=${currentGetContent?.competency}`
            : "") +
          (currentGetContent?.tags ? `&tags=${currentGetContent?.tags}` : "") +
          (currentGetContent?.storyMode
            ? `&story_mode=${currentGetContent?.storyMode}`
            : "")
      );

      // TODO: handle error if resWord is empty

      setTotalSyllableCount(resWord?.data?.totalSyllableCount);
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives:
          resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);

      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
      setAssessmentResponse(resWord);

      localStorage.setItem("storyTitle", resWord?.name);

      setQuestions(quesArr);
      setMechanism(currentGetContent.mechanism);

      let showcaseLevel = userState === 4 || userState === 9;
      setIsShowCase(showcaseLevel);
      if (showcaseLevel) {
        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: "showcase",
            lesson: userState,
            progress: 0,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );
      }

      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress[virtualId]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    localStorage.setItem("mechanism_id", (mechanism && mechanism.id) || "");
  }, [mechanism]);

  const handleBack = async () => {
    if (progressData.currentPracticeStep > 0) {
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const lang = getLocalData("lang");
      let practiceProgress = {};
      let newCurrentPracticeStep =
        progressData.currentPracticeStep === 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: virtualId,
          sessionId: sessionId,
          milestone: "practice",
          lesson: newCurrentPracticeStep,
          progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );

      setProgressData(practiceProgress[virtualId]);

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[newCurrentPracticeStep].name
      );
      let quesArr = [];
      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
          (currentGetContent?.mechanism?.id
            ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
            : "") +
          (currentGetContent?.competency
            ? `&level_competency=${currentGetContent?.competency}`
            : "") +
          (currentGetContent?.tags ? `&tags=${currentGetContent?.tags}` : "") +
          (currentGetContent?.storyMode
            ? `&story_mode=${currentGetContent?.storyMode}`
            : "")
      );
      setTotalSyllableCount(resWord?.data?.totalSyllableCount);
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives:
          resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);
      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
      setAssessmentResponse(resWord);

      localStorage.setItem("storyTitle", resWord?.name);
      setQuestions(quesArr);
      setTimeout(() => {
        setMechanism(currentGetContent.mechanism);
      }, 1000);
      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
  };

  useEffect(() => {
    if (livesData?.scoreData) {
      if (livesData?.redLivesToShow <= 0) {
        handleNext(true);
      }
    }
  }, [livesData]);

  function highlightWords(sentence, matchedChar, color) {
    const words = sentence.split(" ");
    matchedChar.sort(function (str1, str2) {
      return str2.length - str1.length;
    });

    let type = currentContentType?.toLowerCase();
    if (type === "char" || type === "word") {
      const word = splitGraphemes(words[0].toLowerCase()).filter(
        (item) => item !== "‌" && item !== "" && item !== " "
      );
      let highlightedString = [];
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length = splitGraphemes(matchedChar[j]).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                    fontWeight: 700,
                    fontFamily: "Quicksand",
                    lineHeight: "50px",
                    background: "#FFF0BD",
                    color: color,
                  }}
                >
                  {i === 0 ? substr.toUpperCase() : substr}
                </Typography>
              </React.Fragment>
            );
            i += length - 1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(
            <React.Fragment key={i}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: color,
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {i === 0 ? word[i].toUpperCase() : word[i]}
              </Typography>
            </React.Fragment>
          );
        }
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some((char) =>
          word.toLowerCase().includes(char)
        );
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <Typography
                variant="h5"
                component="h4"
                ml={1}
                sx={{
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                  background: "#FFF0BD",
                }}
              >
                {word}
              </Typography>{" "}
            </React.Fragment>
          );
        } else {
          return (
            <Typography
              variant="h5"
              component="h4"
              ml={1}
              sx={{
                color: "#333F61",
                fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                fontWeight: 700,
                fontFamily: "Quicksand",
                lineHeight: "50px",
              }}
              key={index}
            >
              {word + " "}
            </Typography>
          );
        }
      });
      return highlightedSentence;
    }
  }

  useEffect(() => {
    if (questions[currentQuestion]?.contentSourceData) {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        const contentSourceData =
          questions[currentQuestion]?.contentSourceData || [];
        const stringLengths = contentSourceData.map((item) => item.text.length);
        const length =
          questions[currentQuestion]?.mechanics_data &&
          (questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
            "mechanic_2" ||
            questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
              "mechanic_1")
            ? 500
            : stringLengths[0];
        window.parent.postMessage({ type: "stringLengths", length }, "*");
      }
    }
  }, [questions[currentQuestion]]);

  const renderMechanics = () => {
    if (!mechanism) {
      return (
        <WordsOrImage
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            words:
              level === 1
                ? levelOneWord
                : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            startShowCase,
            setStartShowCase,
            handleBack: !isShowCase && handleBack,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            loading,
            percentage,
            fluency,
            setOpenMessageDialog,
            setEnableNext,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "fillInTheBlank" && mechanism.id !== "") {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "formAWord2") {
      return (
        <Mechanics7
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (mechanism.name === "readTheImage") {
      const options = questions[currentQuestion]?.mechanics_data
        ? questions[currentQuestion]?.mechanics_data[0]?.options
        : [];
      const audioLink =
        options && options.length > 0
          ? options.find((option) => option.isAns === true)?.audio_url || null
          : null;

      const mechanics_data = questions[currentQuestion]?.mechanics_data;
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              "Look at the picture and speak the correct answer from below",
            parentWords: mechanics_data
              ? mechanics_data[0].text
              : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            question_audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                mechanics_data[0].audio_url
              : questions[currentQuestion]?.contentSourceData?.[0]?.audio_url,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            options: options,
            correctness: mechanics_data ? mechanics_data[0]?.correctness : null,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            image: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                mechanics_data[0]?.image_url
              : null,

            audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                audioLink
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "formASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: "Form a sentence using the words and speak",
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            jumbled_text:
              questions[currentQuestion]?.mechanics_data?.[0]?.jumbled_text,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            // image: elephant,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (
      mechanism.name === "audio" ||
      (mechanism.name === "fillInTheBlank" && mechanism.id === "")
    ) {
      return (
        <Mechanics6
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (page === 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
            setDisableScreen(false);
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {renderMechanics()}
    </>
  );
};

export default Practice;
