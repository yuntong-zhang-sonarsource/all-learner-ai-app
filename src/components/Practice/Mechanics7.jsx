import { Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import MainLayout from "../Layouts.jsx/MainLayout";

// import useSound from "use-sound";
// import t from "../../assets/audio/t.mp3";
// import i from "../../assets/audio/i.mp3";
// import g from "../../assets/audio/g.mp3";
// import e from "../../assets/audio/e.mp3";
import clapImage from "../../assets/hand-icon-new.svg";
import bulbHint from "../../assets/hint.svg";
import frame from "../../assets/frame.svg";
import pencil from "../../assets/pencil.gif";

import correctSound from "../../assets/audio/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import addSound from "../../assets/audio/add.mp3";
import removeSound from "../../assets/audio/remove.wav";
import { splitGraphemes } from "split-graphemes";
import { WordRedCircle, StopButton, SpeakButton } from "../../utils/constants";
import { metaphone } from "metaphone";
// JSON TO MAKE IT WORK
// {
//   criteria: "word",
//   template: "simple",
//   mechanism: { id: "mechanic_7", name: "formAWord2" },
// }

const phoneticMatch = (str1, str2) => {
  //console.log('sss', str1, str2);

  const phonetic1 = metaphone(str1);
  const phonetic2 = metaphone(str2);
  const distance = levenshtein(phonetic1, phonetic2);
  //console.log(`Phonetic 1: ${phonetic1}, Phonetic 2: ${phonetic2}`);
  const maxLength = Math.max(phonetic1.length, phonetic2.length);
  return ((maxLength - distance) / maxLength) * 100;
};

const levenshtein = (a, b) => {
  const tmp = [];
  let i,
    j,
    alen = a.length,
    blen = b.length,
    res;

  if (alen === 0) {
    return blen;
  }
  if (blen === 0) {
    return alen;
  }

  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      res = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + res
      );
    }
  }

  return tmp[alen][blen];
};

