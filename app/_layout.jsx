import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider, useDispatch } from "react-redux";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomToast } from "../components/CustomToast";
import { COLORS } from "../constants/constants";
import "../global.css";
import { loadDeliveryCharges } from '../hook/pricing/loadDeliveryCharges';
import store from "../redux/store/store";
import LocationComponent from "../services/LocationComponent";

const APP_PRIMARY_COLOR = COLORS.white;
const NAVIGATION_STATE_KEY = "NAVIGATION_STATE";

const AppContent = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadDeliveryCharges());
    }, [dispatch]);

    // Only mount Stack when user is authenticated
    return (
        <>
            <LocationComponent />
            <StatusBar style="dark" backgroundColor={APP_PRIMARY_COLOR} />

            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(routes)" />
            </Stack>

            <Toast
                config={{
                    success: (props) => <CustomToast {...props} type="success" />,
                    error: (props) => <CustomToast {...props} type="error" />,
                    info: (props) => <CustomToast {...props} type="info" />,
                }}
            />
        </>
    );
};

const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        maven: require("../assets/fonts/MavenPro-Regular.ttf"),
        "maven-medium": require("../assets/fonts/MavenPro-Medium.ttf"),
        "maven-bold": require("../assets/fonts/MavenPro-Bold.ttf"),
        "maven-black": require("../assets/fonts/MavenPro-Black.ttf"),
        "roboto": require("../assets/fonts/Roboto-Regular.ttf"),
        "roboto-medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "outfit": require("../assets/fonts/Outfit-Regular.ttf"),
        "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
        "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
        "outfit-black": require("../assets/fonts/Outfit-Black.ttf"),
        "ubuntu-regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
        "ubuntu-medium": require("../assets/fonts/Ubuntu-Medium.ttf"),
        "ubuntu-bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
    });

    const [initialState, setInitialState] = useState();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadState = async () => {
            try {
                const state = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
                if (state) setInitialState(JSON.parse(state));
            } catch (e) {
                console.warn("Failed to load navigation state", e);
            } finally {
                setIsReady(true);
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        if (fontsLoaded && isReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isReady]);

    if (!fontsLoaded || !isReady) {
        return <View style={{ flex: 1, backgroundColor: "white" }} />;
    }

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <AppContent />
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </Provider>
        </SafeAreaProvider>
    );
};

export default RootLayout;