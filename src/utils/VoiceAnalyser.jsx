import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import calcCER from "character-error-rate";
import s1 from "../assets/audio/S1.m4a";
import s2 from "../assets/audio/S2.m4a";
import s3 from "../assets/audio/S3.m4a";
import s4 from "../assets/audio/S4.m4a";
import s5 from "../assets/audio/S5.m4a";
import s6 from "../assets/audio/S6.m4a";
import v1 from "../assets/audio/V1.m4a";
import v10 from "../assets/audio/V10.mp3";
import v2 from "../assets/audio/V2.m4a";
import v3 from "../assets/audio/V3.m4a";
import v4 from "../assets/audio/V4.m4a";
import v5 from "../assets/audio/V5.m4a";
import v6 from "../assets/audio/V6.m4a";
import v7 from "../assets/audio/V7.m4a";
import v8 from "../assets/audio/V8.m4a";
import livesAdd from "../assets/audio/livesAdd.wav";
import livesCut from "../assets/audio/livesCut.wav";
import { response } from "../services/telementryService";
import AudioCompare from "./AudioCompare";
import PropTypes from "prop-types";
import {
  SpeakButton,
  compareArrays,
  getLocalData,
  replaceAll,
  NextButtonRound,
  rnnoiseModelPath,
} from "./constants";
import config from "./urlConstants.json";
import { filterBadWords } from "./Badwords";
import { fetchFile } from "@ffmpeg/ffmpeg";
import useFFmpeg from "./useFFmpeg";
import * as fuzz from "fuzzball";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3Client from "../config/awsS3";
import * as wasm from "indicasr-wasm";
/* eslint-disable */

