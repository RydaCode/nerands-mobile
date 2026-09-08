import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useReducer, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { useDispatch } from "react-redux";

import { IMAGE_URI } from "../../RequestMethods";
import { COLORS, SIZES } from "../../constants/constants";
import { Carticons } from "../../constants/icons";
import { useResponsive } from "../../hook/useResponsive";

import {
    decreaseQty,
    increaseQty,
    removeItem,
} from "../../redux/store/slices/CartSlices";

import {
    calculateItemTotal,
    calculateUnitPrice
} from "../../utils/calculateItemTotal";

import { getAvatarColor } from "../../utils/getInitials";
import { toast } from "../../utils/toast";
import CartDataModal from "./CartDataModal";


/*
|--------------------------------------------------------------------------
| Local Modal State
|--------------------------------------------------------------------------
*/

const initialState = {
    modalVisible: false,
    quantity: 1,
    selectedExtras: [],
    chiliOption: false,
};


const reducer = (state, action) => {
    switch (action.type) {

        case "TOGGLE_MODAL":
            return {
                ...state,
                modalVisible: !state.modalVisible
            };


        case "SET_QUANTITY":
            return {
                ...state,
                quantity: action.payload
            };


        case "TOGGLE_EXTRA": {
            const newSelectedExtras =
                state.selectedExtras.includes(action.payload)
                    ? state.selectedExtras.filter(
                        extra => extra !== action.payload
                    )
                    : [
                        ...state.selectedExtras,
                        action.payload
                    ];

            return {
                ...state,
                selectedExtras: newSelectedExtras
            };
        }


        case "TOGGLE_CHILI":
            return {
                ...state,
                chiliOption: action.payload
            };


        case "SET_INITIAL_EXTRAS":
            return {
                ...state,
                selectedExtras: action.payload || []
            };


        case "UPDATE_CART_ITEM":
            return {
                ...state,
                selectedExtras:
                    action.payload.selectedExtras || [],
                quantity:
                    action.payload.quantity ||
                    state.quantity,
            };


        case "RESET":
            return initialState;


        default:
            return state;
    }
};


