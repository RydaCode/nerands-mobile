import { Entypo, EvilIcons, FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { STORES_IMAGE_URI } from '../../../RequestMethods'
import AdminStoreSingleCard from '../../../components/admin-store-single/cards/AdminStoreSingleCard'
import DeleteSelectedProductsOthers from '../../../components/delete-content/delete-store-others/DeleteSelectedProductsOthers'
import PublishStoreOthers from '../../../components/publish-content/publish-store/PublishStoreOthers'
import { COLORS, SIZES } from '../../../constants/constants'
import useApi from '../../../hook/useApi'

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
    delivery_status
 }) => {
    const [dropdownmenu, setDropdownMenu] = useState(false);
    const router = useRouter();

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

    const [publishStoremodalVisible, setPublishStoreModalVisible] = useState(false);
    const [deleteSelectedProductsmodalVisible, setDeleteSelectedProductsModalVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const { data: orderdata, isLoading: isLoadingOrder, error: errororder, get: getOrders } = useApi(`/orders/adminorders/${store_id}`);

    const { data, isLoading, error, get: getProducts } = useApi(`/products/admin/store?store_id=${store_id}&page=1&limit=10`);

    const {data: storereviews, isLoading: reviewsLoading, error: reviewsError, get: reviewsGet } = useApi(
        `/stores/${store_id}/reviews/`
    );

    useEffect(() => {
        reviewsGet();
    }, []);

    const reviews = storereviews?.data ?? [];

    useEffect(() => {
        if (store_id) {
            getProducts(); // fetch products
            getOrders();   // fetch orders if needed
        }
    }, [store_id]);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await getProducts();  // refresh products only
        } catch (err) {
            console.log('Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const productsList = data?.data ?? [];
    const productsCount = data?.count ?? 0;
    
    const handleCheckboxChange = (product_id) => {
        if (!product_id) return; // Prevent adding null or undefined IDs
    
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(product_id)
                ? prevSelectedItems.filter((id) => id !== product_id) // Remove if already selected
                : [...prevSelectedItems, product_id] // Add if not selected
        );
    };  

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
                        onPress={() => {setDeleteSelectedProductsModalVisible(false)}}
                    />
                    <View style={styles.centeredView}>
                        <View
                            style={[styles.modalView, { backgroundColor: '#fff', borderRadius: SIZES.radius, padding: 10, width: '100%', maxWidth: width }]} >
                            {/* Container */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22}/>
                                    <Text className='text-2xl ml-1' style={{fontFamily: 'ubuntu-medium'}}>Delete selected products</Text>
                                </View>
                                <Pressable
                                    onPress={() => {setDeleteSelectedProductsModalVisible(false)}}
                                    className='h-[30px] w-[30px] rounded-full justify-center items-center bg-red'>
                                    <FontAwesome5 name='times' color={COLORS.white} size={15} />
                                </Pressable>

                            </View>
                            {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                            <DeleteSelectedProductsOthers
                                setDeleteSelectedProductsModalVisible={setDeleteSelectedProductsModalVisible}
                                selectedItems={selectedItems}
                                store_id={store_id}
                            />
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End delete selected products modal */}
        
        <View className=''>
            <View>
                <View className='w-full justify-center items-center relative'>
                    
                    {/*  } */}
                    <View className='pb-10 mt-4 relative w-full flex-row flex-wrap items-center justify-between'
                        animation='slideInRight'
                        iterationCount={1}
                    >
                        <FlatList
                            data={productsList}
                            renderItem={({ item }) => {
                                const productSizes = Array.isArray(item.sizes) ? item.sizes : [];
                                const productColors = Array.isArray(item.colors) ? item.colors : [];
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
                                        product_actual_price={item.product_actual_price}
                                        product_status={item.product_status}
                                        store_name={store_name}
                                        store_id={item.store_id}
                                        store_category={item.store_category}
                                        product_category={item.product_category}
                                        product_colors={productColors}
                                        product_sizes={productSizes}
                                        chili_option={item.chili_option}
                                        product_extras_status={item.product_extras_status}
                                        store_profileimage={store_profileimage}
                                        handleCheckboxChange={handleCheckboxChange}
                                        selectedItems={selectedItems}
                                        setSelectedItems={setSelectedItems}
                                        active_status={active_status}
                                        is_available={item.is_available}
                                        variant_groups={item.variant_groups}
                                    />
                                );
                            }}
                            keyExtractor={(item) => item.product_id}

                            numColumns={numColumns} //Set number of columns (2 items per row)
                            columnWrapperStyle={{
                                justifyContent: 'space-between', //Adjust space between columns
                                paddingTop: 20,
                            }}
                            contentContainerStyle={{
                                paddingBottom: 20, //Optional: add some bottom padding
                            }}

                            ListHeaderComponent={() => (
                                <View className='mb-5'>
                                    <View
                                        className='w-full justify-center items-center'>
                                        <View className='flex-row w-full justify-between items-center'>
                                            <View
                                                className='flex-row mt-4 w-[84%] justify-start items-center'>
                                                <View style={{width: 70, height: 70}} className='rounded-full border-2 border-lavender mr-1 justify-center items-center'>
                                                    <Image source={{uri: `${STORES_IMAGE_URI}${store_profileimage}`}}
                                                        className='w-[100%] border-2 border-white h-[100%] rounded-full object-cover'/>
                                                </View>
                                                <View className='justify-start w-[75%]'>
                                                    <Text style={{fontFamily: 'roboto-bold'}} className='text-base'>{store_name}</Text>
                                                    <Text style={{fontFamily: 'roboto-medium'}} className='ml-1, text-sm text-slate'>{store_category}</Text>
                                                </View>
                                            </View>
                                            {dropdownmenu === false ?
                                                <TouchableOpacity
                                                    onPress={() => setDropdownMenu(true)}
                                                    className='bg-grey_bg w-12 h-12 border-2 border-lavender rounded-full items-center justify-center'>
                                                    <View className='w-full h-full border-2 border-white justify-center items-center rounded-full'>
                                                        <Entypo name="menu" size={25} color={COLORS.black} />
                                                    </View>
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    onPress={() => setDropdownMenu(false)}
                                                    className='bg-grey_bg w-12 h-12 border-2 border-lavender rounded-full items-center justify-center'>
                                                    <View className='w-full h-full border-2 border-white justify-center items-center rounded-full'>
                                                        <Entypo name="menu" size={25} color={COLORS.black} />
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <View className='w-full'>
                                            <Text className='mt-1 text-sm'>{store_description}</Text>
                                        </View>
                                    </View>
                                    <View
                                        className='flex-row w-full justify-between items-center mt-10'>
                                        <TouchableOpacity className='justify-center items-center'>
                                            <View className='flex-row justify-center items-center'>
                                                <MaterialIcons name="star" size={15} />
                                                <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}> {reviews?.stats?.average_rating}({reviews?.stats?.total_reviews})</Text>
                                            </View>
                                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>Ratings</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='justify-center items-center'>
                                            <EvilIcons name="location" size={24} />
                                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>Location</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='justify-center items-center'>
                                            <View className='flex-row justify-center items-center'>
                                                <SimpleLineIcons name="user-follow" size={15} />
                                                <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>(100K)</Text>
                                            </View>
                                            <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>Followers</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    {/* {dropdownmenu === false ? <></> : */}
                                    <View className='mt-6 w-full flex-row justify-between items-center'
                                        duration={1000}  //1 second
                                        easing="ease-in-out"  //Easing for smoother animation
                                    >
                                        <TouchableOpacity className='flex-row justify-center  rounded-md border border-lavender items-center py-3 bg-grey_bg relative'
                                            style={{width: '29%'}}
                                            onPress={() => router.push({pathname: '/(routes)/admin-orders/main-orders/', params: {
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
                                            }})}
                                        >
                                            <Entypo name='box' size={14} />
                                            <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-black ml-1' >Orders</Text>
                                            <View className='rounded-full bg-red border-2 justify-center items-center border-white absolute' style={{height: 28, width: 28, right: -2, top: -12}}>
                                                <Text className='text-sm text-white'>{orderdata?.count || 0}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='flex-row justify-center border  rounded-md border-lavender items-center py-3 bg-grey_bg'
                                            style={{width: '29%'}}
                                            onPress={() => router.push({pathname: '/(routes)/edit-stores/stores-settings-others/', params: {
                                                active_status: active_status,
                                                city_town: city_town,
                                                closing_time: closing_time,
                                                created_date: created_date,
                                                delivery_status: delivery_status,
                                                store_latitude: store_latitude,
                                                location: location,
                                                store_longitude: store_longitude,
                                                open_close: open_close,
                                                open_time: open_time,
                                                store_category: store_category,
                                                store_country: store_country,
                                                store_coverimage: store_coverimage,
                                                store_description: store_description,
                                                store_email: store_email,
                                                store_id: store_id,
                                                store_location: store_location,
                                                store_name: store_name,
                                                store_phone_num: store_phone_num,
                                                store_profileimage: store_profileimage,
                                                store_province: store_province,
                                                store_ratings: store_ratings,
                                                user_id: user_id,
                                                router: router
                                            }})}
                                        >
                                            <FontAwesome name='gear' size={14} />
                                            <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-black ml-1' >Dashboard</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='flex-row justify-center rounded-md border border-lavender items-center py-3 bg-red'
                                            style={{width: '38%'}}
                                            onPress={() => setDeleteSelectedProductsModalVisible(true)}
                                        >
                                            <FontAwesome5 name='trash' color={COLORS.white} size={14} />
                                            <Text style={{fontFamily: 'roboto-medium'}} className='text-sm text-white ml-1' >Delete Selected</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                // <View>
                                //     <Categories />
                                //     <TopRatedStores />
                                //     <View className='mb-4 mt-10 mx-2'>
                                //         <Text style={{fontFamily: 'maven-bold'}} className='text-xl'>All Stores</Text>
                                //     </View>
                                // </View>
                            )}

                            // ListEmptyComponent={() => (
                            //     <EmptyState
                            //         title='Items founds'
                            //         subtitle='Create store'
                            //     />
                            // )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
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