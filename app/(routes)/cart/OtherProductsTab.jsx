import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, SectionList, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import OrderBtn from '../../../components/cart/OrderBtn';
import OthersCartData from '../../../components/cart/OthersCartData';
import DeliveryOptions1 from '../../../components/DeliveryOptions1';
import EmptyState from '../../../components/EmptyState';
import { COLORS, SIZES } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { clearOthersCart } from '../../../redux/store/slices/OthersCartSlice';
import { USER_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';
import DeliveryZones from './DeliveryZones';
import GetAvailableRunners from './GetAvailableRunners';
import LogingBtn from '../../../components/cart/LogingBtn';

const OtherProductsTab = () => {
    const { user_id, phone_num, province, city_town } = useSelector((state) => state.auth);
    const {
        latitude, longitude, displayCurrentLocation, locationServicesEnabled,
    } = useSelector((state) => state.location)

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const router = useRouter();
    const dispatch = useDispatch();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [runnerdetails, setRunnerDetails] = useState(null);
    const [selectedRunnerId, setSelectedRunnerId] = useState(null);

    // Get screen dimensions for responsive UI
    const { width, height } = Dimensions.get("window");
    const buttonWidth = width * 0.4;

    const othersCartItems = useSelector(state => state.otherscart.othersCartItems);
    const [totalZMK, setTotalZMK] = useState(0);
    const [orderdata, setOrderData] = useState(null);
    const [addrunner, setAddRunner] = useState(false);
    const charges = useSelector(state => state.delivery.charges);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [setstorecount, setStoreCount] = useState(25);
    const [availablerunners, setAvailableRunners] = useState(false);

    const [showZones, setShowZones] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);

    const handleLogin = () => {
        router.push('/(auth)/login');
    }

    // API hook
    const runnerUrl = useMemo(() => {
        return `/runner/search?latitude=${latitude}&longitude=${longitude}`;
    }, [latitude, longitude]);

    const { 
        data: searchrunner,
        error: searchRunnerError,
        isLoading: searchLoading,
        get: getRunner,
    } = useApi(runnerUrl);

    useEffect(() => {
        getRunner();
    }, []);

    const destination = useMemo(() => {
        if (latitude == null || longitude == null) return null;

        return {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
    }, [latitude, longitude]);

    const origin = useMemo(() => {
        if (!Array.isArray(searchrunner) || !searchrunner.length) return null;

        const lat = Number(searchrunner[0]?.location_latitude);
        const lng = Number(searchrunner[0]?.location_longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        return { latitude: lat, longitude: lng };
    }, [searchrunner]);

    // Update total price when cart changes
    useEffect(() => {
        const newTotal = othersCartItems.reduce((total, item) => total + item.total_price, 0);
        setTotalZMK(parseFloat(newTotal.toFixed(2))); // Ensuring proper decimal handling
    }, [othersCartItems]);

    const handleSelectMode = useCallback((data) => {
        setSelected(data);
    }, []);

    // Group payload for multivendor
    const groupedByStore = othersCartItems.reduce((acc, item) => {
        const storeId = item.store_id;

        if (!acc[storeId]) {
            acc[storeId] = {
                store_id: storeId,
                store_name: item.store_name,
                store_category: item.store_category,
                store_phone_num: item.store_phone_num,
                store_province: item.store_province,
                store_location: item.store_location,
                opentime: item.opentime,
                closing_time: item.closing_time,
                store_latitude: item.store_latitude,
                store_longitude: item.store_longitude,
                items: []
            };
        }
        acc[storeId].items.push(item);
        return acc;
    }, {});

    // 2. Convert grouped object → array (easier for backend)
    const storesArray = Object.values(groupedByStore);
    const storeCount = new Set(othersCartItems.map(item => item.store_id)).size;

    const feeMap = {
        2: 40, 3: 60, 4: 70, 5: 80, 6: 90
    };

    const runnerFeeValue = feeMap[storeCount] || 100;

    const grandTotal = useMemo(() => {
        const deliveryFee = Number(selectedDelivery?.fee || 0);
        const outSkatePrice = Number(0);

        return totalZMK + deliveryFee + outSkatePrice + (runnerdetails?.runner_active ? runnerFeeValue : 0);
    }, [totalZMK, selectedDelivery, runnerdetails?.runner_active, selectedZone]);

    const orderData = useMemo(() => {
        if (!othersCartItems.length) return null;

        return {
            user_id,
            order_type: 'General',

            user_latitude: latitude ?? 0.0,
            user_longitude: longitude ?? 0.0,

            cart_qty: othersCartItems.length,
            order_total_price: grandTotal,

            runner_data: runnerdetails || null,

            stores: storesArray.map(store => ({
                store_id: store.store_id,
                store_name: store.store_name,
                store_category: store.store_category,
                store_phone_num: store.store_phone_num,
                store_province: store.store_province,
                store_location: store.store_location,
                open_time: store.opentime,
                closing_time: store.closing_time,
                store_latitude: store.store_latitude ?? 0.0,
                store_longitude: store.store_longitude ?? 0.0,
                runner_active: runnerdetails?.runner_active || false,
                shipping_fee:
                    province !== 'Lusaka'
                        ? 0
                        : (selectedDelivery?.fee ?? 0),

                    shipping_mode:
                    province !== 'Lusaka'
                        ? null
                        : (selectedDelivery?.mode ?? 'Motor-Bike'),
                runner_fee: runnerdetails?.runner_active ? runnerFeeValue : 0,

                items: store.items.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    variants: item.selected_variants,
                    quantity: item.product_qty,
                    product_price: item.product_price,
                    final_price: item.final_price,
                    total_price: item.total_price,
                    product_notes: item.product_notes || ''
                }))
            }))
        };
    }, [othersCartItems, latitude, longitude, grandTotal, user_id]);

    // Custom API call hook
    const {
        data: orderResponse,
        isLoading,
        error,
        post: orderProduct
    } = useApi(`/orders/make_order`);

    const handlePlaceOrder = async () => {
        if (othersCartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (province !== 'Lusaka' && !selectedZone) {
            toast.error("Select delivery city & parcel size");
            return;
        }

        if (province === 'Lusaka' && !selectedDelivery) {
            toast.error("Select delivery mode");
            return;
        }

        if (!orderData) {
            toast.error("Order not ready");
            return;
        }

        try {
            const response = await orderProduct(orderData);

            if (!response?.data?.success) {
                toast.error(response?.data?.message || "Order Failed");
                return;
            }

            toast.success("Order Successful");

            dispatch(clearOthersCart());
            router.back();

        } catch (err) {
            console.log("ORDER ERROR:", err);
            toast.error("Failed to place order");
        }
    };

    const handleClearCart = () => dispatch(clearOthersCart());

    const sections = useMemo(() => {
        return Object.values(
            othersCartItems.reduce((acc, item) => {
                if (!acc[item.store_id]) {
                    acc[item.store_id] = {
                        store_id: item.store_id,
                        store_name: item.store_name,
                        data: [],
                        total: 0,
                        itemCount: 0
                    };
                }

                acc[item.store_id].data.push(item);
                acc[item.store_id].total += item.total_price;
                acc[item.store_id].itemCount += item.product_qty;

                return acc;
            }, {})
        );
    }, [othersCartItems]);

    // Optimize SectionList rendering
    const renderItem = useCallback(({ item }) => <OthersCartData item={item} />, []);

    const DeliveryOptionsMemo = React.memo(DeliveryOptions1);

    const closeModal = () => {
        setAvailableRunners(false);

        // ONLY keep checkbox checked if runner is actually selected
        if (!selectedRunnerId) {
            setAddRunner(false);
            // setRunnerDetails(null);
        }
    };

    const clearRunner = () => {
        setRunnerDetails(null);
        setSelectedRunnerId(null);
        setAddRunner(false);
    };

    const totalItems = othersCartItems.reduce(
        (sum, item) => sum + (item.product_qty || 0),
        0
    );

    return (
        <View className="flex-1 h-full justify-center items-center relative">
            {availablerunners && (
                <GetAvailableRunners
                    closeModal={closeModal}
                    setAvailableRunners={setAvailableRunners}
                    setRunnerDetails={setRunnerDetails}
                    user_phone_num={phone_num}
                />
            )}
            {isLoading &&
                <View className='absolute flex-1 h-full w-full bg-white justify-center items-center'>
                    <View className='bg-grey_bg py-6 rounded border border-white elevation-sm justify-center items-center' style={{zIndex: 999, width: '90%'}}>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                            Placing order, please wait...
                        </Text>
                    </View>
                </View>
            }
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.product_id}
                renderSectionHeader={({ section }) => (
                    <View className="flex-row bg-gray-100 p-1 mb-1 justify-between items-center">
                        <Text
                            className="text-lg"
                            style={{ fontFamily: 'roboto-bold' }}
                        >
                            {section.store_name}
                        </Text>

                        <Text className="text-sm text-slate">
                            {section.itemCount} item{section.itemCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}

                renderItem={renderItem}

                renderSectionFooter={({ section }) => (
                    <View className="flex-row justify-end mb-8" style={{marginTop: -8}}>
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

                ListHeaderComponent={othersCartItems.length > 0 && (
                    <View className=''>
                        <View className='w-full mt-4 mb-8 items-center justify-start bg-gray-100 rounded p-2'>
                            <Text
                                className='text-black text-base'
                                style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                            >
                                You have {othersCartItems.length} item{othersCartItems.length !== 1 ? 's' : ''} from {storeCount} {storeCount > 1 ? 'different' : ''} store{storeCount !== 1 ? 's' : ''} in your general cart.
                            </Text>
                        </View>
                        <View className='flex-row w-full justify-end items-center mb-4'>
                            <TouchableOpacity
                                onPress={handleClearCart}
                                className='p-1 justify-center flex-row items-center elevation-sm border border-white rounded bg-red'
                            >
                                <FontAwesome5 name='trash' color='white' size={13}/>
                                <Text className='text-white ml-1'>Remove all</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                ListFooterComponent={
                    othersCartItems.length > 0 && (
                        <>
                            {storeCount > 1 && (
                                <View>
                                    {runnerdetails?.runner_active === true ? <></> : (
                                        <View className='bg-navBtnBgHome rounded px-2 py-1'>
                                            <View className='flex-row items-center'>
                                                {/* <FontAwesome6 name="triangle-exclamation" size={18} color="red" /> */}
                                                <Text className='text-red text-base' style={{fontFamily: 'roboto-medium'}}>
                                                    Attention*
                                                </Text>
                                            </View>
                                            <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                                <Text className='text-green1'>Multiple stores detected.</Text> A runner can collect all items and deliver them together in one trip, saving time and delivery cost.
                                            </Text>
                                        </View>
                                    )}

                                    <View
                                        className='border p-2 my-8 flex-row justify-between items-center rounded border-lavender relative'
                                        style={{backgroundColor: runnerdetails?.runner_active ? COLORS.grey_bg : COLORS.white}}
                                    >
                                        {runnerdetails?.runner_active && (
                                            <View className='flex-row justify-start items-center'>
                                                <View
                                                    className='border border-lavender rounded-full justify-center items-center'
                                                    style={{width: 40, height: 40}}
                                                >
                                                    {runnerdetails?.profile_image === null ?
                                                    <FontAwesome name="user" size={30} color={COLORS.slate}/>
                                                        : <Image
                                                            source={{ uri: `${USER_IMAGE_URI}${runnerdetails?.profile_image}` }}
                                                            style={{ height: '100%', width: '100%' }}
                                                            className='rounded-full border-2 border-white'
                                                        />
                                                    }
                                                </View>
                                                <Text
                                                    style={{fontFamily: 'roboto-medium'}}
                                                    className='text-sm text-black ml-1'
                                                >{runnerdetails?.first_name} {runnerdetails?.last_name}</Text>
                                            </View>
                                        )}

                                        <View className="mb-5"
                                            style={{marginTop: 20}}
                                        >
                                            <BouncyCheckbox
                                                disableBuiltInState
                                                isChecked={runnerdetails !== null}
                                                onPress={(checked) => {
                                                    if (runnerdetails === null) {
                                                        // nothing selected → open modal
                                                        setAvailableRunners(true);
                                                        setAddRunner(true);
                                                        return;
                                                    }

                                                    // already selected → uncheck & clear
                                                    setSelectedRunnerId(null);
                                                    setRunnerDetails(null);
                                                    setAddRunner(false);
                                                }}
                                                disableText={runnerdetails?.runner_active}
                                                text="Activate runner"
                                                textStyle={{
                                                    textDecorationLine: 'none',
                                                    color: COLORS.black,
                                                    fontWeight: 'bold',
                                                    marginLeft: -10,
                                                    fontSize: 13,
                                                }}
                                                size={22}
                                                fillColor={COLORS.primary}
                                                iconStyle={{
                                                    borderColor: COLORS.primary,
                                                    borderWidth: 2,
                                                    borderRadius: 2,
                                                }}
                                                innerIconStyle={{
                                                    borderWidth: 2,
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            {province !== 'Lusaka' ? (
                                <>
                                    <TouchableOpacity
                                        className='relative flex-row justify-between items-center px-2 py-4 rounded border border-lavender'
                                        style={{backgroundColor: selectedZone ? COLORS.grey_bg : COLORS.white}}
                                        onPress={() => setShowZones(true)}
                                    >
                                        <View style={{width: '80%'}} className='items-center flex-row justify-between'>
                                            <View>
                                                <Text className='' style={{fontFamily: 'roboto', fontSize: 13, fontWeight: 'bold'}}>
                                                    {selectedZone ? selectedZone.city : 'Select delivery city'}
                                                </Text>
                                                {selectedZone && (
                                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto'}}>
                                                        {selectedZone.province}
                                                    </Text>
                                                )}
                                            </View>
                                            <View>
                                                {selectedZone && (
                                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-green2 text-base'>
                                                        <Text style={{textTransform: 'capitalize'}}>{selectedZone?.size}:</Text> K{selectedZone?.price}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <FontAwesome name='caret-up' size={22} color={COLORS.primary} />
                                    </TouchableOpacity>

                                    <View className='w-full mt-3'>
                                        <Text
                                            style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                                            className='text-red text-base'>
                                                Note*
                                            </Text>
                                        <Text
                                            className='text-sm text-slate'
                                            style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                            Kindly note that the delivery fee will be calculated after the items have been collected and bundled into a single order.
                                        </Text>
                                    </View>
                                    
                                </>
                            ) : (
                                <DeliveryOptionsMemo 
                                    origin={origin}
                                    destination={destination}
                                    selectedId={selectedDelivery?.mode}
                                    onSelectMode={setSelectedDelivery}
                                />
                            )}

                            <View className="flex-row items-center justify-center my-8">
                                {province !== 'Lusaka' ? (
                                    <Text className="text-base font-semibold" style={{ fontFamily: 'roboto-medium' }}>
                                        Delivery Fee:{' '}<Text className={`text-primary text-base`}>
                                            {selectedZone === null ? 0 : `K${0}`}
                                        </Text>
                                    </Text>
                                ) : (
                                    <Text className="text-base font-semibold" style={{ fontFamily: 'roboto-medium' }}>
                                        Delivery Fee:{' '}<Text className={`text-primary text-${selectedDelivery === null ? 'sm' : 'base'}`}>
                                            {selectedDelivery === null ? `K${0}` : `K${selectedDelivery?.fee}`}
                                        </Text>
                                    </Text>
                                )}

                                {runnerdetails?.runner_active &&
                                    <>
                                        <Text className='text-2xl text-slate mx-3'>|</Text>
                                        <Text className="text-base font-semibold" style={{ fontFamily: 'roboto-medium' }}>
                                            Runner Fee:{' '}<Text className='text-primary'>K{runnerFeeValue}</Text>
                                        </Text>
                                    </>
                                }
                            </View>

                            <View className="flex-row items-center justify-between mb-8">
                                <Text className="text-2xl font-semibold" style={{ fontFamily: 'ubuntu-medium' }}>Grand Total:</Text>
                                <View
                                    className="bg-primary items-center justify-center"
                                    style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06 }}
                                >
                                    <Text style={{ fontFamily: 'maven-medium' }} className="text-2xl text-white">
                                        K{grandTotal.toLocaleString()}
                                    </Text>
                                </View>
                            </View>


                            {!isAuthenticated && (
                                <View className='mb-4 w-full bg-[#FEF2F2] px-1 py-3 rounded justify-center items-center'>
                                    <Text
                                        className='text-base text-slate'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Please sign in to continue with this order.</Text>
                                </View>
                            )}

                            <View className="mb-20" />
                        </>
                    )
                }

                ListEmptyComponent={
                    <View style={{width: '100%', marginTop: 80}}
                        className="h-full w-full justify-center items-center">
                        <View className="flex-1 justify-center items-center relative">
                            <EmptyState
                                icon={<FontAwesome name='shopping-cart' size={40} color={COLORS.slate}/>}
                                description="Your general cart is empty"
                            />
                        </View>

                        <TouchableOpacity
                            className='bg-primary justify-center items-center elevation-sm border border-white rounded py-3'
                            style={{width: '100%'}}
                            onPress={() => router.push('../(tabs)/')}
                        >
                            <Text className='text-lg text-white' style={{fontFamily: 'roboto-medium'}}>
                                Go shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />

            {!isAuthenticated ? (
                <LogingBtn handlePress={handleLogin}/>
            ): othersCartItems.length > 0 ? (
                <OrderBtn
                    handlePlaceOrder={handlePlaceOrder}
                    router={router}
                    title="Order Now"
                    loading={isLoading}
                    disable={isLoading}
                    order_qty={totalItems}
                    order_total={grandTotal.toLocaleString()}
                />
            ) : null}

            <DeliveryZones
                visible={showZones}
                onClose={() => setShowZones(false)}
                onSelect={(zone) => setSelectedZone(zone)}
                clearRunner={clearRunner}
            />
        </View>
    );
};

export default OtherProductsTab;