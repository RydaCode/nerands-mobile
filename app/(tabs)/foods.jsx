import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Categories from "../../components/home/Categories";
import HomeHeader from "../../components/home/HomeHeader";
import MainContent from "../../components/home/MainContent";
import { COLORS, SIZES } from "../../constants/constants";
import useApi from "../../hook/useApi";

const ALLOWED_CATEGORIES = ["Restaurant", "Liquor", "Cafe", "Dries", "Vegies"];
const LIMIT = 10;

const StickyCategoryTabs = ({ tabs = [], selectedTab, onTabPress }) => {
    const scrollRef = useRef(null);
    const underlineX = useRef(new Animated.Value(0)).current;
    const [tabLayouts, setTabLayouts] = useState([]);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const index = tabs.indexOf(selectedTab);
        if (index < 0 || !tabLayouts[index]) return;

        Animated.spring(underlineX, {
            toValue: tabLayouts[index].x,
            useNativeDriver: false,
            bounciness: 12,
        }).start();

        // Auto-scroll tab into view
        if (scrollRef.current) {
            const scrollX = Math.max(
                tabLayouts[index].x - width / 2 + tabLayouts[index].width / 2,
                0,
            );
            scrollRef.current.scrollTo({ x: scrollX, y: 0, animated: true });
        }
    }, [selectedTab, tabLayouts]);

    return (
        <View style={{ paddingVertical: 10, backgroundColor: "white" }}>
            <ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
            >
                {tabs.map((tab, index) => {
                    const isActive = selectedTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabPress(tab)}
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                setTabLayouts((prev) => {
                                    const newLayouts = [...prev];
                                    newLayouts[index] = layout;
                                    return newLayouts;
                                });
                            }}
                            style={{
                                marginRight: 6,
                                marginBottom: 4,
                                paddingVertical: 7,
                                paddingHorizontal: 15,
                                borderRadius: SIZES.border,
                                borderWidth: 1,
                                backgroundColor: isActive ? COLORS.primary : COLORS.grey_bg,
                                borderColor: isActive ? COLORS.primary : COLORS.lavender,
                            }}
                        >
                            <Text
                                className="text-sm"
                                style={{
                                    color: isActive ? COLORS.white : COLORS.slate,
                                    fontFamily: "roboto-medium",
                                }}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {tabLayouts.length === tabs.length && (
                    <Animated.View
                        style={{
                            position: "absolute",
                            height: 3,
                            width: tabLayouts[tabs.indexOf(selectedTab)].width,
                            backgroundColor: COLORS.primary,
                            bottom: 0,
                            left: underlineX,
                            borderRadius: 2,
                            marginTop: 4,
                        }}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const Foods = () => {
    const { displayCurrentLocation } = useSelector(
        (state) => state.location,
    );
    const { user_id  } = useSelector((state) => state.auth);
    const { get } = useApi();

    const [stores, setStores] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const loadingMoreRef = useRef(false);

    const TABS = ["All", ...ALLOWED_CATEGORIES];
    const [selectedTab, setSelectedTab] = useState("All");

    // --- Fetch stores ---
    const fetchStores = async ({ cursor = null, reset = false } = {}) => {
        if (loadingMoreRef.current) return;
        if (!hasNext && !reset) return;

        loadingMoreRef.current = true;
        if (reset) setRefreshing(true);
        else setLoadingMore(true);

        try {
            const categoriesToSend =
                selectedTab === "All" ? ALLOWED_CATEGORIES : [selectedTab];

            const url = `/stores/foods?limit=${LIMIT}${
                cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
            }&categories=${encodeURIComponent(categoriesToSend.join(","))}${
                user_id ? `&user_id=${encodeURIComponent(user_id)}` : ""
            }`;

            const res = await get(url);
            const { data = {} } = res || {};
            const {
                stores: newStores = [],
                nextCursor: newCursor = null,
                hasNext: more = false,
                success: apiSuccess = false,
            } = data;

            if (apiSuccess) {
                setStores((prev) => (reset ? newStores : [...prev, ...newStores]));
                setNextCursor(newCursor);
                setHasNext(more);
            } else if (reset) {
                setStores([]);
                setNextCursor(null);
                setHasNext(false);
            }
        } catch (err) {
            console.error("Error fetching stores:", err);
        } finally {
            setLoadingMore(false);
            setRefreshing(false);
            loadingMoreRef.current = false;
        }
    };

    useEffect(() => {
        fetchStores({ reset: true });
    }, [selectedTab]);

    const fetchMoreStores = () => {
        if (!hasNext || loadingMoreRef.current) return;
        fetchStores({ cursor: nextCursor });
    };

    const renderFooter = () =>
        loadingMore ? (
            <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator size={35} color={COLORS.primary} />
            </View>
        ) : null;

    
    console.log("stores FOODSSS", stores)

    return (
        <SafeAreaView className="flex-1 h-full bg-white px-2" edges={["top"]} style={{paddingBottom: 80}}>
            <HomeHeader title="Home Header" location={displayCurrentLocation} />

            <StickyCategoryTabs
                tabs={TABS}
                selectedTab={selectedTab}
                onTabPress={setSelectedTab}
            />

            <FlatList
                data={stores}
                keyExtractor={(item, index) =>
                    item?.store_id?.toString() ?? index.toString()
                }
                renderItem={({ item }) => item && (
                    <MainContent {...item} />
                )}

                ListHeaderComponent={() => (
                    <View className="">
                        <Categories />
                        {/* <FoodsAndLiquor /> */}
                    </View>
                )}

                ListEmptyComponent={() => !refreshing && (
                    <View
                        style={{ paddingTop: 100 }}
                        className="flex-1 justify-center items-center"
                    >
                        <Ionicons name="search" size={50} color={COLORS.green1} />
                        <Text
                            className='text-base text-slate justify-center items-center'
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            No stores found in this category.
                        </Text>
                    </View>
                )}

                contentContainerStyle={{ paddingBottom: 40 }}
                onEndReached={fetchMoreStores}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchStores({ reset: true })}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Foods;