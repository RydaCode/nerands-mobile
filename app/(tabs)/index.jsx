import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;