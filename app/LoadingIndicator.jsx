import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { COLORS } from '../constants/constants';

const LoadingIndicator = ({ loading_text }) => {
    return (
        <>
            {/* Forces overlay into status bar space */}
            <StatusBar
                translucent
                backgroundColor="rgba(0,0,0,0.4)"
                barStyle="light-content"
            />

            <View className='inset-0' style={styles.overlay}>
                <View className='flex-1 justify-center items-center px-4' style={styles.center}>
                    <View className='flex-row py-4 items-center w-full px-4 rounded-md bg-white'>
                        <ActivityIndicator size={50} color={COLORS.primary} />
                        <Text className='ml-2 text-xl' style={{fontFamily: 'roboto-medium'}}>
                            {loading_text?.trim() || "Please wait..."}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 9999,
        elevation: 9999, // Android
    }
});
