import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router"; // Navigation
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux"; // Redux hook
import { COLORS } from "../constants/constants";
import { Carticons } from "../constants/icons";
import { loadDeliveryCharges } from '../hook/pricing/loadDeliveryCharges';
import useApi from "../hook/useApi";
import { useNetworkStatus } from "../utils/useNetworkStatus";
import useRehydrateAuth from "./(auth)/auth/useRehydrateAuth";

const Index = () => {
    const router = useRouter();
    const { status } = useNetworkStatus();
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const api = useApi();
    const rehydrated = useRehydrateAuth(api.flushQueue);
    const [versionnumber, setVersionNumber] = useState(null);
    // Get location data from Redux store with fallback to prevent errors
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } =
        useSelector((state) => state.location) || {};
    const charges = useSelector(state => state.delivery.charges);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        if (!rehydrated) return;

        const init = async () => {
            try {
                const res = await api.get('/app/version?platform=android');
                const version = res?.data;

                const currentVersion = Constants.expoConfig.version;

                const compareVersions = (a, b) => {
                    const pa = a.split('.').map(Number);
                    const pb = b.split('.').map(Number);

                    for (let i = 0; i < 3; i++) {
                        if ((pa[i] || 0) < (pb[i] || 0)) return -1;
                        if ((pa[i] || 0) > (pb[i] || 0)) return 1;
                    }
                    return 0;
                };

                const isForceBlocked =
                    compareVersions(currentVersion, version.minimum_version) < 0;

                const hasUpdateAvailable =
                    compareVersions(currentVersion, version.latest_version) < 0;

                // 🚫 FORCE UPDATE → STOP EVERYTHING
                if (isForceBlocked) {
                    router.replace({
                        pathname: '/update-app',
                        params: {
                            update_message: version.update_message,
                            play_store_url: version.play_store_url,
                            latest_version: version.latest_version,
                        }
                    });
                    return;
                }

                // 💡 OPTIONAL UPDATE → SHOW ALERT ONLY
                if (hasUpdateAvailable) {
                    setVersionNumber(version);
                    setShowUpdateAlert(true);
                }

                // 🚀 CONTINUE NORMAL FLOW (THIS WAS MISSING BEFORE)
                router.replace(
                    isAuthenticated ? '/(tabs)' : '/(auth)'
                );

            } catch (error) {
                // Fail-safe → still allow access
                router.replace(
                    isAuthenticated ? '/(tabs)' : '/(auth)'
                );
            }
        };

        init();
    }, [rehydrated, isAuthenticated]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!charges || Object.keys(charges).length === 0) {
            dispatch(loadDeliveryCharges());
        }
    }, [dispatch, charges]);

    return (
        <View className="flex-1 relative items-center bg-white justify-between py-10">

            {/* TOP / MIDDLE CONTENT */}
            <View className="items-center flex-1 justify-center">

                <ActivityIndicator size={40} color={COLORS.primary} />
                
                {status === "slow" && (
                    <Text className="text-orange-500 mt-6">
                        Slow internet connection detected
                    </Text>
                )}

                {status === "fair" && (
                    <Text className="text-yellow-500 mt-6">
                        Your internet connection is fair
                    </Text>
                )}

                {status === "good" && (
                    <Text className="text-green-600 mt-6">
                        Your internet connection is excellent
                    </Text>
                )}

                {status === "offline" && (
                    <Text className="text-red mt-6">
                        No internet connection
                    </Text>
                )}

                <View className="w-full justify-center items-center">
                    <Image
                        source={Carticons.landing_screen}
                        style={{ width: 250, height: 100 }}
                    />
                </View>
            </View>

            {/* BOTTOM TEXT */}
            <View className="mb-10 justify-center items-center">
                <Text
                    style={{fontFamily: 'roboto-medium'}}
                    className='text-sm text-slate'
                >App By:</Text>
                <Text
                    style={{fontFamily: 'roboto-medium'}}
                    className='text-base text-black'
                >Aquanet Technologies Ltd.</Text>
            </View>

            {showUpdateAlert && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 60,
                        left: 20,
                        right: 20,
                        backgroundColor: '#fff',
                        padding: 16,
                        borderRadius: 12,
                        elevation: 5,
                    }}
                >
                    <Text style={{ fontSize: 15, marginBottom: 10 }}>
                        {versionnumber.update_message}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            className='bg-green-600 w-full justify-center items-center py-2 rounded'
                            onPress={() => {
                                if (!versionnumber.play_store_url) {
                                    alert("Update will be available soon");
                                    return;
                                }

                                Linking.openURL(versionnumber.play_store_url);
                            }}
                        >
                            <Text
                                className='text-white'
                                style={{ fontFamily: 'roboto-medium'}}
                            >
                                Update
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Index;