import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../../components/EmptyState";
import { COLORS, SIZES } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { PRODUCTS_IMAGE_URI } from "../../../RequestMethods";
import { toast } from "../../../utils/toast";
import LoadingIndicator from "../../LoadingIndicator";

const OrdersData = ({ order, router, store_name }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.25; // 29% of the screen width for the image
    const imageHeightModal = height * 0.1; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] =
        useState(false);
    const extras = order.extras || [];

    const variantsArray = Object.values(order.variants || {});

    return (
        <>
            {/* Start publish store modal */}
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={true}
                visible={orderFullInfoModalVisible}
                onRequestClose={() => {
                    setOrderFullInfoModalVisible(false);
                }}
            >
                <Pressable
                    style={styles.centeredView}
                    onPress={() => {
                        setOrderFullInfoModalVisible(false);
                    }}
                />
                <View
                    style={styles.centeredView}
                    animation="slideInUp"
                    iterationCount={1}
                >
                    <View
                        style={[
                            styles.modalView, {
                                backgroundColor: "#fff",
                                borderRadius: SIZES.radius,
                                padding: 10,
                                width: "100%",
                                maxWidth: width,
                            },
                        ]}
                    >
                        {/* Container */}
                        <View className="p-1 flex-row justify-between items-center">
                            <View className="flex-row justify-center items-center">
                                <FontAwesome6 name="edit" size={22} />
                                <Text
                                    className="text-2xl ml-1"
                                    style={{ fontFamily: "ubuntu-medium" }}
                                >
                                    Product Details
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => {
                                    setOrderFullInfoModalVisible(false);
                                }}
                                className="h-[30px] w-[30px] rounded-full justify-center items-center bg-red"
                            >
                                <FontAwesome5 name="times" color={COLORS.white} size={15} />
                            </Pressable>
                        </View>
                        <View
                            className="bg-white w-full p-3"
                            style={{
                                maxWidth: width,
                                borderRadius: SIZES.border, // Ensure it does not exceed the device width
                            }}
                        >
                            {/* Product Image and Info */}
                            <View className="flex-row mb-4">
                                <View
                                    className="relative"
                                    style={{ width: imageWidthModal, height: imageHeightModal }}
                                >
                                <Image
                                    className="w-full h-full"
                                    source={{
                                        uri: `${PRODUCTS_IMAGE_URI}${order.images?.[0]}`,
                                    }}
                                    style={{ borderRadius: SIZES.radius, resizeMode: "cover" }}
                                />
                                </View>
                                <View className="justify-center ml-[10px]">
                                    <Text
                                        className="text-lg"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        {order.product_name}
                                    </Text>
                                    <Text
                                        className="text-red text-lg"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        K{order.final_price || 'N/A'}
                                    </Text>
                                    
                                    <Text
                                        className="text-slate text-sm"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        From: {store_name}
                                    </Text>
                                </View>
                            </View>
                            <Text
                                className="text-ms text-slate mb-4"
                                style={{ fontFamily: "roboto-medium" }}
                            >
                                {order.notes}
                            </Text>

                            {/* Quantity Control */}
                            <View className="flex-row justify-between items-center mb-6">
                                <Text
                                    className="text-2xl"
                                    style={{ fontFamily: "ubuntu-medium" }}
                                >
                                    Quantity
                                </Text>
                                <View className="flex-row items-center">
                                    <Text
                                        className="text-xl"
                                        style={{ fontFamily: "maven-bold" }}
                                    >
                                        {order.quantity || 'N/A'}
                                    </Text>
                                </View>
                            </View>
                            {/* Variant Section */}
                            <ScrollView
                                style={{ maxHeight: height * 0.3 }}
                                showVericallScrollIndicator={false}
                            >
                                {variantsArray?.length > 0 && (
                                    <>
                                        <View className=''>
                                        <Text
                                            className='text-2xl'
                                            style={{fontFamily: 'ubuntu-medium'}}
                                        >Variants</Text>
                                        </View>
                                        <View style={{height: 1}} className='w-full bg-lavender my-1'/>
                                    </>
                                )}

                                {variantsArray?.length > 0 && variantsArray?.map((group) => (
                                    <View key={group?.group_id} className="mb-4">
                                        <Text style={{ fontFamily: 'roboto-bold' }}>
                                            {group?.group_name}
                                        </Text>

                                        {group?.options?.map((option) => (
                                            <View
                                                key={option.option_id}
                                                className="flex-row justify-between items-center"
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <MaterialCommunityIcons
                                                        name="checkbox-marked"
                                                        size={27}
                                                        color={COLORS.primary}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginLeft: 4,
                                                            fontSize: 15,
                                                            fontFamily: 'roboto-medium',
                                                            color: COLORS.slate
                                                        }}
                                                    >
                                                        {option.name}
                                                    </Text>
                                                </View>

                                                {option.price > 0 && (
                                                    <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 17 }}>
                                                        K{option.price || 'N/A'}
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Total Amount */}
                            <View className="flex-row items-center justify-between mb-5">
                                <Text
                                    className="text-2xl"
                                    style={{ fontFamily: "ubuntu-medium" }}
                                >
                                    Total:
                                </Text>
                                <View
                                    className="bg-primary items-center justify-center P-[5px]"
                                    style={{
                                        borderRadius: SIZES.radius,
                                        width: buttonWidth,
                                        height: height * 0.06,
                                    }}
                                >
                                    <Text
                                        style={{ fontFamily: "ubuntu-medium" }}
                                        className="text-2xl text-white"
                                    >
                                        K{order.total_price || 'N/A'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Start public modal */}
            
            <TouchableOpacity
                onPress={() => setOrderFullInfoModalVisible(true)}
                className="flex-row justify-between items-center"
            >
                <View className="flex-row justify-start items-center">
                    {!order?.images ? 
                        <FontAwesome5 name="box" size={35} color={COLORS.slate} style={{width: 60, height: 60, borderRadius: SIZES.radius, backgroundColor: COLORS.lavender, justifyContent: 'center', alignItems: 'center'}}/> :
                        <Image
                            source={{ uri: `${PRODUCTS_IMAGE_URI}${order.images?.[0]}` }}
                            style={{ borderRadius: SIZES.radius }}
                            className="h-[65px] w-[26%]"
                        />
                    }
                    
                    <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
                        <View className="w-full">
                            <View className="">
                                <Text
                                    className="text-lg"
                                    style={{ fontFamily: "roboto-medium" }}
                                    numberOfLines={1}
                                >
                                    {order.product_name || 'Product name not available'}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text
                                        className="text-sm text-slate"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        Price: K{order.final_price || 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row items-center justify-start mr-4">
                                    <Text
                                        className="text-slate text-sm"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        Qty:{order.quantity || 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row items-center justify-start mr-4">
                                    <Text
                                        className="text-green2 text-sm"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        Total: K{order.total_price || 'N/A'}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center justify-start mr-4">
                                    <Text
                                        numberOfLines={1}
                                        className="text-grey text-sm"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        {order.desc || 'Description not available'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View className='bg-grey_bg w-full my-5' style={{height: 1}}/>
        </>
    );
};

const GeneralOrder = ({ params }) => {
    const user_id = params.user_id;
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons
    const {
        latitude,
        longitude,
        displayCurrentLocation,
        locationServicesEnabled,
    } = useSelector((state) => state.location);

    const { data, isLoading, error, get } = useApi(`/orders/${params.order_id}`);

    useEffect(() => {
        if (params.order_id) {
            get();
        }
    }, [params.order_id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'red'; // orange
            case 'Processing':
                return '#3B82F6'; // blue
            case 'Accepted':
                return '#22C55E'; // green
            case 'In_Transit':
                return '#8B5CF6'; // purple
            case 'Delivered':
                return '#10B981'; // emerald
            case 'Ready':
                return 'coral'; // emerald
            default:
                return '#6B7280'; // gray
        }
    };

    // const {data:gettransporter, isLoading:transporterloading, error:transportererrors, refetch:transporterrefetch} = useApi(`/deliveryman/transporter/${user_id}`);

    // const origine_lat = parseFloat(latitude);
    // const origine_lng = parseFloat(longitude);
    // const destination_lat = parseFloat(data?.items[0]?.store.store_latitude);
    // const destination_lng = parseFloat(data?.items[0]?.store.store_longitude);

    // const directions = [
    //   { latitude: origine_lat, longitude: origine_lng },
    //   { latitude: destination_lat, longitude: destination_lng },
    // ];

    // const pointA = directions[0]; // Transporter
    // const pointB = directions[1]; // Store

    // const origin = {
    //       latitude: origine_lat,
    //       longitude: origine_lng
    //   };

    //   const destination = {
    //       latitude: destination_lat,
    //       longitude: destination_lng
    //   };

    // const tansproter_lat = parseFloat(gettransporter?.latitude);
    // const tansproter_lng = parseFloat(gettransporter?.longitude);

    // const directions_trans = [
    //     {latitude: origine_lat, longitude: origine_lng},
    //     {latitude: -15.01245, longitude: 28.23158}
    // ]

    // const calculateDistanceTrans = (pointAT, pointBT) => {
    //     const distanceKm = haversine(pointAT, pointBT) / 1000; // Convert meters to km
    //     return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
    // };

    // const pointAT = directions_trans[0]; // Transporter
    // const pointBT = directions_trans[1]; // Store

    // const estimateTimeTrans = (pointAT, pointBT, averageSpeedKmh = 40) => {
    //     const distanceKm = haversine(pointAT, pointBT) / 1000;
    //     const timeHours = distanceKm / averageSpeedKmh;
    //     const totalMinutes = Math.ceil(timeHours * 60);

    //     const hours = Math.floor(totalMinutes / 60);
    //     const minutes = totalMinutes % 60;

    //     if (hours > 0) {
    //       return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    //     } else {
    //       return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    //     }
    // };

    const { data:delteOrder, error:deleteOrderError, isLoading:deleteOrderLoading, del:deleteOrderData } = useApi(
        `/orders/delete/${params.order_id}`,
    );

    const deleteOrder = async () => {
        if (!params.order_id) {
            toast.error('Missing order ID');
            return;
        }

        try {
            await deleteOrderData();
            toast.success('Order removed successfully');
        } catch (error) {
            toast.error('Failed to delete this order');
        }
    };

    if (deleteOrderLoading) return <LoadingIndicator loading_text='Removing order...'/>;
    if (isLoading) return <LoadingIndicator loading_text='Loading order items...'/>;

    const sections = (data?.stores || []).map(store => {
        const items = store.items || [];

        const storeTotal = items.reduce((sum, item) => {
        return sum + Number(item.total_price || 0);
        }, 0);

        const itemCount = items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
        }, 0);

        return {
            title: store.store_name,
            store_id: store.store_id,
            store_phone: store.store_phone,
            status: store.status,
            shipping_fee: store.shipping_fee,
            runner_fee: store.runner_fee,
            discount_amount: store.discount_amount,
            runner_active: store.runner_active,
            shipping_mode: store.shipping_mode,
            store_latitude: store.store_latitude,
            store_longitude: store.store_longitude,
            data: items,
            total: storeTotal,
            itemCount: itemCount
        };
    });

    const orderSubtotal = (data?.stores || []).reduce((storeSum, store) => {
        const items = store.items || [];

        const storeTotal = items.reduce((itemSum, item) => {
            return itemSum + Number(item.total_price || 0);
        }, 0);

        return storeSum + storeTotal;
    }, 0);
    

    const stores = data?.stores || [];

    // number of stores
    const storeCount = stores.length;

    // total items across all stores
    const totalItems = stores.reduce((storeSum, store) => {
        const items = store.items || [];

        return storeSum + items.reduce((itemSum, item) => {
            return itemSum + Number(item.quantity || 0);
        }, 0);
    }, 0);

    const shippingFee =
        data?.stores?.[0]?.shipping_fee ?? 0;

    const runnerFee =
        data?.stores?.[0]?.runner_fee ?? 0;

    const runnerActiveFee =
        data?.stores?.[0]?.runner_active ?? 0;

    const grandTotal =
        Number(orderSubtotal || 0) +
        Number(runnerFee || 0) +
        Number(shippingFee || 0);

    const statusColorMap = {
        pending: "bg-rose-700",
        accepted: "bg-violet-500",
        in_progress: "bg-indigo-500",
        completed: "bg-green2",
        cancelled: "bg-red",
    };

    const orderTypeColorMap = {
        Food: "bg-coral",
        Normal: "bg-green1",
        Local_Market: "bg-indigo-500",
    };

    const statusColor = statusColorMap[params.order_status] || "bg-red";
    const typeStatusColor = orderTypeColorMap[params.order_type] || "bg-green2";

    const orderType = `${typeStatusColor} py-2 rounded justify-center items-center`;
    const orderStatusClassName = `${statusColor} py-2 rounded justify-center items-center`;

    return (
        <View className="">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.order_item_id}
                renderSectionHeader={({ section }) => (
                    <View className="flex-row bg-gray-100 p-1 mb-1 justify-between items-center">
                        <Text
                            className="text-lg"
                            style={{ fontFamily: 'roboto-bold' }}
                        >
                            {section.title}
                        </Text>

                        <Text className="text-sm text-slate">
                            {section.itemCount} item{section.itemCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}

                renderItem={({ item, section }) => (
                    <OrdersData
                        order={item}
                        router={router}
                        store_name={section.title}
                    />
                )}

                renderSectionFooter={({ section }) => (
                    <View className="flex-row justify-between" style={{marginTop: -12, marginBottom: 40}}>
                        <View
                            className='rounded py-1 justify-center items-center'
                            style={{
                                width: buttonWidth,
                                backgroundColor: getStatusColor(section.status?.charAt(0).toUpperCase() + section.status?.slice(1))
                             }}
                        >
                            <Text
                                className="text-lg text-white"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                {section.status?.charAt(0).toUpperCase() + section.status?.slice(1)}
                            </Text>
                        </View>
                        <View
                            className='bg-grey_bg rounded py-1 justify-center items-center'
                            style={{ width: buttonWidth }}
                        >
                            <Text
                                className="text-lg text-primary"
                                style={{ fontFamily: 'ubuntu-medium' }}
                            >
                                Total: K{section.total.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                )}

                ListHeaderComponent={() => (
                    <View className='mt-6'>
                        <View className='w-full flex-row justify-between'>
                            <View
                                className={orderType}
                                style={{width: '48%'}}
                            >
                                <Text
                                    className='text-base text-white'
                                    style={{fontFamily: 'roboto-medium'}}
                                >
                                    {params.order_type.charAt(0).toUpperCase() + params.order_type.slice(1)}
                                </Text>
                            </View>
                            <View
                                className={orderStatusClassName}
                                style={{width: '48%'}}
                            >
                                <Text
                                    className='text-base text-white'
                                    style={{fontFamily: 'roboto-medium'}}
                                >
                                    Status: {params.order_status.charAt(0).toUpperCase() + params.order_status.slice(1)}
                                </Text>
                            </View>
                        </View>
                        <View className='w-full mt-3 mb-5 items-center justify-start bg-white rounded py-1'>
                            <Text className='text-black text-base' style={{fontFamily: 'roboto-medium'}}>
                                You have {totalItems} item{totalItems !== 1 ? 's' : ''} from {storeCount} store{storeCount !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                )}

                ListFooterComponent={({section}) => (
                    <View className='mb-10'>
                        {runnerActiveFee === true && (
                            <View style={{
                                padding: 10,
                                backgroundColor: '#e8f5e9',
                                borderRadius: 8,
                                borderLeftWidth: 1,
                                borderLeftColor: '#4caf50'
                            }}>
                                <Text className='text-red' style={{ fontSize: 16, fontFamily: 'roboto-medium', marginBottom: 4 }}>
                                    Runner Active
                                </Text>

                                <Text className='text-sm' style={{ fontSize: 14, color: '#555', textAlign: 'justify' }}>
                                    This order has an active runner. This means a runner collects all items
                                    from the respective stores and bundle them into one delivery.
                                </Text>
                            </View>
                        )}
                        <View className='mt-4 justify-center items-center' style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                            <Text>
                                <Text className='text-green2 mt-2' style={{fontFamily: 'roboto-medium'}}>
                                Order Total: <Text className='text-red'>K{Number(orderSubtotal).toLocaleString()}</Text>
                                </Text>
                            </Text>
                            <View className='flex-row justify-center items-center mt-2'>
                                <Text className='text-green2' style={{fontFamily: 'roboto-medium'}}>
                                    Runner Fee: <Text className='text-red'>K{runnerFee}</Text>
                                </Text>

                                <Text style={{marginHorizontal: 10}}>|</Text>

                                <Text className='text-green2' style={{fontFamily: 'roboto-medium'}}>
                                    Delivery Fee: <Text className='text-red'>K{shippingFee}</Text>
                                </Text>
                            </View>
                        </View>
                        <View className='mt-4 justify-center items-center' style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                            <Text className='text-2xl text-primary' style={{fontFamily: 'maven-medium'}}>
                                Grand Total: K{Number(grandTotal).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                )}

                ListEmptyComponent={() => (
                    <View style={{width: '100%', marginTop: 80}}
                        className="h-full w-full justify-center items-center">
                        <View className="flex-1 justify-center items-center relative">
                            <EmptyState
                                icon={<FontAwesome5 name='shopping-cart' size={40} color={COLORS.slate}/>}
                                description="Your general cart is empty"
                            />
                        </View>

                        <TouchableOpacity
                            className='bg-primary justify-center items-center elevation-sm border border-white rounded py-3'
                            style={{width: '100%'}}
                            // onPress={() => router.push('../(tabs)/')}
                        >
                            <Text className='text-lg text-white' style={{fontFamily: 'roboto-medium'}}>
                                Go shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingBottom: 30,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default GeneralOrder;