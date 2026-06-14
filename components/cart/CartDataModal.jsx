import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ExtraCheckbox from "../../app/screens/StoreSingleScreen/ExtraCheckbox ";
import { COLORS, SIZES } from "../../constants/constants";
import { decreaseQty, increaseQty } from "../../redux/store/slices/CartSlice";
import { PRODUCTS_IMAGE_URI } from "../../RequestMethods";
import { calculateItemTotal, calculateUnitPrice } from "../../utils/calculateItemTotal";
import { toast } from "../../utils/toast";

const CartDataModal = ({
    state,
    setModalVisible,
    modalVisible,
    item,
    extras
}) => {
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [selectedVariants, setSelectedVariants] = useState({});

    const isLandscape = width > height;

    const imageDimensions = useMemo(
        () =>
        isLandscape
            ? { width: "35%", height: 170, marginRight: 10 }
            : { width: width * 0.25, height: height * 0.09 },
        [isLandscape, width, height],
    );

    const cartItem = useSelector(state =>
        state.cart.cartItems.find(i => i.cart_id === item.cart_id)
    );

    const qtycounter = item.product_qty;

    const selectedSet = useMemo(() => {
        return new Set(item.selected_extras || []);
    }, [item.selected_extras]);


    const alreadyInCart = useMemo(() => {
        return cartItems.some(
            (cartItem) => cartItem.product_id === item.product_id,
        );
    }, [cartItems, item.product_id]);

    useEffect(() => {
        if (item?.variant_groups) {
            const defaults = {};

            item.variant_groups.forEach((group) => {
                if (group.is_required && group.options.length > 0) {
                    defaults[group.id] = group.options[0]; // 👈 first option
                }
            });

            setSelectedVariants(defaults);
        }
    }, [item]);

    const handleAddToCart = useCallback(() => {
        toast.success("Product added to cart");
    });

    const selectVariant = (groupId, option) => {
        setSelectedVariants(prev => ({
            ...prev,
            [groupId]: option
        }));
    };

    const handleIncreaseQty = () => {
        if (qtycounter < 10) {
            dispatch(increaseQty(item.cart_id));
        }
    };

    const handleDecreaseQty = () => {
        if (qtycounter > 1) {
            dispatch(decreaseQty(item.cart_id));
        }
    };

    const handleRemoveItem = () => {
        dispatch(removeItem(item.cart_id));
        toast.success("Product removed from cart");
    };

    return (
        <Modal
            animationType="slide"
            transparent
            statusBarTranslucent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack" onPress={() => setModalVisible(false)} />
            </MotiView>
            <MotiView
                from={{ translateY: 300 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 300 }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.sheet}
            >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <View
                    className="w-full pb-20 relative"
                    style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                >
                    <TouchableOpacity
                        className='w-full justify-cente items-center'
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                        onPress={() => setModalVisible(false)}
                    >
                        <View className='h-1 rounded-full my-2 bg-[#ccc] w-[30%]'/>
                    </TouchableOpacity>
                    {/* Header */}
                    <View className='w-full px-4'>
                        <Text className="text-black text-2xl mt-1 font-semibold" style={{ fontFamily: "maven-medium" }}
                        >Product Details</Text>
                    </View>
                    <View className='w-full px-4 mt-1'>
                        <View className='bg-lavender' style={{height: 0.5,}}/>
                    </View>
                    <ScrollView
                        style={{ maxHeight: height * 0.8, paddingHorizontal: 16, paddingBottom: 40, backgroundColor: 'transparent', marginBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Product Info */}
                        <View className="flex-row mb-4 pt-2">
                            <View className="relative rounded" style={imageDimensions}>
                                <Image
                                    className="w-full h-full"
                                    source={{ uri: `${PRODUCTS_IMAGE_URI}${item.product_images}` }}
                                    style={{ borderRadius: SIZES.radius, resizeMode: "cover" }}
                                />
                            </View>
                            <View className="justify-center ml-3">
                                <Text className="text-lg" style={{ fontFamily: "roboto-medium" }}>{item.product_name}</Text>
                                <Text className="text-primary text-lg" style={{ fontFamily: "maven-medium" }}>
                                    K{calculateUnitPrice(item).toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {item.product_description && (
                            <Text className="text-sm text-slate mb-4" style={{ fontFamily: "roboto-regular" }}>
                                {item.product_description}
                            </Text>
                        )}

                        <View className='w-full flex-row justify-between items-center bg-grey_bg p-2 rounded'>
                            <View className='' style={{width: '30%'}}>
                                <Text className='text-2xl' style={{fontFamily: 'ubuntu-medium'}}>Quantity</Text>
                            </View>
                            <View className='flex-row justify-center items-center border border-lavender rounded p-1 px-2'>
                                <TouchableOpacity
                                    disabled={qtycounter <= 1}
                                    onPress={handleDecreaseQty}
                                    style={{ opacity: qtycounter <= 1 ? 0.5 : 0.9 }}
                                    className="p-2 w-7 h-7 bg-grey_bg border border-slate items-center rounded-full justify-center"
                                >
                                    <FontAwesome name="minus"/>
                                </TouchableOpacity>
                                <Text className='text-xl text-black px-3' style={{fontFamily: 'roboto-medium'}}>
                                    {qtycounter}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleIncreaseQty}
                                    disabled={qtycounter >= 10}
                                    activeOpacity={0.5}
                                    style={{ opacity: qtycounter >= 10 ? 0.5 : 0.9 }}
                                    className="p-1 w-7 h-7 bg-grey_bg border border-slate items-center justify-center rounded-full"
                                >
                                    <FontAwesome name="plus"/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Variants */}
                        <View>
                            {item.variant_groups.map((group) => (
                                <View key={group.id} className="my-5">
                                    {/* Group Title */}
                                    <Text className='mb-3 text-sm text-green1' style={{fontFamily: 'roboto-medium'}}>Ensure that you select the right variant and extras</Text>
                                    <View className='items-center mb-2 flex-row w-full justify-start'>
                                        <Text className="font-semibold text-2xl" style={{ fontFamily: "maven-medium" }}>
                                            {group.name}
                                        </Text>

                                        {group.is_required &&
                                            <Text className="text-red ml-1" style={{ fontFamily: "roboto-bold", fontSize: 20 }}>*</Text>
                                        }
                                    </View>

                                    {/* Options */}
                                    <View className="w-full">
                                        {group.options.map((option, index) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                activeOpacity={0.7}
                                                onPress={() => selectVariant(group.id, option)}
                                                className={`flex-row items-center justify-between w-full mb-3 `}
                                            >
                                                {/* Radio check */}
                                                <View
                                                    className={`h-6 w-6 border justify-center items-center ${
                                                        item.selected_variants[group.id]?.id === option.id
                                                        ? 'border-primary' : 'border-slate'
                                                    }`}
                                                    style={{
                                                        borderRadius: 2.5, borderWidth: 1.3,
                                                        backgroundColor: item.selected_variants[group.id]?.id === option.id
                                                        ? COLORS.primary : 'white'
                                                    }}
                                                >
                                                    {item.selected_variants[group.id]?.id === option.id && (
                                                        <FontAwesome5 name="check" size={10}
                                                            color={
                                                                item.selected_variants[group.id]?.id === option.id
                                                                ? COLORS.white : COLORS.white
                                                            }
                                                        />
                                                    )}
                                                </View>

                                                {/* Label */}
                                                <View className='flex-row justify-between' style={{width: '92%'}}>
                                                    <Text className={`
                                                        ${group[group.id]?.id === option.id
                                                            ? 'text-primary' : 'text-slate'
                                                        }
                                                        `} style={{fontFamily: 'roboto-medium', fontSize: 13}}>
                                                        {option.name}
                                                    </Text>
                                                    <Text className={`ml-2
                                                        ${group[group.id]?.id === option.id
                                                            ? 'text-primary' : 'text-slate'
                                                        }
                                                        `} style={{fontFamily: 'roboto-medium', fontSize: 13}}>K{option.price}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                        
                        {/* Extras */}
                        {extras.length > 0 && (
                            <ScrollView
                                style={{ maxHeight: height * 0.3 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View className="">
                                    <Text className="mb-2 font-semibold text-2xl" style={{ fontFamily: "maven-medium" }}>
                                        Extras
                                    </Text>
                                </View>
                                {extras.map(extra => {
                                    const isChecked = selectedSet.has(extra.extra_id);
                                    return (
                                        <ExtraCheckbox
                                            key={extra.extra_id}
                                            label={extra.extra_name}
                                            price={extra.extra_price}
                                            checked={isChecked}
                                            disableBuiltInState
                                        />
                                    );
                                })}
                            </ScrollView>
                        )}
                    </ScrollView>

                    {/* Add to Cart */}
                    <View className='absolute w-full px-4 bg-transparent justify-center items-center'
                        style={{bottom: 50}}
                    >
                        {/* Total */}
                        <View className='w-full mb-2 bg-white'>
                            <Text className="text-2xl text-red" style={{ fontFamily: "ubuntu-bold" }}>
                                Total: K{calculateItemTotal(item).toLocaleString()}
                            </Text>
                        </View>
                        <View className='flex-row w-full justify-between items-center'>
                            <TouchableOpacity
                                style={{
                                    width: '100%'
                                }}
                                
                                onPress={handleAddToCart}
                                className="bg-primary py-3 flex-row justify-center items-center rounded elevation-md"
                            >
                                <Text
                                    className="text-white text-2xl font-semibold"
                                    style={{ fontFamily: "maven-medium" }}
                                >
                                    Update Cart
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* <TouchableWithoutFeedback/> */}
            </MotiView>
        </Modal>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default CartDataModal;