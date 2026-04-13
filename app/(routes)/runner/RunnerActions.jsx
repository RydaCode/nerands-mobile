import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

const RunnerActions = ({ isActive, toggleAvailability, setBuyErrands, router, runner_id }) => (
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
            className={`bg-${isActive ? 'red' : 'green2'} rounded-md elevation-lg justify-center items-center`}
            style={{ width: '32%', height: 70 }}
            onPress={toggleAvailability}
        >
            <MaterialCommunityIcons name="bike-fast" color="#fff" size={20} />
            <Text className="text-base text-white" style={{ fontFamily: 'roboto-medium' }}>
                {isActive ? 'Disable' : 'Enable'}
            </Text>
        </TouchableOpacity>
    </View>
);

export default RunnerActions;