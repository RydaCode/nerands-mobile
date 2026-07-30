import {
    Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons
} from "@expo/vector-icons";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SIZES } from "../../../constants/constants";
import { addItem, clearCart } from "../../../redux/store/slices/CartSlice";
import { PRODUCTS_IMAGE_URI } from "../../../RequestMethods";
import { toast } from "../../../utils/toast";
import ExtraCheckbox from "./ExtraCheckbox ";
import { ACTIONS } from "./useProductDetailsReducer";

const ProductDetailsModal = ({
    state,
    localDispatch,
    item,
    extras,
    isAvailable,
    is_closed,
    store_profileimage,
    product_iamges,
    store_description,
    store_name,
    store_latitude,
    store_longitude,
    store_location,
    store_id,
    store_phone_num,
    business_id
}) => {
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [selectedVariants, setSelectedVariants] = useState({});
    const cartStoreId = useSelector(state => state.cart.store_id);

    const price = useMemo(() => {
        const variants = Object.values(selectedVariants);

        if (variants.length === 0) return null; // 👈 important

        return variants.reduce(
            (sum, variant) => sum + (variant?.price || 0),
            0
        );
    }, [selectedVariants]);

    const isLandscape = width > height;

    const imageDimensions = useMemo(
        () =>
        isLandscape
            ? { width: "35%", height: 170, marginRight: 10 }
            : { width: width * 0.25, height: height * 0.09 },
        [isLandscape, width, height],
    );

    const extrasMap = useMemo(() => {
        return new Map(
            extras.map((extra) => [
                extra.extra_id, // ✅ KEY MUST BE ID
                {
                    name: extra.extra_name,
                    price: extra.extra_price,
                },
            ]),
        );
    }, [extras]);

    const extrasTotal = useMemo(() => {
        return state.selectedExtras.reduce(
            (sum, name) => sum + (extrasMap.get(name)?.price || 0), 0,
        );
    }, [state.selectedExtras, extrasMap]);

    const totalAmount = useMemo(() => {
        const variants = Object.values(selectedVariants);

        let basePrice = item.final_price;

        if (variants.length > 0) {
            const hasOverride = variants.some(v => v.is_price_override);

            basePrice = hasOverride
                ? variants.find(v => v.is_price_override)?.price
                : variants.reduce((sum, v) => sum + (v.price || 0), 0);
        }

        return (basePrice + extrasTotal) * state.quantity;
    }, [selectedVariants, item.final_price, extrasTotal, state.quantity]);

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
        const selectedExtrasData = state.selectedExtras.map(id => {
            const extra = extrasMap.get(id);

            return {
                extra_id: id,
                extra_name: extra?.name,
                extra_price: extra?.price,
            };
        });

        if (cartStoreId && cartStoreId !== store_id) {
            Alert.alert(
                "Start new order?",
                "Your cart contains items from another store. Do you want to clear it and add this item?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Clear Cart",
                        onPress: () => {
                            dispatch(clearCart());

                            dispatch(
                                addItem({
                                    ...item,
                                    product_extras: extras,
                                    selected_extras: selectedExtrasData,
                                    selected_variants: selectedVariants,
                                    total_price: totalAmount,
                                    static_total_price: totalAmount,
                                    product_qty: state.quantity,
                                    store_image: store_profileimage,
                                    store_latitude: store_latitude,
                                    store_longitude: store_longitude,
                                    store_description,
                                    store_name: store_name,
                                    store_id: store_id,
                                    business_id: business_id,
                                    store_phone_num,
                                })
                            );
                        },
                    },
                ]
            );
        } else {
            dispatch(
                addItem({
                    ...item,
                    product_extras: extras,
                    // product_variants: ,
                    selected_extras: selectedExtrasData,
                    selected_variants: selectedVariants,
                    total_price: totalAmount,
                    static_total_price: totalAmount,
                    product_qty: state.quantity,
                    store_image: store_profileimage,
                    store_latitude: store_latitude,
                    store_longitude: store_longitude,
                    store_description,
                    store_name: store_name,
                    store_id: store_id,
                    business_id: business_id,
                    store_phone_num
                }),
            );

            localDispatch({ type: ACTIONS.RESET });
            toast.success("Product added to cart");
        }
    }, [state, totalAmount, dispatch, item, extrasMap]);

    const toggleModal = () => localDispatch({ type: ACTIONS.TOGGLE_MODAL });

    const selectVariant = (groupId, option) => {
        setSelectedVariants(prev => ({
            ...prev,
            [groupId]: option
        }));
    };

    return (
        <Modal
            animationType="slide"
            transparent
            statusBarTranslucent
            visible={state.modalVisible}
            onRequestClose={toggleModal}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack" onPress={toggleModal} />
            </MotiView>
            <MotiView
                from={{ translateY: 300 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 300 }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.sheet}
            >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                {/* Header */}
                    <View className='flex-row justify-between items-center w-full px-4 pt-2'>
                        <View className=''>
                            <Text className="text-black text-2xl mt-1 font-semibold" style={{ fontFamily: "outfit-medium" }}
                            >Product Details</Text>
                        </View>
                        <TouchableOpacity
                            style={{width: 30, height: 30}}
                            className='justify-center items-center rounded-full bg-grey_bg'
                            onPress={toggleModal}
                        >
                            <FontAwesome name="times" size={15} color={'red'}/>
                        </TouchableOpacity>
                    </View>
                    <View className='w-full px-4 my-2'>
                        <View className='bg-lavender' style={{height: 0.5,}}/>
                    </View>
                    <ScrollView
                        style={{ maxHeight: height * 0.8, paddingHorizontal: 16, width: '100%', paddingBottom: 20, backgroundColor: 'transparent' }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Product Info */}
                        <View className="flex-row mb-4 pt-2">
                            <View className="relative rounded" style={imageDimensions}>
                                <Image
                                    className="w-full h-full"
                                    source={{ uri: `${PRODUCTS_IMAGE_URI}${product_iamges}` }}
                                    style={{ borderRadius: SIZES.radius, resizeMode: "cover" }}
                                />
                                {!isAvailable && (
                                    <View className="absolute w-full h-full bg-black rounded opacity-70 justify-center items-center">
                                        <MaterialCommunityIcons
                                            name="lock" size={13} style={{ color: COLORS.lite }}
                                        />
                                        <Text style={{ fontFamily: "roboto-regular" }} className="text-sm text-white">
                                            Unavailable
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className="justify-center ml-3">
                                <Text className="text-xl" style={{ fontFamily: "roboto-medium" }}>{item.product_name}</Text>
                                <Text className="text-primary text-xl" style={{ fontFamily: "maven-medium" }}>
                                    K{price ?? item.final_price}
                                </Text>
                            </View>
                        </View>

                        {item.product_description && (
                            <Text className="text-sm text-slate mb-4" style={{ fontFamily: "roboto-regular" }}>
                                {item.product_description}
                            </Text>
                        )}

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
                                                        selectedVariants[group.id]?.id === option.id
                                                        ? 'border-primary' : 'border-slate'
                                                    }`}
                                                    style={{
                                                        borderRadius: 2.5, borderWidth: 1.3,
                                                        backgroundColor: selectedVariants[group.id]?.id === option.id
                                                        ? COLORS.primary : 'white'
                                                    }}
                                                >
                                                    {selectedVariants[group.id]?.id === option.id && (
                                                        <FontAwesome5 name="check" size={10}
                                                            color={
                                                                selectedVariants[group.id]?.id === option.id
                                                                ? COLORS.white : COLORS.white
                                                            }
                                                        />
                                                    )}
                                                </View>

                                                {/* Label */}
                                                <View className='flex-row justify-between' style={{width: '92%'}}>
                                                    <Text className={`
                                                        ${selectedVariants[group.id]?.id === option.id
                                                            ? 'text-primary' : 'text-slate'
                                                        }
                                                        `} style={{fontFamily: 'roboto-medium', fontSize: 13}}>
                                                        {option.name}
                                                    </Text>
                                                    <Text className={`ml-2
                                                        ${selectedVariants[group.id]?.id === option.id
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
                                <Text className="mb-2 font-semibold text-2xl" style={{ fontFamily: "maven-medium" }}>
                                    Extras
                                </Text>
                                {extras.map((extra) => (
                                    <ExtraCheckbox
                                        key={extra.extra_id}
                                        label={extra.extra_name}
                                        price={extra.extra_price}
                                        checked={state.selectedExtras.includes(extra.extra_name)}
                                        onToggle={() =>
                                            localDispatch({
                                                type: ACTIONS.TOGGLE_EXTRA,
                                                payload: extra.extra_id
                                            })
                                        }
                                    />
                                ))}
                            </ScrollView>
                        )}

                        {/* Total */}
                        {/* <Text
                            className="text-2xl my-6 text-red"
                            style={{ fontFamily: "ubuntu-bold" }}
                        >
                            Total: K{totalAmount}
                        </Text> */}
                    </ScrollView>

                    {/* Add to Cart */}
                    <View className=' w-full px-4 bg-transparent justify-center items-center'
                        style={{marginBottom: 50}}
                    >
                        {/* Total */}
                        <View className='w-full mb-2 bg-white'>
                            <Text className="text-2xl text-red" style={{ fontFamily: "ubuntu-bold" }}>
                                Total: K{totalAmount}
                            </Text>
                        </View>
                        <View className='flex-row w-full justify-between items-center'>
                            <TouchableOpacity
                                style={{
                                    opacity: alreadyInCart || is_closed || !isAvailable ? 0.7 : 1,
                                    width: '100%'
                                }}
                                disabled={alreadyInCart || is_closed || !isAvailable}
                                onPress={handleAddToCart}
                                className="bg-primary py-3 flex-row justify-center items-center rounded elevation-md"
                            >
                                {is_closed || !isAvailable  ? (
                                    <Feather name="lock" size={19} style={{ color: COLORS.red }} />
                                ) :  (
                                    <FontAwesome
                                        name="shopping-cart"
                                        size={20}
                                        color={COLORS.white}
                                    />
                                )}
                                <Text
                                    className="ml-2 text-white text-2xl font-semibold"
                                    style={{ fontFamily: "maven-medium" }}
                                >
                                    {alreadyInCart
                                    ? "Already In Cart" : is_closed ? "Closed" : !isAvailable ? "Unavailable" : "Add To Cart"}
                                </Text>
                            </TouchableOpacity>
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
        maxHeight: '93%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default ProductDetailsModal;