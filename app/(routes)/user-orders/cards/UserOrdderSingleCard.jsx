import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../../../components/EmptyState";
import { COLORS, SIZES } from "../../../../constants/constants";
import useApi from "../../../../hook/useApi";
import {
  PRODUCTS_IMAGE_URI
} from "../../../../RequestMethods";
import { toast } from "../../../../utils/toast";
import LoadingIndicator from "../../../LoadingIndicator";

const OrdersData = ({ order, router, store_name, order_type }) => {
  const { width, height } = useWindowDimensions();

  // Calculate dynamic sizes based on screen width/height
  const imageWidthModal = width * 0.25; // 29% of the screen width for the image
  const imageHeightModal = height * 0.1; // 12% of the screen height for the image
  const buttonWidth = width * 0.4; // 40% of the screen width for buttons
  const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);

  const variantsArray = Object.values(order.variants || {});
  const extras = order.extras || [];

  const variantsTotal = variantsArray.reduce((total, item) => {
      // FOOD VARIANTS
      if (item.price) {
          return total + Number(item.price || 0);
      }

      // GENERAL VARIANTS
      if (item.options) {
          const optionsTotal = item.options.reduce(
              (sum, option) => sum + Number(option.price || 0),
              0
          );
          return total + optionsTotal;
      }

      return total;
  }, 0);

  const extrasTotal = extras.reduce(
      (sum, extra) => sum + Number(extra.extra_price || 0), 0
  );

  const basePrice =
      variantsTotal > 0
          ? variantsTotal
          : Number((order.final_price * order.quantity) || 0);

  const finalProductPrice = basePrice + extrasTotal;

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
            style={[
              styles.modalView,
              {
                backgroundColor: "#fff",
                maxHeight: '80%',
                width: "100%",
                paddingBottom: 40
              },
            ]}
          >
            <ScrollView
                showVericallScrollIndicator={false}
            >
            {/* Container */}
            <View className="p-3 flex-row justify-between items-center">
              <View className="flex-row justify-center items-center">
                <FontAwesome6 name="edit" size={22} />
                <Text
                  className="text-2xl ml-1"
                  style={{ fontFamily: "maven-medium" }}
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
                      uri: `${PRODUCTS_IMAGE_URI}${order.images?.[0]}`,
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
                    K{basePrice}
                  </Text>
                  
                  <Text
                    className="text-slate text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    From: {store_name}
                  </Text>
                </View>
              </View>

              <Text
                className="text-ms text-slate mb-4"
                style={{ fontFamily: "roboto-medium" }}
              >
                {order.notes}
              </Text>

              {/* Quantity Control */}
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-2xl"
                  style={{ fontFamily: "ubuntu-medium" }}
                >
                  Qty
                </Text>
                <View className="flex-row items-center">
                  <Text
                    className="text-2xl"
                    style={{ fontFamily: "ubuntu-medium" }}
                  >
                    {order.quantity}
                  </Text>
                </View>
              </View>
              <View style={{height: 1}} className='w-full bg-lavender my-6'/>
              {/* Variants Section */}
                {variantsArray?.length > 0 && (
                  <>
                    <View className='mb-1'>
                      <Text
                        className='text-2xl'
                        style={{fontFamily: 'ubuntu-medium'}}
                      >Variants</Text>
                    </View>
                  </>
                )}
                  {order_type === 'Food' ? (
                    variantsArray.map((item) => (
                      <View
                        key={item.id}
                          className="flex-row justify-between items-center mb-8"
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons
                              name="checkbox-marked"
                              size={27}
                              color={COLORS.primary}
                            />

                            <Text
                              style={{
                                marginLeft: 4,
                                fontSize: 14,
                                fontFamily: 'roboto-medium',
                                color: COLORS.slate
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                          <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 14 }}>
                              K{item.price}
                            </Text>
                        </View>
                    ))
                  ) : order_type === 'General' ? (
                    variantsArray?.length > 0 &&
                    variantsArray?.map((group) => (
                      <View key={group.id} className="mb-4">
                        <Text style={{ fontFamily: 'roboto-bold' }}>
                          {group.group_name}
                        </Text>

                        {group.options?.map((option) => (
                          <View
                            key={option.option_id}
                            className="flex-row justify-between items-center"
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialCommunityIcons
                                name="checkbox-marked"
                                size={27}
                                color={COLORS.primary}
                              />

                              <Text
                                style={{
                                  marginLeft: 4,
                                  fontSize: 15,
                                  fontFamily: 'roboto-medium',
                                  color: COLORS.slate
                                }}
                              >
                                {option.name}
                              </Text>
                            </View>

                            {option.price > 0 && (
                              <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 17 }}>
                                K{option.price}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    ))
                  ) : (
                    <></>
                  )}
                  
                {extras.length > 0 &&
                  <>
                    <View className='mb-1'>
                      <Text
                        className='text-2xl'
                        style={{fontFamily: 'ubuntu-medium'}}
                      >Extras</Text>
                    </View>
                  
                  {extras.map((extra) => (
                    <View
                        key={extra.extra_id}
                        className="flex-row justify-between items-center"
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MaterialCommunityIcons
                            name="checkbox-marked"
                            size={27}
                            color={COLORS.primary}
                          />

                          <Text
                            style={{
                              marginLeft: 4,
                              fontSize: 14,
                              fontFamily: 'roboto-medium',
                              color: COLORS.slate
                            }}
                          >
                            {extra.extra_name}
                          </Text>
                        </View>

                        <Text style={{ color: COLORS.primary, fontFamily: 'roboto-medium', fontSize: 14 }}>
                          K{extra.extra_price}
                        </Text>
                      </View>
                ))}
                </>
                }

              {/* Total Amount */}
              <View className="flex-row items-center justify-between my-4">
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
                    K{finalProductPrice * order.quantity}
                  </Text>
                </View>
              </View>
            </View>
            </ScrollView>
          </View>
      </Modal>
      {/* Start public modal */}

      <TouchableOpacity
        onPress={() => setOrderFullInfoModalVisible(true)}
        className="flex-row justify-between items-center"
      >
        <View className="flex-row justify-start items-center">
          <Image
            source={{ uri: `${PRODUCTS_IMAGE_URI}${order.images?.[0]}` }}
            style={{ borderRadius: SIZES.radius }}
            className="h-[65px] w-[26%]"
          />
          <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
            <View className="w-full">
              <View className="">
                <Text
                  className="text-lg"
                  style={{ fontFamily: "roboto-medium" }}
                  numberOfLines={1}
                >
                  {order.product_name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    className="text-sm text-slate"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Price: K{order.total_price}
                  </Text>
                </View>
                <View className="flex-row items-center justify-start mr-4">
                  <Text
                    className="text-slate text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Qty:{order.quantity}
                  </Text>
                </View>
                <View className="flex-row items-center justify-start mr-4">
                  <Text
                    className="text-green2 text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    Total: K{order.total_price}
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
      <View className='bg-grey_bg w-full my-5' style={{height: 1}}/>
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

  const { data, isLoading, error, get } = useApi(`/orders/${params.order_id}`);

  useEffect(() => {
    get();
  }, []);

  const { data:delteOrder, error:deleteOrderError, isLoading:deleteOrderLoading, del:deleteOrderData } = useApi(
    `/orders/delete/${params.order_id}`,
  );

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

  const sections = (data?.stores || []).map(store => {
    const items = store.items || [];

    const storeTotal = items.reduce((sum, item) => {
      return sum + Number(item.total_price || 0);
    }, 0);

    const itemCount = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    return {
      title: store.store_name,
      store_id: store.store_id,
      store_phone: store.store_phone,
      status: store.status,
      shipping_fee: store.shipping_fee,
      runner_fee: store.runner_fee,
      discount_amount: store.discount_amount,
      runner_active: store.runner_active,
      shipping_mode: store.shipping_mode,
      store_latitude: store.store_latitude,
      store_longitude: store.store_longitude,
      data: items,
      total: storeTotal,
      itemCount: itemCount
    };
  });

  const orderSubtotal = (data?.stores || []).reduce((storeSum, store) => {
    const items = store.items || [];

    const storeTotal = items.reduce((itemSum, item) => {
      return itemSum + Number(item.total_price || 0);
    }, 0);

    return storeSum + storeTotal;
  }, 0);

  const stores = data?.stores || [];

  // number of stores
  const storeCount = stores.length;

  // total items across all stores
  const totalItems = stores.reduce((storeSum, store) => {
    const items = store.items || [];

    return storeSum + items.reduce((itemSum, item) => {
      return itemSum + Number(item.quantity || 0);
    }, 0);
  }, 0);

  const shippingFee =
    data?.stores?.[0]?.shipping_fee ?? 0;

  const runnerFee =
    data?.stores?.[0]?.runner_fee ?? 0;

  const runnerActiveFee =
    data?.stores?.[0]?.runner_active ?? 0;

  const grandTotal =
    Number(orderSubtotal || 0) + Number(runnerFee || 0) + Number(shippingFee || 0);


  const statusColorMap = {
    pending: "bg-rose-700",
    accepted: "bg-violet-500",
    in_progress: "bg-indigo-500",
    completed: "bg-green2",
    cancelled: "bg-red",
  };

  const orderTypeColorMap = {
    Food: "bg-coral",
    Normal: "bg-green1",
    Local_Market: "bg-indigo-500",
  };

  const statusColors = {
    pending: COLORS.red,
    accepted: COLORS.green2,
    processing: COLORS.extra_blue,
    ready: COLORS.coral,
    delayed: COLORS.red,
    cancelled: COLORS.red,
    completed: COLORS.green1,
    in_transit: COLORS.purple,
    returned: COLORS.grey
};

  const statusColor = statusColorMap[params.order_status] || "bg-red";
  const typeStatusColor = orderTypeColorMap[params.order_type] || "bg-green2";

  const orderType = `${typeStatusColor} py-2 rounded justify-center items-center`;
  const orderStatusClassName = `${statusColor} py-2 rounded justify-center items-center`;

  return (
    <View className="px-4">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.order_item_id}
        renderSectionHeader={({ section }) => (
            <View className="flex-row bg-gray-100 p-1 mb-1 justify-between items-center">
                <Text
                    className="text-lg"
                    style={{ fontFamily: 'roboto-bold' }}
                >
                  {section.title}
                </Text>

                <Text className="text-sm text-slate">
                    {section.itemCount} item{section.itemCount !== 1 ? 's' : ''}
                </Text>
            </View>
        )}

        renderItem={({ item, section }) => (
          <OrdersData
            order={item}
            router={router}
            store_name={section.title}
            order_type={params.order_type}
          />
        )}

        renderSectionFooter={({ section }) => (
            <View className="flex-row justify-between" style={{marginTop: -12, marginBottom: 40}}>
              <View
                    className='rounded py-1 justify-center items-center'
                    style={{
                      width: buttonWidth,
                      backgroundColor: statusColors[section?.status] || COLORS.grey
                    }}
                >
                    <Text
                        className="text-lg text-white"
                        style={{ fontFamily: 'roboto-medium' }}
                    >
                        {section.status?.charAt(0).toUpperCase() + section.status?.slice(1)}
                    </Text>
                </View>
                <View
                    className='bg-grey_bg rounded py-1 justify-center items-center'
                    style={{ width: buttonWidth }}
                >
                    <Text
                        className="text-lg text-primary"
                        style={{ fontFamily: 'ubuntu-medium' }}
                    >
                        Total: K{section.total.toLocaleString()}
                    </Text>
                </View>
            </View>
        )}

        ListHeaderComponent={() => (
          <View className='mt-6'>
            <View className='w-full flex-row justify-between'>
              <View
                className={orderType}
                style={{width: '48%'}}
              >
                <Text
                  className='text-base text-white'
                  style={{fontFamily: 'roboto-medium'}}
                >
                  {params.order_type.charAt(0).toUpperCase() + params.order_type.slice(1)}
                </Text>
              </View>
              {/* <View
                className={orderStatusClassName}
                style={{width: '48%'}}
              >
                <Text
                  className='text-base text-white'
                  style={{fontFamily: 'roboto-medium'}}
                >Status: {params.order_status.charAt(0).toUpperCase() + params.order_status.slice(1)}</Text>
              </View> */}
            </View>
              <View className='w-full mt-3 mb-5 items-center justify-start bg-white rounded py-1'>
                  <Text className='text-black text-base' style={{fontFamily: 'roboto-medium'}}>
                      You have {totalItems} item{totalItems !== 1 ? 's' : ''} from {storeCount} store{storeCount !== 1 ? 's' : ''}
                  </Text>
              </View>
            </View>
        )}

        ListFooterComponent={({section}) => (
          <View className='mb-10'>
            {runnerActiveFee === true && (
              <View style={{
                padding: 10,
                backgroundColor: '#e8f5e9',
                borderRadius: 8,
                borderLeftWidth: 1,
                borderLeftColor: '#4caf50'
              }}>
                <Text className='text-red' style={{ fontSize: 16, fontFamily: 'roboto-medium', marginBottom: 4 }}>
                  Runner Active
                </Text>

                <Text className='text-sm' style={{ fontSize: 14, color: '#555', textAlign: 'justify' }}>
                  This order has an active runner. This means a runner collects all items
                  from the respective stores and bundle them into one delivery.
                </Text>
              </View>
            )}
            <View className='mt-4 justify-center items-center' style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Text>
                <Text className='text-green2 mt-2' style={{fontFamily: 'roboto-medium'}}>
                  Order Total: <Text className='text-red'>K{Number(orderSubtotal).toLocaleString()}</Text>
                </Text>
              </Text>
              <View className='flex-row justify-center items-center mt-2'>
              <Text className='text-green2' style={{fontFamily: 'roboto-medium'}}>
                Runner Fee: <Text className='text-red'>K{runnerFee}</Text>
              </Text>

              <Text style={{marginHorizontal: 10}}>|</Text>

              <Text className='text-green2' style={{fontFamily: 'roboto-medium'}}>
                Delivery Fee: <Text className='text-red'>K{shippingFee}</Text>
              </Text>
            </View>
            </View>
            <View className='mt-4 justify-center items-center' style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Text className='text-2xl text-primary' style={{fontFamily: 'maven-medium'}}>
                Grand Total: K{Number(grandTotal).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
            <View style={{width: '100%', marginTop: 80}}
                className="h-full w-full justify-center items-center">
                <View className="flex-1 justify-center items-center relative">
                    <EmptyState
                        icon={<FontAwesome5 name='shopping-cart' size={40} color={COLORS.slate}/>}
                        description="Your general cart is empty"
                    />
                </View>

                <TouchableOpacity
                    className='bg-primary justify-center items-center elevation-sm border border-white rounded py-3'
                    style={{width: '100%'}}
                    // onPress={() => router.push('../(tabs)/')}
                >
                    <Text className='text-lg text-white' style={{fontFamily: 'roboto-medium'}}>
                        Go shopping
                    </Text>
                </TouchableOpacity>
            </View>
        )}
        showsVerticalScrollIndicator={false}
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