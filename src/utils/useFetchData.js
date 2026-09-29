import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axiosBs from "./axiosBase";
import axios from "axios";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [render, setRender] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get("token");
    if (token) {

      try {
        const response = await axiosBs.get(import.meta.env.VITE_API_HOST + url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        if (err?.response?.status === 403) {
          Cookies.remove("token");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, render]);

  useEffect(() => {
    if (render) {
      setRender(false);
    }
  }, [render]);

  return { data, loading, error, setLoading, setRender };
};

export default useFetchData;
