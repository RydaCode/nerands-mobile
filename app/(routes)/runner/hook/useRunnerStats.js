import { useEffect } from "react";
import useApi from "../../../../hook/useApi";

export const useRunnerStats = ({ runner_id }) => {
    const dailyApi = useApi(
        runner_id ? `/trips/runner/daily/${runner_id}` : null
    );

    const completedApi = useApi(
        runner_id
            ? `/trips/runner/performed?runner_id=${runner_id}&order_status=completed&page=1&limit=10`
            : null
    );

    const cancelledApi = useApi(
        runner_id
            ? `/trips/runner/performed?runner_id=${runner_id}&order_status=cancelled&page=1&limit=10`
            : null
    );

    const paidErrandsApi = useApi(
        runner_id ? `/trips/get_errands/${runner_id}?req_type=paid` : null
    );

    useEffect(() => {
        if (!runner_id) return;

        dailyApi.get();
        completedApi.get();
        cancelledApi.get();
        paidErrandsApi.get();
    }, [runner_id]);

    return {
        stats: {
            available: paidErrandsApi.data?.errands?.errandsCount ?? 0,
            daily: dailyApi.data?.data?.count ?? 0,
            completed:
                completedApi.data?.data?.todayErrandsCount ?? 0,
            cancelled:
                cancelledApi.data?.data?.todayErrandsCount ?? 0,
        },

        refreshStats: () => {
            dailyApi.get();
            completedApi.get();
            cancelledApi.get();
            paidErrandsApi.get();
        },

        isLoading: [
            dailyApi,
            completedApi,
            cancelledApi,
            paidErrandsApi,
        ].some((a) => a.isLoading),

        error: [
            dailyApi,
            completedApi,
            cancelledApi,
            paidErrandsApi,
        ].some((a) => a.error),
    };
};