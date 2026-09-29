import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const axiosBs = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

axiosBs.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      Cookies.remove("token");
      const navigate = useNavigate(); 
      navigate("/login"); 
    }
    return Promise.reject(error);
  }
);

const setAuthorizationHeader = () => {
  const token = Cookies.get("token");
  if (token) {
    axiosBs.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosBs.defaults.headers.common['Authorization']; 
  }
};
setAuthorizationHeader();

export default axiosBs;
