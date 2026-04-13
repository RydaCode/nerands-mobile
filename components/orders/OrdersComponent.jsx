import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { COLORS, SIZES } from "../../constants/constants";
import useApi from "../../hook/useApi";
import EmptyState from "../EmptyState";

// Individual order display
const OrdersData = ({ order, router, user_id }) => {
  const statusColorMap = {
    pending: "bg-rose-700",
    accepted: "bg-violet-500",
    in_progress: "bg-indigo-500",
    completed: "bg-green2",
    cancelled: "bg-red",
  };

  const statusColor = statusColorMap[order.order_status] || "bg-red";

  // console.log(order)
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
              store_profileimage: order.store_profileimage
            },
          })
        }
        className="flex-row justify-between items-center"
      >
        <View className="flex-row justify-start items-center">
          <View
            style={{ borderRadius: SIZES.radius }}
            className="h-[65px] w-[26%] border-2 border-lavender justify-center items-center"
          >
            <Entypo size={40} name="box" color={COLORS.primary} />
          </View>
          <View className="w-[71.7%] flex-row ml-2 justify-between items-center">
            <View className="w-[90%]">
              <Text className="text-base" style={{ fontFamily: "roboto-medium" }}>
                Order No: {order.order_number}
              </Text>
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
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    {order.order_type === 1 ? "Foods" : "General"}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-sm text-slate"
                  style={{ fontFamily: "roboto-medium" }}
                >
                  Time: {order.order_time}
                </Text>
                <Text
                  className="text-sm text-slate mr-4"
                  style={{ fontFamily: "roboto-medium" }}
                >
                  | Date: {order.order_date}
                </Text>
              </View>
            </View>
            <View style={{ height: 13, width: 13 }} className={dotClassName} />
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

  const { data, isLoading, error, get } = useApi();

  // Fetch on mount
  useEffect(() => {
    if (!user_id) return;
    fetchInitialOrders();
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
    try {
      const nextPage = page + 1;

      const res = await get(
        `/orders/get_orders/${user_id}?page=${nextPage}&limit=10`,
      );

      const payload = res?.data;
      const newOrders = Array.isArray(payload?.data) ? payload.data : [];

      if (newOrders.length === 0) {
        setHasMore(false);
        return;
      }

      setOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);

      if (payload?.total && payload?.limit) {
        setHasMore(nextPage < Math.ceil(payload.total / payload.limit));
      }
    } catch (error) {
      console.error("Error loading more orders:", error);
    }
  };

  // Show loader while fetching
  if (isLoading || isRefreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-md mt-3 text-slate">Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className="justify-center items-center">
      {!user_id ? (
        <View className="w-full h-full justify-center items-center bg-white">
          <Text className="text-sm text-red">
            You are not logged in, Please login to see your orders
          </Text>
          <TouchableOpacity
            style={{ width: "90%" }}
            className="bg-primary rounded-md justify-center items-center py-2 mt-3"
            onPress={() => router.push("/sign-in")}
          >
            <Text
              className="text-white text-2xl"
              style={{ fontFamily: "ubuntu-medium" }}
            >
              Goto Login
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders || []}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => `${item.order_id}`}
          renderItem={({ item }) => (
            <>
              <OrdersData order={item} router={router} user_id={user_id} />
              <View className="w-full my-5 rounded-full bg-slate opacity-10 h-[1px]" />
            </>
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
          onEndReached={() => {
            if (hasMore && !isRefreshing && !isLoading) {
              loadMoreOrders();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default OrdersComponent;
