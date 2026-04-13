import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useApi from "../../../../hook/useApi";
import {
    startBackgroundTracking,
    stopBackgroundTracking,
} from "../../../../services/LocationServices";
import { toast } from "../../../../utils/toast";

export const useRunnerProfile = () => {
    const { user_id, runner_id, is_runner } = useSelector((s) => s.auth);

    /* -------------------- APIs -------------------- */
    const {data: runnerApi, isLoading: getUserLoading, error: getUserError, get: getUserData} = useApi(user_id ? `/runner/get_runner/${user_id}` : null);
    const availabilityApi = useApi(`/runner/update`);

    const runner = runnerApi;

    console.log("RUNNERSSS", runner?.profile_image);

    /* -------------------- Local state -------------------- */
    const [isActive, setIsActive] = useState('NO');

    /* -------------------- Sync backend availability -------------------- */
    useEffect(() => {
        if (!runner) return;

        // Only sync on initial load / runner_id change
        setIsActive(runner.is_available === "YES");
    }, [runner_id, runner]);

    /* -------------------- Optimistic availability toggle -------------------- */
    const toggleAvailability = async () => {
        if (!runner_id) return;

        const prev = isActive;
        const next = !prev;

        // 1️⃣ Optimistic UI update
        setIsActive(next);

        try {
            // 2️⃣ Update backend first
            await availabilityApi.patch({
                runner_id,
                is_assigned: next ? "YES" : "NO",
            });

            // 3️⃣ Start/Stop background tracking safely
            if (next) await startBackgroundTracking();
            else await stopBackgroundTracking();

            toast.success(
                "Success",
                next ? "Tracking started" : "Tracking stopped"
            );
        } catch (err) {
            // ❌ Rollback UI and tracking
            setIsActive(prev);

            try {
                if (next) await stopBackgroundTracking();
                else await startBackgroundTracking();
            } catch (_) {
                // ignore tracking rollback errors
            }
            console.log(err)
            toast.error("Error", "Could not change availability");
        }
    };

    useEffect(() => {
        if (user_id) {
            getUserData();
        }
    }, [user_id]);

    /* -------------------- Refresh runner -------------------- */
    const refreshRunner = getUserData;
    
    /* -------------------- Loading & Error -------------------- */
    const isLoading = getUserLoading || availabilityApi.isLoading;
    const error = getUserError || availabilityApi.error;

    /* -------------------- Return values -------------------- */
    return {
        runner,
        runner_id,
        is_runner,
        isActive,

        toggleAvailability,
        refreshRunner,

        isLoading,
        error,
    };
};