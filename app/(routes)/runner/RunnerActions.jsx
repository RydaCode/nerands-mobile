import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';

const RunnerActions = ({ isActive, toggleAvailability, setBuyErrands, router, runner_id }) => {
    const isAvailable = isActive === "YES";
    const loadingAvailability = isActive === null;
    return (
        <View className="w-full flex-row justify-between items-center mt-4">
            <TouchableOpacity
                className="bg-green2 elevation-lg rounded-md justify-center items-center"
                style={{ width: '32%', height: 70 }}
                onPress={() => setBuyErrands(true)}
            >
                <MaterialCommunityIcons name="bike-fast" color="red" size={20} />
                <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>
                    Buy Errands
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-green2 elevation-lg rounded-md justify-center items-center"
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
                className={`rounded-md elevation-lg justify-center items-center`}
                style={{ width: '32%', height: 70, backgroundColor: isAvailable ? COLORS.red : COLORS.green2 }}
                disabled={loadingAvailability}
                onPress={() => {
                    console.log("Availability button pressed");
                    toggleAvailability();
                }}
            >
                <MaterialCommunityIcons name="bike-fast" color="#fff" size={20}/>

                <Text
                    className="text-base text-white"
                    style={{ fontFamily:'roboto-medium' }}
                >
                    {loadingAvailability 
                        ? "Loading..." : isAvailable ? "Go Offline" : "Go Online"
                    }
                </Text>
            </TouchableOpacity>
        </View>
    )
};

export default RunnerActions;