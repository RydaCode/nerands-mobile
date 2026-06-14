import { Text, View } from 'react-native';

const Redirecting = ({ title = 'Success', redirect_text = 'Redirecting...' }) => {
    return (
        <View className="absolute top-0 left-0 right-0 bg-white bottom-0 z-50 flex-1 justify-center items-center w-full h-full">
            <View className="px-6 py-4 rounded-md">
                <Text className="text-xl text-green2 text-center" style={{ fontFamily: 'roboto-bold' }}>
                    {title}
                </Text>
                <Text className="text-green2 text-lg mt-2 text-center" style={{ fontFamily: 'roboto-medium' }}>
                    {redirect_text}
                </Text>
            </View>
        </View>
    );
};

export default Redirecting;