const Mechanics7 = ({
  page,
  setPage,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  header,
  parentWords = "",
  image,
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
  const [words, setWords] = useState(
    type === "word" ? [] : ["Friend", "She is", "My"]
  );
  const [recordingStates, setRecordingStates] = useState({});

  useEffect(() => {
    if (words && words.length) {
      setRecordingStates(
        words.reduce((acc, word) => ({ ...acc, [word]: false }), {})
      );
    }
  }, [words]);

  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const [recAudio, setRecAudio] = useState("");

  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [currentIsSelected, setCurrentIsSelected] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState({});

  //console.log('worrrrdss', words, incorrectWords)

  // useEffect(() => {
  //   initSpeechRecognition();
  // }, []);

  const currentWordRef = useRef(currentWord);
  const currentIsSelectedRef = useRef(currentIsSelected);
  const wordsRef = useRef(words);
  const selectedWordsRef = useRef(selectedWords);

  // Update refs whenever the state changes
  useEffect(() => {
    currentWordRef.current = currentWord;
    currentIsSelectedRef.current = currentIsSelected;
    wordsRef.current = words;
    selectedWordsRef.current = selectedWords;
  }, [currentWord, currentIsSelected, words, selectedWords]);

  const initializeRecognition = () => {
    //console.log('started rec...');

    let recognitionInstance;
    if ("webkitSpeechRecognition" in window) {
      recognitionInstance = new window.webkitSpeechRecognition();
    } else if ("SpeechRecognition" in window) {
      recognitionInstance = new window.SpeechRecognition();
    } else {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    if (recognitionInstance) {
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        //console.log('Speech recognition started...');
      };

      recognitionInstance.onresult = (event) => {
        //console.log('Speech recognition result:', event);
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);
        setIsRecording(false);
        //console.log('transcript', transcript);

        // After getting the transcribed text, we need to handle the word logic
        // console.log('crq', currentWordRef.current, currentWord);
        //console.log('wordzzS', wordsRef.current, selectedWordsRef.current);

        handleWordsLogic(currentWordRef.current, transcript, currentIsSelected);
        setIsProcessing(false);
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        setIsProcessing(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          //console.log('No speech detected. Please speak clearly into the microphone.');
        } else if (event.error === "aborted") {
          //console.log('Speech recognition aborted. Restarting...');
          recognitionInstance.start(); // Try to restart the recognition
        }
      };

      recognitionInstance.onend = () => {
        // console.log('Speech recognition service disconnected');
        setIsProcessing(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const startRecording = (word, isSelected) => {
    //console.log('wordzzR', word, isSelected, words, selectedWords);
    setRecordingStates((prev) => ({
      ...prev,
      [word]: true,
    }));
    setIsRecording(true);
    setRecordedText("");
    setCurrentWord(word);
    setCurrentIsSelected(isSelected);
    // console.log('rec1', recognition, currentWord);
    // if (recognition) {
    //   recognition.start();
    // }
  };

  const stopRecording = (word) => {
    setRecordingStates((prev) => ({
      ...prev,
      [word]: false,
    }));
    setIsRecording(false);
    setIsProcessing(true);
    //console.log('Stopping recording...');
    //console.log('rec2', recognition);
    if (recognition) {
      recognition.stop();
    }
  };

  useEffect(() => {
    if (isRecording && recognition) {
      //console.log('rec1', recognition, currentWord);
      recognition.start();
    }
  }, [isRecording, recognition, currentWord]);

  useEffect(() => {
    initializeRecognition();
  }, []);

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio("");
    }
  };

  useEffect(() => {
    setSelectedWords([]);
  }, [contentId]);

  const [shake, setShake] = useState(false);

  function jumbleSentence(sentence) {
    // Split the sentence into words
    const words = sentence.split(" ");

    // Shuffle the words using Fisher-Yates (Durstenfeld) shuffle algorithm
    for (let i = words.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap words[i] with the element at random index
      [words[i], words[j]] = [words[j], words[i]];
    }

    // Join the jumbled words back into a sentence
    return words;
  }

  //console.log("Mechanics7", audio);

  // useEffect(() => {
  //   let wordsArr = jumbleSentence(parentWords);
  //   console.log('wwwwwwww', wordsArr);

  //   if (parentWords) {
  //     for (let i = wordsArr.length - 1; i > 0; i--) {
  //       let j = Math.floor(Math.random() * i);
  //       let k = wordsArr[i];
  //       wordsArr[i] = wordsArr[j];
  //       wordsArr[j] = k;
  //     }
  //   console.log('wwwwwwww1', wordsArr)
  //     setWordsAfterSplit(wordsArr);
  //     setWords(wordsArr);
  //   }
  // }, [parentWords]);

  useEffect(() => {
    setWordsAfterSplit(currentImg.syllable);
    setWords(currentImg.syllable);
    wordsRef.current = currentImg.syllable;
  }, [currentImg]);

  const [booleanState, setBooleanState] = useState(true);

  useEffect(() => {
    if (selectedWordsRef.current.length > 0) {
      setBooleanState(false);
    }
  }, [selectedWordsRef.current]);

  // const [tPlay] = useSound(t);
  // const [iPlay] = useSound(i);
  // const [gPlay] = useSound(g);
  // const [ePlay] = useSound(e);
  // const [rPlay] = useSound(r);

  // const audioPlay = {
  //   T: tPlay,
  //   I: iPlay,
  //   G: gPlay,
  //   E: ePlay,
  //   R: rPlay,
  // };
  const handleWordss = (word, isSelected) => {
    console.log("wordz", word, isSelected, words, selectedWords);

    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    // audioPlay[word]();
    if (selectedWords?.length + 1 !== wordsAfterSplit?.length || isSelected) {
      let audio = new Audio(isSelected ? removeSound : addSound);
      audio.play();
      setEnableNext(false);
    }

    if (isSelected) {
      let selectedWordsArr = [...selectedWords];
      let index = selectedWordsArr?.findIndex((elem) => elem === word);
      selectedWordsArr?.splice(index, 1);
      setSelectedWords(selectedWordsArr);
      setWords([...words, word]);
    } else {
      let wordsArr = [...words];
      //console.log('warray', wordsArr);

      let index = wordsArr?.findIndex((elem) => elem === word);
      wordsArr?.splice(index, 1);
      setWords(wordsArr);
      setSelectedWords([...selectedWords, word]);
      //console.log('warray1', wordsArr, selectedWords);
      if (selectedWords?.length + 1 === wordsAfterSplit?.length) {
        let audio = new Audio(
          [...selectedWords, word]?.join(" ") === parentWords
            ? correctSound
            : wrongSound
        );
        audio.play();
      }
    }
  };

  const handleWordsLogic = (word, transcribedText, isSelected) => {
    // console.log(
    //   "wordz",
    //   word,
    //   transcribedText,
    //   wordsRef.current,
    //   selectedWordsRef.current
    // );

    const matchPercentage = phoneticMatch(word, transcribedText);
    //console.log("matching data:", matchPercentage);

    if (matchPercentage < 49 && !isSelected) {
      //console.log("Pronunciation does not match, dropping the word.");
      setIncorrectWords((prevState) => ({ ...prevState, [word]: true }));
    } else {
      setIncorrectWords((prevState) => ({ ...prevState, [word]: false }));
    }

    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    // audioPlay[word]();
    if (
      selectedWordsRef.current?.length + 1 !== wordsAfterSplit?.length ||
      isSelected
    ) {
      let audio = new Audio(isSelected ? removeSound : addSound);
      audio.play();
      setEnableNext(false);
    }

    if (isSelected) {
      let selectedWordsArr = [...selectedWordsRef.current];
      let index = selectedWordsArr?.findIndex((elem) => elem === word);
      selectedWordsArr?.splice(index, 1);
      setSelectedWords(selectedWordsArr);
      selectedWordsRef.current = selectedWordsArr;
      setWords([...wordsRef.current, word]);
      wordsRef.current = [...wordsRef.current, word];
    } else {
      let wordsArr = [...wordsRef.current];
      //console.log("warray", wordsArr);

      let index = wordsArr?.findIndex((elem) => elem === word);
      wordsArr?.splice(index, 1);
      setWords(wordsArr);
      setSelectedWords([...selectedWordsRef.current, word]);
      //console.log("warray1", wordsArr, selectedWordsRef.current);
      if (selectedWordsRef.current?.length + 1 === wordsAfterSplit?.length) {
        let audio = new Audio(
          [...selectedWordsRef.current, word]?.join(" ") === parentWords
            ? correctSound
            : wrongSound
        );
        audio.play();
      }
    }
  };

  const handleWords = (word, isSelected) => {
    //console.log('wordzz', word, isSelected, words, selectedWords);
    startRecording(word, isSelected);
  };

  const answer =
    selectedWordsRef.current?.length !== wordsAfterSplit?.length
      ? ""
      : selectedWordsRef.current?.join(" ") === parentWords
      ? "correct"
      : "wrong";

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      answer={answer}
      isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      recAudio={recAudio}
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
      {/* <div
        style={{
          left: `calc(50% - 258px / 2)`,
          top: `calc(50% - 45px / 2 - 235.5px)`,
          fontFamily: "Quicksand",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "36px",
          lineHeight: "45px",
          alignItems: "center",
          textAlign: "center",
          color: "#333F61",
        }}
      >
        {header}
      </div> */}
      {isRecordingComplete && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <img
            src={frame}
            alt="frame"
            width={"300px"}
            style={{ position: "relative", zIndex: 1 }}
          />
          <img
            src={currentImg.img}
            alt="pencil"
            height={"90px"}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4, mt: 2 }}>
        <Box
          sx={{
            minWidth: "230px",
            minHeight: "55px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            borderRadius: "15px",
            border: `2px solid ${
              answer === "correct"
                ? "#58CC02"
                : answer === "wrong"
                ? "#C30303"
                : !wordsRef.current?.length &&
                  !!selectedWordsRef.current?.length &&
                  type === "word"
                ? "#1897DE"
                : "rgba(51, 63, 97, 0.10)"
            }`,
            cursor: "pointer",
            letterSpacing: answer != "correct" ? "5px" : "normal",
            background: "#FBFBFB",
            paddingX: type === "word" ? 0 : "20px",
          }}
        >
          {selectedWordsRef.current?.map((elem, index) => {
            const parentWordsArray =
              typeof parentWords === "string"
                ? parentWords.split(" ")
                : parentWords;

            let remainingParts = parentWordsArray.filter(
              (word) => !selectedWordsRef.current.includes(word)
            );

            const isIncorrect = incorrectWords[elem];

            return (
              <span
                onClick={() => handleWordsLogic(elem, "", true)}
                className={
                  answer === "wrong"
                    ? `audioSelectedWrongWord ${shake ? "shakeImage" : ""}`
                    : ""
                }
                style={{
                  borderRadius: "12px",
                  padding: answer === "correct" ? "0px" : "5px 10px 5px 10px",
                  border:
                    answer != "wrong"
                      ? answer === "correct"
                        ? "none" // No border if the answer is correct
                        : answer === "wrong"
                        ? "2px solid #C30303" // Red border if the answer is wrong
                        : !wordsRef.current.length &&
                          selectedWordsRef.current.length &&
                          type === "word"
                        ? "2px solid #1897DE" // Blue border for some specific condition
                        : "none"
                      : "", // Default light border,
                  color:
                    type === "word"
                      ? isIncorrect
                        ? "#C30303" // Red color if the word is incorrect
                        : answer === "correct"
                        ? "#58CC02"
                        : "#1897DE"
                      : answer === "wrong"
                      ? "#C30303"
                      : "#333F61",
                  fontWeight: type === "word" ? 600 : 700,
                  fontSize: "35px",
                  fontFamily: "Quicksand",
                  cursor: "pointer",
                  marginLeft:
                    type === "word" ? 0 : answer != "correct" ? "20px" : 0,
                }}
              >
                {elem}
                {remainingParts.length > 0 && (
                  <span
                    style={{
                      color: "#1897DE1A",
                      fontWeight: 700,
                      fontSize: "35px",
                      fontFamily: "Quicksand",
                      marginLeft: "5px",
                    }}
                  >
                    {remainingParts.join(" ")}
                  </span>
                )}
              </span>
            );
          })}
        </Box>
      </Box>
      {!isRecordingComplete && !isRecording && !isProcessing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maskBorderWidth: 6,
            mb: 5,
            //position: "relative",
          }}
        >
          <img
            src={currentImg.img}
            alt="pencil"
            height={"80px"}
            style={{
              //position: "absolute",
              zIndex: 2,
              //top: "50%",
              //left: "50%",
              //transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          mb: 4,
          mt: 6,
        }}
      >
        {wordsRef.current?.map((elem, wIndex) => (
          <React.Fragment key={elem}>
            {type === "word" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft:
                    wordsRef.current.length === 1 && wIndex === 0
                      ? "170px"
                      : "0px",
                }}
              >
                <Box
                  onClick={() => handleWords(elem)}
                  sx={{
                    marginTop: "30px",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: "30px", sm: "40px", md: "50px" },
                    minWidth: { xs: "50px", sm: "60px", md: "70px" },
                    //   background: "#1897DE",
                    m: { xs: 0.5, sm: 1 },
                    cursor: wIndex === 0 ? `url(${clapImage}), auto` : "auto",
                    //   borderRadius: "12px",
                    //   border: "5px solid #10618E",
                    fontSize: {
                      xs: "30px",
                      sm: "30px",
                      md: "40px",
                      lg: "40px",
                    },
                    marginLeft: wIndex > 0 ? "150px!important" : undefined,
                  }}
                >
                  {/* <span
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: {
                      xs: "25px",
                      sm: "35px",
                      md: "40px",
                      lg: "40px",
                    },
                    fontFamily: "Quicksand",
                  }}
                >
                  {elem}
                </span> */}
                  {wIndex == 0 && (
                    <Box sx={{ position: "absolute" }}>
                      <WordRedCircle height={elem?.length < 3 ? 120 : 140} />
                    </Box>
                  )}
                  {/* {wIndex == 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-80px",
                    }}
                  >
                    <img src={clapImage} alt="clapImage" />
                  </Box>
                )} */}
                  {wIndex == 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left:
                          wordsRef.current?.length > 1 ? "-180px" : undefined,
                        right:
                          wordsRef.current?.length == 1 ? "-180px" : undefined,
                      }}
                    >
                      <img src={bulbHint} alt="bulbHint" />
                    </Box>
                  )}
                  {elem?.split("")?.map((char, index) => (
                    <span
                      style={{
                        color: wIndex == 0 ? "#1897DE" : "#000000",
                        fontWeight: 700,
                        fontSize: {
                          xs: "40px",
                          sm: "50px",
                          md: "60px",
                          lg: "70px",
                        },
                        lineHeight: "87px",
                        letterSpacing: "2%",
                        fontFamily: "Quicksand",
                        marginLeft: index > 0 ? "20px" : undefined,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </Box>

                {wIndex === 0 &&
                  (!recordingStates[elem] ? (
                    <Box
                      sx={{
                        cursor: "pointer",
                        height: "38px",
                        marginTop: "50px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: { xs: "30px", sm: "40px", md: "50px" },
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                        cursor: `url(${clapImage}), auto`,
                        fontSize: {
                          xs: "20px",
                          sm: "30px",
                          md: "40px",
                          lg: "50px",
                        },
                        marginLeft: wIndex > 0 ? "150px!important" : undefined,
                      }}
                      onClick={() => handleWords(elem)}
                    >
                      <SpeakButton />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        cursor: "pointer",
                        height: "38px",
                        marginTop: "50px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: { xs: "30px", sm: "40px", md: "50px" },
                        minWidth: { xs: "50px", sm: "60px", md: "70px" },
                        cursor: `url(${clapImage}), auto`,
                        fontSize: {
                          xs: "20px",
                          sm: "30px",
                          md: "40px",
                          lg: "50px",
                        },
                        marginLeft: wIndex > 0 ? "150px!important" : undefined,
                      }}
                      onClick={() => stopRecording(elem)}
                    >
                      <StopButton />
                    </Box>
                  ))}
              </div>
            ) : (
              <Box
                onClick={() => handleWords(elem)}
                sx={{
                  textAlign: "center",
                  px: { xs: "15px", sm: "20px", md: "25px" },
                  py: { xs: "8px", sm: "10px", md: "12px" },
                  m: { xs: 0.5, sm: 1 },
                  textTransform: "none",
                  borderRadius: "12px",
                  border: `1px solid rgba(51, 63, 97, 0.10)`,
                  background: "#FFF",
                  cursor: "pointer",
                  fontSize: {
                    xs: "25px",
                    sm: "30px",
                    md: "35px",
                    lg: "40px",
                  },
                }}
              >
                <span
                  style={{
                    color: "#6F80B1",
                    fontWeight: 600,
                    fontFamily: "Quicksand",
                  }}
                >
                  {elem}
                </span>
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>

      {!isRecording && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "15px" }}>
          <VoiceAnalyser
            pageName={"m7"}
            setVoiceText={setVoiceText}
            onAudioProcessed={handleRecordingComplete}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            dontShowListen={type === "image" || isDiscover}
            // updateStory={updateStory}
            handleNext={handleNext}
            enableNext={enableNext}
            originalText={parentWords}
            audioLink={audio ? audio : null}
            {...{
              contentId,
              contentType,
              currentLine: currentStep - 1,
              playTeacherAudio,
              callUpdateLearner,
              isShowCase,
              setEnableNext,
              showOnlyListen: answer !== "correct",
              setOpenMessageDialog,
            }}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export default Mechanics7;
