import { Box } from "@mui/material";


function ProgressBar({stepsArr, currentStep, steps}) {
  return (
    <Box
      sx={{
        width: "85vw",
        position: "absolute",
        display: "flex",
        top: "0",
      }}
    >
      {stepsArr?.map((step, index) => {
        const showGreen = step + 1 <= currentStep;
        return (
          <Box
            index={index}
            sx={{
              height: "8px",
              width: `${100 / steps}%`,
              background: showGreen ? "#18DE2C" : "#C1C6CC",
              marginLeft: "3px",
            }}
          ></Box>
        );
      })}
    </Box>
  );
}

export default ProgressBar;