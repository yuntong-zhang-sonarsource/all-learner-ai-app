import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

// Import speech recognition and speedometer
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speedometer from "react-d3-speedometer";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Speech recognition state variables
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [wpm, setWpm] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [finalWpm, setFinalWpm] = useState(0);

  const startTimeRef = useRef(null);

  // New state variables for pauses
  const [transcriptWords, setTranscriptWords] = useState([]);
  const [lastWordTimestamp, setLastWordTimestamp] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseDots, setPauseDots] = useState("");
  const pauseIntervalRef = useRef(null);
  const pauseThreshold = 1000; // Pause threshold in milliseconds (e.g., 1000ms = 1 second)

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
    };
  }, []);

  // Check for browser support
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser does not support speech recognition.");
    }
  }, []);

  // Use effect to handle transcript changes and pauses
  useEffect(() => {
    if (status === "recording") {
      const words = transcript
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const currentTime = Date.now();

      if (words.length > 0) {
        const lastWord = words[words.length - 1];

        if (transcriptWords.length === 0) {
          // First word
          setTranscriptWords([lastWord]);
          setLastWordTimestamp(currentTime);
          setIsPaused(false);
        } else {
          // Check if new word is added
          const lastTranscriptWord = transcriptWords
            .filter((word) => word !== "...")
            .slice(-1)[0];
          if (lastTranscriptWord !== lastWord) {
            // New word added
            if (isPaused) {
              // User started speaking again after a pause
              setIsPaused(false);
              setPauseDots("");
              if (pauseIntervalRef.current) {
                clearInterval(pauseIntervalRef.current);
                pauseIntervalRef.current = null;
              }
            }
            setTranscriptWords((prevWords) => [...prevWords, lastWord]);
            setLastWordTimestamp(currentTime);
          } else {
            // No new word, check for pause
            const timeSinceLastWord = currentTime - lastWordTimestamp;
            if (timeSinceLastWord >= pauseThreshold && !isPaused) {
              // Pause detected
              setIsPaused(true);
              setPauseDots(".");
              pauseIntervalRef.current = setInterval(() => {
                setPauseDots((prevDots) =>
                  prevDots.length < 10 ? prevDots + "." : ""
                );
              }, 500);
            }
          }
        }
      } else {
        // No words yet
        if (!isPaused && lastWordTimestamp) {
          const timeSinceLastWord = currentTime - lastWordTimestamp;
          if (timeSinceLastWord >= pauseThreshold) {
            // Pause detected
            setIsPaused(true);
            setPauseDots(".");
            pauseIntervalRef.current = setInterval(() => {
              setPauseDots((prevDots) =>
                prevDots.length < 10 ? prevDots + "." : ""
              );
            }, 500);
          }
        }
      }
    }
  }, [transcript, status, lastWordTimestamp]);

  const startRecording = async () => {
    try {
      const micStartTime = new Date().getTime();

      // Retrieve and parse localStorage value safely
      const durationData = localStorage.getItem("duration");
      let parsedDuration = { retryCount: 0 }; // Default values

      if (durationData) {
        try {
          parsedDuration = JSON.parse(durationData);
        } catch (err) {
          console.error("Error parsing duration data from localStorage:", err);
          parsedDuration = { retryCount: 0 };
        }
      }
      const retryCount = parsedDuration.retryCount || 0;

      const duration = {
        ...parsedDuration,
        micStartTime: micStartTime,
        retryCount: !!props?.recordedAudio ? retryCount + 1 : 0,
      };

      // Safely set the new duration data in localStorage
      try {
        localStorage.setItem("duration", JSON.stringify(duration));
      } catch (err) {
        console.error("Error updating duration data in localStorage:", err);
      }

      // Update the UI status
      setStatus("recording");
      if (props.setEnableNext) {
        props.setEnableNext(false);
      }

      // Request microphone access and start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        disableLogs: true,
      });

      // Start recording
      recorderRef.current.startRecording();
      setIsRecording(true);

      // Start speech recognition
      resetTranscript();
      setTranscriptWords([]);
      setLastWordTimestamp(null);
      setIsPaused(false);
      setPauseDots("");
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
      startTimeRef.current = Date.now();
      SpeechRecognition.startListening({ continuous: true });
    } catch (err) {
      console.error("Error in startRecording:", err);
    }
  };

  const stopRecording = () => {
    try {
      const micStopTime = new Date().getTime();

      // Retrieve and parse localStorage value safely
      const durationData = localStorage.getItem("duration");
      if (!durationData) {
        throw new Error("Duration data not found in localStorage.");
      }

      let parsedDuration = {};

      if (durationData) {
        parsedDuration = JSON.parse(durationData);
      } else {
        parsedDuration = { retryCount: 0, micStartTime: 0 };
      }
      const duration = {
        ...parsedDuration,
        micStopTime: micStopTime,
      };

      // Safely update localStorage
      localStorage.setItem("duration", JSON.stringify(duration));

      // Update UI status
      setStatus("inactive");

      // Stop recording if the recorder exists
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          try {
            const blob = recorderRef.current.getBlob();

            // Check if the blob exists
            if (blob) {
              setAudioBlob(blob);
              saveBlob(blob);
            } else {
              throw new Error("Failed to retrieve audio blob.");
            }

            // Stop all media stream tracks
            if (mediaStreamRef.current) {
              mediaStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
            }

            setIsRecording(false);
          } catch (blobError) {
            console.error("Error handling the audio blob:", blobError);
          }
        });
      }

      // Stop speech recognition
      SpeechRecognition.stopListening();

      // Calculate final WPM
      const endTime = Date.now();
      const durationInMinutes = (endTime - startTimeRef.current) / 60000;
      const words = transcript
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const calculatedWpm = words / durationInMinutes;

      setWordCount(words);
      setWpm(Math.round(calculatedWpm));

      setFinalTranscript(transcript);
      setFinalWpm(Math.round(calculatedWpm));

      // Reset transcript for next time
      resetTranscript();
      setTranscriptWords([]);
      setLastWordTimestamp(null);
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
      setIsPaused(false);
      setPauseDots("");

      // Enable the "Next" button if the callback is provided
      if (props.setEnableNext) {
        props.setEnableNext(true);
      }
    } catch (err) {
      console.error("Error in stopRecording:", err);
    }
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
  };

  // Function to render live transcript with highlighted current word and pauses
  const renderLiveTranscript = () => {
    if (transcriptWords.length === 0 && pauseDots === "") return null;

    const lastIndex = transcriptWords.length - 1;

    return (
      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        {transcriptWords.map((word, index) => (
          <span
            key={index}
            style={{
              backgroundColor:
                index === lastIndex && !isPaused ? "#ffff00" : "transparent",
              padding: "2px",
              marginRight: "5px",
            }}
          >
            {word}
          </span>
        ))}
        {isPaused && <span style={{ marginLeft: "5px" }}>{pauseDots}</span>}
      </div>
    );
  };

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording") {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{ cursor: "pointer", height: "38px" }}
                  onClick={stopRecording}
                >
                  <StopButton />
                </Box>
                <Box style={{ marginTop: "50px", marginBottom: "20px" }}>
                  <RecordVoiceVisualizer />
                </Box>

                {/* Display live transcript with highlighted current word and pauses */}
                {renderLiveTranscript()}
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0 auto",
                  }}
                  className="game-action-button"
                >
                  {props?.originalText &&
                    (!props.dontShowListen || props.recordedAudio) && (
                      <>
                        {!props.pauseAudio ? (
                          <div
                            onClick={() => {
                              props.playAudio(true);
                            }}
                          >
                            <Box sx={{ cursor: "pointer" }}>
                              <ListenButton />
                            </Box>
                          </div>
                        ) : (
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              props.playAudio(false);
                            }}
                          >
                            <StopButton />
                          </Box>
                        )}
                      </>
                    )}

                  <div>
                    {props?.originalText && !props.showOnlyListen && (
                      <Box
                        marginLeft={
                          !props.dontShowListen || props.recordedAudio
                            ? "32px"
                            : "0px"
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={startRecording}
                      >
                        {!props.recordedAudio ? <SpeakButton /> : <RetryIcon />}
                      </Box>
                    )}
                  </div>
                </div>

                {/* Display the speedometer and WPM after recording */}
                {finalTranscript && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Speedometer
                      minValue={0}
                      maxValue={200}
                      value={finalWpm}
                      needleColor="black"
                      startColor="red"
                      segments={5}
                      endColor="green"
                      textColor="black"
                    />

                    <div style={{ marginTop: "20px" }}>
                      <h4>Words per minute (WPM): {finalWpm}</h4>
                      <h4>Word count: {wordCount}</h4>
                      <p>Transcript: {finalTranscript}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default AudioRecorder;
