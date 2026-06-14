import { useEffect, useMemo } from "react";
import useApi from "../../../../hook/useApi";

export const useRunnerOrders = ({ runner_id, isActive }) => {
    const acceptedApi = useApi(
        runner_id
            ? `/trips/runner/errands?runner_id=${runner_id}&order_status=Accepted&page=1&limit=1`
            : null
    );

    const progressingApi = useApi(
        runner_id
            ? `/trips/runner/errands?runner_id=${runner_id}&order_status=in_progress&page=1&limit=1`
            : null
    );

    const readyApi = useApi(
        runner_id
            ? `/trips/runner/errands?runner_id=${runner_id}&order_status=ready&page=1&limit=1`
            : null
    );

    const pendingApi = useApi(
        runner_id
            ? `/trips/runner/errands?runner_id=${runner_id}&order_status=pending&page=1&limit=1`
            : null
    );

    useEffect(() => {
        if (!runner_id || !isActive) return;
        acceptedApi.get();
        progressingApi.get();
        readyApi.get();
        pendingApi.get();
    }, [runner_id, isActive]);

    const activeOrder = useMemo(
        () =>
            acceptedApi.data?.data?.[0] ||
            progressingApi.data?.data?.[0] ||
            readyApi.data?.data?.[0] ||
            null,
        [acceptedApi.data, progressingApi.data, readyApi.data]
    );

    return {
        activeOrder,
        pendingOrders: pendingApi.data,

        refreshOrders: () => {
            acceptedApi.get();
            progressingApi.get();
            readyApi.get();
            pendingApi.get();
        },

        isLoading: [
            acceptedApi,
            progressingApi,
            readyApi,
            pendingApi,
        ].some((a) => a.isLoading),

        error: [
            acceptedApi,
            progressingApi,
            readyApi,
            pendingApi,
        ].some((a) => a.error),
    };
};