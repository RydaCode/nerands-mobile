import { Entypo, Fontisto, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../../constants/constants";
import useApi from "../../hook/useApi";
import { useResponsive } from '../../hook/useResponsive';
import socket from "../../socket-io/socket";
import { formatText } from "../../utils/getInitials";
import EmptyState from "../EmptyState";
import agoTimeStamp from "../agoTimeStamp";

// Individual order display
const OrdersData = ({ order, router, user_id }) => {
  const statusColorMap = {
    pending: "bg-rose-700",
    accepted: "bg-violet-600",
    in_progress: "bg-indigo-600",
    completed: "bg-green2",
    cancelled: "bg-red",
  };


  const statusColors = {
      pending: COLORS.red,
      accepted: COLORS.green1,
      processing: COLORS.extra_blue,
      ready: COLORS.coral,
      delayed: COLORS.red,
      cancelled: COLORS.red,
      completed: COLORS.green2,
      in_transit: COLORS.purple,
      returned: COLORS.grey,
  };

  const {wp} = useResponsive();

  const statusColor = statusColorMap[order.store_order_status] || "bg-red";

  const orderTota = Number(order.order_total_price) + Number(order.delivery_fee);

  const dotClassName = `flex-row rounded-full ${statusColor}`;
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "../(routes)/user-orders/single-user-order/",
            params: {
              user_id: user_id,
              order_id: order.order_id,
              order_number: order.order_number,
              items_quantity: order.items_quantity,
              order_total_price: order.order_total_price,
              user_latitude: order.user_latitude,
              user_longitude: order.user_longitude,
              order_status: order.order_status,
              store_latitude: order.store_latitude,
              store_longitude: order.store_longitude,
              delivery_fee: order.delivery_fee,
              delivery_mode: order.delivery_mode,
              store_profileimage: order.store_profileimage,
              order_type: order.order_type
            },
          })
        }
        className="flex-row w-full justify-between items-cente border border-lavender rounded bg-white mb-6 p-1"
      >
        <View className="justify-center items-center w-full">
          <View className="flex-row justify-between items-center w-full">
            <View
              style={{
                height: wp(11),
                width: '14%',
                backgroundColor: COLORS.white,
              }}
              className="border rounded border-lavender justify-center items-center"
            >
              <Entypo size={29} name="box" color={statusColors[order?.store_order_status] || COLORS.grey} />
            </View>

            <View className="justify-center items-start" style={{width: '78%'}}>
              <Text className="text-base" style={{ fontFamily: "roboto-medium" }}>
                Order No: {order.order_number}
              </Text>
            </View>

            {/* <View
              className='rounded-full'
              style={{
                height: 13,
                width: 13,
                backgroundColor: statusColors[order?.store_order_status] || COLORS.grey,
              }}
            /> */}
          </View>


          <View className="w-full flex-row px-1 justify-between items-center">
            <View className="w-full">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base text-primary"
                  style={{ fontFamily: "roboto-medium" }}
                >
                  Total: K{orderTota.toLocaleString()}
                </Text>
                <Text
                  className="text-slate text-sm mx-2"
                  style={{ fontFamily: "roboto-medium" }}
                >
                  Qty: {order.items_quantity}
                </Text>
                
                <View
                  className="flex-row px-2 py-0.5 items-center bg-grey_bg justify-center rounded-sm"
                  style={{ width: "30%" }}
                >
                  <Text
                    className="text-green1 text-sm"
                    style={{ fontFamily: "roboto" }}
                  >
                    {order.order_type}
                  </Text>
                </View>

              </View>
              <View className='my-1' style={{height: 1, width: "100%", backgroundColor: COLORS.grey_bg}}/>
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-sm text-slate"
                  style={{ fontFamily: "roboto" }}
                >
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                <Text
                  className="text-sm text-slate mr-4"
                  style={{ fontFamily: "roboto" }}
                >
                  {' '} ({agoTimeStamp(order.created_at)})
                </Text>

                <View
                  className="flex-row px-4 py-0.5 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: statusColors[order?.store_order_status] || COLORS.grey,
                  }}
                >
                  <Text
                    className="text-white text-sm"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    {order.store_order_status === 'completed' ? 'Delivered' :
                    formatText(order.store_order_status)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
};

