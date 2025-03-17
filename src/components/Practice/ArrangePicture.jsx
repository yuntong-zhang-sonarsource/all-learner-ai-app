import React, { useState } from "react";
import image1Img from "../../assets/image1.svg";
import image2Img from "../../assets/image2.svg";
import image3Img from "../../assets/image3.svg";
import image4Img from "../../assets/image4.svg";
import image5Img from "../../assets/image5.svg";
import profileImg from "../../assets/prfiile.svg";
import crossImg from "../../assets/cross.svg";
import circleImg from "../../assets/circlee.svg";
import nextImg from "../../assets/nexxt.svg";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import { practiceSteps, getLocalData } from "../../utils/constants";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const imagesData = [
  { img: image2Img, id: "1" },
  { img: image3Img, id: "4" },
  { img: image4Img, id: "3" },
  { img: image1Img, id: "5" },
  { img: image5Img, id: "2" },
];

function ArrangePicture({
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
}) {
  const [placedImages, setPlacedImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [wrongAttempts, setWrongAttempts] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  steps = 1;

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data?.images || [];
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

  const currentLevel = practiceSteps?.[currentPracticeStep]?.name || "P1";

  //const conversation = contentM14[level]?.[currentLevel]?.conversation || content?.conversation;

  const conversation = getConversation(level, currentLevel);

  const handleImageClick = (image) => {
    const emptyIndex = placedImages.findIndex((item) => item === null);

    if (emptyIndex !== -1) {
      if (image.id === (emptyIndex + 1).toString()) {
        const updatedPlacedImages = [...placedImages];
        updatedPlacedImages[emptyIndex] = image;
        setPlacedImages(updatedPlacedImages);
      } else {
        const updatedWrongAttempts = [...wrongAttempts];
        updatedWrongAttempts[emptyIndex] = true;
        setWrongAttempts(updatedWrongAttempts);

        setTimeout(() => {
          const resetWrongAttempts = [...wrongAttempts];
          resetWrongAttempts[emptyIndex] = false;
          setWrongAttempts(resetWrongAttempts);
        }, 1000);
      }
    }
  };

  const isAllCorrect = placedImages.every(
    (image, index) => image && image.id === (index + 1).toString()
  );

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#BFE981",
          padding: "0px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <img
            src={profileImg}
            alt="Profile"
            style={{
              width: "35px",
              height: "35px",
              marginLeft: "39px",
              marginTop: "60px",
            }}
          />
        </div>

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
          <h2
            style={{
              fontFamily: "PoetsenOne",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000000",
              marginBottom: "20px",
            }}
          >
            Arrange the Pictures
          </h2>

          {isAllCorrect && (
            <p
              style={{
                fontFamily: "DynaPuff",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#58CC02",
                marginBottom: "20px",
              }}
            >
              Great Work
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              margin: "20px 0",
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#FFEFE6",
                  border: placedImages[index] ? "none" : "2px dashed #FF8C8C",
                  borderRadius: "10px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {placedImages[index] && (
                  <>
                    <img
                      src={placedImages[index].img}
                      alt={`Placed Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <img
                      src={circleImg}
                      alt="Correct"
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        width: "20px",
                        height: "20px",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        width: "15px",
                        height: "15px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        border: "1px solid #000",
                      }}
                    >
                      {index + 1}
                    </div>
                  </>
                )}

                {wrongAttempts[index] && (
                  <>
                    <img
                      src={crossImg}
                      alt="Wrong Attempt"
                      style={{
                        position: "absolute",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <p
                      style={{
                        position: "absolute",
                        bottom: "15px",
                        color: "#000000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Wrong
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {isAllCorrect && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <img
                src={nextImg}
                alt="Next"
                style={{ width: "75px", height: "75px", cursor: "pointer" }}
                onClick={() => {
                  handleNext();
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "25px",
              marginTop: "20px",
            }}
          >
            {imagesData?.map((image) =>
              placedImages.some(
                (placed) => placed && placed.id === image.id
              ) ? null : (
                <div
                  key={image.id}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.img}
                    alt={`Image ${image.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ArrangePicture;
