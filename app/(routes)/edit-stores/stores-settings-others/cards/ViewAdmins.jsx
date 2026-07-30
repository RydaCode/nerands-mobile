import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../../../../constants/constants';
import useApi from '../../../../../hook/useApi';

const ViewAdmins = ({router, params}) => {
    const store_id = params.store_id;
    
    const { data, isLoading, error, get, } = useApi(
        `/stores/business/${params.business_id}/store-members/${store_id}`
    );

    useEffect(() => {
        if (store_id) {
            get(); // Fetch stores
        }
    }, [store_id]);
    const storeCount = data?.count ?? 0;
    return (
        <TouchableOpacity
            onPress={() => router.push({pathname: '../admins-route/view-admins/', params: {
                store_latitude: params.store_latitude,
                location: params.location,
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
            }})}
            style={{borderRadius: SIZES.border}}
            className='h-full items-center justify-center bg-white border-1 relative m-2 w-full'
        >
            <View style={{right: 25, top: 3, height: 23, width: 23}} className='absolute z-50 bg-red rounded-full items-center justify-center border-2 border-white'>
                <Text style={{fontFamily: 'roboto-medium', fontSize: 11}} className='text-white'>{storeCount}</Text>
            </View>
            <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                <FontAwesome5 name="user" color='#54C571' size={19} />
            </View>
            <Text className='text-sm'>View Admins</Text>
        </TouchableOpacity>
    )
}

export default ViewAdmins