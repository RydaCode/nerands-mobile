import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const RunnerActions = ({ isActive, setBuyErrands, router, runner_id, user_id, reload }) => {
    const {data, isLoading, error, patch} = useApi('/runner/update');

    /* -------------------- Optimistic availability toggle -------------------- */
    const toggleAvailability = async () => {

        const next = isActive === "YES"
            ? "NO"
            : "YES";

        try {

            const res = await patch({
                user_id,
                runner_id,
                is_available: next,
            });

            console.log("res", res)

            if (!res?.success) {
                toast.error( res?.data?.message || 'Failed to update availability.');
                reload();
                return;
            } else {
                toast.success(
                    "Success",
                    next === "YES"
                        ? "You are now available"
                        : "You are now offline"
                );

                reload();
            }

        } catch(err){
            console.log(err);
        }
    };

    const available = isActive;

    return (
        <View className="w-full flex-row justify-between items-center mb-2 mt-4">
            <TouchableOpacity
                className="bg-green2 elevation-sm rounded justify-center items-center"
                style={{ width: '32%', height: 70 }}
                onPress={() => setBuyErrands(true)}
            >
                <MaterialCommunityIcons name="bike-fast" color="red" size={20} />
                <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>
                    Buy Errands
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-green2 elevation-sm rounded justify-center items-center"
                style={{ width: '32%', height: 70 }}
                onPress={() => router.push({
                    pathname: './runner-orders',
                    params: { runner_id: runner_id },
                })}
            >
                <Text className="text-xl">📍</Text>
                <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>
                    Active Orders
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className={`rounded elevation-sm justify-center items-center`}
                style={{ width: '32%', height: 70, backgroundColor: available === 'YES' ? COLORS.red : COLORS.green2 }}
                disabled={isLoading}
                onPress={toggleAvailability}
            >
                {isLoading ? (
                    <ActivityIndicator color={COLORS.white} size={'small'}/>
                ) : (
                    <>
                        <MaterialCommunityIcons name="bike-fast" color="#fff" size={20}/>

                        <Text
                            className="text-base text-white"
                            style={{ fontFamily:'roboto-medium' }}
                        >
                            {available === 'YES' ? "Go Offline" : "Go Online"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )
};

export default RunnerActions;