const AudioPath = {
  1: {
    0: v1,
    1: v2,
    2: v3,
    3: v4,
    4: v5,
    5: v6,
    6: v7,
    7: v8,
    10: v10,
  },
  2: {
    0: s1,
    1: s2,
    2: s3,
    3: s4,
    4: s5,
    5: s6,
  },
};
const currentIndex = localStorage.getItem("index") || 1;
function VoiceAnalyser(props) {
  const [loadCnt, setLoadCnt] = useState(0);
  const [loader, setLoader] = useState(false);
  const [pauseAudio, setPauseAudio] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [recordedPauseCount, setRecordedPauseCount] = useState(0);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState("");
  const [audioPermission, setAudioPermission] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState();
  const [temp_audio, set_temp_audio] = useState(null);
  const [isStudentAudioPlaying, setIsStudentAudioPlaying] = useState(false);
  const [temp_Student_audio, set_temp_Student_audio] = useState(null);
  const { callUpdateLearner } = props;
  const lang = getLocalData("lang");
  const { livesData, setLivesData } = props;
  const [isAudioPreprocessing, setIsAudioPreprocessing] = useState(
    import.meta.env.VITE_APP_IS_AUDIOPREPROCESSING === "true"
  );
  const [isMatching, setIsMatching] = useState(false);

  //console.log('audio', recordedAudio, isMatching);

  useEffect(() => {
    if (!props.enableNext) {
      setRecordedAudio("");
    }
  }, [props.enableNext]);
  const [nonDenoisedText, setNonDenoisedText] = useState("");
  const [nonDenoisedTextTokens, setNonDenoisedTextTokens] = useState([]);
  const [denoisedTextTokens, setDenoisedTextTokens] = useState([]);
  const [denoisedText, setDenoisedText] = useState("");
  const [isOfflineModel, setIsOfflineModel] = useState(
    localStorage.getItem("isOfflineModel") === "true"
  );

  const { ffmpeg, loading } = useFFmpeg();

  const handleProcess = async (recordedBlob) => {
    // if (loading) {
    //   console.log("FFmpeg is still loading...");
    //   return;
    // }
    console.log(recordedBlob);
    try {
      let nondenoisedBlob;
      let nonDenoisedRes;
      let newDenoisedUrl;


      if (callUpdateLearner && isOfflineModel) {
        try {
          if(isOfflineModel && lang === 'en') {
            await ffmpeg.FS(
              "writeFile",
              "recorded.webm",
              await fetchFile(recordedBlob)
            );
    
            let nondenoiseddata;
            try {
              nondenoiseddata = ffmpeg.FS("readFile", "recorded.webm");
            } catch (error) {
              console.error("Error reading recorded file:", error);
              return;
            }
            nondenoisedBlob = new Blob([nondenoiseddata.buffer], {
              type: "audio/webm",
            });
    
            nonDenoisedRes = await getResponseText(nondenoisedBlob);
          
          }else{
            const transcodedArrayBuffer = await transcodeFile(recordedBlob, "webm",false);
        
            const byteArray = new Uint8Array(transcodedArrayBuffer);
                  const processed_data = wasm.run_preprocessor(byteArray);
                  const logits = await runModel(processed_data);
                  let vocab = window.offlineVocab;
                  let topK = 2;
                  const batch_size = 1;
                  const vocab_size = vocab.length - 1;
                  const time_steps = logits.length / (vocab_size * batch_size);
                  const offset = Number(vocab[0]);
                  const actual_vocab_size = Number(vocab[1]);
              
                  let output;
                  if (topK > 1) {
                    output = wasm.decode_logprobs_topk(
                      logits,
                      new Uint32Array([batch_size, time_steps, vocab_size]),
                      vocab.slice(2),
                      offset,
                      actual_vocab_size,
                      topK
                    );
                  } else {
                    output = wasm.decode_logprobs(
                      logits,
                      new Uint32Array([batch_size, time_steps, vocab_size]),
                      vocab.slice(2),
                      offset,
                      actual_vocab_size
                    );
                  }
    
                  console.log(output);
                  nonDenoisedRes = output[0].text;
                  setNonDenoisedTextTokens([...nonDenoisedTextTokens,output]);
          }


          nonDenoisedRes = await filterBadWords(nonDenoisedRes);
          setNonDenoisedText(nonDenoisedRes);
          console.log("non denoised output -- ", nonDenoisedRes);
          console.log(fuzz.ratio(props.originalText, nonDenoisedRes));
        } catch (error) {
          console.error("Error getting non denoised text:", error);
        }
      }



      let denoisedRes;


      if (callUpdateLearner && isOfflineModel) {
        try {
          await ffmpeg.FS(
            "writeFile",
            "cb.rnnn",
            await fetchFile(rnnoiseModelPath)
          );
    
          await ffmpeg.run(
            "-i",
            "recorded.webm",
            "-af",
            "arnndn=m=cb.rnnn",
            "output.wav"
          );
    
          let data;
          try {
            data = ffmpeg.FS("readFile", "output.wav");
          } catch (error) {
            console.error("Error reading output file:", error);
            return;
          }
          const denoisedBlob = new Blob([data.buffer], { type: "audio/wav" });
          newDenoisedUrl = URL.createObjectURL(denoisedBlob);

          if(isOfflineModel && lang !== 'en') {
            const transcodedArrayBuffer = await transcodeFile(recordedBlob, "webm",true);
        
            const byteArray = new Uint8Array(transcodedArrayBuffer);
                  const processed_data = wasm.run_preprocessor(byteArray);
                  const logits = await runModel(processed_data);
                  let vocab = window.offlineVocab;
                  let topK = 2;
                  const batch_size = 1;
                  const vocab_size = vocab.length - 1;
                  const time_steps = logits.length / (vocab_size * batch_size);
                  const offset = Number(vocab[0]);
                  const actual_vocab_size = Number(vocab[1]);
              
                  let output;
                  if (topK > 1) {
                    output = wasm.decode_logprobs_topk(
                      logits,
                      new Uint32Array([batch_size, time_steps, vocab_size]),
                      vocab.slice(2),
                      offset,
                      actual_vocab_size,
                      topK
                    );
                  } else {
                    output = wasm.decode_logprobs(
                      logits,
                      new Uint32Array([batch_size, time_steps, vocab_size]),
                      vocab.slice(2),
                      offset,
                      actual_vocab_size
                    );
                  }
    
                  denoisedRes = output[0].text;
                  setDenoisedTextTokens([...denoisedTextTokens,output]);
          }else{
            denoisedRes = await getResponseText(denoisedBlob);
          }

          denoisedRes = await filterBadWords(denoisedRes);
          setDenoisedText(denoisedRes);
          console.log("denoised output -- ", denoisedRes);
          console.log(fuzz.ratio(props.originalText, denoisedRes));
        } catch (error) {
          console.error("Error getting denoised text:", error);
        }
      }

      if(newDenoisedUrl === undefined){
        newDenoisedUrl = recordedBlob;
      }
      setRecordedAudio((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl); // Clean up the previous URL
        }
        return newDenoisedUrl;
      });

      console.log("Denoised URL:", newDenoisedUrl);

    } catch (error) {
      console.error("Error processing audio:", error);
    }
    setLoader(false);
  };

  const transcodeFile = async (recordedBlob, inputType, isDenoised) => {

    const blobResponse = await fetch(recordedBlob);

    // Ensure the response is OK
    if (!blobResponse.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get the Blob from the response
    const audioBlob = await blobResponse.blob();

    // Convert the Blob to ArrayBuffer
    const fileBuffer = await audioBlob.arrayBuffer();

    // await ffmpeg.writeFile(`input.${inputType}`, new Uint8Array(fileBuffer));
    await ffmpeg.FS(
      "writeFile",
      `input.${inputType}`,
      new Uint8Array(fileBuffer)
    );
    // "-acodec pcm_s16le -ar 44100 -ac 2"
    if(!isDenoised){
    await ffmpeg.run(
      "-i",
      `input.${inputType}`,
      "-acodec",
      "pcm_s16le",
      "-ar",
      "16000",
      "-ac",
      "1",
      "output.wav"
    );
    }else{
      await ffmpeg.run(
        "-i",
        `input.${inputType}`,
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        "-af",
        "arnndn=m=cb.rnnn",
        "output.wav"
      );
    }

    // @ts-ignore
    const outData = await ffmpeg.FS("readFile", "output.wav");
    return outData.buffer;
  };

  const runModel = async (data) => {
    const data_length = data[0][0].length;
    const i = data.length;
    const j = data[0].length;
    const k = data[0][0].length;
    const arr = [];
    for (let a = 0; a < i; a++) {
      for (let b = 0; b < j; b++) {
        for (let c = 0; c < k; c++) {
          arr.push(data[a][b][c]);
        }
      }
    }
    const audio_tensor = new window.ort.Tensor(
      "float32",
      new Float32Array(arr),
      [i, j, k]
    );
    const audio_tensor_length = new window.ort.Tensor(
      "int64",
      new BigInt64Array([BigInt(data_length)])
    );
    const feeds = { audio_signal: audio_tensor, length: audio_tensor_length };
    const results = await window.offlineSession.run(feeds);
    return results.logprobs.cpuData;
  };

  const getResponseText = async (audioBlob) => {
    // console.log("whisper code");
    // let denoised_response_text = "";
    // let isWhisperRunning = false;
    // let audio0 = null;
    // let context = new AudioContext({
    //   sampleRate: 16000,
    //   channelCount: 1,
    //   echoCancellation: false,
    //   autoGainControl: true,
    //   noiseSuppression: true,
    // });

    // window.OfflineAudioContext =
    //   window.OfflineAudioContext || window.webkitOfflineAudioContext;

    // window.whisperModule.set_status("");

    // const blobToArrayBuffer = async (blob) => {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result);
    //     reader.onerror = reject;
    //     reader.readAsArrayBuffer(blob);
    //   });
    // };

    // let audioBuf = await blobToArrayBuffer(audioBlob);

    // let audioBuffer;
    // try {
    //   audioBuffer = await context.decodeAudioData(audioBuf);
    // } catch (error) {
    //   console.error("Error decoding audio data:", error);
    //   return "";
    // }

    // var offlineContext = new OfflineAudioContext(
    //   audioBuffer.numberOfChannels,
    //   audioBuffer.length,
    //   audioBuffer.sampleRate
    // );
    // var source = offlineContext.createBufferSource();
    // source.buffer = audioBuffer;
    // source.connect(offlineContext.destination);
    // source.start(0);

    // let renderedBuffer = await offlineContext.startRendering();
    // let audio = renderedBuffer.getChannelData(0);
    // let audioAll = new Float32Array(
    //   audio0 == null ? audio.length : audio0.length + audio.length
    // );

    // if (audio0 != null) {
    //   audioAll.set(audio0, 0);
    // }
    // audioAll.set(audio, audio0 == null ? 0 : audio0.length);

    // window.whisperModule.set_audio(1, audioAll);

    // let whisperStatus = "";

    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // let checkWhisperStatus = true;

    // while (checkWhisperStatus) {
    //   whisperStatus = window.whisperModule.get_status();
    //   if (whisperStatus === "running whisper ...") {
    //     isWhisperRunning = true;
    //   }
    //   if (isWhisperRunning && whisperStatus === "waiting for audio ...") {
    //     denoised_response_text = window.whisperModule.get_transcribed();
    //     checkWhisperStatus = false;
    //     break;
    //   }
    //   await delay(100);
    // }

    // return denoised_response_text;

      // Initialize the recognizer if needed
  let expectedSampleRate = 16000;

  // Convert the Blob to an ArrayBuffer
  const arrayBuffer = await audioBlob.arrayBuffer();

  // Decode the audio data
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  let recordSampleRate = audioBuffer.sampleRate;

  let recognizer_stream = window.sherpaRecognizer;

  function downsampleBuffer(buffer, exportSampleRate) {
    if (exportSampleRate === recordSampleRate) {
      return buffer;
    }
    var sampleRateRatio = recordSampleRate / exportSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
};

  // Get the audio samples from the buffer
  let samples = audioBuffer.getChannelData(0);

  samples = downsampleBuffer(samples, expectedSampleRate);

  recognizer_stream = recognizer.createStream();

  // Process the samples with the recognizer
  recognizer_stream.acceptWaveform(expectedSampleRate, samples);

  // Wait for the recognizer to be ready and decode the result
  while (recognizer.isReady(recognizer_stream)) {
    recognizer.decode(recognizer_stream);
  }

  let isEndpoint = recognizer.isEndpoint(recognizer_stream);

  let result = recognizer.getResult(recognizer_stream);

  console.log(result);

  return result.text;

  };

  useEffect(() => {
    const processAudio = async () => {
      if (loading || !recordedAudio) {
        console.log("FFmpeg is still loading or no audio recorded...");
        return;
      }

      try {
        await ffmpeg.FS(
          "writeFile",
          "input.wav",
          await fetchFile(recordedAudio)
        );

        let silenceStartCount = 0;
        ffmpeg.setLogger(({ type, message }) => {
          if (type === "fferr" && message.includes("silence_start")) {
            silenceStartCount += 1;
          }
        });

        await ffmpeg.run(
          "-i",
          "input.wav",
          "-af",
          "silencedetect=noise=-40dB:d=0.5",
          "-f",
          "null",
          "/dev/null"
        );

        setRecordedPauseCount(silenceStartCount);
        console.log("silenceStartCount", silenceStartCount);
      } catch (error) {
        console.error("Error processing audio for pause count:", error);
      } finally {
        // Clean up
        ffmpeg.FS("unlink", "input.wav");
      }
    };

    processAudio();
  }, [recordedAudio, loading, ffmpeg]);

  const initiateValues = async () => {
    const currIndex = (await localStorage.getItem("index")) || 1;
    setCurrentIndex(currIndex);
  };

  useEffect(() => {
    setRecordedAudio("");
  }, [props.contentId]);

  const playAudio = async (val) => {
    if (isStudentAudioPlaying) {
      return;
    }
    const { audioLink } = props;
    try {
      let audio = new Audio(
        audioLink
          ? audioLink
          : `${import.meta.env.VITE_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${props.contentId}.wav`
      );
      audio.crossOrigin = "anonymous";
      audio.addEventListener("canplaythrough", () => {
        set_temp_audio(audio);
        setPauseAudio(val);
        if (val) {
          audio.play();
        } else {
          audio.pause();
        }
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio failed to load", e);
        setPauseAudio(false); // Set pause state to false
        alert("Failed to load the audio. Please try again.");
      });
    } catch (err) {
      console.error("An error occurred:", err);
      alert("An unexpected error occurred while trying to play the audio.");
    }
  };

  const playRecordedAudio = (val) => {
    if (pauseAudio) {
      return;
    }
    try {
      const audio = new Audio(recordedAudio);
      audio.addEventListener("canplaythrough", () => {
        setIsStudentAudioPlaying(val);
        set_temp_Student_audio(audio);
        if (val) {
          audio.play();
          audio.onended = () => setIsStudentAudioPlaying(false);
        } else {
          audio.pause();
        }
      });
      audio.addEventListener("error", (e) => {
        console.error("Audio failed to load", e);
        setIsStudentAudioPlaying(false);
        alert("Failed to load the audio. Please try again.");
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (temp_Student_audio !== null) {
      if (!isStudentAudioPlaying) {
        temp_Student_audio.pause();
        props.setVoiceAnimate(false);
      } else {
        temp_Student_audio.play();
        props.setVoiceAnimate(true);
      }
      temp_Student_audio.onended = function () {
        setPauseAudio(false);
        props.setVoiceAnimate(false);
      };
      temp_Student_audio.addEventListener("ended", () =>
        setIsStudentAudioPlaying(false)
      );
    }
    return () => {
      if (temp_Student_audio !== null) {
        temp_Student_audio.pause();
      }
    };
  }, [temp_Student_audio]);

  useEffect(() => {
    if (temp_audio !== null) {
      if (!pauseAudio) {
        temp_audio.pause();
        props.setVoiceAnimate(false);
      } else {
        temp_audio.play();
        props.setVoiceAnimate(true);
      }
      temp_audio.onended = function () {
        setPauseAudio(false);
        props.setVoiceAnimate(false);
      };
      //temp_audio.addEventListener("ended", () => alert("end"));
    }
    return () => {
      if (temp_audio !== null) {
        temp_audio.pause();
      }
    };
  }, [temp_audio]);

  useEffect(() => {
    initiateValues();
  }, []);

  useEffect(() => {
    if (loadCnt === 0) {
      getpermision();
      setLoadCnt((loadCnt) => Number(loadCnt + 1));
    }
  }, [loadCnt]);

  function hasVoice(base64String) {
    // Convert base64 string to ArrayBuffer
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode ArrayBuffer to audio buffer
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    return new Promise((resolve) => {
      audioContext.decodeAudioData(bytes.buffer, (buffer) => {
        // Analyze the audio buffer to check for voice
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        source.start();

        // Wait for a moment and check if there is any voice
        setTimeout(() => {
          analyser.getByteFrequencyData(dataArray);
          const hasVoice = dataArray.some((value) => value > 0);
          resolve(hasVoice);
        }, buffer.duration * 1000);
      });
    });
  }

  useEffect(() => {
    if (recordedAudio !== "") {
      // setLoader(true);
      let uri = recordedAudio;
      let request = new XMLHttpRequest();
      request.open("GET", uri, true);
      request.responseType = "blob";
      request.onload = function () {
        let reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          let base64Data = e.target.result.split(",")[1];
          setRecordedAudioBase64(base64Data);
        };
      };
      request.send();
    } else {
      setLoader(false);
      setRecordedAudioBase64("");
      setApiResponse("");
    }
  }, [recordedAudio]);

  useEffect(() => {
    if (props.isNextButtonCalled) {
      if (recordedAudioBase64 !== "") {
        const lang = getLocalData("lang") || "ta";
        fetchASROutput(lang, recordedAudioBase64);
        setLoader(true);
      }
    }
  }, [props.isNextButtonCalled]);

  useEffect(() => {
    if (recordedAudioBase64 !== "") {
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
    }
  }, [recordedAudioBase64]);

  useEffect(() => {
    // props.updateStory();
    props.setVoiceText(apiResponse);
    props.setRecordedAudio(recordedAudio);
  }, [apiResponse]);

  const fetchASROutput = async (sourceLanguage, base64Data) => {
    // let samplingrate = 30000;
    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    // var payload = JSON.stringify({
    //     config: {
    //         language: {
    //             sourceLanguage: sourceLanguage,
    //         },
    //         transcriptionFormat: {
    //             value: 'transcript',
    //         },
    //         audioFormat: 'wav',
    //         samplingRate: samplingrate,
    //         postProcessors: null,
    //     },
    //     audio: [
    //         {
    //             audioContent: base64Data,
    //         },
    //     ],
    // });
    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: payload,
    //     redirect: 'follow',
    // };
    // const apiURL = `https://asr-api.apiResponse.org/asr/v1/recognize/en`;
    // fetch(apiURL, requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => {
    //         var apiResponse = JSON.parse(result);
    //         setApiResponse(apiResponse['output'][0]['source'] != '' ? apiResponse['output'][0]['source'] : '-');
    //         setLoader(false);
    //     });

    try {
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const sub_session_id = getLocalData("sub_session_id");
      const { originalText, contentType, contentId, currentLine } = props;
      const responseStartTime = new Date().getTime();
      let responseText = "";
      let profanityWord = "";
      let topkTokens
      let newThresholdPercentage = 0;
      let data = {};

      let response_text = "";
      let mode = isOfflineModel ? "offline" : "online";
      let pause_count = recordedPauseCount;

      if (
        fuzz.ratio(originalText, nonDenoisedText) >=
        fuzz.ratio(originalText, denoisedText)
      ) {
        response_text = nonDenoisedText;
        topkTokens = nonDenoisedTextTokens[0] || [];
      } else {
        response_text = denoisedText;
        topkTokens = denoisedTextTokens[0] || [];
      }

      let requestBody = {
        original_text: originalText,
        response_text: response_text,
        mode: mode,
        pause_count: pause_count,
        audio: mode === "offline" ? "" : base64Data,
        user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId,
        contentType,
      };

      if(topkTokens.length > 0) {
      requestBody.output= topkTokens
      }

      if (props.selectedOption) {
        requestBody["is_correct_choice"] = props.selectedOption?.isAns;
      }

      if (props.correctness) {
        requestBody["correctness"] = props.correctness;
      }

      if (callUpdateLearner) {
        const { data: updateLearnerData } = await axios.post(
          `${import.meta.env.VITE_APP_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
          requestBody
        );

        //TODO: handle  Errors

        data = updateLearnerData;
        responseText = data.responseText;
        profanityWord = await filterBadWords(data.responseText);
        if (profanityWord.includes("**")) {
          props?.setOpenMessageDialog({
            message: "Please avoid using inappropriate language.",
            isError: true,
          });
        }
        newThresholdPercentage = data?.subsessionTargetsCount || 0;
        if (contentType.toLowerCase() !== "word") {
          handlePercentageForLife(
            newThresholdPercentage,
            contentType,
            data?.subsessionFluency,
            lang
          );
        }
      }

      if (responseText.toLowerCase() === originalText.toLowerCase()) {
        setIsMatching(true);
      } else {
        setIsMatching(false);
      }

      //console.log('textss', recordedAudio, isMatching, responseText, originalText);

      const responseEndTime = new Date().getTime();
      const responseDuration = Math.round(
        (responseEndTime - responseStartTime) / 1000
      );

      let texttemp = responseText.toLowerCase();
      texttemp = replaceAll(texttemp, ".", "");
      texttemp = replaceAll(texttemp, "'", "");
      texttemp = replaceAll(texttemp, ",", "");
      texttemp = replaceAll(texttemp, "!", "");
      texttemp = replaceAll(texttemp, "|", "");
      texttemp = replaceAll(texttemp, "?", "");
      const studentTextArray = texttemp.split(" ");

      let tempteacherText = originalText.toLowerCase();
      tempteacherText = tempteacherText.replace(/\u00A0/g, " ");
      tempteacherText = tempteacherText.trim();
      tempteacherText = replaceAll(tempteacherText, ".", "");
      tempteacherText = replaceAll(tempteacherText, "'", "");
      tempteacherText = replaceAll(tempteacherText, ",", "");
      tempteacherText = replaceAll(tempteacherText, "!", "");
      tempteacherText = replaceAll(tempteacherText, "|", "");
      tempteacherText = replaceAll(tempteacherText, "?", "");
      const teacherTextArray = tempteacherText.split(" ");

      let student_correct_words_result = [];
      let student_incorrect_words_result = [];
      let originalwords = teacherTextArray.length;
      let studentswords = studentTextArray.length;
      let wrong_words = 0;
      let correct_words = 0;
      let result_per_words = 0;

      let word_result_array = compareArrays(teacherTextArray, studentTextArray);

      for (let i = 0; i < studentTextArray.length; i++) {
        if (teacherTextArray.includes(studentTextArray[i])) {
          correct_words++;
          student_correct_words_result.push(studentTextArray[i]);
        } else {
          wrong_words++;
          student_incorrect_words_result.push(studentTextArray[i]);
        }
      }
      //calculation method
      if (originalwords >= studentswords) {
        result_per_words = Math.round(
          Number((correct_words / originalwords) * 100)
        );
      } else {
        result_per_words = Math.round(
          Number((correct_words / studentswords) * 100)
        );
      }

      const errorRate = calcCER(responseText, tempteacherText);
      let finalScore = 100 - errorRate * 100;

      finalScore = finalScore < 0 ? 0 : finalScore;

      let word_result = finalScore === 100 ? "correct" : "incorrect";

      // TODO: Remove false when VITE_APP_AWS_S3_BUCKET_NAME and keys added
      let audioFileName = "";
      if (import.meta.env.VITE_APP_CAPTURE_AUDIO === "true") {
        let getContentId = currentLine;
        audioFileName = `${
          import.meta.env.VITE_APP_CHANNEL
        }/${sessionId}-${Date.now()}-${getContentId}.wav`;

        const command = new PutObjectCommand({
          Bucket: import.meta.env.VITE_APP_AWS_S3_BUCKET_NAME,
          Key: audioFileName,
          Body: Uint8Array.from(window.atob(base64Data), (c) =>
            c.charCodeAt(0)
          ),
          ContentType: "audio/wav",
        });
        try {
          await S3Client.send(command);
        } catch (err) {}
      }

      response(
        {
          // Required
          target:
            import.meta.env.VITE_APP_CAPTURE_AUDIO === "true"
              ? `${audioFileName}`
              : "", // Required. Target of the response
          //"qid": "", // Required. Unique assessment/question id
          type: "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
          values: [
            { original_text: originalText },
            { response_text: responseText },
            { response_correct_words_array: student_correct_words_result },
            { response_incorrect_words_array: student_incorrect_words_result },
            { response_word_array_result: word_result_array },
            { response_word_result: word_result },
            { accuracy_percentage: finalScore },
            { duration: responseDuration },
          ],
        },
        "ET"
      );

      setApiResponse(callUpdateLearner ? data.status : "success");

      if (
        callUpdateLearner &&
        (props.pageName === "wordsorimage" || props.pageName === "m5")
      ) {
        const isMatching =
          data?.createScoreData?.session?.error_rate?.character === 0;
        if (typeof props.updateStoredData === "function") {
          props.updateStoredData(recordedAudio, isMatching);
        }
      }
      if (props.handleNext) {
        props.handleNext();
        if (temp_audio !== null) {
          temp_audio.pause();
          setPauseAudio(false);
        }
      }
      setLoader(false);
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
    } catch (error) {
      setLoader(false);
      if (props.handleNext) {
        props.handleNext();
      }
      if (props.setIsNextButtonCalled) {
        props.setIsNextButtonCalled(false);
      }
      setRecordedAudioBase64("");
      setApiResponse("error");
      console.log("err", error);
    }
  };

  const handlePercentageForLife = (
    percentage, // subsessionTargetsCount
    contentType,
    fluencyScore, // subsessionFluency
    language
  ) => {
    try {
      if (livesData) {
        let totalSyllables = livesData?.totalTargets;
        if (language === "en") {
          // TODO: need to check why this is 50
          if (totalSyllables > 50) {
            totalSyllables = 50;
          }
        }
        // Calculate the current percentage based on total targets.
        percentage = Math.round((percentage / totalSyllables) * 100);

        // Define the total number of lives and adjust the threshold based on syllables.
        const totalLives = 5;
        let threshold = 30; // Default threshold

        // Adjust the threshold based on total syllables.
        if (totalSyllables <= 100) threshold = 30;
        else if (totalSyllables > 100 && totalSyllables <= 150) threshold = 25;
        else if (totalSyllables > 150 && totalSyllables <= 175) threshold = 20;
        else if (totalSyllables > 175 && totalSyllables <= 250) threshold = 15;
        else if (totalSyllables > 250 && totalSyllables <= 500) threshold = 10;
        else if (totalSyllables > 500) threshold = 5;

        // Calculate lives lost based on percentage.
        let livesLost = Math.floor(percentage / (threshold / totalLives));

        // Check fluency criteria and adjust lives lost accordingly.
        let meetsFluencyCriteria;
        switch (contentType.toLowerCase()) {
          case "word":
            meetsFluencyCriteria = fluencyScore < 2;
            break;
          case "sentence":
            meetsFluencyCriteria = fluencyScore < 6;
            break;
          case "paragraph":
            meetsFluencyCriteria = fluencyScore < 10;
            break;
          default:
            meetsFluencyCriteria = true; // Assume criteria met if not specified.
        }

        // If fluency criteria are not met, reduce an additional life, but ensure it doesn't exceed the total lives.
        if (!meetsFluencyCriteria && livesLost < totalLives) {
          livesLost = Math.min(livesLost + 1, totalLives);
        }

        // Determine the number of red and black lives to show.
        const redLivesToShow = totalLives - livesLost;
        let blackLivesToShow = 5;
        if (livesLost <= 5) {
          blackLivesToShow = livesLost;
        }

        // Prepare the new lives data.
        let newLivesData = {
          ...livesData,
          blackLivesToShow,
          redLivesToShow,
          meetsFluencyCriteria: meetsFluencyCriteria,
        };

        // Play audio based on the change in lives.
        const HeartGaain =
          livesData.redLivesToShow === undefined
            ? 5 - newLivesData.redLivesToShow
            : livesData.redLivesToShow - newLivesData.redLivesToShow;
        let isLiveLost;
        if (HeartGaain > 0) {
          isLiveLost = true;
        } else {
          isLiveLost = false;
        }
        const audio = new Audio(isLiveLost ? livesCut : livesAdd);
        audio.play();

        // Update the state or data structure with the new lives data.
        setLivesData(newLivesData);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  // const getpermision = () => {
  //   navigator.getUserMedia =
  //     navigator.getUserMedia ||
  //     navigator.webkitGetUserMedia ||
  //     navigator.mozGetUserMedia ||
  //     navigator.msGetUserMedia;
  //   navigator.getUserMedia(
  //     { audio: true },
  //     () => {
  //       console.log("Permission Granted");
  //       setAudioPermission(true);
  //     },
  //     () => {
  //       console.log("Permission Denied");
  //       setAudioPermission(false);
  //       //alert("Microphone Permission Denied");
  //     }
  //   );
  // };
  const getpermision = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setAudioPermission(true);
      })
      .catch((error) => {
        console.log("Permission Denied");
        setAudioPermission(false);
        //alert("Microphone Permission Denied");
      });
  };

  //console.log('textss', recordedAudio, isMatching);

  return (
    <div>
      {loader ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
        </Box>
      ) : (
        (() => {
          if (audioPermission != null) {
            if (audioPermission) {
              return (
                <>
                  <AudioCompare
                    setRecordedAudio={setRecordedAudio}
                    originalText={props.originalText}
                    playAudio={playAudio}
                    pauseAudio={pauseAudio}
                    playRecordedAudio={playRecordedAudio}
                    isStudentAudioPlaying={isStudentAudioPlaying}
                    dontShowListen={
                      props.isShowCase
                        ? props.isShowCase && !recordedAudio
                        : props.dontShowListen
                    }
                    isShowCase={props.isShowCase}
                    isAudioPreprocessing={isAudioPreprocessing}
                    recordedAudio={recordedAudio}
                    setEnableNext={props.setEnableNext}
                    showOnlyListen={props.showOnlyListen}
                    setOpenMessageDialog={props.setOpenMessageDialog}
                    handleProcess={handleProcess}
                  />
                  {/* <RecordVoiceVisualizer /> */}
                </>
              );
            } else {
              return (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    // alert(
                    //   "Microphone is blocked. Enable microphone to continue."
                    // );
                    props.setOpenMessageDialog({
                      message:
                        "Microphone is blocked. Enable microphone to continue.",
                      isError: true,
                    });
                  }}
                >
                  <SpeakButton />
                </Box>
              );
            }
          }
        })()
      )}
      {!loader && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {props.enableNext && (
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (props.setIsNextButtonCalled) {
                  props.setIsNextButtonCalled(true);
                } else {
                  props.handleNext();
                }
              }}
            >
              <NextButtonRound />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

VoiceAnalyser.propTypes = {
  enableNext: PropTypes.bool.isRequired,
  setIsNextButtonCalled: PropTypes.func,
  handleNext: PropTypes.func.isRequired,
  originalText: PropTypes.string,
  isShowCase: PropTypes.bool,
  dontShowListen: PropTypes.bool,
  setEnableNext: PropTypes.func.isRequired,
  showOnlyListen: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  contentType: PropTypes.string.isRequired,
  currentLine: PropTypes.number.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setVoiceAnimate: PropTypes.func.isRequired,
  setRecordedAudio: PropTypes.func.isRequired,
  setVoiceText: PropTypes.func.isRequired,
  livesData: PropTypes.object,
  contentId: PropTypes.string,
  updateStoredData: PropTypes.func.isRequired,
  pageName: PropTypes.string,
};

export default VoiceAnalyser;
