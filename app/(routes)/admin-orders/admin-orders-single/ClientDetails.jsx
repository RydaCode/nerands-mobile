import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import { USER_IMAGE_URI } from '../../../../RequestMethods'
import { calculateDistance, makeCall } from '../../../../utils/getDistance'

const ClientDetails = ({ user_id, store_longitude, store_latitude }) => {

  const {data, isLoading, error, get} = useApi(
    `/users/user/external/${user_id}`
  );

  useEffect(() => {
    if (!user_id) return;
    get();
  }, [user_id]);

    if (!data) return;

    const pointA = {
      latitude: Number(store_latitude),
      longitude: Number(store_longitude),
    };

    const pointB = {
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };
    
    return (
        <View className="mt-6">
            {/* Store Details */}
                        <View className="relative">
                          <View className="w-full border pt-4 pb-1 px-2 rounded-md border-lavender ">
                            <View className="px-1 absolute left-1 -top-5 bg-white rounded-full justify-center items-center p-1">
                              <Text
                                className="text-lg"
                                style={{ fontFamily: "roboto-medium" }}
                              >
                                Client's Details
                              </Text>
                            </View>
            
                            <View className="w-full flex-row justify-between items-center">
                              <TouchableOpacity className="w-[83%] flex-row justify-start items-center mb-3">
                                {!data.profile_image ?
                                  <View className=''>
                                    <FontAwesome name="user-circle-o" size={52} color={COLORS.slate} />
                                  </View> :
                                  <View
                                    className="border-2 border-lavender justify-center items-center rounded-full"
                                    style={{ height: 55, width: 55 }}
                                  >
                                    <Image
                                      source={{
                                        uri: `${USER_IMAGE_URI}${data.profile_image}`,
                                      }}
                                      className="rounded-full h-full w-full"
                                    />
                                  </View>
                                }
                                <View className="ml-2">
                                  <Text
                                    className="text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                  >
                                    {data.first_name} {data.last_name}
                                  </Text>
                                  <Text
                                    className="text-slate text-sm"
                                    style={{
                                      fontFamily: "roboto",
                                      fontSize: SIZES.small,
                                    }}
                                  >
                                    {data.phone_num}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="w-[15%] items-center justify-center"
                                onPress={() => makeCall(data.phone_num)}
                              >
                                <View
                                  className="border border-lavender bg-[#DFF6E6] items-center justify-center rounded-full"
                                  style={{ height: 42, width: 42 }}
                                >
                                  <FontAwesome5
                                    name="phone"
                                    color={COLORS.green2}
                                    size={15}
                                  />
                                </View>
                              </TouchableOpacity>
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
                                  color={COLORS.green1}
                                />
                                <Text
                                  className="text-sm text-slate"
                                  style={{ fontFamily: "roboto" }}
                                >
                                  {calculateDistance(pointA, pointB)} away
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                    </View>
        </View>
    )
}

export default ClientDetails;