// Main component
const OrdersComponent = ({ title }) => {
  const {
    user_id,
    first_name,
    last_name,
    phone_num,
    email_add,
    user_type,
    gender,
    date_of_birth,
    country,
    province,
    profile_image,
  } = useSelector((state) => state.auth) || {};

  //   const { user_id } = useSelector((state) => state.auth) || {};
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { data, isLoading, error, get } = useApi();

  console.log("order.order_status", orders);

  const onEndReachedCalledDuringMomentum = useRef(false);
  // Fetch on mount
  useEffect(() => {
    if (!user_id) return;
    fetchInitialOrders();
  }, [user_id]);

  useEffect(() => {
      if (!user_id) return;

      socket.emit("join_user", user_id);

      const handleOrderUpdated = (data) => {

          setOrders(prev =>
              prev.map(order =>
                  order.order_id === data.order_id
                      ? {
                          ...order,
                          order_status: data.status
                      }
                      : order
              )
          );
      };

      socket.on("order_updated", handleOrderUpdated);

      return () => {
          socket.off("order_updated", handleOrderUpdated);
      };

  }, [user_id]);

  // Fetch page 1
  const fetchInitialOrders = async () => {
    try {
      setIsRefreshing(true);

      const res = await get(`/orders/get_orders/${user_id}?page=1&limit=10`);
      const payload = res?.data;

      const newData = Array.isArray(payload?.data) ? payload.data : [];

      setOrders(newData);
      setPage(1);

      if (payload?.total && payload?.limit) {
        setHasMore(1 < Math.ceil(payload.total / payload.limit));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreOrders = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const res = await get(
        `/orders/get_orders/${user_id}?page=${nextPage}&limit=10`
      );

      const payload = res?.data;
      const newOrders = Array.isArray(payload?.data) ? payload.data : [];

      if (newOrders.length === 0) {
        setHasMore(false);
        return;
      }

      setOrders(prev => [...prev, ...newOrders]);
      setPage(nextPage);

      if (payload?.total && payload?.limit) {
        setHasMore(nextPage < Math.ceil(payload.total / payload.limit));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Show loader while fetching
  if (!orders.length && isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-3">Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className="justify-center w-full items-center">
      {!user_id ? (
        <View className="w-full h-full justify-center items-center bg-white">
                    
          <Fontisto name="locked" size={30} color={COLORS.slate} />
          <Text className="text-base my-4 text-slate" style={{fontFamily: 'roboto-medium'}}>
              Please login to see your orders
          </Text>
          <TouchableOpacity
              style={{ width: "90%" }}
              className="bg-primary rounded elevation-md justify-center items-center py-2 mt-3"
              onPress={() => router.push("/(auth)/login")}
          >
              <Text
                  className="text-white text-2xl"
                  style={{ fontFamily: "ubuntu-medium" }}
              >
                  Login
              </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders || []}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          keyExtractor={(item) => `${item.order_id}`}
          renderItem={({ item }) => (
            <OrdersData order={item} router={router} user_id={user_id} />
          )}

          ListHeaderComponent={() => (
            <View className='my-4 justify-start items-center'>
              <Text>You have {orders.length} orders</Text>
            </View>
          )}

          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center relative">
              <View
                className="absolute bg-red justify-center items-center rounded-full"
                style={{ height: 27, width: 27 }}
              >
                <Text className="text-white text-sm">0</Text>
              </View>
              <EmptyState
                icon={
                  <Ionicons size={70} name="bag-outline" color={COLORS.slate} />
                }
                description="You have no orders"
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={fetchInitialOrders}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchInitialOrders}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}

          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              if (!loadingMore && hasMore) {
                loadMoreOrders();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }
          }}
          onEndReachedThreshold={0.5}

          ListFooterComponent={() => {
            if (loadingMore) {
              return (
                <View style={{ paddingVertical: 15 }}>
                  <ActivityIndicator size={30} color={COLORS.primary} />
                  <Text style={{ textAlign: "center", color: "gray", marginTop: 5 }}>
                    Loading more...
                  </Text>
                </View>
              );
            }
          }}
        />
      )}
    </View>
  );
};

export default OrdersComponent;
