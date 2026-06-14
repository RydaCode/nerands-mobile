import { Entypo, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import LogingBtn from '../../../../components/cart/LogingBtn';
import { CustomToast } from '../../../../components/CustomToast';
import { COLORS } from '../../../../constants/constants';
import { clearProducts, deleteProduct, removeStore } from "../../../../redux/store/slices/CustomOrdersCartSlice";
import { USER_IMAGE_URI } from '../../../../RequestMethods';
import { toast } from '../../../../utils/toast';
import SelectPackageSize from './SelectPackageSize';

const ViewCartModal = ({
    viewCart,
    setViewCart,
    setOpenAddProduct,
    errorMessage,
    setErrorMessage,
    estimatedBudget,
    serviceCharge,
    serviceFee,
    delivery,
    handlingFee,
    setHandlingFee,
    handleMakeOrder,
    makeOrderLoading,
    makeOrderError,
    setOpenAddStoreModal
}) => {
    const dispatch = useDispatch();
    const [openSelctSize, setOpenSelctSize] = useState(false);
    const [selectedSize, setSelectedSize] = useState([]);
    const products = useSelector((state) => state.customcart.products);
    const stores = useSelector((state) => state.customcart.custom_stores);
    const runnerdetails = useSelector(state => state.customcart.runner_details);
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const {
        latitude, longitude, displayCurrentLocation, locationServicesEnabled,
    } = useSelector((state) => state.location) || {};

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogin = () => {
            router.push('/(auth)/login');
        }

    useEffect(() => {
        if (errorMessage) {
            fadeAnim.setValue(1);

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setErrorMessage("");
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (errorMessage) {
            toast.info(errorMessage);
        }
    }, [errorMessage]);

    const removeFromCart = (id) => {
        Alert.alert(
            "Remove product?",
            "This will delete it from your cart",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteProduct(id));
                        if (products?.length === 1) {
                            setSelectedSize([]);
                        }
                        toast.success("Product removed from cart");
                        setErrorMessage("Product removed from cart")
                    },
                },
            ]
        );
    };

    const removeAllProducts = () => {
        Alert.alert(
            "Clear cart?",
            "This will clear your cart, and can not be undone",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(clearProducts());
                        setSelectedSize([]);
                        toast.success("Cart cleared");
                        setErrorMessage("Cart cleared")
                    },
                },
            ]
        );
    };

    const cartTotals = products.reduce(
        (total, item) => total + item.estimatedPrice * item.qty, 0
    );

    const totalQuantity = products.reduce(
        (total, item) => total + item.qty, 0
    );

    const grandTotal = Number(cartTotals || 0) + Number(serviceFee || 0) + Number(selectedSize?.price || 0); 

    return (
        <>
        <SelectPackageSize
            openSelctSize={openSelctSize}
            setOpenSelctSize={setOpenSelctSize}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            setHandlingFee={setHandlingFee}
        />

        <Modal
            transparent
            statusBarTranslucent
            visible={viewCart}
            animationType="none"
            onRequestClose={() => setViewCart(false)}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable
                    className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack"
                    onPress={() => setViewCart(false)}
                />
            </MotiView>

            <MotiView
                from={{ translateY: 400 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 400 }}
                transition={{ type: 'timing', duration: 400 }}
                style={styles.productsheet}
            >
                <View className='w-full relative flex-1 mb-14'>
                    {makeOrderLoading &&
                        <View
                            className='absolute flex-1 justify-center items-center'
                            style={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                zIndex: 900
                            }}
                        >
                            <View style={{borderColor: '#FEF2F2', width: '95%' }} className='bg-white border justify-center items-center py-4 rounded elevation-sm'>
                                <ActivityIndicator size={35} color={COLORS.primary}/>
                                <Text
                                    className='text-lg mt-2'
                                    style={{fontFamily: 'roboto-medium'}}
                                >
                                    Placing order...
                                </Text>
                            </View>
                        </View>
                    }
                    <TouchableOpacity
                        className='w-full justify-center items-center my-1'
                        onPress={() => setViewCart(false)}
                    >
                        <View className='h-1 rounded-full my-1 bg-slate w-[30%]'/>
                    </TouchableOpacity>  
                    <View className='flex-row justify-between items-center w-full mt-2'>
                        <View className=''>
                            <Text
                                className='text-2xl text-black'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >Cart</Text>
                        </View>

                        <View
                            className='flex-row items-center bg-grey_bg py-2 rounded justify-center'
                            style={{width: '50%'}}
                        >
                            <Ionicons name="basket" size={22} color={COLORS.slate} />
                            <Text
                                className='text-lavender'
                                style={{fontFamily: 'roboto-medium'}}
                            >| </Text>
                            <Text
                                className='text-primary text-base'
                                style={{fontFamily: 'roboto-medium'}}
                            >
                                {totalQuantity}
                            </Text>
                        </View>

                        <TouchableOpacity className='p-3 justify-center items-center rounded-full bg-red'
                            style={{width: 35, height: 35}}
                            onPress={() => setViewCart(false)}
                        >
                            <FontAwesome name="times" size={15} color='white'/>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1}} className='flex-row mt-2 w-full bg-lavender'/>

                    <View className='flex-1'>
                        {products?.length === 0 &&
                            <View className='flex-1 h-full mt-10 justify-center items-center'>
                                <Text
                                    style={{fontFamily: 'roboto-medium'}}
                                >Your Custom Cart Is Empty.</Text>
                                <TouchableOpacity
                                    className='flex-row bg-primary justify-center items-center mt-8 rounded elevation-lg py-3'
                                    style={{width: '50%'}}
                                    onPress={() => {
                                        setViewCart(false);
                                        setOpenAddProduct(true);
                                    }}
                                >
                                    <Entypo name='plus' size={20} color={COLORS.white}/>
                                    <Text
                                        className='text-white text-lg'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >
                                        Add Items
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View>
                                    <View className='w-full flex-row justify-between items-center'>
                                        <View
                                            className='mb-3'
                                            style={{borderColor: "#eee", width: '86%'}}
                                        >
                                            <View className='flex-row justify-between items-center'>
                                                <View>
                                                    <View className='flex-row items-center'>
                                                        <View
                                                            className='rounded-full justify-center items-center bg-grey_bg'
                                                            style={{width: 40, height: 40}}
                                                        >
                                                            <Ionicons name="basket" size={24} color={COLORS.extra_blue} />
                                                        </View>
                                                        <Text className='ml-2 text-lg' style={{ fontFamily: "roboto-medium", marginBottom: 3 }}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View className='flex-row mt-1 w-full justify-between items-center'>
                                                        <Text
                                                            style={{fontFamily: 'roboto-medium'}}
                                                            className='text-sm text-slate'
                                                        >
                                                            Qty: {item.qty}
                                                        </Text>
                                                        <Text
                                                            style={{fontFamily: 'roboto-medium'}}
                                                            className='text-sm text-slate'
                                                        >
                                                            Est. Price: K{item.estimatedPrice}
                                                        </Text>
                                                        <Text
                                                            style={{fontFamily: 'roboto-medium'}}
                                                            className='text-sm text-green1'
                                                        >
                                                            Est. Total: K{item.estimatedPrice * item.qty}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            className='bg-grey_bg justify-center items-center rounded-full'
                                            style={{width: 30, height: 30}}
                                            onPress={() => removeFromCart(item.id)}
                                        >
                                            <FontAwesome6 name="trash" size={12} color='red'/>
                                        </TouchableOpacity>
                                    </View>
                                    {item.productNotes ? (
                                        <View className='mt-2 p-1 bg-grey_bg rounded-md'>
                                            <Text style={{fontFamily: 'roboto-medium'}}>Notes:</Text>
                                            <Text className='text-sm mt-1 text-slate' style={{textAlign: 'justify', fontFamily: 'roboto'}}>
                                                {item.productNotes}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <View style={{height: 1}} className='flex-row my-4 w-full bg-lavender'/>
                                </View>
                            )}

                            ListHeaderComponent={
                                products?.length > 0 && (
                                    <View className='w-full flex-row justify-between items-center my-10'>
                                        <TouchableOpacity
                                            className="bg-[#EFF6FF] py-1 rounded border-2 px-3 flex-row justify-center items-center"
                                            style={{borderColor: COLORS.extra_blue, width: '20%'}}
                                            onPress={() => {
                                                setViewCart(false);
                                                setOpenAddProduct(true);
                                            }}
                                        >
                                            <Entypo name="plus" size={24} color={COLORS.extra_blue} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className='flex-row bg-grey_bg p-1 justify-center items-center rounded'
                                            onPress={() => removeAllProducts()}
                                        >
                                            <FontAwesome6 name='trash' size={14} color='red' />
                                            <Text
                                                className='text-sm ml-1 text-slate'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >Remove All</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }       

                            ListFooterComponent={
                                products?.length > 0 && (
                                    <>
                                        <View className='flex-row justify-end items-center'>
                                            <View
                                                className='flex-row items-center bg-grey_bg my-2 px-4 py-3 rounded justify-center'
                                            >
                                                <Text
                                                    className='text-primary text-lg'
                                                    style={{fontFamily: 'roboto-medium'}}
                                                >
                                                    Est. Cart Total: K{Number(cartTotals).toLocaleString()}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className='w-full mt-8'>
                                            <Text className='text-sm text-slate mb-1'>
                                                <Text className=''
                                                    style={{
                                                        fontFamily: 'roboto-medium',
                                                        color: selectedSize?.borderColor
                                                        ? selectedSize.borderColor
                                                        : "#22C55E",
                                                    }}>Delivery address:</Text> The system uses the location captured at the moment of pressing the order button.
                                            </Text>
                                            <View
                                                className='w-full p-2 border rounded'
                                                style={{
                                                    backgroundColor: selectedSize?.backgroundColor
                                                        ? selectedSize.backgroundColor
                                                        : '#ECFDF5',
                                                    borderColor: selectedSize?.borderColor
                                                        ? selectedSize.borderColor
                                                        : "#22C55E",
                                                }}
                                            >
                                                <View className='w-full flex-row justify-between items-center'>
                                                    <View className='flex-row items-center'>
                                                        <FontAwesome6
                                                            name='location-pin'
                                                            size={15}
                                                            color={selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.black}
                                                        />
                                                        <Text
                                                            style={{fontFamily: 'roboto-medium'}}
                                                            className='text-lg ml-1'
                                                        >
                                                            Selected Delivery Address
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            width: 25,
                                                            height: 25,
                                                            borderRadius: 100,
                                                            borderWidth: 2,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderColor: selectedSize?.borderColor
                                                                ? selectedSize.borderColor
                                                                : "#22C55E",
                                                        }}
                                                    >
                                                        <FontAwesome name='check' color={selectedSize.iconColor? selectedSize.iconColor : "#22C55E"} />
                                                    </View>
                                                </View>
                                                <View className='bg-lavender w-full my-1' style={{height: 1}} />
                                                <Text
                                                    className='text-slate text-sm'
                                                    style={{fontFamily: 'roboto'}}
                                                >
                                                    {displayCurrentLocation}
                                                </Text>
                                            </View>
                                        </View>

                                        {runnerdetails !== null && (
                                        <View
                                            className='p-2 my-3 elevation-sm rounded w-full items-center'
                                            style={{
                                                borderWidth: 1,
                                                backgroundColor: selectedSize?.backgroundColor
                                                    ? selectedSize.backgroundColor
                                                    : '#ECFDF5',
                                                borderColor: selectedSize?.borderColor
                                                    ? selectedSize.borderColor
                                                    : "#22C55E",
                                            }}
                                            onPress={() => setOpenSelctSize(true)}
                                        >
                                            <View className='flex-row justify-between items-center w-full'>
                                                <View className='flex-row items-center' style={{ width: '85%' }}>
                                                    <View
                                                        className='border-2 border-lavender justify-center items-center rounded-full relative'
                                                        style={{height: 65, width: 65}}
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

                                                    <View className='ml-1'>
                                                        <Text
                                                            className='text-lg text-black'
                                                            style={{ fontFamily: 'roboto-medium' }}
                                                        >
                                                            {runnerdetails?.first_name} {runnerdetails?.last_name}
                                                        </Text>
                                                        <Text
                                                            className='text-sm text-slate'
                                                            style={{ fontFamily: 'roboto-medium' }}
                                                        >
                                                            {runnerdetails?.runner_phone_number}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                        borderRadius: 100,
                                                        borderWidth: 2,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderColor: selectedSize?.borderColor
                                                            ? selectedSize.borderColor
                                                            : "#22C55E",
                                                    }}
                                                >
                                                    <FontAwesome name='check' color={selectedSize.iconColor? selectedSize.iconColor : "#22C55E"} />
                                                </View>
                                            </View>

                                            <View className='w-full'>
                                                <Text
                                                    className='text-sm text-slate'
                                                    style={{
                                                        textAlign: 'justify',
                                                        fontFamily: 'roboto-medium'
                                                    }}
                                                >
                                                    {`This is the runner who will handle your order, do not hesitate to contact ${runnerdetails?.runner_gender === 'male' ? 'him' : 'her'} in case you have any specific instructions or requests regarding your order.`}
                                                </Text>
                                            </View>

                                            <View className='w-full flex-row items-center justify-between mt-2'>
                                                <Text
                                                    className='text-lg text-black'
                                                    style={{
                                                        textAlign: 'justify',
                                                        fontFamily: 'roboto-medium'
                                                    }}
                                                >
                                                    Selected Runner
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        width: 45,
                                                        height:45,
                                                        paddingVertical: 4,
                                                        borderRadius: 999,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderWidth: 1,
                                                        backgroundColor: selectedSize?.backgroundColor
                                                            ? selectedSize.backgroundColor
                                                            : '#ECFDF5',
                                                        borderColor: selectedSize?.borderColor
                                                            ? selectedSize.borderColor
                                                            : "#22C55E",
                                                    }}
                                                    className='elevation-sm border border-lavender'
                                                >
                                                    <FontAwesome
                                                        name='phone'
                                                        size={20}
                                                        color={
                                                            selectedSize?.borderColor
                                                            ? selectedSize.borderColor
                                                            : "#22C55E"
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}

                                        <TouchableOpacity
                                            className='p-2 my-3 elevation-sm rounded w-full items-center'
                                            style={{
                                                borderWidth: 1,
                                                backgroundColor: selectedSize?.backgroundColor
                                                    ? selectedSize.backgroundColor
                                                    : '#ECFDF5',
                                                borderColor: selectedSize?.borderColor
                                                    ? selectedSize.borderColor
                                                    : "#22C55E",
                                            }}
                                            onPress={() => setOpenSelctSize(true)}
                                        >
                                            <View className='flex-row justify-between items-center w-full'>
                                                <View className='flex-row' style={{ width: '85%' }}>
                                                    <Ionicons
                                                        name={selectedSize.icon ? selectedSize.icon : 'basket'}
                                                        size={27}
                                                        color={selectedSize.iconColor ? selectedSize.iconColor : COLORS.green1}
                                                    />

                                                    <Text
                                                        className='text-lg ml-1 text-black'
                                                        style={{ fontFamily: 'roboto-medium' }}
                                                    >
                                                        {selectedSize?.name
                                                            ? `Size - ${selectedSize.name}`
                                                            : 'Select Package Size'}
                                                    </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                        borderRadius: 100,
                                                        borderWidth: 2,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderColor: selectedSize?.borderColor
                                                            ? selectedSize.borderColor
                                                            : "#CBD5E1",
                                                    }}
                                                >
                                                    {selectedSize?.iconColor && <FontAwesome name='check' color={selectedSize.iconColor} />}
                                                </View>
                                            </View>

                                            <View className='w-full'>
                                                <Text
                                                    className='text-sm text-slate'
                                                    style={{
                                                        textAlign: 'justify',
                                                        fontFamily: 'roboto-medium'
                                                    }}
                                                >
                                                    {selectedSize?.description
                                                        ? `Size - ${selectedSize.description}`
                                                        : 'This helps to calculate handle runner fees & delivery costs.'}
                                                </Text>
                                            </View>

                                            <View className='w-full flex-row justify-between items-center mt-2'>
                                                <Text
                                                    className='text-lg text-black'
                                                    style={{
                                                        textAlign: 'justify',
                                                        fontFamily: 'roboto-medium'
                                                    }}
                                                >
                                                    Package Size
                                                </Text>
                                                <View
                                                    style={{
                                                        width: '50%',
                                                        paddingVertical: 4,
                                                        borderRadius: 999,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: selectedSize.badgeColor,
                                                    }}
                                                >
                                                    <Text className='text-white text-lg'>
                                                        K{selectedSize.price}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        <View
                                            className='w-full mt-8 border border-lavender rounded'
                                            style={{
                                                borderTopLeftRadius: 4,
                                                borderTopRightRadius: 4,
                                                backgroundColor: selectedSize?.backgroundColor
                                                    ? selectedSize.backgroundColor
                                                    : '#ECFDF5',
                                                borderColor: selectedSize?.borderColor
                                                    ? selectedSize.borderColor
                                                    : "#22C55E",
                                            }}
                                        >
                                            <View
                                                className='py-1 px-2'
                                                style={{
                                                    borderTopLeftRadius: 4,
                                                    borderTopRightRadius: 4,
                                                    backgroundColor: selectedSize?.borderColor
                                                        ? selectedSize?.borderColor
                                                        : '#ECFDF5',
                                                    borderColor: selectedSize?.borderColor
                                                        ? selectedSize?.borderColor
                                                        : "#22C55E",
                                                }}
                                            >
                                                <Text
                                                    className='text-white text-lg'
                                                    style={{
                                                        fontFamily: 'roboto-medium',
                                                        color: selectedSize?.borderColor ? COLORS.white : COLORS.black
                                                    }}
                                                >
                                                    Cost Breakdown
                                                </Text>
                                            </View>
                                            <View className='p-2 mt-4'>
                                                <View className='flex-row justify-between items-center'>
                                                    <View style={{width: '66%'}}>
                                                        <Text style={{fontFamily: 'roboto-medium'}}>
                                                            Order Budget
                                                        </Text>
                                                    </View>
                                                    <View className='flex-row justify-end' style={{width: '30%'}}>
                                                        <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                                            K{Number(estimatedBudget || 0).toLocaleString()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {stores.length > 0 && (
                                                    <>
                                                        <View className='bg-lavender w-full  my-2'
                                                            style={{
                                                                height: 1,
                                                                backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.lavender
                                                            }}
                                                        />
                                                        <View className='w-full'>
                                                            <View className='w-full'>
                                                                <Text style={{fontFamily: 'roboto-medium'}}>
                                                                    Preferred Stores
                                                                </Text>
                                                                <Text
                                                                    className='text-sm text-slate'
                                                                    style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                                >
                                                                    These are the stores you prefer your order to be sourced from, if available. If not available, the system will source from other stores but still try to prioritize your preferred stores.
                                                                </Text>
                                                            </View>
                                                            <View className="w-full mt-2 flex-row flex-wrap items-center">
                                                                <>
                                                                    {stores?.map((store) => (
                                                                        <View
                                                                            key={store.id}
                                                                            className="px-3 py-2 mr-2 mb-8 relative border border-[#E2E8F0] rounded"
                                                                            style={{
                                                                                backgroundColor: selectedSize?.backgroundColor ? selectedSize?.backgroundColor : COLORS.grey_bg,
                                                                                borderColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.grey_bg
                                                                            }}
                                                                        >
                                                                            <Text className="text-sm"
                                                                                style={{
                                                                                    fontFamily: "roboto-medium",
                                                                                    color: selectedSize ? selectedSize?.borderColor : COLORS.black
                                                                                }}
                                                                            >
                                                                                {store.name}
                                                                            </Text>
                                                                            <TouchableOpacity
                                                                                style={{
                                                                                    height: 23,
                                                                                    width: 23,
                                                                                    borderRadius: 100,
                                                                                    backgroundColor: '#FEF2F2',
                                                                                    position: 'absolute',
                                                                                    top: -13,
                                                                                    right: -7,
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center'
                                                                                }}
                                                                                onPress={() => dispatch(removeStore(store.id))}
                                                                            >
                                                                                <FontAwesome name='times' color={'red'}/>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    ))}
                                                                    <View
                                                                        className='rounded py-2 ml-2 border'
                                                                        style={{
                                                                            paddingHorizontal: 10,
                                                                            borderColor: COLORS.extra_blue,
                                                                            backgroundColor: '#EFF6FF',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center'
                                                                        }}
                                                                        onTouchStart={() => setOpenAddStoreModal(true)}
                                                                    >
                                                                        <Entypo name="plus" size={20} color={COLORS.extra_blue} />
                                                                    </View>
                                                                </>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}
                                                <View className='bg-lavender w-full  my-2'
                                                    style={{
                                                        height: 1,
                                                        backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.lavender
                                                    }}
                                                />
                                                <View className='flex-row justify-between items-center'>
                                                    <View style={{width: '66%'}}>
                                                        <Text style={{fontFamily: 'roboto-medium'}}>
                                                            Est. Cart Total
                                                        </Text>
                                                        <Text
                                                            className='text-sm text-slate'
                                                            style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                        >
                                                            The estimated cart total is calculated from the prices and quantities of items in your cart.
                                                        </Text>
                                                        {grandTotal > estimatedBudget && (
                                                            <Text
                                                                className='text-sm text-red mt-2'
                                                                style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                            >
                                                                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Error!:</Text> The estimated grand total is larger than your budget, Kindly remove some items or increase your budget
                                                            </Text>
                                                        )}
                                                    </View>
                                                    <View className='flex-row justify-end' style={{width: '30%'}}>
                                                        <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                                            K{Number(cartTotals || 0).toLocaleString()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className='bg-lavender w-full  my-2'
                                                    style={{
                                                        height: 1,
                                                        backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.lavender
                                                    }}
                                                />
                                                <View className='flex-row justify-between items-center'>
                                                    <View style={{width: '66%'}}>
                                                        <Text style={{fontFamily: 'roboto-medium'}}>
                                                            Est. Service Fee (%{serviceCharge})
                                                        </Text>
                                                        <Text
                                                            className='text-sm text-slate'
                                                            style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                        >
                                                            The service fee is %{serviceCharge} of the total amount spent.
                                                        </Text>
                                                    </View>
                                                    <View className='flex-row justify-end' style={{width: '30%'}}>
                                                        <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                                            K{Number(serviceFee || 0).toLocaleString()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {selectedSize?.price === 0 ? null :
                                                    <>
                                                        <View className='bg-lavender w-full  my-2'
                                                            style={{
                                                                height: 1,
                                                                backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.lavender
                                                            }}
                                                        />
                                                        <View className='flex-row justify-between items-center'>
                                                            <View style={{width: '68%'}}>
                                                                <Text style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                                                    Handling Fee {selectedSize?.name}
                                                                </Text>
                                                                <Text
                                                                    className='text-sm text-slate'
                                                                    style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                                >
                                                                    {selectedSize?.description}
                                                                </Text>
                                                            </View>
                                                            <View className='flex-row justify-end' style={{width: '28%'}}>
                                                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                                                    K{Number(selectedSize?.price || 0).toLocaleString()}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                }
                                                {delivery === null ? null :
                                                    <>
                                                        <View className='bg-lavender w-full  my-2'
                                                            style={{
                                                                height: 1,
                                                                backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.lavender
                                                            }}
                                                        />
                                                        <View className='flex-row justify-between items-center'>
                                                            <View style={{width: '68%'}}>
                                                                <Text style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                                                    Delvery Fee {delivery?.mode}
                                                                </Text>
                                                                <Text
                                                                    className='text-sm text-slate'
                                                                    style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                                                >
                                                                    Ensure that the delviery mode selected matches the handling mode and size of your order.
                                                                </Text>
                                                            </View>
                                                            <View className='flex-row justify-end' style={{width: '28%'}}>
                                                                <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>
                                                                    K{Number(delivery?.fee || 0).toLocaleString()}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                }
                                            </View>
                                        </View>
                                        <View className='w-full my-8 flex-row justify-between items-center'>
                                            <Text className='text-2xl' style={{fontFamily: 'ubuntu-medium'}}>
                                                Grand Total:
                                            </Text>
                                            <Text className='text-2xl' style={{fontFamily: 'ubuntu-medium'}}>
                                                K{grandTotal.toLocaleString()}
                                            </Text>
                                        </View>

                                        {products?.length === 0 ? null :
                                            <View className='w-full absolute bottom-0 mb-3 justify-center items-center rounded-md'>
                                                {errorMessage &&
                                                    <View style={{backgroundColor: '#ECFDF5'}} className='w-full rounded my-10 justify-center py-3'>
                                                        <Text
                                                            className='text-green1 text-center'
                                                            style={{fontFamily: 'roboto-medium'}}
                                                        >
                                                            {errorMessage}
                                                        </Text>
                                                    </View>
                                                }

                                                {!isAuthenticated ? (
                                                    <LogingBtn handlePress={handleLogin}/>
                                                ) : products?.length > 0 ? (
                                                    <TouchableOpacity
                                                        className="py-3 rounded elevation-md w-full flex-row justify-center items-center"
                                                        style={{
                                                            backgroundColor: selectedSize?.borderColor ? selectedSize?.borderColor : COLORS.primary
                                                        }}
                                                        onPress={handleMakeOrder}
                                                    >
                                                        <Text className='text-2xl text-white'
                                                            style={{fontFamily: 'ubuntu-medium'}}
                                                        >Order Now</Text>
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        }
                                        <View style={{ paddingBottom: 80 }}/>
                                    </>
                                )
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </MotiView>
            <Toast
                config={{
                    success: (props) => <CustomToast {...props} type="success" />,
                    error: (props) => <CustomToast {...props} type="error" />,
                    info: (props) => <CustomToast {...props} type="info" />,
                }}
            />
        </Modal>
        </>
    )
}

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

    productsheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '95%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12
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
});

export default ViewCartModal