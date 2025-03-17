import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/readAloudLogo.svg";
import backgroundImg from "../../assets/readAloudBackground.svg";
import raMic from "../../assets/raMic.svg";
import raStop from "../../assets/raStop.svg";
import raRetry from "../../assets/raRetry.svg";
import raNext from "../../assets/raNext.svg";
import raWoodStand from "../../assets/raWoodStand.svg";
import raWave from "../../assets/raWave.svg";
import raStop2 from "../../assets/raStop2.svg";
import raSound from "../../assets/raSound.svg";
import raMic2 from "../../assets/raMic2.svg";
import raMonkey from "../../assets/raMonkey.svg";
import { practiceSteps, getLocalData } from "../../utils/constants";
import { Log } from "../../services/telementryService";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MainLayout from "../Layouts.jsx/MainLayout";

const content = {
  L1: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
  ],
  L2: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  P1: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  P2: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  S1: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  L3: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  L4: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  P3: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  P4: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
  S2: [
    [
      {
        text: "I love dosa and ice cream",
        questions: "What does the person like to eat?",
      },
      {
        text: "I like playing football",
        questions: "Which sport does the person enjoy?",
      },
      {
        text: "I don’t like spicy food and waking up early",
        questions: "What does the person dislike?",
      },
      {
        text: "I enjoy watching cartoons, I also love reading storybooks",
        questions: "How does the person spend their free time?",
      },
      {
        text: "My favourite colour is blue",
        questions: "What is the person’s favourite colour?",
      },
    ],
    [
      {
        text: "My best friend is Rahul",
        questions: "Who is the speaker’s best friend?",
      },
      {
        text: "He is tall and has short black hair",
        questions: "How does Rahul look?",
      },
      {
        text: "He is kind and funny",
        questions: "What kind of person is Rahul?",
      },
      {
        text: "We study in Government High School",
        questions: "Where does the speaker study?",
      },
      {
        text: "There is a library with many books",
        questions: "What can students find in the school library?",
      },
    ],
    [
      {
        text: "My name is Priya",
        questions: "What is the speaker's name?",
      },
      {
        text: "I have a small cat",
        questions: "What kind of pet does the speaker have?",
      },
      {
        text: "The cat is white and fluffy",
        questions: "How does the cat look?",
      },
      {
        text: "I like to play with my cat",
        questions: "What does the speaker like to do with the cat?",
      },
      {
        text: "My cat likes to sleep",
        questions: "What does the cat like to do?",
      },
    ],
  ],
};

