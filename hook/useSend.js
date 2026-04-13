import axios from "axios";
import { useState } from "react";
import { getTokens, setTokens } from "../app/(auth)/auth/tokenManager";
import { SERVER_URI } from "../RequestMethods";

const useSend = (endpoint, params) => {
  const [send, setSend] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendData = async () => {
    setIsLoading(true);
    setError(null);
    setSend(null);

    const { accessToken, refreshToken } = await getTokens();

    try {
      const response = await axios.post(`${SERVER_URI}${endpoint}`, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      setSend(response.data);
    } catch (err) {
      if (err.response?.status === 401 && refreshToken) {
        try {
          const refreshRes = await axios.post(
            `${SERVER_URI}/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const newAccessToken = refreshRes.data.accessToken;
          await setTokens({ accessToken: newAccessToken });

          // Retry original request
          const retryRes = await axios.post(`${SERVER_URI}${endpoint}`, params, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          setSend(retryRes.data);
        } catch (refreshError) {
          setError({
            status: refreshError.response?.status,
            message: "Session expired. Please log in again.",
          });
        }
      } else {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "An unknown error occurred.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setError(null);
    setSend(null);
  };

  const resend = () => {
    sendData();
  };

  return { send, isLoading, error, resend, clear };
};

export default useSend;