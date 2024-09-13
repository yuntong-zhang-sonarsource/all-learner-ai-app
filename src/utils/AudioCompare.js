import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const micStartTime = new Date().getTime();

      // Retrieve and parse localStorage value safely
      const durationData = localStorage.getItem("duration");
      if (!durationData) {
        throw new Error("Duration data not found in localStorage.");
      }

      const parsedDuration = JSON.parse(durationData);
      const retryCount = parsedDuration.retryCount || 0; // Handle if retryCount is missing

      const duration = {
        ...parsedDuration,
        micStartTime: micStartTime,
        retryCount: retryCount + 1,
      };

      // Safely set the new duration data in localStorage
      localStorage.setItem("duration", JSON.stringify(duration));

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
        mimeType: "audio/wav", // Same MIME type as AudioRecorderCompair
        recorderType: RecordRTC.StereoAudioRecorder, // Use StereoAudioRecorder for compatibility
        numberOfAudioChannels: 1, // Same number of audio channels
        desiredSampRate: 16000, // Adjust sample rate if needed
        disableLogs: true,
      });

      // Start recording
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error("Error in startRecording:", err);

      // Display a message or handle the error as necessary
      props?.setOpenMessageDialog({
        message: err.message || "Failed to start recording. Please try again.",
        isError: true,
      });
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

      const parsedDuration = JSON.parse(durationData);
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
              saveBlob(blob); // Persist the blob (e.g., save it to a server or locally)
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
            props?.setOpenMessageDialog({
              message:
                blobError.message ||
                "An error occurred while processing the audio.",
              isError: true,
            });
          }
        });
      }

      // Enable the "Next" button if the callback is provided
      if (props.setEnableNext) {
        props.setEnableNext(true);
      }
    } catch (err) {
      console.error("Error in stopRecording:", err);

      // Optionally show an error message to the user
      props?.setOpenMessageDialog({
        message: err.message || "Failed to stop recording. Please try again.",
        isError: true,
      });
    }
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
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
                <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
              </div>
            );
          } else {
            return (
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
            );
          }
        })()}
      </div>
    </div>
  );
};

export default AudioRecorder;
