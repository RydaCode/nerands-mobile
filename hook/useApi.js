// hooks/useApi.js
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "./axiosInstance";

const MAX_RETRIES = 2;
const BACKOFF_BASE = 1000;
const offlineQueue = [];

const useApi = (endpoint, { autoFetch = false, enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);
  const fetchedRef = useRef(false);

  /* -------------------- UNMOUNT SAFETY -------------------- */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  /* -------------------- CORE REQUEST -------------------- */
  const request = useCallback(
    async (
      method,
      body = null,
      customEndpoint = null,
      retries = MAX_RETRIES,
      config = {}
    ) => {
      if (!mountedRef.current) {
        return { success: false, canceled: true };
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        /* -------- OFFLINE CHECK -------- */
        const netState = await NetInfo.fetch();

        if (!netState.isConnected) {
          offlineQueue.push({ method, body, customEndpoint, config });
          return { success: false, offline: true };
        }

        /* -------- REQUEST -------- */
        const url = customEndpoint || endpoint;

        const response = await axiosInstance.request({
          method,
          url,
          data: body,
          signal: controller.signal,
          ...config,
        });

        if (!mountedRef.current) {
          return { success: false, canceled: true };
        }

        setData(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        if (!mountedRef.current) {
          return { success: false, canceled: true };
        }

        /* -------- REQUEST CANCELED -------- */
        if (err.name === "CanceledError") {
          return { success: false, canceled: true };
        }

        /* -------- RETRY -------- */
        if (retries > 0) {
          await new Promise((res) =>
            setTimeout(
              res,
              BACKOFF_BASE * 2 ** (MAX_RETRIES - retries)
            )
          );
          return request(
            method,
            body,
            customEndpoint,
            retries - 1,
            config
          );
        }

        /* -------- BACKEND DOWN / NETWORK ERROR -------- */
        if (!err.response) {
          const message =
            "Server is unreachable. Please try again later.";

          setError({ message });

          return {
            success: false,
            offline: false,
            message,
          };
        }

        /* -------- API ERROR -------- */
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong";

        setError({
          status: err.response?.status,
          message,
        });

        return {
          success: false,
          offline: false,
          message,
        };
      } finally {
        mountedRef.current && setIsLoading(false);
      }
    },
    [endpoint]
  );

  /* -------------------- AUTO FETCH -------------------- */
  useEffect(() => {
    if (!autoFetch || !enabled || fetchedRef.current) return;

    fetchedRef.current = true;
    request("GET");
  }, [autoFetch, enabled, request]);

  /* -------------------- OFFLINE QUEUE -------------------- */
  const flushQueue = useCallback(async () => {
    if (!offlineQueue.length) return;

    for (const q of offlineQueue) {
      try {
        await request(
          q.method,
          q.body,
          q.customEndpoint,
          MAX_RETRIES,
          q.config
        );
      } catch {}
    }

    offlineQueue.length = 0;
  }, [request]);

  /* -------------------- API -------------------- */
  return {
    data,
    isLoading,
    error,

    get: (customEndpoint, config) =>
      request("GET", null, customEndpoint, MAX_RETRIES, config),
    post: (body, customEndpoint, config) =>
      request("POST", body, customEndpoint, MAX_RETRIES, config),
    patch: (body, customEndpoint, config) =>
      request("PATCH", body, customEndpoint, MAX_RETRIES, config),
    del: (body, customEndpoint, config) =>
      request("DELETE", body, customEndpoint, MAX_RETRIES, config),

    flushQueue,
  };
};

export default useApi;