const CartData = ({ item }) => {

    const { wp } = useResponsive();

    const { width, height } = useWindowDimensions();

    const dispatch = useDispatch();

    const [state, localDispatch] = useReducer(
        reducer,
        initialState
    );

    const [modalVisible, setModalVisible] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Extras
    |--------------------------------------------------------------------------
    */

    const extras = item.product_extras || [];


    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    const qtycounter =
        Number(item.product_qty) || 1;


    /*
    |--------------------------------------------------------------------------
    | Product Price
    |--------------------------------------------------------------------------
    |
    | calculateUnitPrice handles:
    |
    | No variants:
    |     product final price + extras
    |
    | With variants:
    |     first group's selected option price
    |     + other selected variant option prices
    |     + extras
    |
    */

    const unitPrice =
        calculateUnitPrice(item);


    /*
    |--------------------------------------------------------------------------
    | Item Total
    |--------------------------------------------------------------------------
    |
    | Unit price × quantity
    |
    */

    const itemTotal =
        calculateItemTotal(item);


    /*
    |--------------------------------------------------------------------------
    | Product Image
    |--------------------------------------------------------------------------
    */

    const productImages =
        Array.isArray(item.product_images)
            ? item.product_images
            : [];

    const product_image =
        productImages.length > 0
            ? productImages[0]
            : Carticons.placeholder;


    /*
    |--------------------------------------------------------------------------
    | Quantity Controls
    |--------------------------------------------------------------------------
    */

    const handleIncreaseQty = () => {

        if (qtycounter < 10) {
            dispatch(
                increaseQty(item.cart_id)
            );
        }
    };


    const handleDecreaseQty = () => {

        if (qtycounter > 1) {
            dispatch(
                decreaseQty(item.cart_id)
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Remove Item
    |--------------------------------------------------------------------------
    */

    const handleRemoveItem = () => {

        dispatch(
            removeItem(item.cart_id)
        );

        toast.success(
            "Product removed from cart"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Open Cart Data Modal
    |--------------------------------------------------------------------------
    */

    const handleOpenModal = () => {
        setModalVisible(true);
    };


    return (
        <>

            {/* ================================================================ */}
            {/* Cart Data Modal */}
            {/* ================================================================ */}

            <CartDataModal
                state={state}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                item={item}
                extras={extras}
            />


            {/* ================================================================ */}
            {/* Cart Item */}
            {/* ================================================================ */}

            <View className="w-full">

                <View
                    className="flex-row justify-between items-center"
                >

                    {/* ======================================================== */}
                    {/* Product + Information */}
                    {/* ======================================================== */}

                    <View
                        className="flex-row justify-start items-center w-[89%]"
                    >

                        {/* ---------------------------------------------------- */}
                        {/* Product Image */}
                        {/* ---------------------------------------------------- */}

                        <TouchableOpacity
                            onPress={handleOpenModal}
                            className="rounded justify-center items-center"
                            style={{
                                height: wp(19),
                                width: wp(23),
                                overflow: "hidden",
                                backgroundColor:
                                    getAvatarColor(
                                        item.product_id
                                    )
                            }}
                        >

                            {!product_image ? (

                                <Text
                                    className="text-white text-sm"
                                    style={{
                                        fontFamily: "roboto"
                                    }}
                                >
                                    image...
                                </Text>

                            ) : (

                                <Image
                                    source={{
                                        uri:
                                            `${IMAGE_URI}${product_image}`
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

                        </TouchableOpacity>


                        {/* ---------------------------------------------------- */}
                        {/* Product Details */}
                        {/* ---------------------------------------------------- */}

                        <View className="w-[70%] ml-2">

                            {/* Product Name */}

                            <Text
                                style={{
                                    fontFamily:
                                        "roboto-medium"
                                }}
                                className="text-base"
                            >
                                {item.product_name}
                            </Text>


                            <View
                                className="flex-row items-center justify-between w-full"
                            >

                                {/* ================================================= */}
                                {/* Unit Price */}
                                {/* ================================================= */}

                                <View className="w-[25%]">

                                    <Text
                                        className="text-slate text-sm"
                                        style={{
                                            fontFamily:
                                                "roboto-regular"
                                        }}
                                    >
                                        Price
                                    </Text>

                                    <Text
                                        style={{
                                            fontFamily:
                                                "roboto-medium"
                                        }}
                                        className="text-base"
                                    >
                                        K
                                        {unitPrice.toLocaleString()}
                                    </Text>

                                </View>


                                {/* ================================================= */}
                                {/* Quantity */}
                                {/* ================================================= */}

                                <View
                                    className="items-center justify-center w-[45%]"
                                >

                                    <Text
                                        className="text-base text-black"
                                        style={{
                                            fontFamily:
                                                "roboto-regular"
                                        }}
                                    >
                                        Qty
                                    </Text>


                                    <View
                                        className="flex-row justify-center items-center"
                                    >

                                        {/* Minus */}

                                        <TouchableOpacity
                                            disabled={
                                                qtycounter <= 1
                                            }
                                            onPress={
                                                handleDecreaseQty
                                            }
                                            style={{
                                                opacity:
                                                    qtycounter <= 1
                                                        ? 0.5
                                                        : 0.9
                                            }}
                                            className="p-2 w-7 h-7 bg-grey_bg border border-slate items-center rounded-full justify-center"
                                        >

                                            <FontAwesome
                                                name="minus"
                                                color={
                                                    COLORS.black
                                                }
                                            />

                                        </TouchableOpacity>


                                        {/* Quantity */}

                                        <View
                                            className="w-[35%] mx-1 items-center justify-center"
                                        >

                                            <Text
                                                style={{
                                                    fontSize:
                                                        SIZES.main
                                                }}
                                                className="mx-1 text-black"
                                            >
                                                {qtycounter}
                                            </Text>

                                        </View>


                                        {/* Plus */}

                                        <TouchableOpacity
                                            onPress={
                                                handleIncreaseQty
                                            }
                                            disabled={
                                                qtycounter >= 10
                                            }
                                            activeOpacity={0.5}
                                            style={{
                                                opacity:
                                                    qtycounter >= 10
                                                        ? 0.5
                                                        : 0.9
                                            }}
                                            className="p-1 w-7 h-7 bg-grey_bg border border-slate items-center justify-center rounded-full"
                                        >

                                            <FontAwesome
                                                name="plus"
                                                color={
                                                    COLORS.black
                                                }
                                            />

                                        </TouchableOpacity>

                                    </View>

                                </View>


                                {/* ================================================= */}
                                {/* Total */}
                                {/* ================================================= */}

                                <View
                                    className="justify-center items-center"
                                >

                                    <Text
                                        className="text-slate text-sm"
                                        style={{
                                            fontFamily:
                                                "roboto-regular"
                                        }}
                                    >
                                        Total
                                    </Text>

                                    <Text
                                        style={{
                                            fontFamily:
                                                "roboto-medium"
                                        }}
                                        className="text-base text-primary"
                                    >
                                        K
                                        {itemTotal.toLocaleString()}
                                    </Text>

                                </View>

                            </View>

                        </View>

                    </View>


                    {/* ======================================================== */}
                    {/* Remove */}
                    {/* ======================================================== */}

                    <TouchableOpacity
                        onPress={handleRemoveItem}
                        className="w-[8%] h-[70px] mr-1 items-center justify-center"
                    >

                        <FontAwesome
                            name="times"
                            color={COLORS.red}
                            size={20}
                        />

                    </TouchableOpacity>

                </View>


                {/* ============================================================ */}
                {/* Divider */}
                {/* ============================================================ */}

                <View
                    className="w-full bg-gray-400 my-3"
                    style={{
                        height: 1,
                        opacity: 0.2
                    }}
                />

            </View>

        </>
    );
};


const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
            COLORS.transparentBlack,
    },

    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: "80%",
        backgroundColor: "white",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
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


export default CartData;