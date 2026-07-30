import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import { usePermissions } from '../../../hook/usePermissions';
import { toast } from '../../../utils/toast';
import AdminStoreSingle from './AdminStoreSingle';

const Index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const {can} = usePermissions();

    const goToStoreSettings = () => {
        router.push({
            pathname: '/(routes)/edit-stores/stores-settings-others',
            params: {
                active_status: params.active_status,
                city_town: params.city_town,
                closing_time: params.closing_time,
                created_date: params.created_date,
                delivery_status: params.delivery_status,
                store_latitude: params.store_latitude,
                store_longitude: params.store_longitude,
                open_close: params.open_close,
                open_time: params.open_time,
                store_category: params.store_category,
                store_country: params.store_country,
                store_coverimage: params.store_coverimage,
                store_description: params.store_description,
                store_email: params.store_email,
                store_id: params.store_id,
                store_location: params.store_location,
                store_name: params.store_name,
                store_phone_num: params.store_phone_num,
                store_profileimage: params.store_profileimage,
                store_province: params.store_province,
                store_ratings: params.store_ratings,
                user_id: params.user_id,
                router: params.router,
                business_id: params.business_id,
                display_name: params.display_name,
                business_type: params.business_type
            }
        });
    };
    
    return (
        <SafeAreaView className='flex-1 bg-white justify-between'>
            <View className='flex-1 px-2'>
                <Headers
                header_name='Branch | Store'
                fontFamily='outfit-medium'
                textStyles='text-2xl'
                icon={
                    <Entypo name="menu" size={24} color={COLORS.slate} />
                }
                handlePress={goToStoreSettings}
            />

            <View className='w-full'>
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
                    business_id={params.business_id}
                    display_name={params.display_name}
                    business_type={params.business_type}
                />
            </View>

            </View>

            {/* Bottom create product button */}
            <View className='bg-white relative border-r border-l border-grey_bg py-5'>
                <View className='absolute top-0 left-0 h-[1px] w-[41%] bg-grey_bg' />
                <View className='absolute top-0 right-0 h-[1px] w-[41%] bg-grey_bg' />

                <TouchableOpacity
                    className='absolute -top-7 self-center'
                    onPress={() => {
                        if (!can('create_product')) {
                            toast.info('You have no permissions to create products.');
                            return;
                        }

                        router.push({
                        pathname: '/create-products/',
                        params: {
                            store_latitude: params.store_latitude,
                            store_longitude: params.store_longitude,
                            open_close: params.open_close,
                            open_time: params.open_time,
                            store_category: params.store_category,
                            store_country: params.store_country,
                            store_coverimage: params.store_coverimage,
                            store_description: params.store_description,
                            store_email: params.store_email,
                            store_id: params.store_id,
                            store_location: params.store_location,
                            store_name: params.store_name,
                            store_phone_num: params.store_phone_num,
                            store_profileimage: params.store_profileimage,
                            store_province: params.store_province,
                            store_ratings: params.store_ratings,
                            user_id: params.user_id,
                            business_id: params.business_id,
                            router: router
                        }
                    })}}
                >
                    <View className='bg-primary w-14 h-14 elevation-sm rounded-full justify-center items-center border-2 border-lavender'>
                        {/* <Entypo name='plus' size={25} color={COLORS.white}/> */}
                        <Text
                            style={{fontSize: 25}}
                            className='text-white'
                        >+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Index