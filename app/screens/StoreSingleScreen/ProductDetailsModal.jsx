import {
    Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons
} from "@expo/vector-icons";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SIZES } from "../../../constants/constants";
import { addItem } from "../../../redux/store/slices/CartSlice";
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
    isOpen,
    store_profileimage,
    product_iamges,
    store_description,
    store_name,
    store_latitude,
    store_longitude,
    store_location,
}) => {
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [selectedVariants, setSelectedVariants] = useState({});

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
                extra.extra_name,
                { price: extra.extra_price, extra_id: extra.extra_id },
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

        let basePrice = item.product_price;

        if (variants.length > 0) {
            const hasOverride = variants.some(v => v.is_price_override);

            basePrice = hasOverride
                ? variants.find(v => v.is_price_override)?.price
                : variants.reduce((sum, v) => sum + (v.price || 0), 0);
        }

        return (basePrice + extrasTotal) * state.quantity;
    }, [selectedVariants, item.product_price, extrasTotal, state.quantity]);

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
        const selectedExtrasData = state.selectedExtras.map((name) => ({
            name,
            price: extrasMap.get(name)?.price,
            extra_id: extrasMap.get(name)?.extra_id,
        }));

        dispatch(
            addItem({
                ...item,
                selected_extras: selectedExtrasData,
                total_price: totalAmount,
                static_total_price: totalAmount,
                product_qty: state.quantity,
                chilioption: state.chiliOption,
                product_image: item.product_iamges,
                store_image: store_profileimage,
                store_latitude: store_latitude,
                store_longitude: store_longitude,
                store_description,
                product_description: item.product_description,
                store_name,
                store_location,
            }),
        );

        localDispatch({ type: ACTIONS.RESET });
        toast.success("Product added to cart");
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
                <View
                    className="w-full pb-20 relative"
                    style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                >
                    <TouchableOpacity
                        className='w-full justify-cente items-center'
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                        onPress={toggleModal}
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
                        style={{ maxHeight: height * 0.8, paddingHorizontal: 16, paddingBottom: 40, backgroundColor: 'transparent' }}
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
                                    K{price ?? item.product_price}
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
                                <View className="">
                                    <Text className="mb-2 font-semibold text-2xl" style={{ fontFamily: "maven-medium" }}>
                                        Extras
                                    </Text>
                                    <ExtraCheckbox
                                        label="Chilli"
                                        price={0}
                                        checked={state.chiliOption}
                                        onToggle={() =>
                                            localDispatch({
                                                type: ACTIONS.TOGGLE_CHILI,
                                                payload: !state.chiliOption,
                                            })
                                        }
                                    />
                                </View>
                                {extras.map((extra) => (
                                    <ExtraCheckbox
                                        key={extra.extra_id}
                                        label={extra.extra_name}
                                        price={extra.extra_price}
                                        checked={state.selectedExtras.includes(extra.extra_name)}
                                        onToggle={() =>
                                            localDispatch({
                                                type: ACTIONS.TOGGLE_EXTRA,
                                                payload: extra.extra_name,
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
                    <View className='absolute w-full px-4 bg-transparent bottom-2 justify-center items-center'>
                        {/* Total */}
                        <View className='w-full mb-2 bg-white'>
                            <Text className="text-2xl text-red" style={{ fontFamily: "ubuntu-bold" }}>
                                Total: K{totalAmount}
                            </Text>
                        </View>
                        <View className='flex-row w-full justify-between items-center'>
                            <TouchableOpacity
                                style={{
                                    opacity: alreadyInCart || !isOpen || !isAvailable ? 0.7 : 1,
                                    width: '100%'
                                }}
                                disabled={alreadyInCart || !isOpen || !isAvailable}
                                onPress={handleAddToCart}
                                className="bg-primary py-3 flex-row justify-center items-center rounded elevation-md"
                            >
                                {isOpen && isAvailable ? (
                                    <FontAwesome
                                        name="shopping-cart"
                                        size={20}
                                        color={COLORS.white}
                                    />
                                ) : (
                                    <Feather name="lock" size={19} style={{ color: COLORS.red }} />
                                )}
                                <Text
                                    className="ml-2 text-white text-2xl font-semibold"
                                    style={{ fontFamily: "maven-medium" }}
                                >
                                    {alreadyInCart
                                    ? "Already In Cart" : !isOpen ? "Closed" : !isAvailable ? "Unavailable" : "Add To Cart"}
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

export default ProductDetailsModal;