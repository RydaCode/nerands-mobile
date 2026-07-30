import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useApi from "../../../../hook/useApi";
import {
    startBackgroundTracking,
    stopBackgroundTracking,
} from "../../../../services/LocationServices";
import { toast } from "../../../../utils/toast";

export const useRunnerProfile = () => {
    const { user_id, is_runner } = useSelector((s) => s.auth);

    /* -------------------- APIs -------------------- */
    const {data: runnerApi, isLoading: getUserLoading, error: getUserError, get: getUserData} = useApi(
        user_id ? `/runner/get_runner/${user_id}` : null
    );
    const availabilityApi = useApi(`/runner/update`);

    const runner = runnerApi;
    const runner_id = runner?.runner_id;

    /* -------------------- Local state -------------------- */
    const [isActive, setIsActive] = useState('NO');

    /* -------------------- Sync backend availability -------------------- */
    useEffect(() => {
        if (!runner) return;

        setIsActive(runner.is_available);
    }, [runner]);

    /* -------------------- Optimistic availability toggle -------------------- */
    const toggleAvailability = async () => {

    console.log("1. toggle called");

    if (!runner_id || isActive === null) {
        console.log("2. stopped", {
            runner_id,
            isActive,
        });
        return;
    }

    const previous = isActive;
    const next = previous === "YES" ? "NO" : "YES";

    console.log("3. changing", {
        previous,
        next
    });

    setIsActive(next);

    try {

        console.log("4. sending API update");

        const response = await availabilityApi.patch({
            user_id,
            runner_id,
            is_available: next,
        });

        console.log("5. API response", response);


        if (next === "YES") {

            console.log("6. starting tracking");
            await startBackgroundTracking();

        } else {

            console.log("7. stopping tracking");
            await stopBackgroundTracking();

        }


        console.log("8. completed");

        toast.success(
            "Success",
            next === "YES"
                ? "You are now available"
                : "You are now offline"
        );


    } catch (error) {

        console.log("ERROR:", error);

        setIsActive(previous);

        toast.error(
            "Error",
            "Could not update availability"
        );
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