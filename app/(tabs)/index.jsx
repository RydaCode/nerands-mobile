import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    RefreshControl,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import LogingBtn from "../../components/cart/LogingBtn";
import Categories from "../../components/home/Categories";
import FashinAndCosmetics from "../../components/home/FashinAndCosmetics";
import FoodsAndLiquor from "../../components/home/FoodsAndLiquor";
import HomeCourasel from "../../components/home/HomeCourasel";
import HomeHeader from "../../components/home/HomeHeader";
import { COLORS } from "../../constants/constants";
import ProductsTabs from "../screens/menu-items/products/ProductsTabs";
import AllProducts from "../screens/menu-items/products/tabs/all-products/AllProducts";

const HomeScreen = () => {
    const { displayCurrentLocation } = useSelector((state) => state.location);
    const tabs = ["All", "Fashion", "Cosmetics", "Electronics"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const router = useRouter();
    
    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const cartItems = useSelector(state => state.cart.cartItems);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogin = () => {
        router.push('/(auth)/login');
    }

    // Global refreshKey to trigger child refresh
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey((prev) => prev + 1);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    // Window width for dynamic columns
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : 2;

    // Render content per tab
    const renderTabContent = () => {
        return(
            <AllProducts
                refreshKey={refreshKey}
                numColumns={numColumns}
                category={activeTab === "All" ? null : activeTab}
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white relatice" style={{paddingBottom: 80}} edges={["top"]}>
            {/* HEADER */}
            <View className='px-2'>
                <HomeHeader title="Home Header" location={displayCurrentLocation} />
            </View>

            <FlatList
                data={[]} // Required, but empty because actual content is in ListHeaderComponent
                keyExtractor={() => "dummy"}
                renderItem={null}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListHeaderComponent={
                    <>
                        {/* TABS */}
                        <View className="w-full mt-2 mb-2 px-2">
                            <ProductsTabs
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </View>

                        {/* STATIC CONTENT */}
                        <View className="flex-1 w-full mt-1 px-2">
                            <HomeCourasel refreshKey={refreshKey} />
                            <Categories refreshKey={refreshKey} />
                            <FoodsAndLiquor refreshKey={refreshKey} />
                            <FashinAndCosmetics refreshKey={refreshKey} />

                            {/* TAB CONTENT */}
                            {renderTabContent()}
                        </View>
                    </>
                }
                ListFooterComponent={<View style={{paddingBottom: !isAuthenticated ? 140 : 80}}/>}
                showsVerticalScrollIndicator={false}
            />

            {(othersCartItems.length > 0 || cartItems.length > 0) && (
                <TouchableOpacity
                    className='absolute elevation-sm border border-lavender bg-lavender justify-center items-center rounded-full'
                    style={{height: 50, width: 50, right: 8, bottom: !isAuthenticated ? 180 : 120}}
                    onPress={() => router.push('../../cart/')}
                >
                    <View className='relative bg-lavender rounded-full h-full border border-lavender p-2 w-full flex-row justify-center items-center elevation-sm'>
                        <FontAwesome name='shopping-cart' color={COLORS.primary} size={20} />
                    </View>
                </TouchableOpacity>
            )}

            {!isAuthenticated && (
                <View className='w-full mb-6 justify-center px-2 items-center'>
                    <LogingBtn handlePress={handleLogin}/>
                </View>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;