import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Linking, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { STORES_IMAGE_URI, USER_IMAGE_URI } from '../../../RequestMethods';
import MainHeader from '../../../components/MainHeader';
import ViewCart from '../../../components/ViewCart';
import { COLORS } from '../../../constants/constants';
import StoreMenuTabs from './StoreMenuTabs';

// Import tab components
import { MotiView } from 'moti';
import useApi from '../../../hook/useApi';
import { calculateDistance, makeCall } from '../../../utils/getDistance';
import { formatText } from '../../../utils/getInitials';
import { formatTime } from '../../../utils/isStoreOpen';
import { toast } from '../../../utils/toast';
import AllProducts from '../../screens/StoreSingleScreen/AllProducts';

const StorePage = () => {
    const {
        store_id,
        store_profileimage,
        store_name,
        store_description,
        store_phone_num,
        open_close,
        store_latitude,
        store_longitude,
        store_location,
        store_category,
        average_rating,
        total_ratings,
        favorited,
        open_time,
        closing_time
    } = useLocalSearchParams();

    const { user_id  } = useSelector((state) => state.auth);

    // Global refreshKey to trigger child refresh
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [ratestore, setRateStore] = useState(false);
    const { latitude, longitude } = useSelector(state => state.location) || {};
    const [showLocationMap, setShowLocationMap] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isFavorited, setIsFavorited] = useState(false);
    const isFavoritedParam = favorited === "true";

    const {data: storedata, isLoading: loadingStore, error: errorStore, get: getStoreData } = useApi();
    
    useEffect(() => {
        if (store_id) {
            getStoreData(`/stores/get_store/${store_id}`);
        }
    }, [store_id]);

    console.log("TIMES", storedata)

    const { data:ratingpost, error: ratingposterror, isLoading:ratingLoading, post } = useApi();
    const {data, error, isLoading, get} = useApi(`/stores/${store_id}/rate/${user_id}`);

    const {data: storereviews, isLoading: reviewsLoading, error: reviewsError, get: reviewsGet } = useApi(
        `/stores/${store_id}/reviews/`
    );

    useEffect(() => {
        reviewsGet();
    }, []);

    const store_data = {
        business_id: storedata?.[0]?.business_id,
        store_id: store_id,
        store_profileimage: store_profileimage,
        store_name: store_name,
        store_description: store_description,
        store_phone_num: store_phone_num,
        open_close: open_close,
        store_latitude: store_latitude,
        store_longitude: store_longitude,
        store_location: store_location,
        store_category: store_category,
        favorited: favorited,
        open_time: open_time,
        closing_time: closing_time,
        is_closed: storedata?.[0]?.is_closed
    };

    const reviewItems = storereviews?.data?.reviews ?? [];
    const stats = storereviews?.data?.stats;
    const pagination = storereviews?.data?.pagination;

        useEffect(() => {
            if (data && data?.success !== undefined) {
                setRating(data?.rating || 0);
                setReview(data?.review || '');
            } else {
                // Safety fallback if data is null/undefined
                setRating(0);
                setReview('');
            }
        }, [data]);

        const submitRating = async () => {
            if (rating === 0) {
                toast.error("Please select a rating");
                return;
            }

            try {
                const res = await post(
                    { user_id, rating, review }, `/stores/${store_id}/rate`
                );

                if (res.success) {
                    toast.success("Rating submitted");
                    get(); // refresh rating
                    setRateStore(false);
                } else {
                    toast.error(res.message || "Failed to submit rating");
                }
            } catch (err) {
                console.error("Failed to submit rating", err);
            }
        };
    
      const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey((prev) => prev + 1);
        setTimeout(() => setRefreshing(false), 1500);
      }, []);

    const router = useRouter();

    const getTabs = () => {
        if (store_category === "Liquor") {
            return [
                "All",
                "Lagers",
                "Ciders",
                "Whisky",
                "Wine",
                "Vodka",
                "Gin",
                "Brandy",
                "Spirits"
            ];
        }

        return [
            "All",
            "Break Fast",
            "Drinks",
            "Lunch",
            "Supper"
        ];
    };

    const tabs = getTabs();

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const cartItems = useSelector((state) => state.cart.cartItems);

    // Total cart price
    const [totalZMK, setTotalZMK] = useState(0);
    useEffect(() => {
        setTotalZMK(cartItems.reduce((total, item) => total + item.total_price, 0));
    }, [cartItems]);

    useEffect(() => {
        setActiveTab(tabs[0]);
    }, [store_category]);

    useEffect(() => {
        if (ratestore) {
            get();
        }
    }, [ratestore]);

    // Function to render the active tab component
    const renderActiveTab = () => {
        return (
            <AllProducts
                store_data={store_data}
                store_id={store_id}
                category={activeTab === "All" ? null : activeTab}
                refreshKey={refreshKey}
            />
        );
    };
    
    const AddToFavorites = async () => {
            try {
                const res = await post(
                    { user_id, store_id: store_id },
                    `/stores/favorites/add`
                );

                if (res?.data?.favorited === false) {
                    toast.error(res.data.message);
                } else {
                    setIsFavorited(res?.data?.favorited);
                    toast.success(
                        res?.data?.message
                    );
                }
            } catch (err) {
                console.error("Failed to toggle favorite", err);
                toast.error("Error occurred");
            }
        };

    const mapRef = useRef(null);

    // Parse strings to numbers
    const pointA = useMemo(() => ({
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
    }), [latitude, longitude]); // User

    const pointB = useMemo(() => ({
        latitude: Number(store_latitude) || 0,
        longitude: Number(store_longitude) || 0,
    }), [store_latitude, store_longitude]); //Store

    // Center map between points
    const initialRegion = useMemo(() => ({
        latitude: (pointA.latitude + pointB.latitude) / 2,
        longitude: (pointA.longitude + pointB.longitude) / 2,
        latitudeDelta: Math.abs(pointA.latitude - pointB.latitude) * 2 || 0.05,
        longitudeDelta: Math.abs(pointA.longitude - pointB.longitude) * 2 || 0.05,
    }), [pointA, pointB]);

    // Fit to both points when map is ready and layout measured
    useEffect(() => {
        if (mapRef.current && mapReady) {
        mapRef.current.fitToCoordinates([pointA, pointB], {
            edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
            animated: true,
        });
        }
    }, [pointA, pointB, mapReady]);

    // Function to open selected maps app
    const openMapsChooser = async (pointA, pointB) => {
        const { latitude: latA, longitude: lngA } = pointA;
        const { latitude: latB, longitude: lngB } = pointB;

        const options = [];

        if (Platform.OS === "ios") {
            options.push({ name: "Apple Maps", url: `http://maps.apple.com/?saddr=${latA},${lngA}&daddr=${latB},${lngB}` });
            options.push({ name: "Google Maps", url: `comgooglemaps://?saddr=${latA},${lngA}&daddr=${latB},${lngB}&directionsmode=driving` });
            options.push({ name: "Waze", url: `waze://?ll=${latB},${lngB}&navigate=yes` });
        } else {
            // Android
            options.push({ name: "Google Maps", url: `https://www.google.com/maps/dir/?api=1&origin=${latA},${lngA}&destination=${latB},${lngB}&travelmode=driving` });
            options.push({ name: "Waze", url: `waze://?ll=${latB},${lngB}&navigate=yes` });
        }

        // Filter apps that can actually be opened
        const availableApps = [];
        for (let opt of options) {
            try {
                const supported = await Linking.canOpenURL(opt.url);
                if (supported) availableApps.push(opt);
            } catch (err) {
                console.log("Error checking URL:", err);
            }
        }

        if (availableApps.length === 0) {
            Alert.alert("No maps apps available", "Please install Google Maps or Waze to navigate.");
            return;
        }

        // If only one app, open it directly
        if (availableApps.length === 1) {
            Linking.openURL(availableApps[0].url);
            return;
        }

        // Let user choose from available apps
        Alert.alert(
            "Open with", "Choose an app to open directions",
            availableApps.map((app) => ({
                text: app.name,
                onPress: () => Linking.openURL(app.url),
            })),
            { cancelable: true }
        );
    };

    console.log("TIMESSS", storedata?.[0]?.next_opening)

    return (
        <SafeAreaView className="flex-1 relative bg-white justify-center items-center px-2">
            {/* Header */}
            <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Store' />

            {/* Comments Modal */}
            <Modal transparent statusBarTranslucent visible={modalVisible} animationType="none">
                {/* Overlay */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.overlay}
                >
                    {/* <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} /> */}
                    <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack" onPress={() => setModalVisible(false)} />
                </MotiView>

                {/* Bottom Sheet */}
                <MotiView
                    from={{ translateY: 400 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 400 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={styles.sheet}
                >
                    <View className='bg-white w-full justify-center items-center rounded-md'
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                    >
                        <TouchableOpacity
                            className='w-full justify-center items-center'
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                            onPress={() => setModalVisible(false)}
                        >
                            <View className='h-1 rounded-full my-2 bg-[#ccc] w-[30%]'/>
                        </TouchableOpacity>

                        <View className='px-2'>
                            <View className='flex-row items-center mt-2'>
                                <FontAwesome name='comments' size={23}/>
                                <Text className='text-xl ml-1' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                            </View>
                            <Text className='text-sm text-green1 mt-1' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                Please take time to read what people are saying about this store
                            </Text>
                        </View>
                    </View>
                    
                    <View className='w-full flex-1 justify-center mt-8 pb-16 items-center'>
                        {reviewsLoading ?
                            <View className='items-center justify-center mb-8'>
                                <ActivityIndicator size={35} color={COLORS.primary}/>
                                <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>Loading comments, please wait...</Text>
                            </View> :
                            <FlatList
                                data={reviewItems}
                                keyExtractor={(item) => item.rating_id}
                                renderItem={({item}) => (
                                    <View className='px-2 w-full'>
                                        <View className='w-full justify-center'>
                                            <View className='justify-between w-full items-center flex-row'>
                                                <View className='border-2 border-lavender justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                                                    {item.profile_image ?
                                                        <Image className='h-full w-full rounded-full' source={{ uri: `${USER_IMAGE_URI}${item.profile_image}` }} />
                                                        : <FontAwesome name='user' size={28} color={COLORS.slate}/> 
                                                    }
                                                </View>
                                                <View className='' style={{width: '83%'}}>
                                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                                        {(`${item.first_name || ""} ${item.last_name || ""}`).trim() || "User"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className='w-full'>
                                                <View className='' >
                                                    <Text className='' style={{fontFamily: 'roboto', textAlign: 'justify'}}>
                                                        {item.review}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className='w-full bg-grey_bg my-4' style={{height: 1}}/>
                                    </View>
                                )}

                                ListEmptyComponent={
                                    <View className='flex-1 justify-center items-center mb-4'>
                                        <FontAwesome name='comments' size={25}/>
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>There are no comments yet</Text>
                                        <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Be the first to comment.</Text>
                                    </View>
                                }

                                ListFooterComponent={
                                    !reviewsLoading &&
                                    <View className='w-full px-2 mb-4'>
                                        {/* Review Input */}
                                        <TouchableOpacity className='border w-full rounded border-lavender py-6 px-3'
                                            onPress={() => {
                                                setModalVisible(false)
                                                setRateStore(true)
                                            }}
                                        >
                                            <Text className='text-slate' style={{fontFamily: 'roboto-medium'}}>Write a comment...</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        }
                    </View>
                </MotiView>
            </Modal>
            {/* End of comments modal */}

            {/* Start location maps */}
            <Modal
                transparent
                statusBarTranslucent
                visible={showLocationMap}
                animationType="none"
            >
                {/* Overlay */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.overlay}
                >
                    <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack" onPress={() => setShowLocationMap(false)} />
                </MotiView>

                {/* Bottom Sheet */}
                <MotiView
                    from={{ translateY: 400 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 400 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={styles.mapsheet}
                > 
                    <View className='w-full relative flex-1 justify-center items-center'>
                        <View className='w-full justify-center items-center rounded-md'>
                        <TouchableOpacity
                            className='w-full justify-center items-center'
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                            onPress={() => setShowLocationMap(false)}
                        >
                            <View className='h-1.5 rounded-full my-1 bg-[#ccc] w-[30%]'/>
                        </TouchableOpacity>
                    </View> 
                        {/* <MapView
                            ref={mapRef}
                            style={styles.map}
                            onMapReady={() => setMapReady(true)}
                            initialRegion={{
                                latitude: (pointA.latitude + pointB.latitude) / 2,
                                longitude: (pointA.longitude + pointB.longitude) / 2,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker
                                coordinate={pointA}
                                title="You"
                                description="Start location"
                                pinColor="green"
                            />
                            <Marker
                                coordinate={pointB}
                                title={store_name}
                                pinColor="blue"
                            />
                            <Polyline
                                coordinates={[pointA, pointB]}
                                strokeColor="red"
                                strokeWidth={3}
                            />
                        </MapView> */}
                        <View className='w-full px-2 pb-2 mt-8 justify-center items-center rounded-md'>
                            <TouchableOpacity
                                className='w-full justify-center flex-row items-center py-4 rounded bg-primary elevation-lg'
                                onPress={() => openMapsChooser(pointA, pointB)}
                            >
                                <MaterialIcons name="my-location" size={24} color="white" />
                                <Text className='text-2xl text-white ml-2'
                                    style={{fontFamily: 'maven-medium'}}
                                >Open In Maps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>
            </Modal>
            {/* End of locations map modal */}

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
                        {/* Store Info */}
                        <View className='w-full mt-2 flex-row items-center'>
                            <View
                                style={{width: 80, height: 80}}
                                className="rounded-full border-2 border-lavender"
                            >
                                <Image
                                    className='h-full w-full rounded-full border-2 border-white'
                                    source={{ uri: `${STORES_IMAGE_URI}${store_profileimage}` }}
                                />
                                {storedata?.[0]?.is_closed &&
                                    <View className='absolute w-full h-full bg-black opacity-70 rounded-full flex-row justify-center items-center'>
                                        <MaterialCommunityIcons name="lock" size={16} style={{color: COLORS.lite}} />
                                        <Text style={{fontFamily: 'roboto'}} className='text-sm text-white'>Closed</Text>
                                    </View>
                                }
                            </View>

                            <View className='ml-3 flex-1'>
                                <Text numberOfLines={2} className="text-lg" style={{ fontFamily: 'roboto-medium' }}>{store_name}</Text>
                                <Text className="text-sm text-gray-500" style={{ fontFamily: 'roboto-medium' }}>
                                    {formatText(store_category)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                className='rounded-full h-[40px] bg-[#DFF6E6] border border-green1 w-[40px] items-center justify-center'
                                onPress={() => makeCall(store_phone_num)}
                            >
                                <FontAwesome name='phone' size={20} style={{color: COLORS.green2}} />
                            </TouchableOpacity>
                        </View>

                        {/* Store Opening Hours */}
                        <View className='mt-1 w-full px-2 my-4 bg-grey_bg rounded py-1'>
                            <Text
                                className="text-sm text-green1"
                                style={{ fontFamily: 'roboto-medium', textAlign: 'justify' }}
                            >
                                {storedata?.[0]?.is_closed ? (
                                    storedata?.[0]?.open_close === false ? (
                                        <Text className="text-red">
                                            🔴 Temporarily closed by the owner
                                        </Text>
                                    ) : (
                                        <Text className="text-red">
                                            🔴 Closed until{" "}
                                            {storedata?.[0]?.next_opening?.is_today
                                                ? "today"
                                                : storedata?.[0]?.next_opening?.day}{" "}
                                            {storedata?.[0]?.next_opening?.time}
                                        </Text>
                                    )
                                ) : (
                                    <Text>
                                        Open
                                        {storedata?.[0]?.is_24_hours
                                            ? " 24/7"
                                            : storedata?.[0]?.open_time && storedata?.[0]?.close_time
                                                ? ` from ${formatTime(storedata[0].open_time)} to ${formatTime(storedata[0].close_time)}`
                                                : ""
                                        }
                                    </Text>
                                )}
                            </Text>
                        </View>

                        {/* Store Description */}
                        <View className='mt-1 w-full px-2'>
                            <Text className='text-sm text-gray-600' style={{ fontFamily: 'roboto-medium' }}>{store_description}</Text>
                        </View>

                        {/* Store Actions */}
                            <View className='flex-row items-center justify-between mt-8 mb-12'>
                                <TouchableOpacity className='items-center'
                                    onPress={() => setRateStore(true)}
                                    style={{width: '23%'}}
                                >
                                    <View className='flex-row justify-center items-center'>
                                        <Ionicons name='star' size={13} color={COLORS.primary} />
                                        <Text className='text-sm' style={{fontFamily: 'roboto', color: COLORS.green1}}>
                                            {' '}{average_rating} ({total_ratings})


                                        </Text>
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Rate Us</Text>
                                </TouchableOpacity>

                                <View style={{height: 30, width: 1}} className='bg-grey_bg'/>

                                <TouchableOpacity
                                    onPress={() => setShowLocationMap(true)}
                                    className='items-center justify-center'
                                    style={{width: '23%'}}
                                >
                                    <View className='flex-row items-center justify-center'>
                                        <FontAwesome6 name="location-dot"  size={13} color={COLORS.primary} />
                                        <Text className='text-sm text-lavender'> | </Text>
                                        <Text numberOfLines={1} className='text-sm text-green1' style={{fontFamily: 'roboto'}}>{calculateDistance(pointA, pointB) || 0 + "Km"}</Text>
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Location</Text>
                                </TouchableOpacity>

                                <View style={{height: 30, width: 1}} className='bg-grey_bg'/>

                                <TouchableOpacity className='items-center'
                                    onPress={AddToFavorites}
                                    style={{width: '23.5%'}}
                                >
                                    <MaterialCommunityIcons
                                        name={!isFavoritedParam ? "cards-heart-outline" : "cards-heart"}
                                        size={16}
                                        color={COLORS.primary}
                                    />
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Favorites</Text>
                                </TouchableOpacity>

                                <View style={{height: 30, width: 1}} className='bg-grey_bg'/>

                                <TouchableOpacity className='justify-center items-center'
                                    onPress={() => setModalVisible(true)}
                                    style={{width: '23.5%'}}
                                >
                                    <View className='flex-row justify-center items-center'>
                                        <FontAwesome name='comments' size={16} color={COLORS.primary}/>
                                        <Text className='text-sm ml-1' style={{fontFamily: 'roboto', color: COLORS.green1}}>
                                            ({total_ratings})
                                        </Text>
                                    </View>
                                    <Text className='text-sm' style={{fontFamily: 'roboto'}}>Reviews</Text>
                                </TouchableOpacity>
                            </View>

                        {/* Tabs */}
                        <View className='mb-4 w-full'>
                            <StoreMenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </View>

                        {/* Active Tab Content */}
                        <View style={{ flex: 1 }} className='relative justify-center items-center'>
                            {renderActiveTab()}
                            <View className='mb-20'/>
                        </View>
                    </>
                }
                showsVerticalScrollIndicator={false}
            />

            {ratestore &&
                <>
                    <View className='absolute flex-1 bottom-2 w-full mb-12' style={{zIndex: 10000}}>
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            className='justify-end'
                        >
                            <View className='bg-white w-full justify-center items-center rounded-md'>
                                <TouchableOpacity
                                    className='w-full bg-red justify-center items-center'
                                    style={{borderTopLeftRadius: 5, borderTopRightRadius: 4}}
                                    onPress={() => setRateStore(false)}
                                >
                                    <View className='h-1 rounded-full my-2 bg-white w-[30%]'/>
                                </TouchableOpacity>

                                <Text className='text-xl mt-4' style={{fontFamily: 'roboto-medium'}}>Rate This Store</Text>

                                <View className='w-[90%] justify-center items-center'>
                                    <View className='justify-center items-center pt-4 flex-row'>
                                        {[...Array(5)].map((_, i) => (
                                        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                                            <MaterialIcons
                                            name={i < rating ? "star" : "star-border"}
                                            size={50}
                                            color="#FFD700"
                                            />
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                    {rating > 0 && (
                                        <Text className="text-sm text-gray-500 my-4">
                                            Your rating: {rating} ⭐
                                        </Text>
                                    )}
                                    <View className='w-full'>
                                        {/* Review Input */}
                                        <Text className='text-base mb-1' style={{fontFamily: 'roboto-medium'}}>Write a review (Optional)</Text>
                                        <TextInput
                                            placeholder="Write a review..."
                                            value={review}
                                            onChangeText={setReview}
                                            multiline
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#ddd',
                                                padding: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                height: 80
                                            }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        className='bg-primary my-4 py-3 w-full rounded-md elevation-lg justify-center items-center'
                                        onPress={() => submitRating()}
                                    >
                                        <Text className='text-white text-2xl' style={{fontFamily: 'roboto-medium'}}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>  
                        </MotiView>
                    </View>
                    <Pressable
                        className="absolute inset-0 bg-transparentBlack"
                        onPress={() => setRateStore(false)}
                    />
                </>
            }
            {/* View Cart */}
            <ViewCart cart_qty={cartItems.length} cart_total={totalZMK.toLocaleString()} router={router} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    mapsheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '95%',
        backgroundColor: 'white',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80
    },

    button: {
        backgroundColor: '#6200ee',
        padding: 12,
        borderRadius: 10,
    },

    closeBtn: {
        marginTop: 15,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
    },

    // map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },

    map: { flex: 1, height: '100%', width: '100%' }
});

export default StorePage;