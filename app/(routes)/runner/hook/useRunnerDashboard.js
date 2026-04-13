import { useRunnerOrders } from "./useRunnerOrders";
import { useRunnerProfile } from "./useRunnerProfile";
import { useRunnerStats } from "./useRunnerStats";

export const useRunnerDashboard = () => {
    const {
        runner,
        runner_id,
        is_runner,
        isActive,
        toggleAvailability,
        refreshRunner,
        isLoading: profileLoading,
        error: profileError,
    } = useRunnerProfile();

    const {
        activeOrder,
        pendingOrders,
        refreshOrders,
        isLoading: ordersLoading,
        error: ordersError,
    } = useRunnerOrders({ runner_id, isActive });

    const {
        stats,
        refreshStats,
        isLoading: statsLoading,
        error: statsError,
    } = useRunnerStats({ runner_id });

    const refreshDashboard = () => {
        refreshRunner();
        refreshStats();
        refreshOrders();
    };

    return {
        runner,
        runner_id,
        is_runner,

        isActive,
        toggleAvailability,

        activeOrder,
        pendingOrders,
        stats,

        refreshDashboard,

        isLoading:
            profileLoading || ordersLoading || statsLoading,

        hasError:
            profileError || ordersError || statsError,
    };
};