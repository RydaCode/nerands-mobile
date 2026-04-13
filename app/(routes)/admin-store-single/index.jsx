import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import AdminStoreSingle from '../../screens/admin-store-single/AdminStoreSingle';

const index = () => {
    const params = useLocalSearchParams();
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-4'>
                <MainHeader textStyles='text-2xl' fontFamily='ubuntu-medium' header_name='Store' />
            </View>
            <View className='w-full px-4'>
                <AdminStoreSingle
                    store_id={params.store_id}
                    user_id={params.user_id}
                    store_name={params.store_name}
                    store_category={params.store_category}
                    store_phone_num={params.store_phone_num}
                    store_email={params.store_email}
                    store_country={params.store_country}
                    store_province={params.store_province}
                    city_town={params.city_town}
                    store_description={params.store_description}
                    store_location={params.store_location}
                    store_longitude={params.store_longitude}
                    store_latitude={params.store_latitude}
                    open_time={params.open_time}
                    closing_time={params.closing_time}
                    created_date={params.created_date}
                    store_profileimage={params.store_profileimage}
                    store_coverImage={params.store_coverimage}
                    store_ratings={params.store_ratings}
                    open_close={params.open_close}
                    active_status={params.active_status}
                    delivery_status={params.delivery_status}
                />
            </View>
        </SafeAreaView>
    )
}

export default index