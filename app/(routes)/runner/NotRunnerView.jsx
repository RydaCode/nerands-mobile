import { Text, TouchableOpacity, View } from 'react-native';

const NotRunnerView = ({ router }) => (
    <View className="flex-1 justify-center items-center px-2 w-full">
        <View className="p-4 bg-white rounded-lg shadow-md">
            <Text className="text-lg text-slate text-center" style={{ fontFamily: 'roboto-medium' }}>
                You're not currently registered as a runner.{"\n"}Press the button below to sign up now.
            </Text>

            <Text style={{ fontFamily: 'roboto-bold' }} className="text-xl text-green-700 text-center my-2">
                🏃 Become a runner & Enjoy These Benefits! 🚀
            </Text>

            <TouchableOpacity
                className="bg-green-600 mt-4 py-4 rounded-md items-center"
                onPress={() => router.push({ pathname: '../create-runner-ac' })}
            >
                <Text className="text-white text-2xl" style={{ fontFamily: 'maven-medium' }}>
                    Register Now
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default NotRunnerView;