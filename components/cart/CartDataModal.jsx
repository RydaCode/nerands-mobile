import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS, SIZES } from "../../constants/constants";
import {
    decreaseQty,
    increaseQty,
    updateItem,
} from "../../redux/store/slices/CartSlice";
import { PRODUCTS_IMAGE_URI } from "../../RequestMethods";
import { toast } from "../../utils/toast";

const CartDataModal = ({
    state,
    setModalVisible,
    modalVisible,
    item,
    extras = [],
}) => {
    const { width, height } = useWindowDimensions();

    const dispatch = useDispatch();

    /*
    |--------------------------------------------------------------------------
    | Redux Cart
    |--------------------------------------------------------------------------
    */

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    /*
    |--------------------------------------------------------------------------
    | Get Current Cart Item
    |--------------------------------------------------------------------------
    |
    | This is important because quantity can change directly in Redux.
    | We therefore always use the latest version from the cart.
    |
    */

    const cartItem = useMemo(() => {
        return cartItems.find(
            (cartItem) =>
                cartItem.cart_id === item?.cart_id
        );
    }, [cartItems, item?.cart_id]);

    /*
    |--------------------------------------------------------------------------
    | Current Quantity
    |--------------------------------------------------------------------------
    */

    const qtycounter =
        cartItem?.product_qty ??
        item?.product_qty ??
        1;

    /*
    |--------------------------------------------------------------------------
    | Selected Variants
    |--------------------------------------------------------------------------
    |
    | Structure:
    |
    | [
    |     {
    |         group_id: "...",
    |         group_name: "Size",
    |         multi_select: false,
    |         options: [
    |             {
    |                 option_id: "...",
    |                 option_name: "Full Chicken",
    |                 option_price: 80
    |             }
    |         ]
    |     }
    | ]
    |
    */

    const [selectedVariants, setSelectedVariants] =
        useState([]);

    /*
    |--------------------------------------------------------------------------
    | Landscape
    |--------------------------------------------------------------------------
    */

    const isLandscape = width > height;

    /*
    |--------------------------------------------------------------------------
    | Image Dimensions
    |--------------------------------------------------------------------------
    */

    const imageDimensions = useMemo(
        () =>
            isLandscape
                ? {
                      width: "35%",
                      height: 170,
                      marginRight: 10,
                  }
                : {
                      width: width * 0.25,
                      height: height * 0.09,
                  },
        [isLandscape, width, height]
    );

    /*
    |--------------------------------------------------------------------------
    | Normalize Existing Variants
    |--------------------------------------------------------------------------
    |
    | Converts whatever is currently in the cart into the
    | structure expected by this component.
    |
    */

    const normalizeSelectedVariants = useCallback(
        (variants) => {
            if (!Array.isArray(variants)) {
                return [];
            }

            return variants
                .filter(
                    (group) =>
                        group &&
                        typeof group === "object"
                )
                .map((group) => ({
                    group_id:
                        group.group_id ??
                        group.id ??
                        null,

                    group_name:
                        group.group_name ??
                        group.name ??
                        "",

                    multi_select:
                        group.multi_select ??
                        false,

                    options: Array.isArray(
                        group.options
                    )
                        ? group.options
                              .filter(
                                  (option) =>
                                      option &&
                                      typeof option ===
                                          "object"
                              )
                              .map((option) => ({
                                  option_id:
                                      option.option_id ??
                                      option.id ??
                                      null,

                                  option_name:
                                      option.option_name ??
                                      option.name ??
                                      "",

                                  option_price:
                                      Number(
                                          option.option_price ??
                                              option.price ??
                                              0
                                      ) || 0,
                              }))
                        : [],
                }));
        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Initialize Selected Variants
    |--------------------------------------------------------------------------
    |
    | Load the variants already stored in the cart.
    |
    */

    useEffect(() => {
        const existingVariants =
            normalizeSelectedVariants(
                cartItem?.selected_variants ??
                    item?.selected_variants
            );

        setSelectedVariants(existingVariants);
    }, [
        cartItem?.cart_id,
        cartItem?.selected_variants,
        item?.selected_variants,
        normalizeSelectedVariants,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Check Whether Option Is Selected
    |--------------------------------------------------------------------------
    */

    const isOptionSelected = useCallback(
        (groupId, optionId) => {
            const group =
                selectedVariants.find(
                    (group) =>
                        group.group_id === groupId
                );

            if (!group) {
                return false;
            }

            return group.options?.some(
                (option) =>
                    option.option_id === optionId
            );
        },
        [selectedVariants]
    );

    /*
    |--------------------------------------------------------------------------
    | Select Variant
    |--------------------------------------------------------------------------
    */

    const selectVariant = useCallback(
        (group, option) => {
            setSelectedVariants((prev) => {
                const existingGroup =
                    prev.find(
                        (g) =>
                            g.group_id === group.id
                    );

                /*
                |--------------------------------------------------------------------------
                | MULTI SELECT
                |--------------------------------------------------------------------------
                */

                if (group.multi_select) {
                    const currentOptions =
                        existingGroup?.options || [];

                    const alreadySelected =
                        currentOptions.some(
                            (selected) =>
                                selected.option_id ===
                                option.id
                        );

                    let newOptions;

                    /*
                    | Remove option
                    */

                    if (alreadySelected) {
                        /*
                        | Required multi-select groups
                        | must keep at least one option.
                        */

                        if (
                            group.is_required &&
                            currentOptions.length === 1
                        ) {
                            return prev;
                        }

                        newOptions =
                            currentOptions.filter(
                                (selected) =>
                                    selected.option_id !==
                                    option.id
                            );
                    }

                    /*
                    | Add option
                    */

                    else {
                        newOptions = [
                            ...currentOptions,
                            {
                                option_id:
                                    option.id,

                                option_name:
                                    option.name,

                                option_price:
                                    Number(
                                        option.price
                                    ) || 0,
                            },
                        ];
                    }

                    /*
                    | Remove empty optional group
                    */

                    if (
                        newOptions.length === 0 &&
                        !group.is_required
                    ) {
                        return prev.filter(
                            (g) =>
                                g.group_id !==
                                group.id
                        );
                    }

                    const newGroup = {
                        group_id: group.id,

                        group_name:
                            group.name,

                        multi_select:
                            group.multi_select,

                        options: newOptions,
                    };

                    /*
                    | Update existing group
                    */

                    if (existingGroup) {
                        return prev.map((g) =>
                            g.group_id === group.id
                                ? newGroup
                                : g
                        );
                    }

                    /*
                    | Add new group
                    */

                    return [
                        ...prev,
                        newGroup,
                    ];
                }

                /*
                |--------------------------------------------------------------------------
                | SINGLE SELECT
                |--------------------------------------------------------------------------
                */

                const alreadySelected =
                    existingGroup?.options?.some(
                        (selected) =>
                            selected.option_id ===
                            option.id
                    );

                /*
                | Optional single-select:
                | tapping the selected option removes it.
                */

                if (
                    alreadySelected &&
                    !group.is_required
                ) {
                    return prev.filter(
                        (g) =>
                            g.group_id !==
                            group.id
                    );
                }

                /*
                | Required single-select cannot
                | be deselected.
                */

                const newGroup = {
                    group_id: group.id,

                    group_name:
                        group.name,

                    multi_select: false,

                    options: [
                        {
                            option_id:
                                option.id,

                            option_name:
                                option.name,

                            option_price:
                                Number(
                                    option.price
                                ) || 0,
                        },
                    ],
                };

                /*
                | Replace existing group
                */

                if (existingGroup) {
                    return prev.map((g) =>
                        g.group_id === group.id
                            ? newGroup
                            : g
                    );
                }

                /*
                | Add group
                */

                return [
                    ...prev,
                    newGroup,
                ];
            });
        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Required Group Validation
    |--------------------------------------------------------------------------
    */

    const hasMissingRequiredGroup = useMemo(() => {
        const groups =
            item?.variant_groups || [];

        return groups.some((group) => {
            if (!group.is_required) {
                return false;
            }

            const selectedGroup =
                selectedVariants.find(
                    (selected) =>
                        selected.group_id ===
                        group.id
                );

            return (
                !selectedGroup ||
                !selectedGroup.options ||
                selectedGroup.options.length === 0
            );
        });
    }, [
        item?.variant_groups,
        selectedVariants,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Calculate Unit Price
    |--------------------------------------------------------------------------
    |
    | First variant group defines the product price.
    | Remaining groups add to it.
    |
    | This follows the same pricing logic used by CartSlice.
    |
    */

    const calculatedUnitPrice = useMemo(() => {
        const variantGroups =
            selectedVariants || [];

        /*
        | No variants
        */

        if (variantGroups.length === 0) {
            return (
                Number(
                    cartItem?.product_price ??
                        item?.product_price ??
                        item?.final_price ??
                        0
                ) || 0
            );
        }

        /*
        | First group = base/overridden price
        */

        const firstGroup =
            variantGroups[0];

        const firstGroupPrice =
            firstGroup?.options?.reduce(
                (sum, option) =>
                    sum +
                    (Number(
                        option.option_price
                    ) || 0),
                0
            ) || 0;

        /*
        | Remaining groups = additions
        */

        const additionalPrice =
            variantGroups
                .slice(1)
                .reduce(
                    (sum, group) =>
                        sum +
                        (group.options || []).reduce(
                            (
                                groupSum,
                                option
                            ) =>
                                groupSum +
                                (Number(
                                    option.option_price
                                ) || 0),
                            0
                        ),
                    0
                );

        return (
            firstGroupPrice +
            additionalPrice
        );
    }, [
        selectedVariants,
        cartItem?.product_price,
        cartItem?.final_price,
        item?.product_price,
        item?.final_price,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Total Price
    |--------------------------------------------------------------------------
    */

    const calculatedTotal = useMemo(() => {
        return (
            calculatedUnitPrice *
            qtycounter
        );
    }, [
        calculatedUnitPrice,
        qtycounter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Increase Quantity
    |--------------------------------------------------------------------------
    */

    const handleIncreaseQty = useCallback(() => {
        if (qtycounter < 10) {
            dispatch(
                increaseQty(item.cart_id)
            );
        }
    }, [
        qtycounter,
        dispatch,
        item.cart_id,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Decrease Quantity
    |--------------------------------------------------------------------------
    */

    const handleDecreaseQty = useCallback(() => {
        if (qtycounter > 1) {
            dispatch(
                decreaseQty(item.cart_id)
            );
        }
    }, [
        qtycounter,
        dispatch,
        item.cart_id,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Update Cart
    |--------------------------------------------------------------------------
    */

    const handleUpdateCart = useCallback(() => {
        /*
        | Required validation
        */

        if (hasMissingRequiredGroup) {
            toast.error(
                "Please select all required options"
            );
            return;
        }

        /*
        | Make sure cart item still exists
        */

        if (!cartItem) {
            toast.error(
                "Cart item no longer exists"
            );
            return;
        }

        /*
        | Update Redux
        */

        dispatch(
            updateItem({
                cart_id: cartItem.cart_id,

                store_id:
                    cartItem.store_id,

                business_id:
                    cartItem.business_id,

                product_qty:
                    cartItem.product_qty,

                selected_variants:
                    selectedVariants,

                product_price:
                    cartItem.product_price,

                /*
                | We let CartSlice calculate the
                | actual final price from variants.
                */

                final_price:
                    cartItem.product_price,

                product_notes:
                    cartItem.product_notes,
            })
        );

        /*
        | Close modal
        */

        setModalVisible(false);

        toast.success(
            "Cart updated successfully"
        );
    }, [
        hasMissingRequiredGroup,
        cartItem,
        selectedVariants,
        dispatch,
        setModalVisible,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Remove Item
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Modal
            animationType="slide"
            transparent
            statusBarTranslucent
            visible={modalVisible}
            onRequestClose={() =>
                setModalVisible(false)
            }
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
                    onPress={() =>
                        setModalVisible(false)
                    }
                />
            </MotiView>

            {/* Bottom Sheet */}

            <MotiView
                from={{
                    translateY: 300,
                }}
                animate={{
                    translateY: 0,
                }}
                exit={{
                    translateY: 300,
                }}
                transition={{
                    type: "timing",
                    duration: 300,
                }}
                style={styles.sheet}
            >
                <View
                    className="w-full pb-20 relative"
                    style={{
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    {/* Drag Handle */}

                    <TouchableOpacity
                        className="w-full justify-center items-center"
                        onPress={() =>
                            setModalVisible(false)
                        }
                    >
                        <View className="h-1 rounded-full my-2 bg-[#ccc] w-[30%]" />
                    </TouchableOpacity>

                    {/* Header */}

                    <View className="w-full px-4">
                        <Text
                            className="text-black text-2xl mt-1 font-semibold"
                            style={{
                                fontFamily:
                                    "maven-medium",
                            }}
                        >
                            Product Details
                        </Text>
                    </View>

                    <View className="w-full px-4 mt-1">
                        <View
                            className="bg-lavender"
                            style={{
                                height: 0.5,
                            }}
                        />
                    </View>

                    {/* Content */}

                    <ScrollView
                        style={{
                            maxHeight:
                                height * 0.8,
                            paddingHorizontal: 16,
                            paddingBottom: 40,
                            backgroundColor:
                                "transparent",
                            marginBottom: 40,
                        }}
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {/* Product Info */}

                        <View className="flex-row mb-4 pt-2">
                            <View
                                className="relative rounded"
                                style={
                                    imageDimensions
                                }
                            >
                                <Image
                                    className="w-full h-full"
                                    source={{
                                        uri: `${PRODUCTS_IMAGE_URI}${item.product_images}`,
                                    }}
                                    style={{
                                        borderRadius:
                                            SIZES.radius,
                                        resizeMode:
                                            "cover",
                                    }}
                                />
                            </View>

                            <View className="justify-center ml-3 flex-1">
                                <Text
                                    className="text-lg"
                                    style={{
                                        fontFamily:
                                            "roboto-medium",
                                    }}
                                >
                                    {
                                        item.product_name
                                    }
                                </Text>

                                <Text
                                    className="text-primary text-lg"
                                    style={{
                                        fontFamily:
                                            "maven-medium",
                                    }}
                                >
                                    K
                                    {calculatedUnitPrice.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Description */}

                        {item.product_description && (
                            <Text
                                className="text-sm text-slate mb-4"
                                style={{
                                    fontFamily:
                                        "roboto-regular",
                                }}
                            >
                                {
                                    item.product_description
                                }
                            </Text>
                        )}

                        {/* Quantity */}

                        <View className="w-full flex-row justify-between items-center bg-grey_bg p-2 rounded">
                            <View
                                style={{
                                    width: "30%",
                                }}
                            >
                                <Text
                                    className="text-2xl"
                                    style={{
                                        fontFamily:
                                            "ubuntu-medium",
                                    }}
                                >
                                    Quantity
                                </Text>
                            </View>

                            <View className="flex-row justify-center items-center border border-lavender rounded p-1 px-2">
                                <TouchableOpacity
                                    disabled={
                                        qtycounter <=
                                        1
                                    }
                                    onPress={
                                        handleDecreaseQty
                                    }
                                    style={{
                                        opacity:
                                            qtycounter <=
                                            1
                                                ? 0.5
                                                : 0.9,
                                    }}
                                    className="p-2 w-7 h-7 bg-grey_bg border border-slate items-center rounded-full justify-center"
                                >
                                    <FontAwesome
                                        name="minus"
                                        size={12}
                                    />
                                </TouchableOpacity>

                                <Text
                                    className="text-xl text-black px-3"
                                    style={{
                                        fontFamily:
                                            "roboto-medium",
                                    }}
                                >
                                    {
                                        qtycounter
                                    }
                                </Text>

                                <TouchableOpacity
                                    onPress={
                                        handleIncreaseQty
                                    }
                                    disabled={
                                        qtycounter >=
                                        10
                                    }
                                    style={{
                                        opacity:
                                            qtycounter >=
                                            10
                                                ? 0.5
                                                : 0.9,
                                    }}
                                    className="p-1 w-7 h-7 bg-grey_bg border border-slate items-center justify-center rounded-full"
                                >
                                    <FontAwesome
                                        name="plus"
                                        size={12}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Variants */}

                        <View>
                            {item.variant_groups?.map(
                                (
                                    group,
                                    groupIndex
                                ) => (
                                    <View
                                        key={
                                            group.id
                                        }
                                        className="my-5"
                                    >
                                        {/* Instruction */}

                                        {groupIndex ===
                                            0 && (
                                            <Text
                                                className="mb-3 text-sm text-green1"
                                                style={{
                                                    fontFamily:
                                                        "roboto-medium",
                                                }}
                                            >
                                                Ensure
                                                that you
                                                select
                                                the right
                                                variant
                                                and
                                                extras
                                            </Text>
                                        )}

                                        {/* Group Header */}

                                        <View className="items-center mb-2 flex-row w-full justify-between">
                                            <View className="flex-row items-center">
                                                <Text
                                                    className="font-semibold text-2xl"
                                                    style={{
                                                        fontFamily:
                                                            "maven-medium",
                                                    }}
                                                >
                                                    {
                                                        group.name
                                                    }
                                                </Text>

                                                {group.is_required && (
                                                    <Text
                                                        className="text-red ml-1"
                                                        style={{
                                                            fontFamily:
                                                                "roboto-bold",
                                                            fontSize: 20,
                                                        }}
                                                    >
                                                        *
                                                    </Text>
                                                )}
                                            </View>

                                            <Text
                                                className="text-sm text-slate"
                                                style={{
                                                    fontFamily:
                                                        "roboto-regular",
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

                                        {/* Options */}

                                        <View className="w-full">
                                            {group.options?.map(
                                                (
                                                    option
                                                ) => {
                                                    const optionSelected =
                                                        isOptionSelected(
                                                            group.id,
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
                                                            {/* Check */}

                                                            <View
                                                                className={`h-6 w-6 border justify-center items-center ${
                                                                    optionSelected
                                                                        ? "border-primary"
                                                                        : "border-slate"
                                                                }`}
                                                                style={{
                                                                    borderRadius: 2.5,
                                                                    borderWidth: 1.3,
                                                                    backgroundColor:
                                                                        optionSelected
                                                                            ? COLORS.primary
                                                                            : "white",
                                                                }}
                                                            >
                                                                {optionSelected && (
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

                                                            {/* Name + Price */}

                                                            <View
                                                                className="flex-row justify-between"
                                                                style={{
                                                                    width: "92%",
                                                                }}
                                                            >
                                                                <Text
                                                                    className={
                                                                        optionSelected
                                                                            ? "text-primary"
                                                                            : "text-slate"
                                                                    }
                                                                    style={{
                                                                        fontFamily:
                                                                            "roboto-medium",
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    {
                                                                        option.name
                                                                    }
                                                                </Text>

                                                                <Text
                                                                    className={
                                                                        optionSelected
                                                                            ? "text-primary"
                                                                            : "text-slate"
                                                                    }
                                                                    style={{
                                                                        fontFamily:
                                                                            "roboto-medium",
                                                                        fontSize: 13,
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

                        {/* Extras */}

                        {extras.length > 0 && (
                            <View className="mb-5">
                                <Text
                                    className="mb-2 font-semibold text-2xl"
                                    style={{
                                        fontFamily:
                                            "maven-medium",
                                    }}
                                >
                                    Extras
                                </Text>

                                {extras.map(
                                    (extra) => {
                                        const isChecked =
                                            (
                                                item.selected_extras ||
                                                []
                                            ).includes(
                                                extra.extra_id
                                            );

                                        return (
                                            <View
                                                key={
                                                    extra.extra_id
                                                }
                                                className="mb-2"
                                            >
                                                <ExtraCheckbox
                                                    label={
                                                        extra.extra_name
                                                    }
                                                    price={
                                                        extra.extra_price
                                                    }
                                                    checked={
                                                        isChecked
                                                    }
                                                    disableBuiltInState
                                                />
                                            </View>
                                        );
                                    }
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* Bottom */}

                    <View
                        className="absolute w-full px-4 bg-transparent justify-center items-center"
                        style={{
                            bottom: 50,
                        }}
                    >
                        {/* Total */}

                        <View className="w-full mb-2 bg-white">
                            <Text
                                className="text-2xl text-primary"
                                style={{
                                    fontFamily:
                                        "ubuntu-bold",
                                }}
                            >
                                Total: K
                                {calculatedTotal.toLocaleString()}
                            </Text>
                        </View>

                        {/* Update Button */}

                        <View className="flex-row w-full justify-between items-center">
                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    opacity:
                                        hasMissingRequiredGroup
                                            ? 0.6
                                            : 1,
                                }}
                                disabled={
                                    hasMissingRequiredGroup
                                }
                                onPress={
                                    handleUpdateCart
                                }
                                className="bg-primary py-3 flex-row justify-center items-center rounded elevation-md"
                            >
                                <Text
                                    className="text-white text-2xl font-semibold"
                                    style={{
                                        fontFamily:
                                            "maven-medium",
                                    }}
                                >
                                    {hasMissingRequiredGroup
                                        ? "Select Required Options"
                                        : "Update Cart"}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
            "rgba(0,0,0,0.5)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: "hidden",
    },
});

export default CartDataModal;