import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import MainHeader from '../../../../components/MainHeader'
import { COLORS } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import UserSingleCustomOrder from '../cards/UserSingleCustomOrder'

const index = () => {
    const params = useLocalSearchParams();
    const { user_id, runner_id, isAuthenticated } = useSelector((s) => s.auth);
    const { data, isLoading, get } = useApi();

    useEffect(() => {
        if (!params?.custom_order_id) return;

        get(`/customorders/order/${params.custom_order_id}/`);
    }, [params?.custom_order_id]);

    if (isLoading || !data?.data) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-md mt-3 text-slate">
                    Loading order items...
                </Text>
            </SafeAreaView>
        );
    }

    const order = data.data ?? null;
    const Products = order ?? [];
    
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-4'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Custom Order' />
            </View>
            <UserSingleCustomOrder products={Products}/>
        </SafeAreaView>
    )
}

export default index