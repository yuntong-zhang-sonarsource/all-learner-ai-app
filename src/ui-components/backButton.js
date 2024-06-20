import { IconButton } from "@mui/material";
import back from "../assets/images/back-arrow.svg";

function BackButton({ onClick }) {
  return (
    <IconButton onClick={onClick}>
      <img src={back} alt="back" style={{ height: "30px" }} />
    </IconButton>
  );
}

export default BackButton;
