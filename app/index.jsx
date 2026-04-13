import NetInfo from "@react-native-community/netinfo"; // Network status
import { useRouter } from "expo-router"; // Navigation
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux"; // Redux hook

const index = () => {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(true); // State for network status

    // Get location data from Redux store with fallback to prevent errors
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } =
        useSelector((state) => state.location) || {};

    // Check network connection on mount
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            {/* Show warning if no internet */}
            {!isConnected && (
                <Text className="text-red-500 mb-2">No internet connection</Text>
            )}

            {/* Continue button */}
            <TouchableOpacity onPress={() => router.push("(tabs)")}>
                <Text className="text-base text-primary" style={{ fontFamily: "maven-bold" }}>
                    Continue
                </Text>

                {/* Location display */}
                <Text className="text-base" style={{ fontFamily: "maven-medium" }}>
                    {displayCurrentLocation || "Fetching location..."}
                </Text>
                <Text className="text-base" style={{ fontFamily: "maven-medium" }}>
                    {latitude !== null ? latitude : "Lat not available"}
                </Text>
                <Text className="text-base" style={{ fontFamily: "maven-medium" }}>
                    {longitude !== null ? longitude : "Long not available"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default index;