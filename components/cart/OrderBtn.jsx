import { Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../constants/constants";

const OrderBtn = ({
  handlePlaceOrder,
  router,
  title,
  order_qty,
  order_total,
  disable,
}) => {
  return (
    <>
      <View
        className="flex-1 items-center justify-center flex-row absolute bottom-3"
        style={{ zIndex: 999 }}
      >
        <View className="flex-row justify-center w-[100%]">
          <TouchableOpacity
            // onPress={() => router.push('../preparing-order/')}
            disabled={disable}
            onPress={handlePlaceOrder}
            activeOpacity={0.5}
            className="mt-10 flex-row bg-primary justify-between items-center relative p-2"
            style={{
              borderRadius: SIZES.radius,
              width: 347,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <View
              className="p-2 items-center justify-center bg-white h-[35px] w-[35px]"
              style={{
                borderRadius: SIZES.round,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                className="text-primary"
                style={{ fontSize: 14, fontWeight: SIZES.h1 }}
              >
                {order_qty}
              </Text>
            </View>

            <View className="mr-16 flex-row justify-start items-center ml-20">
              <Text
                className="ml-2 text-white text-2xl"
                style={{ fontFamily: "ubuntu-medium", fontWeight: SIZES.h1 }}
              >
                {title}
              </Text>
            </View>
            <View
              className="py-2 items-center justify-center px-2 bg-white"
              style={{
                borderRadius: SIZES.radius,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                className="text-primary"
                style={{ fontSize: 13, fontWeight: SIZES.h1 }}
              >
                K{order_total}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default OrderBtn;