const ReadAloud = ({
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
  const [step, setStep] = useState("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const utteranceRef = useRef(null);
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

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas?.[virtualId]) {
    currentPracticeStep = progressDatas[virtualId].currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.title || "L1";

  useEffect(() => {
    setCurrentQIndex(0);
  }, [currentLevel]);

  const allTexts = content[currentLevel][currentQIndex]
    ?.map((item) => item.text)
    .join(". ");
  const currentText =
    content[currentLevel][currentQIndex][currentIndex]?.text || "";
  const currentQuestion =
    content[currentLevel][currentQIndex][currentIndex]?.questions || "";

  console.log(
    "transcript",
    currentPracticeStep,
    currentLevel,
    evaluationResults
  );

  // const handleReadAloud = () => {
  //   if (utteranceRef.current) {
  //     window.speechSynthesis.cancel();
  //     utteranceRef.current = null;
  //     setHighlightedWord(null);
  //     setStep("stopped");
  //     return;
  //   }

  //   const utterance = new SpeechSynthesisUtterance(allTexts);
  //   utteranceRef.current = utterance;

  //   utterance.onboundary = (event) => {
  //     const charIndex = event.charIndex;
  //     //const words = allTexts?.split(" ");
  //     const words = allTexts.match(/\S+/g);
  //     let cumulativeLength = 0;
  //     for (let i = 0; i < words.length; i++) {
  //       cumulativeLength += words[i].length + 1;
  //       if (cumulativeLength > charIndex) {
  //         //setHighlightedWord(words[i]);
  //         setHighlightedWord(words[i].replace(/[^a-zA-Z0-9]/g, ""));
  //         break;
  //       }
  //     }
  //   };

  //   utterance.onend = () => {
  //     utteranceRef.current = null;
  //     setHighlightedWord(null);
  //     setStep("stopped");
  //   };

  //   setStep("playing");
  //   window.speechSynthesis.speak(utterance);
  // };

  const handleReadAloud = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setHighlightedWord(null);
      setStep("stopped");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(allTexts);
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      const words = allTexts.split(" "); // Split text into words
      let cumulativeLength = 0;
      let currentWordIndex = 0;

      // Find the word being spoken based on charIndex
      for (let i = 0; i < words.length; i++) {
        cumulativeLength += words[i].length + 1; // +1 for the space
        if (cumulativeLength > charIndex) {
          currentWordIndex = i;
          break;
        }
      }

      // Set the highlighted word and its global index
      setHighlightedWord({
        word: words[currentWordIndex],
        index: currentWordIndex,
      });
    };

    utterance.onend = () => {
      utteranceRef.current = null;
      setHighlightedWord(null);
      setStep("stopped");
    };

    setStep("playing");
    window.speechSynthesis.speak(utterance);
  };

  const handleReplay = () => {
    setStep("start");
    handleReadAloud();
  };

  const handleNextStep = async () => {
    if (step === "stopped") {
      setStep("questions");
    } else {
      const teacherText = currentText;
      const studentText = transcriptRef.current;

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

      if (step === "questions" || step === "stoppedRecording") {
        if (currentIndex < content[currentLevel][currentQIndex].length - 1) {
          setCurrentIndex(currentIndex + 1);
          setStep("questions");
        } else {
          setStep("start");
          setCurrentIndex(0);
          setCurrentQIndex(currentQIndex + 1);
          //setEvaluationResults({});
          handleNext();
        }
      }
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
          textAlign: "center",
          margin: "auto",
          //padding: "20px",
          //backgroundColor: "#1CB0F6",
          background: `url(${backgroundImg}) no-repeat center center`,
          backgroundSize: "100% auto",
          width: "100%",
          height: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "95%",
            height: "80%",
            backgroundColor: "#FFFFFF",
            zIndex: 1,
            top: "10%",
            left: "2.5%",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img
            src={raMonkey}
            alt="Monkey"
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "-20px",
              width: "200px",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Left Image */}
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
                marginLeft: "20px",
              }}
            />

            <h2
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                margin: 0,
                color: "#000000",
                fontStyle: "italic",
              }}
            >
              Read & Think
            </h2>
          </div>
          {/* Read Aloud Text */}
          {step !== "questions" &&
            step !== "finished" &&
            step !== "stoppedRecording" &&
            step !== "recording" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "50px",
                }}
              >
                {/* {allTexts.split(". ").map((sentence, index) => (
                <div key={index}>
                  {sentence.split(" ").map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      style={{
                        backgroundColor:
                          word === highlightedWord
                            ? "#833B1C40"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                        border:
                          word === highlightedWord
                            ? "1px solid #42210B"
                            : "none",
                        color: "#000000",
                        fontSize: "20px",
                        fontWeight: "500",
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              ))} */}
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    width: "50%",
                    lineHeight: "2",
                  }}
                >
                  {allTexts.split(" ").map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      style={{
                        backgroundColor:
                          highlightedWord && highlightedWord.index === wordIndex
                            ? "#833B1C40"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                        border:
                          highlightedWord && highlightedWord.index === wordIndex
                            ? "1px solid #42210B"
                            : "none",
                        color: "#000000",
                        fontSize: "20px",
                        fontWeight: "500",
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Start Button */}
          {step === "start" && (
            <img
              src={raMic}
              alt="Start"
              height={"70px"}
              width={"75px"}
              onClick={handleReadAloud}
              style={{ cursor: "pointer", marginTop: "80px" }}
            />
          )}

          {/* Stop Button */}
          {step === "playing" && (
            <img
              src={raStop}
              alt="Stop"
              height={"70px"}
              width={"75px"}
              onClick={handleReadAloud}
              style={{ cursor: "pointer", marginTop: "80px" }}
            />
          )}

          {/* Replay & Next Buttons */}
          {step === "stopped" && (
            <div style={{ display: "flex", gap: "20px" }}>
              <img
                src={raRetry}
                alt="Retry"
                height={"70px"}
                width={"75px"}
                onClick={handleReplay}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
              <img
                src={raNext}
                alt="Next"
                height={"70px"}
                width={"75px"}
                onClick={handleNextStep}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
            </div>
          )}

          {/* Question Display */}
          {(step === "questions" ||
            step === "stoppedRecording" ||
            step === "recording") && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={raWoodStand}
                alt="Wood Stand"
                style={{ width: "100%", maxWidth: "550px", marginLeft: "50px" }}
              />
              <p
                style={{
                  position: "absolute",
                  top: "75%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#000000",
                  fontSize: "18px",
                  fontWeight: "700",
                  textAlign: "center",
                  width: "80%",
                }}
              >
                {currentQuestion}
              </p>
            </div>
          )}

          {step === "questions" && (
            <div style={{ display: "flex", gap: "20px" }}>
              <img
                src={raSound}
                alt="Sound"
                height={"70px"}
                width={"75px"}
                //onClick={handleReplay}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
              <img
                src={raMic2}
                alt="Mic"
                height={"70px"}
                width={"75px"}
                onClick={() => {
                  setStep("recording");
                  startRecording();
                }}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
            </div>
          )}

          {/* Recording Controls */}
          {step === "recording" && (
            <div style={{ display: "flex", gap: "20px" }}>
              <img
                src={raWave}
                alt="Wave"
                height={"70px"}
                width={"350px"}
                //onClick={handleReplay}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
              <img
                src={raStop2}
                alt="Stop"
                height={"70px"}
                width={"75px"}
                onClick={() => {
                  setStep("stoppedRecording");
                  stopRecording();
                }}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
            </div>
          )}

          {/* Next Question Button */}
          {step === "stoppedRecording" && (
            <div style={{ display: "flex", gap: "20px" }}>
              <img
                src={raRetry}
                alt="Retry"
                height={"70px"}
                width={"75px"}
                onClick={() => {
                  setStep("recording");
                  startRecording();
                }}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
              <img
                src={raNext}
                alt="Next"
                height={"70px"}
                width={"75px"}
                onClick={handleNextStep}
                style={{ cursor: "pointer", marginTop: "80px" }}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReadAloud;
