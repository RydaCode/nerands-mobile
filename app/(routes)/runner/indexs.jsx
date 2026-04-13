import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MainHeader from "../../../components/MainHeader";
import LoadingIndicator from "../../LoadingIndicator";
import AssignmentModal from "./AssignmentModal";
import AssignmentsCard from "./AssignmentsCard";
import NotRunnerView from "./NotRunnerView";
import RunnerActions from "./RunnerActions";
import RunnerHeader from "./RunnerHeader";
import StatsCards from "./StatsCards";

import { useState } from "react";
import LocationComponent from "../../../services/LocationComponent";
import BuyTripsModal from "./BuyErrandsModal";
import { useRunnerDashboard } from "./hook/useRunnerDashboard";

const Index = () => {
    const router = useRouter();
    const [buyerrands, setBuyErrands] = useState(false);
    const [settings, setSettings] = useState(false);

    const {
        isLoading,
        runner,
        runner_id,
        is_runner,
        activeOrder,
        customOrder,
        pendingOrders,
        stats,
        isActive,
        toggleAvailability,
        refreshDashboard
    } = useRunnerDashboard();

    if (isLoading) {
        return <LoadingIndicator loading_text="Loading runner data..." />;
    }

    <LocationComponent role="runner" userId={runner_id} />;

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            {/* Pass refresh function to modal */}
            <AssignmentModal
                pendingorders={pendingOrders}
                onClose={() => setBuyErrands}
                refreshOrders={refreshDashboard} // refresh pending orders after action
            />

            <View className="px-4">
                <MainHeader header_name="Runner" fontFamily='maven-medium' textStyles="text-2xl text-black" />
            </View>

            <View className='mb-6'>
                <RunnerHeader runner={runner} setSettings={setSettings} />
            </View>

            <FlatList
                data={[]}
                ListHeaderComponent={
                    !is_runner ? (
                        <NotRunnerView router={router} />
                    ) : (
                        <>
                            <StatsCards stats={stats} runner={runner} />
                            <AssignmentsCard
                                activeOrder={activeOrder}
                                customOrder={customOrder}
                                runner={runner}
                                router={router}
                                text="Go to Assignment"
                            />
                            <RunnerActions
                                isActive={isActive}
                                toggleAvailability={toggleAvailability}
                                setBuyErrands={setBuyErrands}
                            />
                            <BuyTripsModal
                                visible={buyerrands}
                                setBuyErrands={setBuyErrands}
                                runner_id={runner_id}
                            />
                        </>
                    )
                }
                renderItem={null}
            />
        </SafeAreaView>
    );
};

export default Index;