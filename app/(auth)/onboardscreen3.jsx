import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/constants';
import { Carticons } from '../../constants/icons';

const OnboardScreen3 = () => {
    const router = useRouter();

    return (
        <SafeAreaView className='flex-1 bg-white px-5 justify-between'>
            <View style={{height: '75%'}} className="justify-center items-center">
                <View
                    className='w-full justify-center items-center p-2 mb-8'
                >
                    <View
                        style={{width: '70%', height: 60}}
                    >
                        <Image
                            className='w-full h-full'
                            source={Carticons.landing_screen2}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <Text
                    className="text-xl mb-4 text-center"
                    style={{ fontFamily: 'roboto-medium' }}
                >
                    All in one app built for your daily needs
                </Text>

                <View className='mt-4'>
                    {/* Item 1 */}
                    <View className="flex-row items-center mb-4">
                    <Feather name="shopping-cart" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black"
                        style={{ fontFamily: 'roboto' }}
                    >
                        Buy and sell products easily
                    </Text>
                    </View>

                    {/* Item 2 */}
                    <View className="flex-row items-center mb-4">
                    <Feather name="home" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black"
                        style={{ fontFamily: 'roboto' }}
                    >
                        Book hotels and lodges
                    </Text>
                    </View>

                    {/* Item 3 */}
                    <View className="flex-row items-center mb-4">
                    <Feather name="package" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black"
                        style={{ fontFamily: 'roboto' }}
                    >
                        Place custom orders
                    </Text>
                    </View>

                    {/* Item 4 */}
                    <View className="flex-row items-center mb-4">
                    <Feather name="truck" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black"
                        style={{ fontFamily: 'roboto' }}
                    >
                        Hire runners for errands and deliveries
                    </Text>
                    </View>

                    {/* Item 5 */}
                    <View className="flex-row items-center mb-4">
                    <Feather name="credit-card" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black"
                        style={{ fontFamily: 'roboto' }}
                    >
                        Buy bus tickets
                    </Text>
                    </View>

                    {/* Item 6 */}
                    <View className="flex-row items-start">
                    <Feather name="home" size={24} color="#000" />
                    <Text
                        className="ml-3 text-base text-black flex-1"
                        style={{ fontFamily: 'roboto', lineHeight: 20 }}
                    >
                        Find houses for rent or purchase, and list your own properties
                    </Text>
                    </View>
                </View>
            </View>

            {/* Bottom area */}
            <View className='w-full'>
                <View className="flex-row justify-center mb-4">
                    <View className="rounded-full mx-1"
                        style={{
                            height: 8, width: 8, backgroundColor: COLORS.lite
                        }}
                        />
                    <View className="rounded-full mx-1"
                        style={{
                            height: 8, width: 8, backgroundColor: COLORS.lite
                        }}
                        />
                    <View className="rounded-full mx-1"
                        style={{
                            height: 8, width: 14, backgroundColor: COLORS.primary
                        }}
                    />
                </View>

                <TouchableOpacity
                    className={`flex-row bg-primary py-3 rounded-lg justify-center items-center mb-4`}
                    onPress={() => router.push('/register')}
                >
                    <Text
                        className='text-white text-lg mr-2'
                        style={{ fontFamily: "roboto-medium" }}
                    >Get Started</Text>
                    <Feather name="arrow-right" size={18} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                    className={`py-3 rounded-lg justify-center items-center mb-8`}
                    onPress={() => router.push('../(tabs)/')}
                >
                    <Text
                        className='text-blue-500 text-base mr-2'
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        Browse without account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OnboardScreen3