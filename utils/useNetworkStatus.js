import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const pingServer = async () => {
    const start = Date.now();

    try {
        await fetch("https://www.google.com", {
            method: "GET",
        });

        const duration = Date.now() - start;

        return duration;
    } catch (error) {
        return null;
    }
};

export const useNetworkStatus = () => {
    const [status, setStatus] = useState("unknown"); 
    // unknown | offline | slow | fair | good

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (!state.isConnected) {
                setStatus("offline");
                return;
            }

            // connected → now test speed
            const latency = await pingServer();

            if (latency === null) {
                setStatus("offline");
                return;
            }

            if (latency < 500) setStatus("good");
            else if (latency < 1500) setStatus("fair");
            else setStatus("slow");
        });

        return () => unsubscribe();
    }, []);

    return { status };
};