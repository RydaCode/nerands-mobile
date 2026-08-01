import React, {
    forwardRef,
    useCallback,
    useMemo,
    useRef,
} from "react";

import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal
} from "@gorhom/bottom-sheet";

import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationRead } from "../redux/store/slices/notificationSlice";
import agoTimeStamp from "./agoTimeStamp";

const NotificationModal = forwardRef((props, ref) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const notifications =
        useSelector(
            state => state.notifications.notifications
        );

    const snapPoints = useMemo(
        () => ["75%", "95%"],
        []
    );
    const insets = useSafeAreaInsets();
    const renderedCount = useRef(0);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const renderItem = useCallback(({ item }) => {
        return (
            <NotificationItem item={item} router={router} dispatch={dispatch} ref={ref} />
        );
    }, []);

    return (

        <BottomSheetModal
            ref={ref}
            index={1}
            snapPoints={snapPoints}
            topInset={insets.top}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{
                backgroundColor: "#ccc",
                width: 80,
            }}
        >

            <View
                style={{
                    flex: 1
                }}
            >

                <View className="flex-row justify-between items-center px-4 py-3">

                    <View className='flex-row justify-center items-center'>
                        <FontAwesome name="bell" size={20}/>
                        <Text
                            className="text-lg ml-1"
                            style={{
                                fontFamily:"roboto-bold"
                            }}
                        >
                            Notifications
                        </Text>
                    </View>

                    <TouchableOpacity>

                        <Text
                            className="text-primary"
                            style={{
                                fontFamily:"roboto-medium"
                            }}
                        >
                            Mark all read
                        </Text>

                    </TouchableOpacity>

                </View>

                <View style={{flex: 1}}>
                    <BottomSheetFlatList
                        data={notifications}
                        keyExtractor={item => item.notification_id}
                        renderItem={renderItem}
                        initialNumToRender={15}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        removeClippedSubviews={true}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
});

const NotificationItem = React.memo(({ item, router, dispatch, ref }) => {

    const readNotification = (item) => {
        // Implement the logic to mark the notification as read
        ref.current?.dismiss();

        router.push({
            pathname: '../(routes)/user-account'
        });

        dispatch(markNotificationRead(item.notification_id));
        console.log(`Notification ${item.notification_id} marked as read.`);
    }

    return (
        <View
            style={{ width: '100%' }}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
            }}
        >
            <TouchableOpacity
                className={`border-gray-100 ${
                    !item.is_read
                        ? "bg-grey_bg"
                        : "bg-white"
                }`}

                onPress={() => readNotification(item)}
            >
                <View className="flex-row items-center" style={{marginHorizontal: 16}}>

                    {item.image_url ? (
                        <Image
                            source={{
                                uri: item.image_url.startsWith("http")
                                    ? item.image_url
                                    : `https://images.nerands.com/${item.image_url}`
                            }}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 999,
                                marginRight: 12
                            }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />
                    ) : (
                        <View
                            className="bg-primary justify-center items-center"
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 999,
                                marginRight: 12
                            }}
                        >
                            <FontAwesome name="bell" size={22} color="white" />
                        </View>
                    )}

                    <View className="flex-1">

                        <Text
                            numberOfLines={1}
                            style={{ fontFamily: "roboto-medium" }}
                            className="text-black"
                        >
                            {item.title}
                        </Text>

                        <Text
                            className="text-slate mt-1"
                            numberOfLines={2}
                        >
                            {item.message}
                        </Text>

                        <Text
                            className="text-sm text-gray-400 mt-2"
                        >
                            {new Date(item.created_at).toLocaleString()} - ({agoTimeStamp(item.created_at)})
                        </Text>

                    </View>

                </View>
                <View className='bg-lavender my-3 mx-4' style={{height: 1}}/>
            </TouchableOpacity>
        </View>
    );
});

export default NotificationModal;