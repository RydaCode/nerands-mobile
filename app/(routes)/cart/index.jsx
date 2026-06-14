import { useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
// import CartData from '../../../components/cart/CartData'
// import OrderBtn from '../../../components/cart/OrderBtn'
import { useRouter } from 'expo-router'
// import { SIZES } from '../../../constants/constants'
// import { clearCart } from '../../../redux/slices/CartSlice';
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
// import useSend from '../../../hook/useSend'
import CartTabs from './CartTabs'
import FoodCartTab from './FoodCartTab'
import LocalMarketCartTab from './LocalMarketCartTab'
import OtherProductsTab from './OtherProductsTab'

const Index = () => {
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    const router = useRouter();

    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const localMarketCartItems = useSelector(state => state.localmarketcart.localMarketCartItems);
    const [activeTab, setActiveTab] = useState('food');

    const totalOtherCartItems = useMemo(() => {
        return othersCartItems.reduce(
            (sum, item) => sum + (item.product_qty || 0),
            0
        );
    }, [othersCartItems]);

    const totalFoodCartItems = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + (item.product_qty || 0),
            0
        );
    }, [cartItems]);

    const totalLocalMarketCartItems = useMemo(() => {
        return localMarketCartItems.reduce(
            (sum, item) => sum + (item.product_qty || 0),
            0
        );
    }, [localMarketCartItems]);

    const tabs = [
        {
            id: 'food',
            title: 'Food Cart',
            count: totalFoodCartItems,
        },
        {
            id: 'general',
            title: 'General Cart',
            count: totalOtherCartItems,
        },
        {
            id: 'local',
            title: 'Local Market Cart',
            count: totalLocalMarketCartItems,
        },
    ];

    const DisplayTabContent = useMemo(() => {
        switch (activeTab) {
            case 'food':
                return <FoodCartTab category="Food Cart" />;

            case 'local':
                return <LocalMarketCartTab category="Local Market Cart" />;

            case 'general':
                return <OtherProductsTab category="General Cart" />;

            default:
                return null;
        }
    }, [activeTab]);

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <View className='w-full mb-4'>
                <MainHeader fontFamily={'ubuntu-medium'} textStyles='text-2xl' header_name='Cart'/>
            </View>

            {/* Store Menu Tabs */}
            <View className='mb-2'>
                <CartTabs tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>

            {/* Tab Content */}
            {DisplayTabContent}
        </SafeAreaView>
    )
}

export default Index