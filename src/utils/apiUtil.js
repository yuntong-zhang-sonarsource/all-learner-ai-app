import axios from "axios";
import { getLocalData } from "./constants";
import config from "./urlConstants.json";

export const fetchASROutput = async (
  base64Data,
  options,
  setLoader,
  setApiResponse
) => {
  try {
    setLoader(true);

    const lang = getLocalData("lang");
    const virtualId = getLocalData("virtualId");
    const sessionId = getLocalData("sessionId");
    const sub_session_id = getLocalData("sub_session_id");

    const requestBody = {
      original_text: options.originalText || "",
      audio: base64Data,
      user_id: virtualId,
      session_id: sessionId,
      language: lang,
      date: new Date(),
      sub_session_id,
      contentId: options.contentId || "",
      contentType: options.contentType || "",
      mechanics_id: localStorage.getItem("mechanism_id") || "",
      //comprehension: options.comprehension || "",
      ans_key: [options.originalText || ""],
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody
    );

    setApiResponse(data?.status || "success");
  } catch (error) {
    console.error("Error in fetchASROutput:", error);
    setApiResponse("error");
  } finally {
    setLoader(false);
  }
};

export const handleTextEvaluation = async (teacherText, studentText) => {
  try {
    const formData = new FormData();
    formData.append("teacherText", `1. ${teacherText}`);
    formData.append("studentText", `1. ${studentText}`);

    const response = await fetch(
      "https://dev-ekstep-tell-ocr-service-985885894164.asia-south1.run.app/api/v1/ocr/gemini/evaluateText",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    console.log("Evaluation API Response:", result);

    const evalResult = result?.responseObj?.responseDataParams?.data?.[0] || {};

    return {
      marks: evalResult.marks || 0,
      grades: evalResult.marks || 0,
      semantics: evalResult.semantics || 0,
      context: evalResult.context || 0,
      grammar: evalResult.grammar || 0,
      accuracy: evalResult.accuracy || 0,
      overall: evalResult.overall || 0,
    };
  } catch (error) {
    console.error("Error in evaluateText API:", error);
    return null;
  }
};
