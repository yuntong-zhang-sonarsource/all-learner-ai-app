import axios from "axios";
import config from "../../utils/urlConstants.json";

const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

export const fetchVirtualId = async (username) => {
  try {
    const response = await axios.post(
      `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching virtual ID:", error);
    throw error;
  }
};
