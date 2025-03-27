import React, { useState, useEffect, useRef } from "react";
import boyboxImg from "../../assets/boybox.svg";
import girlImg from "../../assets/girl.svg";
import girlboxImg from "../../assets/girlbox.svg";
import guyImg from "../../assets/guy.svg";
import mikeImg from "../../assets/mikee.svg";
import pauseImg from "../../assets/pausse.svg";
import effectImg from "../../assets/effects.svg";
import { practiceSteps, getLocalData } from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { trainStationImg } from "../../utils/imageAudioLinks";
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

const content = {
  conversation: [
    {
      speaker: "Good morning, dear! How can I help you?",
      user: "Good morning, sir. I need some potatoes",
    },
    { speaker: "How many kilos do you want?", user: "Two kilograms, please." },
    {
      speaker: "One kilo of potatoes costs Rs. 30.",
      user: "That’s fine. I also need half a kilo of carrots and beans.",
    },
    {
      speaker: "Anything else?",
      user: "No, that’s all. What is the total amount?",
    },
    {
      speaker: "The total amount is Rs. 100",
      user: "Here is the money. Thank you, sir.",
    },
  ],
};

const contentM13 = {
  14: {
    P3: {
      conversation: [
        {
          speaker: "What do you see in the market?",
          user: "I see colourful shops, sweets, and toys everywhere.",
        },
        {
          speaker: "What do you want to buy?",
          user: "I want to buy something special for my grandmother.",
        },
        {
          speaker: "Do you have a lot of money?",
          user: "No, I don’t have much money, but I will find something useful.",
        },
        {
          speaker: "What did you buy?",
          user: "I bought a pair of tongs for my grandmother.",
        },
        {
          speaker: "Why was your grandmother happy?",
          user: "She was very happy because now she won’t burn her hands while making chapatis.",
        },
      ],
    },
    P4: {
      conversation: [
        {
          speaker: "How are cricket and kabaddi different?",
          user: "Cricket is played with a bat and ball, but kabaddi is a physical game where players tag opponents and return to their side.",
        },
        {
          speaker: "Which sport do you like more and why?",
          user: "I like kabaddi more because it is fast and exciting.",
        },
        {
          speaker: "Where do we play cricket and kabaddi?",
          user: "Cricket is played on a large field, but kabaddi is played on a small court.",
        },
        {
          speaker: "What equipment do players use in cricket and kabaddi?",
          user: "Cricket players use bats, balls, and protective gear, but kabaddi players need no equipment.",
        },
        {
          speaker: "Why do people enjoy cricket and kabaddi?",
          user: "People enjoy cricket because it is strategic and thrilling, but kabaddi is loved for its speed and physical action.",
        },
      ],
    },
    S1: {
      conversation: [
        {
          speaker: "Which is your favourite season?",
          user: "My favourite season is winter.",
        },
        {
          speaker: "Why do you like this season?",
          user: "Because it is cold and comfortable.",
        },
        {
          speaker: "What kind of dress do you wear in this season?",
          user: "I wear jumpers, sweaters, and woollen clothes.",
        },
        {
          speaker: "How is this season different from other seasons?",
          user: "It is colder and more pleasant.",
        },
        { speaker: "When does this season occur?", user: "December, January." },
      ],
    },
    P7: {
      conversation: [
        {
          speaker: "Where are you going?",
          user: "I am going to the bazaar today.",
        },
        {
          speaker: "What do you want to buy?",
          user: "I need to buy some spices and slippers for my mother.",
        },
        {
          speaker: "Is someone going with you?",
          user: "No, I am going alone because Binya is busy at home.",
        },
        {
          speaker: "Who did you meet in the bazaar?",
          user: "I met my aunt, and she invited me for tea.",
        },
        {
          speaker: "What happened while you were returning home?",
          user: "Suddenly, the wind stopped, and the sky became very dark.",
        },
      ],
    },
    P8: {
      conversation: [
        {
          speaker: "How are dogs and cats different?",
          user: "Dogs are social and active, but cats are independent and quiet.",
        },
        {
          speaker: "Which pet do you like more and why?",
          user: "I like dogs more because they are friendly and loyal.",
        },
        {
          speaker: "How do we take care of dogs and cats?",
          user: "Dogs need daily walks and training, but cats need a litter box and a quiet space.",
        },
        {
          speaker: "What do dogs and cats eat?",
          user: "Dogs eat meat, kibble, and sometimes vegetables, but cats mostly eat meat and fish.",
        },
        {
          speaker: "Why do people like dogs and cats?",
          user: "People like dogs because they are loyal and protective, but cats are loved for being calm and independent.",
        },
      ],
    },
    S2: {
      conversation: [
        {
          speaker: "What is your favourite type of road transport?",
          user: "I like travelling by bus.",
        },
        {
          speaker: "Why do you like this type of transport?",
          user: "It is comfortable.",
        },
        { speaker: "How often do you travel using it?", user: "Every day." },
        {
          speaker: "Where do you usually go when you use this transport?",
          user: "To school.",
        },
        {
          speaker:
            "How is this transport different from other types of transport?",
          user: "It has fixed routes and stops.",
        },
      ],
    },
  },
};

