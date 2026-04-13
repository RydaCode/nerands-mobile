import { Text, TouchableOpacity, View } from 'react-native'

const CreateTransporterAcc = ({router}) => {
    return (
        <View className="flex-1 justify-center items-center px-2 w-full">
                    <View className="p-4 bg-white rounded-lg shadow-md">
                        <Text
                            className="text-base text-red text-center"
                            style={{ fontFamily: 'roboto-medium' }}
                        >❕You're not currently registered as a transporter. Press the
                            button below to sign up now.
                        </Text>
                        <Text
                            style={{ fontFamily: 'roboto-medium' }}
                            className="text-xl text-green-700 text-center my-2"
                        >
                            🚚 Become a Transporter & Enjoy These Benefits! 🚀
                        </Text>

                        <View className='w-full'>
                            <View className='mb-2'>
                                <Text className="text-base text-gray-700">
                                    ✅ <Text className="" style={{fontFamily:'roboto-bold'}}>Earn More</Text> – Get paid for every trip you complete.{"\n"}
                                </Text>
                            </View>
                            <View className='mb-2'>
                                <Text className="text-base text-gray-700">
                                    ✅ <Text style={{fontFamily:'roboto-bold'}}>Flexible Work</Text> – Choose your own working hours.{"\n"}
                                </Text>
                            </View>
                            <View className='mb-2'>
                                <Text className="text-base text-gray-700">
                                    ✅ <Text style={{fontFamily:'roboto-bold'}}>More Opportunities</Text> – Get assigned trips based on your availability.{"\n"}
                                </Text>
                            </View>
                            <View className='mb-2'>
                                <Text className="text-base text-gray-700">
                                    ✅ <Text style={{fontFamily:'roboto-bold'}}>Bonuses & Incentives</Text> – Earn extra rewards for completing more trips.{"\n"}
                                </Text>
                            </View>
                            <View className='mb-2'>
                                <Text className="text-base text-gray-700">
                                    ✅ <Text style={{fontFamily:'roboto-bold'}}>24/7 Support</Text> – Get assistance whenever you need it.
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="bg-green-600 mt-4 py-4 rounded-md items-center"
                            onPress={() =>
                                router.push({ pathname: '../create-transporter-ac' })
                            }
                        >
                            <Text
                                className="text-white text-2xl"
                                style={{ fontFamily: 'maven-medium' }}
                            >
                                Register Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
    )
}

export default CreateTransporterAcc