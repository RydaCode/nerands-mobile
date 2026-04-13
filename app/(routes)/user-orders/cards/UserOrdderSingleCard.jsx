import { FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { useSelector } from "react-redux";
import { COLORS, SIZES } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import {
  PRODUCTS_IMAGE_URI,
  STORES_IMAGE_URI,
} from "../../../../RequestMethods";
import { calculateDistance, estimateTime, makeCall } from "../../../../utils/getDistance";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";
import ExtraCheckbox from "../../../screens/StoreSingleScreen/ExtraCheckbox ";

const OrdersData = ({ order, router }) => {
  const { width, height } = useWindowDimensions();

  // Calculate dynamic sizes based on screen width/height
  const imageWidthModal = width * 0.25; // 29% of the screen width for the image
  const imageHeightModal = height * 0.1; // 12% of the screen height for the image
  const buttonWidth = width * 0.4; // 40% of the screen width for buttons

  const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] =
    useState(false);
  const extras = order.extras || [];

  //   console.log(order);

  return (
    <>
      {/* Start publish store modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={orderFullInfoModalVisible}
        onRequestClose={() => {
          setOrderFullInfoModalVisible(false);
        }}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            setOrderFullInfoModalVisible(false);
          }}
        />
        <View
          style={styles.centeredView}
          animation="slideInUp"
          iterationCount={1}
        >
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: "#fff",
                borderRadius: SIZES.radius,
                padding: 10,
                width: "100%",
                maxWidth: width,
              },
            ]}
          >
            {/* Container */}
            <View className="p-1 flex-row justify-between items-center">
              <View className="flex-row justify-center items-center">
                <FontAwesome6 name="edit" size={22} />
                <Text
                  className="text-2xl ml-1"
                  style={{ fontFamily: "ubuntu-medium" }}
                >
                  Product Details
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setOrderFullInfoModalVisible(false);
                }}
                className="h-[30px] w-[30px] rounded-full justify-center items-center bg-red"
              >
                <FontAwesome5 name="times" color={COLORS.white} size={15} />
              </Pressable>
            </View>
            <View
              className="bg-white w-full p-3"
              style={{
                maxWidth: width,
                borderRadius: SIZES.border, // Ensure it does not exceed the device width
              }}
            >
              {/* Product Image and Info */}
              <View className="flex-row mb-4">
                <View
                  className="relative"
                  style={{ width: imageWidthModal, height: imageHeightModal }}
                >
                  <Image
                    className="w-full h-full"
                    source={{
                      uri: `${PRODUCTS_IMAGE_URI}${order.product_images}`,
                    }}
                    style={{ borderRadius: SIZES.radius, resizeMode: "cover" }}
                  />
                </View>
                <View className="justify-center ml-[10px]">
                  <Text
                    className="text-lg"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    {order.product_name}
                  </Text>
                  <Text
                    className="text-red text-lg"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    ZMK {order.product_price}
                  </Text>
                  <Text
                    className="text-slate text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    From: {order.store_name}
                  </Text>
                </View>
              </View>

              <Text
                className="text-ms text-slate mb-4"
                style={{ fontFamily: "roboto-medium" }}
              >
                {order.desc}
              </Text>

              {/* Quantity Control */}
              <View className="flex-row justify-between items-center mb-6">
                <Text
                  className="text-xl"
                  style={{ fontFamily: "ubuntu-medium" }}
                >
                  Quantity
                </Text>
                <View className="flex-row items-center">
                  <Text
                    className="text-xl"
                    style={{ fontFamily: "maven-bold" }}
                  >
                    {order.quantity}
                  </Text>
                </View>
              </View>
              {/* Extras Section */}
              <ScrollView
                style={{ maxHeight: height * 0.3 }}
                showVericallScrollIndicator={false}
              >
                {order.chili_option && (
                  <View className="mb-3">
                    <Text
                      className="mb-2 font-semibold text-2xl"
                      style={{ fontFamily: "maven-medium" }}
                    >
                      Extras
                    </Text>
                    <ExtraCheckbox label="Chilli" price={0} checked={true} />
                  </View>
                )}
                {extras.length > 0 &&
                  extras.map((extra) => (
                    <ExtraCheckbox
                      checked={true}
                      key={extra.extra_id}
                      label={extra.extra_name}
                      price={extra.extra_price}
                    />
                  ))}
              </ScrollView>

              {/* Total Amount */}
              <View className="flex-row items-center justify-between mb-5">
                <Text
                  className="text-2xl"
                  style={{ fontFamily: "ubuntu-medium" }}
                >
                  Total:
                </Text>
                <View
                  className="bg-primary items-center justify-center P-[5px]"
                  style={{
                    borderRadius: SIZES.radius,
                    width: buttonWidth,
                    height: height * 0.06,
                  }}
                >
                  <Text
                    style={{ fontFamily: "ubuntu-medium" }}
                    className="text-2xl text-white"
                  >
                    ZMK {order.total_price}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Start public modal */}

      <TouchableOpacity
        onPress={() => setOrderFullInfoModalVisible(true)}
        className="flex-row justify-between items-center"
      >
        <View className="flex-row justify-start items-center">
          <Image
            source={{ uri: `${PRODUCTS_IMAGE_URI}${order.product_images}` }}
            style={{ borderRadius: SIZES.radius }}
            className="h-[65px] w-[26%]"
          />
          <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
            <View className="w-full">
              <View className="">
                <Text
                  className="text-sm"
                  style={{ fontFamily: "roboto-medium" }}
                >
                  {order.product_name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    className="text-sm text-slate"
                    style={{ fontFamily: "roboto" }}
                  >
                    Price: K{order.product_price}
                  </Text>
                </View>
                <View className="flex-row items-center justify-start mr-4">
                  <Text
                    className="text-slate text-sm"
                    style={{ fontFamily: "roboto" }}
                  >
                    Qty:{order.quantity}
                  </Text>
                </View>
                <View className="flex-row items-center justify-start mr-4">
                  <Text
                    className="text-primary text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Total: K{order.order_total_price}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center justify-start mr-4">
                  <Text
                    numberOfLines={1}
                    className="text-grey text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    {order.desc}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const UserOrdderSingleCard = ({ params }) => {
  const user_id = params.user_id;
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const buttonWidth = width * 0.4; // 40% of the screen width for buttons
  const {
    latitude,
    longitude,
    displayCurrentLocation,
    locationServicesEnabled,
  } = useSelector((state) => state.location);

  const { data, isLoading, error, get, del } = useApi(
    `/orders/${params.order_id}`,
  );

  console.log("DATAAA", params)

  useEffect(() => {
    get();
  }, []);

  // const {data:gettransporter, isLoading:transporterloading, error:transportererrors, refetch:transporterrefetch} = useApi(`/deliveryman/transporter/${user_id}`);

  const origine_lat = parseFloat(latitude);
  const origine_lng = parseFloat(longitude);
  const destination_lat = parseFloat(data?.items[0]?.store.store_latitude);
  const destination_lng = parseFloat(data?.items[0]?.store.store_longitude);

  const directions = [
    { latitude: origine_lat, longitude: origine_lng },
    { latitude: destination_lat, longitude: destination_lng },
  ];

  const pointA = directions[0]; // Transporter
  const pointB = directions[1]; // Store

  const origin = {
        latitude: origine_lat,
        longitude: origine_lng
    };

    const destination = {
        latitude: destination_lat,
        longitude: destination_lng
    };

  // const tansproter_lat = parseFloat(gettransporter?.latitude);
  // const tansproter_lng = parseFloat(gettransporter?.longitude);

  // const directions_trans = [
  //     {latitude: origine_lat, longitude: origine_lng},
  //     {latitude: -15.01245, longitude: 28.23158}
  // ]

  // const calculateDistanceTrans = (pointAT, pointBT) => {
  //     const distanceKm = haversine(pointAT, pointBT) / 1000; // Convert meters to km
  //     return distanceKm < 1 ? `${Math.round(distanceKm * 1000) || ''} meters` : `${distanceKm.toFixed(2) || 0}Km`;
  // };

  // const pointAT = directions_trans[0]; // Transporter
  // const pointBT = directions_trans[1]; // Store

  // const estimateTimeTrans = (pointAT, pointBT, averageSpeedKmh = 40) => {
  //     const distanceKm = haversine(pointAT, pointBT) / 1000;
  //     const timeHours = distanceKm / averageSpeedKmh;
  //     const totalMinutes = Math.ceil(timeHours * 60);

  //     const hours = Math.floor(totalMinutes / 60);
  //     const minutes = totalMinutes % 60;

  //     if (hours > 0) {
  //       return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  //     } else {
  //       return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  //     }
  // };

  const { data:delteOrder, error:deleteOrderError, isLoading:deleteOrderLoading, del:deleteOrderData } = useApi(
    `/orders/delete/${params.order_id}`,
  );

  // console.log("DELIVERY FEE")

  const deleteOrder = async () => {
    if (!params.order_id) {
      toast.error('Missing order ID');
      return;
    }

    try {
      await deleteOrderData();
      toast.success('Order removed successfully');
    } catch (error) {
      toast.error('Failed to delete this order');
    }
  };

  if (deleteOrderLoading) return <LoadingIndicator loading_text='Removing order...'/>;
  if (isLoading) return <LoadingIndicator loading_text='Loading order items...'/>;

  const grandTota = Number(params.order_total_price) + Number(params.delivery_fee);

  return (
    <View className="px-4">
      <FlatList
        data={data?.items || []} // Use the nested items array
        keyExtractor={(item, index) =>
          item.order_item_id || `${data.order_id}-${item.product_id}-${index}`
        } // Use unique order_item_id
        renderItem={({ item }) => (
          <View>
            <OrdersData order={item} router={router} />
            <View className="w-full my-4 rounded-full bg-slate opacity-10 h-[1px]" />
          </View>
        )}
        // Place all static UI elements inside ListHeaderComponent
        ListHeaderComponent={() => (
          <View className="flex-row justify-between items-center my-6">
            <Text
              className="mt-1 text-base"
              style={{ fontFamily: "roboto-medium" }}
            >
              Order No: {params.order_number}
            </Text>
            <View className="flex-row justify-start items-center py-[1px] px-2 rounded-full bg-[#F3F4F8]">
              <View className="rounded-full bg-red border-1 border-red mr-1 h-[10px] w-[10px]" />
              <Text
                className="text-red"
                style={{ fontFamily: "roboto-medium" }}
              >
                Pending
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <>
            <View className="mt-4 mb-2 w-full flex-row justify-center items-center">
              <Text
                className="text-base text-primary"
                style={{ fontFamily: "roboto-medium" }}
              >
                Order Total: K{params.order_total_price}
              </Text>
              <Text className='text-2xl mx-4'>|</Text>
              <Text
                className="text-base text-green1"
                style={{ fontFamily: "roboto-medium" }}
              >
                Delivery Fee: K{Number(params.delivery_fee)}
              </Text>
            </View>
            <View className="mt-4 mb-8 w-full flex-row justify-center items-center">
              <Text
                className="text-2xl"
                style={{ fontFamily: "ubuntu-medium" }}
              >
                Grand Total:
              </Text>
              <View
                className="bg-red items-center ml-2 justify-center"
                style={{
                  padding: 5,
                  borderRadius: SIZES.radius,
                  width: buttonWidth,
                  height: height * 0.06,
                }}
              >
                <Text
                  style={{ fontFamily: "ubuntu-medium" }}
                  className="text-2xl text-white"
                >
                  K{grandTota}
                </Text>
              </View>
            </View>

            {/* Store Details */}
            <View className="relative">
              <View className="w-full border pt-4 pb-1 px-2 rounded-md border-lavender ">
                <View className="px-1 absolute left-1 -top-5 bg-white rounded-full justify-center items-center p-1">
                  <Text
                    className="text-lg"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Store Details
                  </Text>
                </View>

                <View className="w-full flex-row justify-between items-center">
                  <TouchableOpacity className="w-[83%] flex-row justify-start items-center mb-3">
                    <View
                      className="border-2 border-lavender rounded-full"
                      style={{ height: 55, width: 55 }}
                    >
                      <Image
                        source={{
                          uri: `${STORES_IMAGE_URI}${params.store_profileimage}`,
                        }}
                        className="rounded-full h-full w-full"
                      />
                    </View>
                    <View className="ml-2">
                      <Text
                        className="text-base"
                        style={{ fontFamily: "roboto-medium" }}
                      >
                        {data?.items[0]?.store.store_name}
                      </Text>
                      <Text
                        className="text-slate text-sm"
                        style={{
                          fontFamily: "roboto",
                          fontSize: SIZES.small,
                        }}
                      >
                        {data?.items[0]?.store.store_phone_num}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-[15%] items-center justify-center"
                    onPress={() => makeCall(data?.items[0]?.store.store_phone_num)}
                  >
                    <View
                      className="border border-lavender bg-grey_bg items-center justify-center rounded-full"
                      style={{ height: 47, width: 47 }}
                    >
                      <FontAwesome5
                        name="phone"
                        color={COLORS.green2}
                        size={15}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row bg-grey_bg px-2 mb-3 rounded-full items-center">
                  {/* <FontAwesome5
                    name="store-alt"
                    size={10}
                    color={COLORS.primary}
                  /> */}
                  <Text
                    className="text-sm text-slate ml-0.5"
                    style={{ fontFamily: "roboto" }}
                  >
                    Category: {data?.items[0]?.store.store_category}
                  </Text>
                </View>
                <TouchableOpacity
                  // onPress={() => router.push({pathname: '../maps/user-store-order-map', params: {
                  //     store_latitude:data[0]?.store_latitude,
                  //     store_longitude:data[0]?.store_longitude,
                  //     store_name: data[0]?.store_name,
                  //     store_profileImage: data[0]?.store_profileImage,
                  //     store_phone_num: data[0]?.store_phone_num
                  // }})}
                  className="flex-row rounded-full w-full justify-between items-center"
                >
                  <View className="flex-row bg-white rounded-full w-[80%] items-center">
                    <Ionicons
                      name="location-sharp"
                      size={15}
                      color={COLORS.primary}
                    />
                    <Text
                      className="text-sm text-slate"
                      style={{ fontFamily: "roboto" }}
                    >
                      {calculateDistance(origin, destination)} Away
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text className='text-base mt-2'>ETA
                  <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}> (Estimated Time of Arrival)</Text>
                </Text>
                <View className='bg-lavender mb-1' style={{height: 1}} />
                <View className="flex-row w-full justify-between bg-white">
                  <View className="flex-row">
                    <FontAwesome5 name="walking" size={12} color={COLORS.black} />
                    <Text className='text-sm text-slate ml-1' style={{fontFamily: 'roboto'}}>
                      {estimateTime(origin, destination, 'FOOT')}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <MaterialCommunityIcons name="bike-fast" size={12} color={COLORS.black} />
                    <Text className='text-sm text-slate ml-1' style={{fontFamily: 'roboto'}}>
                      {estimateTime(origin, destination, 'BIKE')}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <FontAwesome6 name="motorcycle" size={12} color={COLORS.black} />
                    <Text className='text-sm text-slate ml-1' style={{fontFamily: 'roboto'}}>
                      {estimateTime(origin, destination, params.delivery_mode)}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Ionicons name="car-sport" size={12} color={COLORS.black} />
                    <Text className='text-sm text-slate ml-1' style={{fontFamily: 'roboto'}}>
                      {estimateTime(origin, destination, 'MOTOR-CAR')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Transporter Details */}
            <View className="relative mt-10">
              <View className="w-full border pt-4 pb-1 px-2 rounded-md border-lavender ">
                <View className="px-1 absolute left-1 -top-5 bg-white rounded-full justify-center items-center p-1">
                  <Text
                    className="text-lg"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Tranporter Details
                  </Text>
                </View>

                <View className="w-full flex-row justify-between items-center">
                  <TouchableOpacity className="w-[83%] flex-row justify-start items-center mb-3">
                    <View
                      className="border-2 border-lavender rounded-full"
                      style={{ height: 55, width: 55 }}
                    >
                      <Image
                        source={{
                          uri: `${STORES_IMAGE_URI}${data?.items[0]?.store.store_profileimage}`,
                        }}
                        className="rounded-full h-full w-full"
                      />
                    </View>
                    <View className="ml-2">
                      <Text
                        className="text-base"
                        style={{ fontFamily: "roboto-medium" }}
                      >
                        {data?.items[0]?.store.store_name}
                      </Text>
                      <Text
                        className="text-slate text-sm"
                        style={{
                          fontFamily: "roboto",
                          fontSize: SIZES.small,
                        }}
                      >
                        {data?.items[0]?.store.store_phone_num}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-[15%] items-center justify-center"
                    onPress={() => makeCall(data?.items[0]?.store.store_phone_num)}
                  >
                    <View
                      className="border border-lavender bg-grey_bg items-center justify-center rounded-full"
                      style={{ height: 47, width: 47 }}
                    >
                      <FontAwesome5
                        name="phone"
                        color={COLORS.green2}
                        size={15}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row bg-grey_bg px-2 mb-3 rounded-full items-center">
                  {/* <FontAwesome5
                    name="store-alt"
                    size={10}
                    color={COLORS.primary}
                  /> */}
                  <Text
                    className="text-sm text-slate ml-0.5"
                    style={{ fontFamily: "roboto" }}
                  >
                    Transporter Type: Bike
                  </Text>
                </View>
                <TouchableOpacity
                  // onPress={() => router.push({pathname: '../maps/user-store-order-map', params: {
                  //     store_latitude:data[0]?.store_latitude,
                  //     store_longitude:data[0]?.store_longitude,
                  //     store_name: data[0]?.store_name,
                  //     store_profileImage: data[0]?.store_profileImage,
                  //     store_phone_num: data[0]?.store_phone_num
                  // }})}
                  className="flex-row rounded-full w-full justify-between items-center"
                >
                  <View className="flex-row bg-white rounded-full w-[80%] items-center">
                    <Ionicons
                      name="location-sharp"
                      size={15}
                      color={COLORS.primary}
                    />
                    <Text
                      className="text-sm text-slate"
                      style={{ fontFamily: "roboto" }}
                    >
                      {calculateDistance(origin, destination)} Away
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className='bg-lavender mt-2' style={{height: 1}} />
                <View className="flex-row w-full items-center bg-white">
                  <View className="">

                    <Text className='text-sm mt-2 text-slate'>ETA
                      <Text className='text-sm' style={{fontFamily: 'roboto'}}> (Estimated Time of Arrival): {estimateTime(origin, destination, 'FOOT')}
                      </Text>
                    </Text>

                    {data?.items[0]?.completed_at == null ? <></> :
                      <Text className='text-sm mt-2 text-green2'>TA
                        <Text className='text-sm' style={{fontFamily: 'roboto'}}>
                          (Time Arrived): {data?.items[0]?.completed_at}
                        </Text>
                      </Text>
                    }
                  </View>
                </View>
              </View>
            </View>
            
            {/* Remove Order Button */}
            <View className="w-full flex-row justify-between items-center my-6">
                <TouchableOpacity
                  className="w-full bg-red elevation-md rounded-md py-4 justify-center items-center"
                  onPress={() => deleteOrder()}
                >
                  <Text
                    className="text-white text-2xl"
                    style={{ fontFamily: "ubuntu-medium" }}
                  >
                    Remove Order
                  </Text>
                </TouchableOpacity>
            </View>
          </>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>No items available.</Text>
          </View>
        }
        // Improve performance by disabling scroll indicator and enabling windowing
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      />
    </View>
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

export default UserOrdderSingleCard;