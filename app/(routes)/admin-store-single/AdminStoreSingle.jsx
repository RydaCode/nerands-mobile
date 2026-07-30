import { Entypo, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import DeleteSelectedProductsOthers from '../../../components/delete-content/delete-store-others/DeleteSelectedProductsOthers'
import PublishStoreOthers from '../../../components/publish-content/publish-store/PublishStoreOthers'
import { COLORS, SIZES } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { usePermissions } from '../../../hook/usePermissions'
import { STORES_IMAGE_URI } from '../../../RequestMethods'
import socket from '../../../socket-io/socket'
import { toast } from '../../../utils/toast'
import AdminStoreSingleCard from './AdminStoreSingleCard'

const AdminStoreSingle = ({
    store_id,
    user_id,
    store_name,
    store_category,
    store_phone_num,
    store_email,
    store_country,
    store_province,
    city_town,
    store_description,
    store_location,
    store_longitude,
    store_latitude,
    open_time,
    closing_time,
    created_date,
    store_profileimage,
    store_coverimage,
    store_ratings,
    open_close,
    active_status,
    delivery_status,
    business_id,
    display_name,
    business_type
 }) => {
    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();

    // Make the image height and width responsive based on the screen size
    const imageWidth = width * 0.25;
    const imageHeight = height * 0.09;

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons
    const numColumns = width > 600 ? 3 : 2;  // Use 3 columns for large screens, 2 for smaller ones

    const [dropdownmenu, setDropdownMenu] = useState(false);
    const router = useRouter();
    const {can} = usePermissions();

    const [publishStoremodalVisible, setPublishStoreModalVisible] = useState(false);
    const [deleteSelectedProductsmodalVisible, setDeleteSelectedProductsModalVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const limit = 10;

    const { data: orderdata, isLoading: isLoadingOrder, error: errororder, get: getOrders } = useApi(
        `/orders/adminorders/${store_id}?order_status=pending`
    );

    const { data, isLoading, error, get: getProducts } = useApi(
        `/products/admin/store?store_id=${store_id}&page=1&limit=10`
    );

    const {data: storereviews, isLoading: reviewsLoading, error: reviewsError, get: reviewsGet } = useApi(
        `/stores/${store_id}/reviews/`
    );

    const fetchProducts = async (reset = false) => {
        if (loadingMore || (!hasMore && !reset)) return;
        const currentPage = reset ? 1 : page;

        try {
            if(reset){
                setInitialLoading(true);
                setPage(1);
            }else{
                setLoadingMore(true);
            }

            const response = await getProducts(
                `/products/admin/store?store_id=${store_id}&page=${currentPage}&limit=${limit}`
            );

            const newProducts = response?.data?.data || [];

            setProductsList(prev =>
                reset ? newProducts : [...prev, ...newProducts]
            );

            setHasMore(
                currentPage < response?.data?.pagination?.pages
            );

            setPage(currentPage + 1);
        } catch(error){
            console.log(error);
        } finally {

            setInitialLoading(false);
            setLoadingMore(false);

        }
    };

    useEffect(() => {
        reviewsGet();
    }, []);

    const reviews = storereviews?.data ?? [];

    useEffect(() => {
        if(store_id){
            fetchProducts(true);
            getOrders();
        }
    },[store_id]);

    useEffect(() => {
        if (!store_id) return;

        socket.emit("join_store", store_id);
        socket.on("new_order", (order) => {
            console.log("New order received:", order);
            // refresh pending orders
            getOrders();
        });

        return () => {
            socket.off("new_order");
        };
    }, [store_id]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProducts(true);
        setRefreshing(false);
    };

    const productsCount = data?.count ?? 0;
    
    const handleCheckboxChange = (product_id) => {
        if (!product_id) return; // Prevent adding null or undefined IDs
    
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(product_id)
                ? prevSelectedItems.filter((id) => id !== product_id) // Remove if already selected
                : [...prevSelectedItems, product_id] // Add if not selected
        );
    };

    const goToStoreSettings = () => {
        router.push({
            pathname: '/(routes)/edit-stores/stores-settings-others',
            params: {
                active_status,
                city_town,
                closing_time,
                created_date,
                delivery_status,
                store_latitude,
                store_longitude,
                open_close,
                open_time,
                store_category,
                store_country,
                store_coverimage,
                store_description,
                store_email,
                store_id,
                store_location,
                store_name,
                store_phone_num,
                store_profileimage,
                store_province,
                store_ratings,
                user_id,
                router,
                business_id,
                display_name,
                business_type
            }
        });
    };

    const DeleteMessage = () => {
        toast.error('Select one or more products to delete.');
    }

    const formatReviews = (count) => {
        if (!count) return 0;

        if (count >= 1_000_000) {
            return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M';
        }

        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace('.0', '') + 'K';
        }
        return count;
    }

    return (
        <>
            {/* Start publish store modal */}
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => { setPublishStoreModalVisible(false)}}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={publishStoremodalVisible}
                    onRequestClose={() => { setPublishStoreModalVisible(false); }}
                >
                    <Pressable style={styles.centeredView} onPress={() => { setPublishStoreModalVisible(false)}}/>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { backgroundColor: '#fff', borderRadius: SIZES.radius, padding: 10, width: '100%', maxWidth: width }]} >
                            {/* Container */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22}/>
                                    <Text className='text-xl ml-1' style={{fontFamily: 'roboto-medium'}}>Publish Store</Text>
                                </View>
                                <Pressable
                                    onPress={() => {setPublishStoreModalVisible(false)}}
                                    className='h-[30px] w-[30px] rounded-full justify-center items-center bg-red'>
                                    <FontAwesome5 name='times' color={COLORS.white} size={15} />
                                </Pressable>
                            </View>
                            {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                            <PublishStoreOthers setPublishStoreModalVisible={setPublishStoreModalVisible} />
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End publish store modal */}
            
            {/* Start delete selected products modal */}
            <TouchableOpacity
                className='flex-1 justify-center items-center'
                onPress={() => {setDeleteSelectedProductsModalVisible(false)}}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={deleteSelectedProductsmodalVisible}
                    onRequestClose={() => {setDeleteSelectedProductsModalVisible(false) }}
                >
                    <Pressable
                        style={styles.centeredView}
                    />
                    <MotiView className='mt-5 w-full items-center'
                        from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                        animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                        transition={{ duration: 1000 }}
                    >
                        <View style={styles.centeredView}>
                            <View
                                style={[styles.modalView, { backgroundColor: '#fff', borderRadius: SIZES.radius, padding: 10, width: '100%', maxWidth: width }]} >
                                {/* Container */}
                                <View className='p-1 flex-row justify-between items-center'>
                                    <View className='flex-row justify-center items-center'>
                                        <FontAwesome6 name="trash" size={19}/>
                                        <Text className='text-xl ml-1' style={{fontFamily: 'roboto-medium'}}>Delete selected products</Text>
                                    </View>
                                </View>
                                {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                                <DeleteSelectedProductsOthers
                                    setDeleteSelectedProductsModalVisible={setDeleteSelectedProductsModalVisible}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    store_id={store_id}
                                />
                            </View>
                        </View>
                    </MotiView>
                </Modal>
            </TouchableOpacity>
            {/* End delete selected products modal */}
        
        <View className=''>
            <View>
                <View className='w-full justify-center items-center relative'>
                    {isLoading && productsList.length === 0 ? (
                        <View className='w-full h-full justify-center items-center'>
                            <ActivityIndicator size={40} color={COLORS.primary}/>
                            <Text className='text-base text-slate mt-4' style={{fontFamily: 'roboto-medium'}}>
                                Loading products from {store_name}
                            </Text>
                        </View>
                    ) : error ? (
                        <View className='w-full h-full justify-center items-center'>
                            <Text className='text-base text-red' style={{fontFamily: 'roboto-medium'}}>
                                An error occured, please restart the app. 
                            </Text>
                        </View>
                    ) : (
                        <View className='pb-10 relative w-full flex-row flex-wrap items-center justify-between'>
                            <FlatList
                                data={productsList}
                                renderItem={({ item }) => {
                                    const productImages = Array.isArray(item.product_images) ? item.product_images : [];
                                    const firstImage = productImages.length > 0 ? `${productImages[0]}` : null;
                                    return (
                                        <AdminStoreSingleCard
                                            key={item.product_id}
                                            product_id={item.product_id}
                                            product_image={firstImage}
                                            product_images={productImages}
                                            product_name={item.product_name}
                                            product_description={item.product_description}
                                            product_price={item.product_price}
                                            product_status={item.product_status}
                                            store_name={store_name}
                                            store_id={item.store_id}
                                            store_category={item.store_category}
                                            product_category={item.product_category}
                                            product_extras_status={item.product_extras_status}
                                            store_profileimage={store_profileimage}
                                            handleCheckboxChange={handleCheckboxChange}
                                            selectedItems={selectedItems}
                                            setSelectedItems={setSelectedItems}
                                            active_status={active_status}
                                            is_available={item.is_available}
                                            variant_groups={item.variant_groups}
                                            markup_percent={item.markup_percent}
                                            final_price={item.final_price}
                                        />
                                    );
                                }}
                                keyExtractor={(item) => item.product_id}

                                numColumns={numColumns} //Set number of columns (2 items per row)
                                columnWrapperStyle={{
                                    justifyContent: 'space-between', //Adjust space between columns
                                    paddingTop: 20,
                                }}

                                onEndReached={()=>{
                                    if(hasMore){
                                        fetchProducts(false);
                                    }
                                }}

                                onEndReachedThreshold={0.5}

                                contentContainerStyle={{
                                    paddingBottom: 20, //Optional: add some bottom padding
                                }}

                                ListHeaderComponent={() => (
                                    <View className='mb-5'>
                                        <View
                                            className='w-full justify-center items-center'>
                                            <View className='flex-row w-full justify-between items-center'>
                                                <View
                                                    className='flex-row mt-4 w-full justify-between items-center'>
                                                    <View
                                                        style={{width: 70, height: 70}}
                                                        className='rounded-full bg-grey_bg border-2 border-lavender mr-1 justify-center items-center'
                                                    >
                                                        {!store_profileimage ? (
                                                            <FontAwesome5 name='store-alt' size={20} color={COLORS.slate}/>
                                                        ) : (
                                                            <Image source={{uri: `${STORES_IMAGE_URI}${store_profileimage}`}}
                                                                className='w-[100%] border-2 border-white h-[100%] rounded-full object-cover'
                                                            />
                                                        )}
                                                    </View>
                                                    <View className='w-[77%]'>
                                                        <Text style={{fontFamily: 'roboto-bold'}} className='text-base'>{store_name}</Text>
                                                        <Text style={{fontFamily: 'roboto-medium'}} className='ml-1, text-sm text-slate'>{store_location}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className='w-full'>
                                                <Text className='mt-1 text-sm'>{store_description}</Text>
                                            </View>
                                        </View>
                                        <View className='flex-row w-full justify-between items-center mt-10 mb-4'>
                                            <TouchableOpacity className='justify-center items-center rounded py-1 border border-lavender' style={{width: '23.5%'}}>
                                                <View className='flex-row justify-center items-center'>
                                                    <MaterialIcons name="star" size={15} color={COLORS.primary} />
                                                    <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}> {reviews?.stats?.average_rating} ({formatReviews(reviews?.stats?.total_reviews)})</Text>
                                                </View>
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Ratings</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className='justify-center items-center rounded py-1 border border-lavender' style={{width: '23.5%'}}>
                                                <FontAwesome6 name="location-dot"  size={16} color={COLORS.green1} />
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Location</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className='justify-center items-center rounded py-1 border border-lavender' style={{width: '23.5%'}}>
                                                <View className='flex-row justify-center items-center'>
                                                    <MaterialCommunityIcons
                                                        name={"cards-heart-outline"}
                                                        // name={!favorited ? "cards-heart-outline" : "cards-heart"}
                                                        size={15}
                                                        color={COLORS.primary}
                                                    />
                                                    <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}> (0)</Text>
                                                </View>
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Followers</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className='items-center rounded py-1 border border-lavender' style={{width: '23.5%'}}>
                                                <View className='flex-row justify-center items-center'>
                                                    <View className='flex-row justify-center items-center'>
                                                        <FontAwesome name="comments" size={15} color={COLORS.primary}/>
                                                        <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>
                                                            {' '}({formatReviews(reviews?.stats?.total_reviews)})
                                                        </Text>
                                                    </View>
                                                    <Text className='text-sm text-green1' style={{fontFamily: 'roboto-medium'}}></Text>
                                                </View>
                                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>Reviews</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View className='mt-6 w-full flex-row justify-between items-center'
                                            duration={1000}  //1 second
                                            easing="ease-in-out"  //Easing for smoother animation
                                        >
                                            <TouchableOpacity className='flex-row justify-center  rounded border border-white items-center elevation-sm py-3 bg-purple-600 relative'
                                                style={{width: '29%'}}
                                                onPress={() => {
                                                    if (!can('view_orders')) {
                                                        toast.info('You have no permissions to view orders');
                                                        return;
                                                    }

                                                    router.push({
                                                    pathname: '/(routes)/admin-orders/main-orders/',
                                                    params: {
                                                        business_id: business_id,
                                                        store_id: store_id,
                                                        user_id: user_id,
                                                        store_name: store_name,
                                                        store_category: store_category,
                                                        store_phone_num: store_phone_num,
                                                        store_email: store_email,
                                                        store_country: store_country,
                                                        store_province: store_province,
                                                        city_town: city_town,
                                                        store_description: store_description,
                                                        store_location: store_location,
                                                        store_latitude: store_latitude,
                                                        store_longitude: store_longitude,
                                                        open_time: open_time,
                                                        closing_time: closing_time,
                                                        created_date: created_date,
                                                        store_profileimage: store_profileimage,
                                                        store_coverImage: store_coverimage,
                                                        store_ratings: store_ratings,
                                                        open_close: open_close,
                                                        active_status: active_status,
                                                        delivery_status: delivery_status
                                                    }
                                                })}}
                                            >
                                                <Entypo name='box' size={14} color='white' />
                                                <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white ml-1' >Orders</Text>
                                                <View className='rounded-full bg-red border-2 justify-center items-center border-white absolute' style={{height: 28, width: 28, right: -2, top: -12}}>
                                                    <Text className='text-base text-white'>{orderdata?.data?.length || 0}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity className='flex-row justify-center border rounded border-white elevation-sm items-center py-3 bg-green2'
                                                style={{width: '29%'}}
                                                onPress={goToStoreSettings}
                                            >
                                                <FontAwesome name='gear' size={14} color='white' />
                                                <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white ml-1' >Dashboard</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className='flex-row justify-center rounded border border-white elevation-sm items-center py-3 bg-red'
                                                style={{ width: '38%' }}
                                                // disabled={selectedItems.length === 0}
                                                onPress={() => {
                                                    if (!can('delete_product')) {
                                                        toast.info('You have no permissions to delete products.');
                                                        return;
                                                    }

                                                    selectedItems.length === 0 ? DeleteMessage() :
                                                    setDeleteSelectedProductsModalVisible(true)
                                                }}
                                            >
                                                <FontAwesome5 name='trash' color={COLORS.white} size={14} />
                                                <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white ml-1' >Delete Selected</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                ListEmptyComponent={() => (
                                    <View className="justify-center items-center" style={{marginTop: 100}}>
                                        <Text className='text-base' style={{ fontFamily: 'roboto-medium'}}>
                                            You haven't posted any products yet.
                                        </Text>
                                        <Text className='text-slate text-sm' style={{ fontFamily: 'roboto-medium'}}>
                                            Press the plus icon below to add new products.
                                        </Text>

                                        {/* <TouchableOpacity
                                            style={{width: '55%'}}
                                            className='bg-primary justify-center items-center mt-4 py-3 rounded elevation-sm border border-white'
                                            onPress={goToStoreSettings}
                                        >
                                            <Text className='text-white text-lg' style={{ fontFamily: 'outfit-medium'}}>Dashboard</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                )}

                                ListFooterComponent={
                                    loadingMore ? (
                                        <View className="py-5 mb-4">
                                            <ActivityIndicator
                                                size={33}
                                                color={COLORS.primary}
                                            />
                                        </View>
                                    ) : null
                                }

                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default AdminStoreSingle