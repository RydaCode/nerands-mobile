import { FontAwesome } from "@expo/vector-icons";
import { useReducer, useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCTS_IMAGE_URI } from "../../RequestMethods";
import { COLORS, SIZES } from "../../constants/constants";
import { Carticons } from "../../constants/icons";
import { decreaseLocalMarketQty, increaseLocalMarketQty, removeLocalMarketItem } from "../../redux/store/slices/LocalMarketCartSlice";
import { calculateItemTotal, calculateUnitPrice } from "../../utils/calculateItemTotal";
import { toast } from "../../utils/toast";
import CartDataModal from "./CartDataModal";

const { width: screenWidth } = Dimensions.get("window"); // Get screen width for scaling
const { height: screenHeight } = Dimensions.get("window"); // Get screen height for scaling

const initialState = {
    modalVisible: false,
    quantity: 1,
    selectedExtras: [],
    chiliOption: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_MODAL":
            return { ...state, modalVisible: !state.modalVisible };

        case "SET_QUANTITY":
            return { ...state, quantity: action.payload };

        case "TOGGLE_EXTRA":
            console.log("Previous selectedExtras:", state.selectedExtras);
            console.log("Toggling extra:", action.payload);

            const newSelectedExtras = state.selectedExtras.includes(action.payload)
                ? state.selectedExtras.filter((extra) => extra !== action.payload) // Remove if already selected
                : [...state.selectedExtras, action.payload]; // Add if not selected

            console.log("Updated selectedExtras:", newSelectedExtras);

            return { ...state, selectedExtras: newSelectedExtras };

        case "TOGGLE_CHILI":
            return { ...state, chiliOption: action.payload };

            // ✅ NEW: Case for setting initial extras from the cart
            case "SET_INITIAL_EXTRAS":
            return { ...state, selectedExtras: action.payload || [] };

        // ✅ NEW: Case for updating the cart item
        case "UPDATE_CART_ITEM":
            return {
                ...state,
                selectedExtras: action.payload.selectedExtras || [],
                quantity: action.payload.quantity || state.quantity,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
};

const LocalMarketCartData = ({ item }) => {
    // Calculate total cart price
    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();

    // Make the image height and width responsive based on the screen size
    const imageWidth = width * 0.25;
    const imageHeight = height * 0.09;

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const dispatch = useDispatch();
    const localMarketCartItems = useSelector((state) => state.localmarketcart.localMarketCartItems);
    const [state, localDispatch] = useReducer(reducer, initialState);
    const extras = item.product_extras || [];

    console.log("LOCALSSS", localMarketCartItems)

    const extrasMap = useMemo(() => {
        return new Map(
            extras.map(extra => [extra.extra_id, extra])
        );
    }, [extras]);
        
    const toggleModal = () => localDispatch({ type: "TOGGLE_MODAL" });

    const cartItem = useSelector(state =>
        state.localmarketcart.localMarketCartItems.find(i => i.cart_id === item.cart_id)
    );

    const qtycounter = item.product_qty;

    const productImages = Array.isArray(item.product_images)
        ? item.product_images
        : [];
    const product_image =
        productImages.length > 0
        ? productImages[0]
        : Carticons.placeholder;

    const [OpenClose, setOpenClose] = useState(item.open_close);
    const [modalVisible, setModalVisible] = useState(false);

    const handleIncreaseQty = () => {
        if (qtycounter < 10) {
            dispatch(increaseLocalMarketQty(item.cart_id));
        }
    };

    const handleDecreaseQty = () => {
        if (qtycounter > 1) {
            dispatch(decreaseLocalMarketQty(item.cart_id));
        }
    };

    const handleRemoveItem = () => {
        dispatch(removeLocalMarketItem(item.cart_id));
        toast.success("Product removed from cart");
    };

    return (
        <>
        {/* Start modal */}
            <CartDataModal
                state={state}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                item={item}
                extras={extras}
            />
        {/* End modal */}
            <View className="w-full">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row justify-start items-center w-[89%]">
                        <TouchableOpacity
                            // onPress={() => setModalVisible(true)}
                            className="w-[26%]"
                            style={{ height: screenHeight * 0.08 }}
                        >
                            <Image
                                source={{ uri: `${PRODUCTS_IMAGE_URI}${item.product_images}` }}
                                style={{
                                    borderRadius: SIZES.border,
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        </TouchableOpacity>
                        <View className="w-[70%] ml-2">
                            <Text
                                style={{ fontFamily: "roboto-medium" }}
                                className="text-base"
                            >
                                {item.product_name}
                            </Text>
                            <View className="flex-row items-center justify-between w-full">
                                <View className="w-[25%]">
                                    <Text
                                        className="text-slate text-sm"
                                        style={{ fontFamily: "roboto-regular" }}
                                    >
                                        Price
                                    </Text>
                                    <Text
                                        style={{ fontFamily: "roboto-medium" }}
                                        className="text-base"
                                    >
                                        K{calculateUnitPrice(item).toLocaleString()}
                                    </Text>
                                </View>
                                <View className="items-center justify-center w-[45%]">
                                    <Text
                                        className="text-base text-black"
                                        style={{ fontFamily: "roboto-regular" }}
                                    >
                                        Qty
                                    </Text>
                                    <View className="flex-row justify-center items-center">
                                        <TouchableOpacity
                                            disabled={qtycounter <= 1}
                                            onPress={handleDecreaseQty}
                                            style={{ opacity: qtycounter <= 1 ? 0.5 : 0.9 }}
                                            className="p-2 w-7 h-7 bg-grey_bg border border-slate items-center rounded-full justify-center"
                                        >
                                            <FontAwesome name="minus" color={COLORS.black} />
                                        </TouchableOpacity>
                                        <View className="w-[35%] mx-1 items-center justify-center">
                                            <Text
                                                style={{ fontSize: SIZES.main }}
                                                className="mx-1 text-black"
                                            >
                                                {qtycounter}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={handleIncreaseQty}
                                            disabled={qtycounter >= 10}
                                            activeOpacity={0.5}
                                            style={{ opacity: qtycounter >= 10 ? 0.5 : 0.9 }}
                                            className="p-1 w-7 h-7 bg-grey_bg border border-slate items-center justify-center rounded-full"
                                        >
                                            <FontAwesome name="plus" color={COLORS.black} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className="justify-center items-center">
                                    <Text
                                        className="text-slate text-sm"
                                        style={{ fontFamily: "roboto-regular" }}
                                    >
                                        Total
                                    </Text>
                                    <View>
                                        <Text
                                            style={{ fontFamily: "roboto-medium" }}
                                            className="text-base text-primary"
                                        >
                                            K{calculateItemTotal(item).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleRemoveItem}
                        className="w-[8%] h-[70px] mr-1 items-center justify-center"
                    >
                        <FontAwesome name="times" color={COLORS.red} size={20} />
                    </TouchableOpacity>
                </View>
                <View
                    className="w-full bg-gray-400 my-3"
                    style={{ height: 1, opacity: 0.2 }}
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
        backgroundColor: COLORS.transparentBlack,
    },

    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: '80%',
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

export default LocalMarketCartData;