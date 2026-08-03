import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import OrderTabs from '../../../components/orders/OrderTabs';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import OrderHistory from './OrderHistory';
import PendingOrders from './PendingOrders';
import TodayOrders from './TodayOrders';

const Index = () => {
    const { user_id, runner_id, is_runner } = useSelector(state => state.auth);
    const params = useLocalSearchParams();

    const {data: normalorders, isLoading: normalOrderLoading, error: normalOrderError, get: getNormalOrders} = useApi();

    useEffect(() => {
        if (runner_id) {
            getNormalOrders(
                `/runner/errands/${runner_id}?order_status=Pending,Accepted,Processing,In_Transit,Delivered,Cancelled,Completed&limit=10`
            );   
        }
    }, [runner_id]);

    const reload = () => {
        if (runner_id) {
            getNormalOrders(
                `/runner/errands/${runner_id}?order_status=Pending,Accepted,Processing,In_Transit,Delivered,Cancelled,Completed&limit=10`
            );
        }
    };

    const todayOrderData = normalorders?.today;
    const pendingData = normalorders?.pending;
    const historyData = normalorders?.history;

    console.log('normalorders', pendingData);

    const tabs = ['Today', 'Pending', 'History'];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    
    const DisplayTabContent = () => {
        switch (activeTab) {
            case 'Today':
                return (
                    <TodayOrders
                        title="Today"
                        todayOrderData={todayOrderData}
                        reload={reload}
                    />
                );

            case 'Pending':
                return (
                    <PendingOrders
                        title="Pending"
                        pendingData={pendingData}
                        reload={reload}
                    />
                );

            case 'History':
                return (
                    <OrderHistory
                        title="History"
                        historyData={historyData}
                        reload={reload}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader fontFamily='outfit-medium' textStyles='text-2xl' header_name='Runner Orders'/>
            <View className='w-full mt-5 mb-1'>
                <OrderTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {normalOrderLoading ? (
                    <View className='h-full justify-center items-center'>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text className='text-lg text-slate' style={{fontFamily: 'roboto-medium'}}>Loading orders, please wait...</Text>
                    </View>
                ) : normalOrderError ? (
                    <View className='h-full justify-center items-center'>
                        <FontAwesome name='search' size={40} color={COLORS.slate}/>
                        <Text className='text-base text-slate mt-3' style={{fontFamily: 'roboto-medium'}}>You currently have no orders {title}</Text>
                    
                        <TouchableOpacity
                            onPress={reload}
                            className='flex-row justify-center items-center mt-4 px-6 py-2 bg-primary rounded'
                        >
                            {/* <ActivityIndicator size={20} color={COLORS.white}/> */}
                            <MaterialCommunityIcons name="reload" size={24} color="white" />
                            <Text
                                className='text-base text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <DisplayTabContent/>
                )}
            </View>
        </SafeAreaView>
    )
}

export default Index