import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/constants';
import { Carticons } from '../../constants/icons';

const OnboardScreen2 = () => {
    const router = useRouter();

    return (
        <SafeAreaView className='flex-1 bg-white px-5 justify-between'>
            <View style={{height: '75%'}} className="justify-center items-center">
                <View
                    className='w-full justify-center items-center mt-1 mb-8'
                >
                    <View
                        style={{width: '90%', height: 200}}
                    >
                        <Image
                            className='w-full h-full'
                            source={Carticons.scooter2}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <Text
                    className="text-xl mb-4 text-center"
                    style={{ fontFamily: 'roboto-medium' }}
                >
                    Become a Runner & Earn
                </Text>
                <Text
                    className="text-base text-center text-black"
                    style={{ fontFamily: 'roboto', textAlign: 'center' }}
                >
                    Accept shopping requests, deliveries, and errands in your area. Work on your schedule and earn with every completed task.    
                </Text>
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
                            height: 8, width: 14, backgroundColor: COLORS.primary
                        }}
                        />
                    <View className="rounded-full mx-1"
                        style={{
                            height: 8, width: 8, backgroundColor: COLORS.lite
                        }}
                    />
                </View>

                <TouchableOpacity
                    className={`flex-row bg-primary py-3 rounded-lg justify-center items-center mb-8`}
                    onPress={() => router.push('/onboardscreen3')}
                >
                    <Text
                        className='text-white text-lg mr-2'
                        style={{ fontFamily: "roboto-medium" }}
                    >Next</Text>
                    <Feather name="arrow-right" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OnboardScreen2