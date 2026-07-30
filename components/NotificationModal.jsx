import {
    forwardRef,
    useCallback,
    useMemo,
} from "react";

import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal
} from "@gorhom/bottom-sheet";

import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { COLORS } from "../constants/constants";
import agoTimeStamp from "./agoTimeStamp";

const NotificationModal = forwardRef((props, ref) => {

    const notifications =
        useSelector(
            state => state.notifications.notifications
        );

    const snapPoints = useMemo(
        () => ["65%", "85%"],
        []
    );
    const insets = useSafeAreaInsets();

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

    const renderItem = ({ item }) => (
    <View style={{width: '100%', paddingHorizontal: 16}}>
    <TouchableOpacity
        className={`py-4 border-b border-gray-100 ${
            !item.is_read
                ? "bg-red-50"
                : "bg-white"
        }`}
    >

        <View className="flex-row items-center">

            {item.image_url && (
                <Image
                    source={{
                        uri: item.image_url.startsWith("http")
                            ? item.image_url
                            : `https://images.nerands.com/${item.image_url}`
                    }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 25,
                        marginRight: 12
                    }}
                    contentFit="cover"
                />
            )}

            <View className="flex-1">

                <Text
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

    </TouchableOpacity>
    <View
        style={{
            height: 1,
            width: '100%',
            backgroundColor: COLORS.grey_bg,
        }}
    />
    </View>
);

    return (

        <BottomSheetModal
            ref={ref}
            index={0}
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
                    flex: 1,
                    paddingBottom: insets.bottom,
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

                <BottomSheetFlatList
                    data={notifications}
                    keyExtractor={item => item.notification_id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + 30,
                    }}
                />
            </View>
        </BottomSheetModal>
    );
});

export default NotificationModal;