const ActOutM13 = ({
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [girlState, setGirlState] = useState("mic");
  const [isComplete, setIsComplete] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({});

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

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    const finalTranscript = transcriptRef.current;
  };

  console.log("transcript", transcript, transcriptRef.current);

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data?.conversation || [];
  };

  steps = 1;

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

  console.log("levelM13", level, currentStep, currentLevel);

  useEffect(() => {
    setCurrentIndex(0);
    setIsComplete(false);
    setGirlState("mic");
  }, [currentLevel]);

  const handleMicClick = () => {
    setGirlState("pause");
    startRecording();
  };

  // const handlePauseClick = () => {
  //   let nextIndex = currentIndex + 1;
  //   if (nextIndex < conversation.length) {
  //     setCurrentIndex(nextIndex);
  //     setGirlState("mic");
  //     handleNext();
  //   } else {
  //     setIsComplete(true);
  //   }
  // };

  const handlePauseClick = async () => {
    stopRecording();

    let nextIndex = currentIndex + 1;

    if (currentLevel === "S1" || currentLevel === "S2") {
      const teacherText = conversation[currentIndex].user;
      const studentText = transcript;

      const formData = new FormData();
      formData.append("teacherText", teacherText);
      formData.append("studentText", studentText);

      try {
        const response = await fetch(
          "https://dev-ekstep-tell-ocr-service-985885894164.asia-south1.run.app/api/v1/ocr/gemini/evaluateText",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        console.log("API Response:", result);

        const responseText =
          result?.responseObj?.responseDataParams?.data || "";
        const marksMatch = responseText.match(/- \*\*Marks:\*\* (\d+)\/\d+/);
        const feedbackMatch = responseText.match(/- \*\*Feedback:\*\* (.+)/);

        const score = marksMatch ? parseInt(marksMatch[1]) : 0;
        const feedback = feedbackMatch
          ? feedbackMatch[1].trim()
          : "No feedback provided";

        setEvaluationResults((prev) => ({
          ...prev,
          [currentIndex]: { score, feedback },
        }));

        console.log("Stored Evaluation:", { score, feedback });
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }

    if (nextIndex < conversation.length) {
      setCurrentIndex(nextIndex);
      setGirlState("mic");
      handleNext();
    } else {
      setIsComplete(true);
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#D9B4F3",
        }}
      >
        {!isComplete && (
          <div
            style={{
              width: "90%",
              height: "70%",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={guyImg}
                  alt="Market Vendor"
                  style={{ width: "470px", marginTop: "40px", height: "400px" }}
                />
                <img
                  src={boyboxImg}
                  alt="Speech Bubble"
                  style={{
                    position: "absolute",
                    top: "46px",
                    left: "90%",
                    transform: "translateX(-50%)",
                    width: "220px",
                  }}
                />
                <p
                  style={{
                    position: "absolute",
                    top: "75px",
                    left: "80%",
                    fontSize: "13px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {conversation[currentIndex]?.speaker}
                </p>
              </div>
              <div style={{ position: "relative" }}>
                <img
                  src={girlImg}
                  alt="Girl"
                  style={{
                    width: "155px",
                    marginTop: "170px",
                    marginRight: "100px",
                  }}
                />
                <img
                  src={girlboxImg}
                  alt="Speech Bubble"
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "10%",
                    transform: "translateX(-50%)",
                    width: "260px",
                  }}
                />
                {currentLevel !== "S1" && currentLevel !== "S2" && (
                  <p
                    style={{
                      position: "absolute",
                      top: "40px",
                      left: "10%",
                      transform: "translateX(-50%)",
                      fontSize: "13px",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "180px",
                      wordWrap: "break-word",
                    }}
                  >
                    {conversation[currentIndex]?.user}
                  </p>
                )}
                <div
                  style={{
                    position: "absolute",
                    top:
                      currentLevel === "S1" || currentLevel === "S2"
                        ? "80px"
                        : "120px",
                    left: "5%",
                  }}
                >
                  {girlState === "mic" && (
                    <img
                      src={mikeImg}
                      alt="Microphone"
                      onClick={handleMicClick}
                      style={{
                        width: "32px",
                        cursor: "pointer",
                        position: "relative",
                        marginBottom: "100px",
                      }}
                    />
                  )}
                  {girlState === "pause" && (
                    <div
                      onClick={handlePauseClick}
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <img
                        src={pauseImg}
                        alt="Pause"
                        style={{ width: "33px" }}
                      />
                      <img
                        src={effectImg}
                        alt="Effect"
                        style={{
                          position: "absolute",
                          top: "-26px",
                          left: "40%",
                          transform: "translateX(-50%)",
                          width: "112px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {isComplete && (
          <div
            style={{
              width: "90%",
              height: "70%",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1>Conversation Complete!</h1>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ActOutM13;
