import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel2 from "../../assets/images/desktopLevel2.png";
import desktopLevel3 from "../../assets/images/desktopLevel3.jpg";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const images = {
    desktopLevel1,
    desktopLevel2,
    desktopLevel3,
  };
  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${
      images?.[`desktopLevel${searchParams.get("level") || 1}`]
    })`,
    backgroundSize: "contain", // Cover the entire viewport
    backgroundRepeat: "round", // Center the image
    position: "relative",
  };

  return <div style={sectionStyle}></div>;
};

export default HomePage;
