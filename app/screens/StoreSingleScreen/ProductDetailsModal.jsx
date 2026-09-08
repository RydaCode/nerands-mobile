import {
    Feather,
    FontAwesome,
    FontAwesome5,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "../../../constants/constants";
import { useResponsive } from "../../../hook/useResponsive";
import { addItem, clearCart } from "../../../redux/store/slices/CartSlice";
import { IMAGE_URI } from "../../../RequestMethods";
import { getAvatarColor } from "../../../utils/getInitials";
import { toast } from "../../../utils/toast";
import { ACTIONS } from "./useProductDetailsReducer";

const ProductDetailsModal = ({
    state,
    localDispatch,
    item,
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

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const cartStoreId = useSelector(
        (state) => state.cart.store_id
    );

    const { wp } = useResponsive();

    /*
    |--------------------------------------------------------------------------
    | Selected Variants
    |--------------------------------------------------------------------------
    |
    | Structure:
    |
    | {
    |     groupId: [
    |         option,
    |         option
    |     ]
    | }
    |
    | Even single-select groups use an array.
    |
    */

    const [selectedVariants, setSelectedVariants] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Selected Options
    |--------------------------------------------------------------------------
    */

    const selectedOptions = useMemo(() => {
        return Object.values(selectedVariants).flat();
    }, [selectedVariants]);

    /*
    |--------------------------------------------------------------------------
    | Base / Display Price
    |--------------------------------------------------------------------------
    |
    | If an option has is_price_override === true,
    | that option replaces the product base price.
    |
    | Other selected options are added to that price.
    |
    */

    const calculatedPrice = useMemo(() => {
    const groups = item.variant_groups || [];

    // No variant groups → use product price
    if (groups.length === 0) {
        return Number(item.final_price) || 0;
    }

    // First group defines the base price
    const baseGroup = groups[0];

    const baseOptions =
        selectedVariants[baseGroup.id] || [];

    const basePrice = baseOptions.reduce(
        (sum, option) =>
            sum + (Number(option.price) || 0),
        0
    );

    // All other groups are additions
    const additionalPrice = groups
        .slice(1)
        .reduce((sum, group) => {
            const options =
                selectedVariants[group.id] || [];

            return (
                sum +
                options.reduce(
                    (optionSum, option) =>
                        optionSum +
                        (Number(option.price) || 0),
                    0
                )
            );
        }, 0);

    return basePrice + additionalPrice;
}, [
    item.variant_groups,
    item.final_price,
    selectedVariants
]);

    /*
    |--------------------------------------------------------------------------
    | Total Amount
    |--------------------------------------------------------------------------
    */

    const totalAmount = useMemo(() => {
        return calculatedPrice * state.quantity;
    }, [calculatedPrice, state.quantity]);

    /*
    |--------------------------------------------------------------------------
    | Product Already In Cart
    |--------------------------------------------------------------------------
    */

    const alreadyInCart = useMemo(() => {
        return cartItems.some(
            (cartItem) =>
                cartItem.product_id === item.product_id
        );
    }, [cartItems, item.product_id]);

    /*
    |--------------------------------------------------------------------------
    | Initialize Required Variant Groups
    |--------------------------------------------------------------------------
    |
    | If a group is required, automatically select
    | its first option.
    |
    | Multi-select required groups will also start
    | with their first option selected.
    |
    */

    useEffect(() => {
        if (!item?.variant_groups) {
            setSelectedVariants({});
            return;
        }

        const defaults = {};

        item.variant_groups.forEach((group) => {
            if (
                group.is_required &&
                group.options?.length > 0
            ) {
                defaults[group.id] = [
                    group.options[0]
                ];
            }
        });

        setSelectedVariants(defaults);
    }, [item]);

    /*
    |--------------------------------------------------------------------------
    | Select Variant / Extra
    |--------------------------------------------------------------------------
    |
    | multi_select = false
    | -------------------
    | Only one option can be selected.
    |
    | multi_select = true
    | ------------------
    | Multiple options can be selected.
    |
    */

    const selectVariant = useCallback(
        (group, option) => {
            setSelectedVariants((prev) => {
                const current = prev[group.id] || [];

                /*
                * MULTI SELECT
                */
                if (group.multi_select) {
                    const alreadySelected = current.some(
                        selected => selected.id === option.id
                    );

                    if (alreadySelected) {
                        // Required multi-select:
                        // don't allow the last option to be removed
                        if (
                            group.is_required &&
                            current.length === 1
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            [group.id]: current.filter(
                                selected =>
                                    selected.id !== option.id
                            )
                        };
                    }

                    return {
                        ...prev,
                        [group.id]: [
                            ...current,
                            option
                        ]
                    };
                }

                /*
                * SINGLE SELECT
                */
                const alreadySelected = current.some(
                    selected => selected.id === option.id
                );

                if (alreadySelected) {
                    // Required: cannot unselect
                    if (group.is_required) {
                        return prev;
                    }

                    // Optional: unselect
                    return {
                        ...prev,
                        [group.id]: []
                    };
                }

                // Select this option
                return {
                    ...prev,
                    [group.id]: [option]
                };
            });
        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Validate Required Groups
    |--------------------------------------------------------------------------
    */

    const hasMissingRequiredGroup = useMemo(() => {
        if (!item?.variant_groups) {
            return false;
        }

        return item.variant_groups.some((group) => {
            if (!group.is_required) {
                return false;
            }

            const selected =
                selectedVariants[group.id] || [];

            return selected.length === 0;
        });
    }, [item?.variant_groups, selectedVariants]);

    /*
    |--------------------------------------------------------------------------
    | Add To Cart
    |--------------------------------------------------------------------------
    */

    const handleAddToCart = useCallback(() => {
        /*
        |--------------------------------------------------------------------------
        | Required Group Validation
        |--------------------------------------------------------------------------
        */

        if (hasMissingRequiredGroup) {
            toast.error(
                "Please select all required options"
            );
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Selected Variant Data
        |--------------------------------------------------------------------------
        |
        | Convert:
        |
        | {
        |     groupId: [options]
        | }
        |
        | into a structure that is easy to
        | store in Redux / send to backend.
        |
        */

        const selectedVariantsData =
            Object.entries(selectedVariants).map(
                ([groupId, options]) => {
                    const group =
                        item.variant_groups?.find(
                            (group) =>
                                group.id === groupId
                        );

                    return {
                        group_id: groupId,
                        group_name: group?.name,
                        multi_select:
                            group?.multi_select || false,

                        options: options.map(
                            (option) => ({
                                option_id: option.id,
                                option_name: option.name,
                                option_price:
                                    Number(option.price) || 0
                            })
                        )
                    };
                }
            );

        /*
        |--------------------------------------------------------------------------
        | Cart Item
        |--------------------------------------------------------------------------
        */

        const cartItem = {
            ...item,
            selected_variants: selectedVariantsData,
            total_price: totalAmount,
            static_total_price: totalAmount,
            product_qty: state.quantity,
            store_image: store_profileimage,
            store_latitude,
            store_longitude,
            store_description,
            store_name,
            store_id,
            business_id,
            store_phone_num
        };

        /*
        |--------------------------------------------------------------------------
        | Different Store
        |--------------------------------------------------------------------------
        */

        if (
            cartStoreId &&
            cartStoreId !== store_id
        ) {
            Alert.alert(
                "Start new order?",
                "Your cart contains items from another store. Do you want to clear it and add this item?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Clear Cart",
                        onPress: () => {
                            dispatch(clearCart());

                            dispatch(
                                addItem(cartItem)
                            );

                            localDispatch({
                                type: ACTIONS.RESET
                            });

                            toast.success(
                                "Product added to cart"
                            );
                        }
                    }
                ]
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Same Store / Empty Cart
        |--------------------------------------------------------------------------
        */

        dispatch(addItem(cartItem));

        localDispatch({
            type: ACTIONS.RESET
        });

        toast.success(
            "Product added to cart"
        );
    }, [
        hasMissingRequiredGroup,
        selectedVariants,
        item,
        totalAmount,
        state.quantity,
        cartStoreId,
        store_id,
        store_profileimage,
        store_latitude,
        store_longitude,
        store_description,
        store_name,
        business_id,
        store_phone_num,
        dispatch,
        localDispatch
    ]);

    /*
    |--------------------------------------------------------------------------
    | Toggle Modal
    |--------------------------------------------------------------------------
    */

    const toggleModal = () => {
        localDispatch({
            type: ACTIONS.TOGGLE_MODAL
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Landscape
    |--------------------------------------------------------------------------
    */

    const isLandscape = width > height;

    return (
        <Modal
            animationType="slide"
            transparent
            statusBarTranslucent
            visible={state.modalVisible}
            onRequestClose={toggleModal}
        >
            {/* ---------------------------------------------------------------- */}
            {/* Overlay */}
            {/* ---------------------------------------------------------------- */}

            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable
                    className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack"
                    onPress={toggleModal}
                />
            </MotiView>

            {/* ---------------------------------------------------------------- */}
            {/* Bottom Sheet */}
            {/* ---------------------------------------------------------------- */}

            <MotiView
                from={{ translateY: 300 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 300 }}
                transition={{
                    type: "timing",
                    duration: 300
                }}
                style={styles.sheet}
            >
                {/* ---------------------------------------------------------------- */}
                {/* Header */}
                {/* ---------------------------------------------------------------- */}

                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: wp(10),
                        height: wp(10),
                        zIndex: 100,
                        elevation: 10
                    }}
                    className="justify-center items-center rounded-full bg-grey_bg"
                    onPress={toggleModal}
                >
                    <FontAwesome
                        name="times"
                        size={15}
                        color="red"
                    />
                </TouchableOpacity>

                {/* ---------------------------------------------------------------- */}
                {/* Content */}
                {/* ---------------------------------------------------------------- */}

                <ScrollView
                    style={{
                        width: "100%",
                        paddingBottom: 20,
                        backgroundColor:
                            "transparent",
                        position: 'relative'
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    {/* ============================================================ */}
                    {/* Product Info */}
                    {/* ============================================================ */}

                    <View className="mb-4 w-full">
                        <View
                            className="w-full relative justify-center items-center rounded overflow-hidden"
                            style={{
                                height: wp(70),
                                backgroundColor:
                                    getAvatarColor(
                                        item.product_id
                                    )
                            }}
                        >
                            {!product_iamges ? (
                                <Text
                                    className="text-white text-base"
                                    style={{
                                        fontFamily:
                                            "roboto-medium"
                                    }}
                                >
                                    Loading image...
                                </Text>
                            ) : (
                                <Image
                                    source={{
                                        uri: `${IMAGE_URI}${product_iamges}`
                                    }}
                                    className="rounded"
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={500}
                                />
                            )}

                            {!isAvailable && (
                                <View className="absolute w-full h-full bg-black rounded opacity-70 justify-center items-center">
                                    <MaterialCommunityIcons
                                        name="lock"
                                        size={13}
                                        style={{
                                            color: COLORS.lite
                                        }}
                                    />

                                    <Text
                                        style={{
                                            fontFamily:
                                                "roboto-regular"
                                        }}
                                        className="text-sm text-white"
                                    >
                                        Unavailable
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="justify-center mt-2 px-3">
                            <Text
                                className="text-xl"
                                style={{
                                    fontFamily:
                                        "roboto-medium"
                                }}
                            >
                                {item.product_name}
                            </Text>

                            <Text
                                className="text-primary text-xl"
                                style={{
                                    fontFamily:
                                        "maven-medium"
                                }}
                            >
                                K{calculatedPrice}
                            </Text>
                        </View>
                    </View>

                    {/* ============================================================ */}
                    {/* Description / Ingredients */}
                    {/* ============================================================ */}

                    <View className="w-full px-3">
                        {item.product_description && (
                            <Text
                                className="text-sm text-slate mb-4"
                                style={{
                                    fontFamily:
                                        "roboto-regular"
                                }}
                            >
                                {
                                    item.product_description
                                }
                            </Text>
                        )}

                        {item.ingridients && (
                            <View className="w-full">
                                <Text
                                    className="text-base text-black mb-1"
                                    style={{
                                        fontFamily:
                                            "roboto-medium"
                                    }}
                                >
                                    Ingredients
                                </Text>

                                <Text
                                    className="text-sm text-slate mb-4"
                                    style={{
                                        fontFamily:
                                            "roboto-regular"
                                    }}
                                >
                                    {item.ingridients}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ============================================================ */}
                    {/* Variant Groups */}
                    {/* ============================================================ */}

                    <View className="w-full px-3">
                        {item.variant_groups?.map(
                            (group, groupIndex) => (
                                <View
                                    key={group.id}
                                    className="my-3"
                                >
                                    {/* ------------------------------------------------ */}
                                    {/* Instruction */}
                                    {/* ------------------------------------------------ */}

                                    {groupIndex === 0 && (
                                        <Text
                                            className="mb-3 text-sm text-green1"
                                            style={{ fontFamily: "roboto-medium" }}
                                        >
                                            Select your preferred options
                                        </Text>
                                    )}

                                    {/* ------------------------------------------------ */}
                                    {/* Group Header */}
                                    {/* ------------------------------------------------ */}

                                    <View className="items-center mb-2 flex-row w-full justify-between">
                                        <View className="flex-row items-center">
                                            <Text
                                                className="text-xl"
                                                style={{
                                                    fontFamily:
                                                        "outfit-medium"
                                                }}
                                            >
                                                {group.name}
                                            </Text>

                                            {group.is_required && (
                                                <Text
                                                    className="text-red ml-1"
                                                    style={{
                                                        fontFamily:
                                                            "roboto-medium",
                                                        fontSize: 15
                                                    }}
                                                >
                                                    *
                                                </Text>
                                            )}
                                        </View>

                                        {/* ------------------------------------------------ */}
                                        {/* Selection Mode */}
                                        {/* ------------------------------------------------ */}

                                        <Text
                                            className="text-sm text-slate"
                                            style={{
                                                fontFamily: "roboto"
                                            }}
                                        >
                                            {group.multi_select
                                                ? group.is_required
                                                    ? "Select one or more"
                                                    : "Select multiple"
                                                : group.is_required
                                                    ? "Select one"
                                                    : "Optional"}
                                        </Text>
                                    </View>

                                    {/* ==================================================== */}
                                    {/* Options */}
                                    {/* ==================================================== */}

                                    <View className="w-full">
                                        {group.options?.map(
                                            (option) => {
                                                const isSelected =
                                                    selectedVariants[
                                                        group.id
                                                    ]?.some(
                                                        (
                                                            selected
                                                        ) =>
                                                            selected.id ===
                                                            option.id
                                                    );

                                                return (
                                                    <TouchableOpacity
                                                        key={
                                                            option.id
                                                        }
                                                        activeOpacity={
                                                            0.7
                                                        }
                                                        onPress={() =>
                                                            selectVariant(
                                                                group,
                                                                option
                                                            )
                                                        }
                                                        className="flex-row items-center justify-between w-full mb-3"
                                                    >
                                                        {/* -------------------------------------------- */}
                                                        {/* Check */}
                                                        {/* -------------------------------------------- */}

                                                        <View
                                                            className={`h-6 w-6 border justify-center items-center ${
                                                                isSelected
                                                                    ? "border-primary"
                                                                    : "border-slate"
                                                            }`}
                                                            style={{
                                                                borderRadius:
                                                                    2.5,
                                                                borderWidth:
                                                                    1.3,
                                                                backgroundColor:
                                                                    isSelected
                                                                        ? COLORS.primary
                                                                        : "white"
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <FontAwesome5
                                                                    name="check"
                                                                    size={
                                                                        10
                                                                    }
                                                                    color={
                                                                        COLORS.white
                                                                    }
                                                                />
                                                            )}
                                                        </View>

                                                        {/* -------------------------------------------- */}
                                                        {/* Label + Price */}
                                                        {/* -------------------------------------------- */}

                                                        <View
                                                            className="flex-row justify-between"
                                                            style={{
                                                                width: "92%"
                                                            }}
                                                        >
                                                            <Text
                                                                className={
                                                                    isSelected
                                                                        ? "text-primary"
                                                                        : "text-slate"
                                                                }
                                                                style={{
                                                                    fontFamily:
                                                                        "roboto",
                                                                    fontSize: 13
                                                                }}
                                                            >
                                                                {
                                                                    option.name
                                                                }
                                                            </Text>

                                                            <Text
                                                                className={`ml-2 ${
                                                                    isSelected
                                                                        ? "text-primary"
                                                                        : "text-slate"
                                                                }`}
                                                                style={{
                                                                    fontFamily:
                                                                        "roboto",
                                                                    fontSize: 13
                                                                }}
                                                            >
                                                                {Number(
                                                                    option.price
                                                                ) >
                                                                0
                                                                    ? `+K${option.price}`
                                                                    : "Free"}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            }
                                        )}
                                    </View>
                                </View>
                            )
                        )}
                    </View>
                </ScrollView>

                {/* ================================================================ */}
                {/* Bottom / Add To Cart */}
                {/* ================================================================ */}

                <View
                    className="bg-transparent justify-center items-center w-full"
                    style={{
                        marginBottom: 50,
                        paddingHorizontal: 10
                    }}
                >
                    {/* ------------------------------------------------------------ */}
                    {/* Total */}
                    {/* ------------------------------------------------------------ */}

                    <View className="w-full mb-2 bg-white flex-row justify-end">
                        <Text
                            className="text-2xl text-primary"
                            style={{
                                fontFamily:
                                    "ubuntu-bold"
                            }}
                        >
                            Total: K{totalAmount}
                        </Text>
                    </View>

                    {/* ------------------------------------------------------------ */}
                    {/* Add Button */}
                    {/* ------------------------------------------------------------ */}

                    <View className="flex-row w-full justify-between items-center">
                        <TouchableOpacity
                            style={{
                                opacity:
                                    alreadyInCart ||
                                    is_closed ||
                                    !isAvailable ||
                                    hasMissingRequiredGroup
                                        ? 0.7
                                        : 1,
                                width: "100%"
                            }}
                            disabled={
                                alreadyInCart ||
                                is_closed ||
                                !isAvailable ||
                                hasMissingRequiredGroup
                            }
                            onPress={
                                handleAddToCart
                            }
                            className="bg-primary py-3 flex-row justify-center items-center rounded elevation"
                        >
                            {is_closed ||
                            !isAvailable ? (
                                <Feather
                                    name="lock"
                                    size={19}
                                    style={{
                                        color: COLORS.white
                                    }}
                                />
                            ) : (
                                <FontAwesome
                                    name="shopping-cart"
                                    size={20}
                                    color={
                                        COLORS.white
                                    }
                                />
                            )}

                            <Text
                                className="ml-2 text-white text-2xl font-semibold"
                                style={{
                                    fontFamily:
                                        "maven-medium"
                                }}
                            >
                                {alreadyInCart
                                    ? "Already In Cart"
                                    : is_closed
                                    ? "Closed"
                                    : !isAvailable
                                    ? "Unavailable"
                                    : hasMissingRequiredGroup
                                    ? "Select Required Options"
                                    : "Add To Cart"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </MotiView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor:
            "rgba(0,0,0,0.5)"
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: "93%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: 'hidden'
    }
});

export default ProductDetailsModal;