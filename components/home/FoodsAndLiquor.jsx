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

const FoodsAndLiquor = (refreshKey) => {
    const router = useRouter();
    const { user_id  } = useSelector((state) => state.auth);
    const { latitude, longitude } = useSelector(state => state.location);
    // This enpoint can be used to fetched and filter stores by category, open_close
    // const { data, isLoading, error, get, del } = useApi(`/stores/toprated?cat_name=food&limit=10&open_close=true`);
    // const { data, isLa, ioading, error, get, del } = useApi(`/stores/toprated?cat_name=food&limit=10&user_id=${user_id}`);
    
    const { data, isLoading, error, get, del } = useApi();

    useEffect(() => {
        if (latitude != null && longitude != null) {
            let url = `/stores/nearby-stores?cat_name=food&limit=10&user_lat=${latitude}&user_lang=${longitude}`;

            if (user_id) {
                url += `&user_id=${user_id}`;
            }

            get(url);
        }
    }, [user_id, latitude, longitude, refreshKey]);

    const storesList = data?.stores ?? [];
    // Get screen width and height using useWindowDimensions
    const { width, height } = useWindowDimensions();

    // Dynamically calculate image sizes based on screen width and height
    const imageWidth = width * 0.60;  // 45% of screen width
    const imageHeight = height * 0.60; // 15% of screen height

    const isLandscape = width > height; // Determine orientation
    const isTablet = width >= 768; // Define a breakpoint for tablets

    // Set image dimensions based on orientation and device type
    const imageDimensions = isLandscape
    ? { width: imageWidth, height: imageHeight } // Larger dimensions for landscape
    : { width: imageWidth, height: 110 }; // Requested dimensions for portrait

    const pointA = { latitude: latitude, longitude: longitude }; // User

    return (
        // store_id, store_profileImage, store_name, store_description, store_phone_num, open_close
        <View>
            {(data && Array.isArray(storesList) && storesList.length > 0) && (
                <View className="mb-2 mt-10">
                    <Text style={{ fontFamily: 'roboto-medium' }} className="text-2xl">Food & Liquor</Text>
                </View>
            )}
            <FlatList
                data={storesList}
                keyExtractor={(item) => item.store_id}
                renderItem={({ item }) => {
                    return (
                    <View>
                        <TouchableOpacity className="items-center mr-4 rounded-md border"
                            style={[ {width: imageWidth}, {
                                elevation: 0,
                                borderWidth: 1,
                                borderColor: COLORS.grey_bg,
                                backgroundColor: "#fff"
                            }]}
                            onPress={() => router.push({pathname: '../(routes)/home-single-store/', params: {
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
                            <View className='rounded-md relative' style={[imageDimensions]}>
                                <Image
                                    style={{
                                            width: "100%",
                                            height: "100%",
                                            borderTopLeftRadius: 5, borderTopRightRadius: 5
                                        }}
                                    
                                    source={
                                        item.store_coverimage
                                            ? { uri: `${STORES_IMAGE_URI}${item.store_coverimage}` }
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
                            <View className="w-full">
                                <View className="flex-row justify-end">
                                    <View className='' style={{width: '67%'}}>
                                        <Text className='text-base' numberOfLines={1} style={{ fontFamily: 'roboto-medium' }}>
                                            {item.store_name}
                                        </Text>
                                    </View>
                                </View>
                                
                                <View className='w-full flex-row px-1 items-center'>
                                    <View className='flex-row items-center ' style={{ maxWidth: '65%' }}>
                                        <Ionicons
                                            name="location-outline"
                                            color={COLORS.green1}
                                            size={12}
                                        />
                                        <Text className='text-slate text-sm' numberOfLines={1} style={{fontFamily: 'roboto'}}>
                                            {item.store_location}
                                        </Text>
                                    </View>
                                    <View className='h-[5px] w-[5px] bg-slate rounded-full self-center justify-center mx-1'/>
                                    <View className="flex-row justify-center items-center self-center mr-1" style={{ width: '25%' }}>
                                        <Ionicons name="location-outline" color={COLORS.primary} size={11} />
                                        <Text className='text-sm text-slate' numberOfLines={1} style={{fontFamily: 'roboto' }}>
                                            {calculateDistance(pointA, { latitude: item.latitude, longitude: item.longitude })}
                                        </Text>
                                    </View>
                                </View>

                                <View className='flex-row items-center mb-1 ml-2' style={{ marginTop: 10 }}>
                                    <View className='flex-row justify-center items-center'>
                                        <Ionicons name="star" size={12} color={COLORS.primary} />
                                        <Text className='text-sm'>{item.average_rating}</Text>
                                        <Text className='text-sm ml-1 text-slate'>({item.review_count})</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                            </View>
                            <View
                                className="absolute left-2 top-2 bg-white rounded-sm py-1 px-2 justify-center items-center"
                            >
                                <Text className='text-sm text-green1'>{formatText(item.store_category)}</Text>
                            </View>
                            <TouchableOpacity
                                className="absolute right-2 top-2 bg-[#DFF6E6] rounded-full h-[30px] w-[30px] justify-center items-center"
                            >
                                <MaterialCommunityIcons
                                    name={!item.favorited ? "cards-heart-outline" : "cards-heart"}
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{height: 30, width: '30%', bottom: 2, right: 2}}
                                className="absolute bg-primary rounded justify-center items-center elevation-sm border border-lavender"

                                onPress={() => router.push({pathname: '../(routes)/home-single-store/', params: {
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
                                    close_time: item.close_time
                                }})}
                            >
                                <Text className='text-white text-sm' style={{fontFamily: 'ubuntu-medium'}}>Visit</Text>
                            </TouchableOpacity>
                            <View
                                style={{bottom: 47, height: 63, width: 63}}
                                className="absolute left-2 border-2 border-white rounded-full justify-center items-center"
                            >
                                <View style={{zIndex: 1100}} className='relative w-full h-full rounded-full'>
                                    <Image
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 999,
                                        }}
                                        source={
                                            item.store_profileimage
                                                ? { uri: `${STORES_IMAGE_URI}${item.store_profileimage}` }
                                                : Carticons.placeholder
                                        }
                                        contentFit="cover"
                                        transition={200}
                                    />
                                    {item.is_closed &&
                                        <View className='absolute w-full h-full bg-black opacity-70 rounded-full'/>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default FoodsAndLiquor;