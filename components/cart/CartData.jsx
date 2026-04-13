import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useReducer, useState } from "react";
import {
    Dimensions,
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
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCTS_IMAGE_URI } from "../../RequestMethods";
import { COLORS, SIZES } from "../../constants/constants";
import {
    decreaseQty,
    increaseQty,
    removeItem,
} from "../../redux/store/slices/CartSlice";
import { toast } from "../../utils/toast";

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

const CartData = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [state, localDispatch] = useReducer(reducer, initialState);
  const extras = item.product_extras || [];

  const extrasMap = new Map(
    extras.map((extra) => [
      extra.extra_id,
      extra.extra_name,
      extra.extra_price,
    ]),
  );
  const extrasTotal = state.selectedExtras.reduce(
    (sum, extra) => sum + (extrasMap.get(extra) || 0),
    0,
  );
  const totalAmount = (item.product_price + extrasTotal) * state.quantity;
  const toggleModal = () => localDispatch({ type: "TOGGLE_MODAL" });

  const cartItem = cartItems.find(
    (cart) => cart.product_id === item.product_id,
  );

  const qtycounter = cartItem ? cartItem.product_qty : 1;

  const productImages = Array.isArray(item.product_images)
    ? item.product_images
    : [];
  const product_image =
    productImages.length > 0
      ? productImages[0]
      : "https://yourapp.com/placeholder.png";

  // console.log(item)

  // Calculate total cart price
  const [totalZMK, setTotalZMK] = useState(0);

  useEffect(() => {
    setTotalZMK(cartItems.reduce((total, item) => total + item.total_price, 0));
  }, [cartItems]);

  const [chiliOptions, setChiliOption] = useState(item.chilieoption);
  const [OpenClose, setOpenClose] = useState(item.open_close);
  const [modalVisible, setModalVisible] = useState(false);

  const handleIncreaseQty = () => {
    if (qtycounter < 10) {
      dispatch(increaseQty(item.product_id));
    }
  };

  const handleDecreaseQty = () => {
    if (qtycounter > 1) {
      dispatch(decreaseQty(item.product_id));
    }
  };

  const handleRemoveItem = () => {
    dispatch(
      removeItem(item.product_id),
      toast.success("Product removed from cart"),
    );
  };

  // Get the window dimensions for responsiveness
  const { width, height } = useWindowDimensions();

  // Make the image height and width responsive based on the screen size
  const imageWidth = width * 0.25;
  const imageHeight = height * 0.09;

  // Calculate dynamic sizes based on screen width/height
  const imageWidthModal = width * 0.29; // 29% of the screen width for the image
  const imageHeightModal = height * 0.12; // 12% of the screen height for the image
  const buttonWidth = width * 0.4; // 40% of the screen width for buttons

  // console.log(cartItem)
  return (
    <>
      {/* Start modal */}
      <TouchableOpacity
        style={styles.centeredView}
        onPress={() => setModalVisible(false)}
      >
        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.centeredView}
            onPress={() => setModalVisible(!modalVisible)}
          ></Pressable>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}
                className="flex-row justify-between mb-5"
              >
                <Text
                  className="text-2xl"
                  style={{ fontFamily: "ubuntu-medium" }}
                >
                  Product Details
                </Text>
                <View className="bg-red h-[27px] w-[27px] items-center justify-center rounded-full">
                  <Entypo name="cross" size={17} color={COLORS.white} />
                </View>
              </Pressable>
              <View>
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: `${PRODUCTS_IMAGE_URI}${product_image}` }}
                    style={{
                      width: 90,
                      height: 70,
                      resizeMode: "cover",
                      borderRadius: SIZES.radius,
                    }}
                  />
                  <View className="ml-3">
                    <Text
                      className="text-xl"
                      style={{ fontFamily: "roboto-medium" }}
                    >
                      {item.product_name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-sm"
                      style={{ fontFamily: "roboto-medium" }}
                    >
                      From: {item.store_name}
                    </Text>
                    <Text
                      className="text-primary text-lg"
                      style={{ fontFamily: "roboto-medium" }}
                    >
                      ZMK {totalAmount}
                    </Text>
                  </View>
                </View>
                <View className="mt-4">
                  <Text
                    className="text-slate text-sm"
                    style={{ fontFamily: "roboto-regular" }}
                  >
                    {item.product_description}
                  </Text>
                </View>

                <View className="items-center justify-between mt-6 flex-row">
                  <Text
                    className="text-xl"
                    style={{ fontFamily: "ubuntu-medium" }}
                  >
                    Qty
                  </Text>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      disabled={qtycounter <= 1}
                      onPress={handleDecreaseQty}
                      activeOpacity={0.5}
                      style={{ opacity: qtycounter <= 1 ? 0.5 : 0.9 }}
                      className="p-2 w-8 h-8 bg-grey_bg border border-slate items-center rounded-full justify-center"
                    >
                      <FontAwesome5
                        name="minus"
                        style={{ color: COLORS.black }}
                      />
                    </TouchableOpacity>
                    <Text className="mx-4 text-lg">
                      {qtycounter.toString()}
                    </Text>
                    <TouchableOpacity
                      onPress={handleIncreaseQty}
                      disabled={qtycounter === 10}
                      activeOpacity={0.5}
                      style={{ opacity: qtycounter >= 10 ? 0.5 : 0.9 }}
                      className="p-2 w-8 h-8 bg-grey_bg border border-slate items-center justify-center rounded-full"
                    >
                      <FontAwesome5
                        name="plus"
                        style={{ color: COLORS.black }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginTop: 25 }}>
                  {extras.length > 1 && (
                    <Text
                      className="mb-2 text-2xl"
                      style={{ fontFamily: "ubuntu-medium" }}
                    >
                      Extras
                    </Text>
                  )}
                  {/* Extras */}
                  {extras.length > 0 && (
                    <ScrollView showsHorizontalScrollIndicator={false}>
                      {cartItem.chilioption === false ? (
                        <></>
                      ) : (
                        <View className="mb-4">
                          <View className="mb-1">
                            <View className="w-full flex-row items-center justify-between">
                              <View className="w-[80%]">
                                <BouncyCheckbox
                                  isChecked={
                                    cartItem.chilioption === false
                                      ? false
                                      : true
                                  }
                                  onPress={() =>
                                    localDispatch({
                                      type: "TOGGLE_CHILI",
                                      payload: !state.chiliOption,
                                    })
                                  }
                                  text="Chilie"
                                  disabled={true}
                                  textStyle={{
                                    fontFamily: "roboto-medium",
                                    textDecorationLine: "none",
                                    color: COLORS.slate,
                                    marginLeft: -10,
                                    fontSize: 13,
                                  }}
                                  size={20}
                                  fillColor={COLORS.primary}
                                  iconStyle={{
                                    borderColor: COLORS.primary,
                                    borderRadius: 2,
                                  }}
                                  innerIconStyle={{
                                    borderWidth: 2,
                                    borderRadius: 2,
                                  }}
                                />
                              </View>
                              <Text
                                className="text-xl"
                                style={{
                                  fontFamily:
                                    state.chiliOption === false
                                      ? "roboto-medium"
                                      : "roboto-bold",
                                  color:
                                    state.chiliOption === true
                                      ? COLORS.primary
                                      : COLORS.slate,
                                }}
                              >
                                K0
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {cartItem.selected_extras.map((extra, index) => (
                        <View className="" key={index}>
                          <View className="w-full flex-row items-center justify-between mb-3">
                            <View className="w-[80%]">
                              <BouncyCheckbox
                                isChecked={true}
                                disableBuiltInState
                                text={extra.name}
                                disabled={true}
                                onPress={() =>
                                  localDispatch({
                                    type: "TOGGLE_EXTRA",
                                    payload: extra.name,
                                  })
                                }
                                textStyle={{
                                  fontFamily: "roboto-medium",
                                  textDecorationLine: "none",
                                  color: COLORS.slate,
                                  marginLeft: -10,
                                  fontSize: 13,
                                }}
                                size={20}
                                fillColor={COLORS.primary}
                                iconStyle={{
                                  borderColor: COLORS.primary,
                                  borderRadius: 2,
                                }}
                                innerIconStyle={{
                                  borderWidth: 2,
                                  borderRadius: 2,
                                }}
                              />
                            </View>

                            <Text
                              className="text-xl"
                              style={{
                                fontFamily: extra.name
                                  ? "roboto-bold"
                                  : "roboto-medium",
                                color: extra.name
                                  ? COLORS.primary
                                  : COLORS.slate,
                              }}
                            >
                              K{extra.price}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
                <View className="flex-row items-center justify-between mb-5">
                  <Text
                    className="text-2xl"
                    style={{ fontFamily: "ubuntu-medium" }}
                  >
                    Total:
                  </Text>
                  <View
                    className="bg-red items-center justify-center"
                    style={{
                      padding: 3,
                      borderRadius: SIZES.radius,
                      width: buttonWidth,
                      height: height * 0.06,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "ubuntu-medium" }}
                      className="text-xl text-white"
                    >
                      ZMK {item.total_price}
                    </Text>
                  </View>
                </View>

                {/* Next Container */}
                <TouchableOpacity
                  className="flex-row items-center justify-center bg-primary mt-2 mb-2 p-2"
                  // onPress={handleUpdateCartItem}
                  style={{
                    borderRadius: SIZES.radius,
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text
                    className="ml-1 text-white text-2xl"
                    style={{ fontFamily: "ubuntu-medium" }}
                  >
                    UPDATE CART
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
      {/* End modal */}

      <View className="w-full flex-1">
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-start items-center w-[89%]">
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              className="w-[26%]"
              style={{ height: screenHeight * 0.08 }}
            >
              <Image
                source={{ uri: `${PRODUCTS_IMAGE_URI}${product_image}` }}
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
                    K{item.product_price.toLocaleString()}
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
                      K{item.total_price.toLocaleString()}
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
