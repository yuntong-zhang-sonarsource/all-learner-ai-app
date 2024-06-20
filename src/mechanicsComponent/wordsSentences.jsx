import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

// Used for words & sentences
function WordSentencesMechanics({ words, matchedChar, highlightWords }) {
  return (
    <Box>
      {!words && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
        </Box>
      )}
      {words && !matchedChar && (
        <Typography
          variant="h5"
          component="h4"
          sx={{
            mb: 4,
            color: "#333F61",
            textAlign: "center",
            fontSize: "40px",
            paddingX: "140px",
            lineHeight: "normal",
            fontWeight: 700,
            fontFamily: "Quicksand",
            lineHeight: "50px",
          }}
        >
          {words || ""}
        </Typography>
      )}
      {matchedChar && (
        <Box
          display={"flex"}
          mb={4}
          sx={{
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {highlightWords(words, matchedChar)}
        </Box>
      )}
    </Box>
  );
}

export default WordSentencesMechanics;
