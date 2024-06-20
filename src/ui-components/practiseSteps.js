import { Box } from "@mui/material";
import { GreenTick, practiceSteps } from "../utils/constants";
//  dummy comment
function PracticeSteps({ currentPracticeStep }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "48px",
            border: "1.5px solid rgba(51, 63, 97, 0.15)",
            ml: {
              lg: 25,
              md: 18,
            },
            borderRadius: "30px",
            background: "white",
          }}
        >
          {practiceSteps.map((elem, i) => {
            return (
              <Box
                key={i}
                sx={{
                  width: {
                    md: "28px",
                    lg: "36px",
                  },
                  height: {
                    md: "28px",
                    lg: "36px",
                  },
                  background:
                    currentPracticeStep > i
                      ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                      : currentPracticeStep == i
                      ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                      : "rgba(0, 0, 0, 0.04)",
                  ml: {
                    md: 1.5,
                    lg: 2,
                  },
                  mr: i == practiceSteps?.length - 1 ? 2 : 0,
                  borderRadius: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentPracticeStep > i ? (
                  <GreenTick />
                ) : (
                  <span
                    style={{
                      color: currentPracticeStep == i ? "white" : "#1E2937",
                      fontWeight: 600,
                      lineHeight: "20px",
                      fontSize: "16px",
                      fontFamily: "Quicksand",
                    }}
                  >
                    {elem.name}
                  </span>
                )}
              </Box>
            );
          })}
        </Box>
        {/* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              ml: {
                                lg: 25,
                                md: 15,
                              },
                              mt: 2,
                            }}
                          >
                            <span
                              style={{
                                color: "#1E2937",
                                fontWeight: 500,
                                lineHeight: "18px",
                                fontSize: "14px",
                                fontFamily: "Quicksand",
                              }}
                            >
                              {"Overall Progress:"}
                            </span>
                            <Box
                              sx={{
                                height: "12px",
                                width: {
                                  md: "250px",
                                  lg: "350px",
                                },
                                background: "#D1F8D5",
                                borderRadius: "6px",
                                ml: 2,
                                position: "relative",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "12px",
                                  width: `${currentPracticeProgress}%`,
                                  background: "#18DE2C",
                                  borderRadius: "6px",
                                  position: "absolute",
                                }}
                              ></Box>
                            </Box>
                            <span
                              style={{
                                color: "#1E2937",
                                fontWeight: 700,
                                lineHeight: "18px",
                                fontSize: "14px",
                                fontFamily: "Quicksand",
                                marginLeft: "10px",
                              }}
                            >
                              {`${currentPracticeProgress}%`}
                            </span>
                          </Box> */}
      </Box>
    </Box>
  );
}

export default PracticeSteps;
