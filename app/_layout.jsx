import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider, useDispatch } from "react-redux";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomToast } from "../components/CustomToast";
import { NotificationContext } from "../components/home/NotificationContext";
import NotificationModal from "../components/NotificationModal";
import { COLORS } from "../constants/constants";
import "../global.css";
import { loadDeliveryCharges } from '../hook/pricing/loadDeliveryCharges';
import { addNotification } from "../redux/store/slices/notificationSlice";
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
    const notificationRef = useRef(null);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(loadDeliveryCharges());
    }, [dispatch]);

    useEffect(() => {

        // Notification received while app is open
        const receivedSubscription = Notifications.addNotificationReceivedListener(
            notification => {
                console.log(
                    "NOTIFICATION RECEIVED:",
                    notification
                );

                console.log(
                    "NOTIFICATION DATA:",
                    notification.request.content.data
                );

                const data = notification.request.content.data;
                dispatch(
                    addNotification({
                        notification_id: data.order_id,
                        title: notification.request.content.title,
                        message: notification.request.content.body,
                        ...data,
                        read:false,
                        created_at: new Date().toISOString()
                    })
                );
            }
        );

        // User taps notification
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(
            response => {

                const data = response.notification.request.content.data;

                console.log(
                    "NOTIFICATION CLICKED DATA:",
                    data
                );

                // router.push('/(tabs)/orders');
                if (data?.action_url) {
                    router.push(data.action_url);
                }
            }
        );

        return () => {
            receivedSubscription.remove();
            responseSubscription.remove();
        };

    }, []);

    // Only mount Stack when user is authenticated
    return (
        <>
            <LocationComponent />
            <StatusBar style="dark" backgroundColor={APP_PRIMARY_COLOR} />

            <NotificationContext.Provider
                value={{
                    openNotifications: () =>
                        notificationRef.current?.present()
                }}
            >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(routes)" />
            </Stack>
            <NotificationModal ref={notificationRef}/>
            </NotificationContext.Provider>

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