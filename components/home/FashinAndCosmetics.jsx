import { COLORS } from '@/constants/constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Carticons } from '../../constants/icons';
import useApi from '../../hook/useApi';
import { STORES_IMAGE_URI } from '../../RequestMethods';
import { calculateDistance } from '../../utils/getDistance';
import { formatText } from '../../utils/getInitials';

const FashinAndCosmetics = (refreshKey) => {
    const { user_id  } = useSelector((state) => state.auth);
    const router = useRouter();
    const { latitude, longitude } = useSelector(state => state.location);
    const { data, isLoading, error, get } = useApi();
    
    useEffect(() => {
        if (latitude || longitude || refreshKey) {
            get(`/stores/toprated?cat_name=general&limit=10&open_close=true&user_id=${user_id}&user_lat=${latitude}&user_lang=${longitude}`);   
        }
    }, [latitude, longitude, user_id, refreshKey]);

    // console.log("TOP:", data)

    const storesList = data?.stores ?? [];
    // Get screen width and height using useWindowDimensions
    const { width, height } = useWindowDimensions();

    // Dynamically calculate image sizes based on screen width and height
    const imageWidth = width * 0.92;  // 45% of screen width
    const imageHeight = height * 0.60; // 15% of screen height

    const isLandscape = width > height; // Determine orientation
    const isTablet = width >= 768; // Define a breakpoint for tablets

    // Set image dimensions based on orientation and device type
    const imageDimensions = isLandscape
    ? { width: imageWidth, height: imageHeight } // Larger dimensions for landscape
    : { width: imageWidth, height: 110 }; // Requested dimensions for portrait

    const pointA = { latitude: latitude, longitude: longitude }; // User

    return (
        <View>
            {(data && Array.isArray(storesList) && storesList.length > 0) && (
                <View className="mb-2 mt-10">
                    <Text style={{ fontFamily: 'roboto-medium' }} className="text-2xl font-semibold">Fashion & Cosmetics</Text>
                </View>
            )}
            <FlatList
                data={storesList}
                keyExtractor={(item) => item.store_id}
                renderItem={({ item }) => {
                    return (
                    <View
                        style={{
                            width: imageWidth,
                            height: 84,
                            elevation: 0,
                            borderWidth: 1,
                            borderColor: COLORS.grey_bg,
                            backgroundColor: COLORS.white,
                        }}
                        className='flex-row mr-4 rounded-md justify-between'
                    >
                        <TouchableOpacity className="flex-row items-center"
                            style={{width: '90%'}}
                            onPress={() => router.push({pathname: '../(routes)/other-stores-single/', params: {
                                store_id: item.store_id,
                                store_profileimage: item.store_profileimage,
                                store_coverimage: item.store_coverimage,
                                store_name: item.store_name,
                                store_description: item.store_description,
                                store_phone_num: item.store_phone_num,
                                open_close: item.open_close,
                                store_latitude: item.latitude,
                                store_longitude: item.longitude,
                                store_location: item.store_location,
                                store_category: item.store_category,
                                average_rating: item.average_rating,
                                total_ratings: item.review_count,
                                favorited: item.favorited,
                                open_time: item.open_time,
                                closing_time: item.closing_time
                            }})}
                        >
                            <View className='rounded relative' style={{ width: '35%', height: '100%' }}>
                               <Image
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 4
                                    }}
                                    source={
                                        item.store_profileimage
                                            ? { uri: `${STORES_IMAGE_URI}${item.store_profileimage}` }
                                            : Carticons.placeholder
                                    }
                                    placeholder={Carticons.placeholder}
                                    contentFit="cover"
                                    transition={200}
                                />

                                {item.is_closed &&
                                    <View className='absolute w-full h-full bg-black opacity-70 rounded-[3px] flex-row justify-center items-center z-50'>
                                        <MaterialCommunityIcons name="lock" size={16} style={{color: COLORS.white, opacity: 0.5}} />
                                        <Text style={{fontFamily: 'roboto'}} className='text-sm text-white'>Closed</Text>
                                    </View>
                                }
                            </View>
                            <View className="ml-2" style={{width: '64%'}}>
                                <View className="flex-row items-center justify-start">
                                    <Text className='text-base' numberOfLines={1} style={{ fontFamily: 'roboto-medium' }}>
                                        {item.store_name}
                                    </Text>
                                </View>
                                <View className='w-full flex-row items-center'>
                                    <View className="flex-row rounded-sm bg-[#DFF6E6] py-1 px-2 justify-center items-center self-center mr-1">
                                        <Text className='text-sm text-green1' style={{fontFamily: 'roboto' }}>
                                            {formatText(item.store_category)}
                                        </Text>
                                    </View>
                                    <View className='flex-row justify-center ml-4 items-center'>
                                        <Ionicons name="star" size={12} color={COLORS.primary} />
                                        <Text className='text-sm'>{item.average_rating}</Text>
                                        <Text className='text-sm ml-1 text-slate'>({item.review_count})</Text>
                                    </View>
                                </View>
                                <View className='mt-2 mr-2 flex-row items-center justify-between'>
                                    <View className='flex-row items-center' style={{ width: '60%' }}>
                                        {/* <Ionicons
                                            name="location-outline"
                                            color={COLORS.green1}
                                            size={12}
                                        /> */}
                                        <Text className='text-slate text-sm' numberOfLines={1} style={{fontFamily: 'roboto'}}>
                                            {item.store_location}
                                        </Text>
                                    </View>
                                    <View className='h-[5px] w-[5px] bg-slate rounded-full self-center justify-center mx-2'/>
                                    <View className="flex-row justify-center items-center mr-1" style={{ width: '25%' }}>
                                        <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                                        <Text className='text-sm text-slate' numberOfLines={1} style={{fontFamily: 'roboto' }}>
                                            {calculateDistance(pointA, { latitude: item.latitude, longitude: item.longitude })}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{alignSelf: 'center'}}
                            className="h-[28px] w-[28px] justify-center items-center mr-1 bg-[#DFF6E6] rounded-full"
                        >
                            <MaterialCommunityIcons
                                name={!item.favorited ? "cards-heart-outline" : "cards-heart"}
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                )}}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default FashinAndCosmetics;