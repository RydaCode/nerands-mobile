import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../../../constants/constants';
import { calculateDisplayDistance, estimateTime, getCourierIcon } from '../../../../utils/getDistance';

const TransporterDetails = ({ transporter, store, user, onCall }) => {

    console.log("TRANSPORTER", transporter)

    const pointA = {
      latitude: Number(store?.order_store_latitude),
      longitude: Number(store?.order_store_longitude),
    }; // Store

    const pointB = {
      latitude: Number(transporter.latitude),
      longitude: Number(transporter.longitude),
    }; // Transporter

    if (!transporter) return null;

    console.log("GOODUZ", store?.order_store_longitude)

    return (
      <View className="mt-8">
    {/* Store Details */}
        <View className="relative">
          <View className="w-full border pt-4 pb-1 px-2 rounded-md border-lavender ">
            <View className="px-1 absolute left-1 -top-5 bg-white rounded-full justify-center items-center p-1">
              <Text
                className="text-lg"
                style={{ fontFamily: "roboto-medium" }}
              >
                Transporter Details
              </Text>
            </View>

            <View className="w-full flex-row justify-between items-center">
              <TouchableOpacity className="w-[83%] flex-row justify-start items-center mb-3">
                <View
                  className="border-2 border-lavender rounded-full"
                  style={{ height: 55, width: 55 }}
                >
                  {/* <Image
                    source={{
                      uri: `${STORES_IMAGE_URI}${data?.items[0]?.store.store_profileimage}`,
                    }}
                    className="rounded-full h-full w-full"
                  /> */}
                </View>
                <View className="ml-2">
                  <Text
                    className="text-base"
                    style={{ fontFamily: "roboto-medium" }}
                  >
                    {user.first_name} {user.last_name}
                  </Text>
                  <Text
                    className="text-slate text-sm"
                    style={{
                      fontFamily: "roboto",
                      fontSize: SIZES.small,
                    }}
                  >
                    {user.phone_num}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[15%] items-center justify-center"
                onPress={() => makeCall(user.phone_num)}
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
                Mode: {transporter?.courier_type ?? 'unknown'}
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
                  {calculateDisplayDistance(pointA, pointB, transporter?.courier_type)} Away
                </Text>
              </View>
            </TouchableOpacity>
            <Text className='text-base mt-2'>ETA
              <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}> (Estimated Time of Arrival)</Text>
            </Text>
            <View className='bg-lavender mb-1' style={{height: 1}} />
            <View className="flex-row w-full justify-between bg-white">
              <View className="flex-row">
                {getCourierIcon(transporter?.courier_type, COLORS.black)}
                <Text className='text-sm text-slate ml-1' style={{fontFamily: 'roboto'}}>
                  {estimateTime(pointA, pointB, (transporter?.courier_type ?? 'unknown').toUpperCase())}
                </Text>
              </View>
            </View>
          </View>
      </View>
    </View>
  )
}

export default TransporterDetails;