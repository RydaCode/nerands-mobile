import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS, SIZES } from '../../../../constants/constants'
import { makeCall } from '../../../../utils/getDistance'

const CustomTransporter = ({ trans_data }) => {
    
    return (
        <View className="my-10">
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
                            <View className=''>
                                <FontAwesome name="user-circle-o" size={52} color={COLORS.slate} />
                            </View>
                            <View className="ml-2">
                                <Text
                                    className="text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    {trans_data?.first_name} {trans_data?.last_name}
                                </Text>
                                <Text
                                    className="text-slate text-sm"
                                    style={{
                                        fontFamily: "roboto",
                                        fontSize: SIZES.small,
                                    }}
                                >
                                    {trans_data?.phone_number}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-[15%] items-center justify-center"
                            onPress={() => makeCall(trans_data?.phone_number)}
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
                </View>
            </View>
        </View>
    )
}

export default CustomTransporter;