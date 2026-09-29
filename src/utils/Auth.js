import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Auth = () => {
  const navigate = useNavigate();

  const isLogin = () => {
    if (!Cookies.get('token')) {
      return false;
    }
    return Cookies.get('token');
  };
  const setLogin = (value) => {
    Cookies.set('token', value, { secure: true });
    navigate('/');
  };

  const ApiRequest = async ({
    url,
    formdata = null,
    method = 'post',
    type = 'application/json'
  }) => {
    try {
      const api_request = axios.create({
        baseURL: import.meta.env.VITE_API_HOST
      });
      if (isLogin()) {
        let token = Cookies.get('token');
        api_request.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;
      }
      const response = await api_request({
        method: method,
        url: url,
        responseType: type,
        data: formdata,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (response?.status === 200) {
        const { data } = response;
        return JSON.parse(data);
      } else {
        return response;
      }
      //    toast.dismiss(id); // next cut it
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST' && error.response?.status === 401) {
        navigate('/login');
      } else {
        // console.log("response", error.response);
      }

      // console.log(error);
    }
  };

  return { isLogin, setLogin, ApiRequest };
};
export default Auth;
