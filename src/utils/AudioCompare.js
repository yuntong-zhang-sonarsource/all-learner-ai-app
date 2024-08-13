import React, { useState } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";

const AudioRecorderCompair = (props) => {
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [recordingInitialized, setRecordingInitialized] = useState(false);
  const [recorder, setRecorder] = useState(null);

  const controlAudio = async (status) => {
    if (status === "recording") {
      startRecording();
    } else {
      stopRecording();
    }
    setStatus(status);
  };

  const resetRecording = () => {
    setAudioSrc("");
    setRecordingInitialized(false);
  };

  const handleMic = async () => {
    if (props.setEnableNext) {
      props.setEnableNext(false);
    }
    resetRecording();
    controlAudio("recording");
  };

  const handleStop = () => {
    if (props.setEnableNext) {
      props.setEnableNext(true);
    }
    controlAudio("inactive");
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {},
      })
      .then((stream) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        const recorder = RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/wav",
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000, // Lower sample rate for voice recording
          numberOfAudioChannels: 1, // Force mono recording
          audioContext: audioContext,
        });

        recorder.startRecording();
        setRecorder(recorder);
        setRecordingInitialized(true);
        props.setRecordedAudio("");
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        props?.setOpenMessageDialog({
          message:
            "Microphone access denied or not working. Please check your settings.",
          isError: true,
        });
      });
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const temp_audioSrc = window.URL.createObjectURL(blob);
        setAudioSrc(temp_audioSrc);

        // Validate the blob
        if (blob.size < 1000) {
          console.error("Recording too short or no audio detected");
          // props?.setOpenMessageDialog({
          //   message: "Please Speak Louder and Clear",
          //   isError: true,
          // });
          if (props.setEnableNext) {
            props.setEnableNext(false);
          }
          return;
        }

        props.setRecordedAudio(temp_audioSrc);
        setRecordingInitialized(false);
      });
    }
  };

  React.useEffect(() => {
    if (props.isNextButtonCalled) {
      destroyRecording();
    }
  }, [props.isNextButtonCalled]);

  const destroyRecording = () => {
    if (recorder) {
      recorder.destroy();
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
        setAudioSrc("");
      }
      setRecorder(null);
      setRecordingInitialized(false);
      setStatus("");
      props.setRecordedAudio("");
      if (props.setEnableNext) {
        props.setEnableNext(false);
      }
    }
  };

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording" && recordingInitialized) {
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
                  onClick={handleStop}
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
                {(!props.dontShowListen || props.recordedAudio) && (
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
                  {!props.showOnlyListen && (
                    <Box
                      marginLeft={
                        !props.dontShowListen || props.recordedAudio
                          ? "32px"
                          : "0px"
                      }
                      sx={{ cursor: "pointer" }}
                      onClick={handleMic}
                    >
                      {!props.recordedAudio ? (
                        <SpeakButton />
                      ) : (
                        <RetryIcon onClick={destroyRecording} />
                      )}
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

export default AudioRecorderCompair;
