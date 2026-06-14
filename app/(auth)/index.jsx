import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NERANDS_URI } from '../../RequestMethods';
import { COLORS } from '../../constants/constants';
import { Carticons } from '../../constants/icons';

const Index = () => {
    const [agreement, setAgreement] = useState(false);
    const router = useRouter();

    const openTerms = () => {
        Linking.openURL(`${NERANDS_URI}/terms`);
    };

    const openPrivacy = () => {
        Linking.openURL(`${NERANDS_URI}/privacy-policy`);
    };
    return (
        <SafeAreaView className='flex-1 bg-white px-5 justify-between'>
            <View className="flex-1 justify-center items-center">
                
               

                <View
                    className='w-full justify-center items-center mt-1 mb-8'
                >
                    <View
                        style={{width: '100%', height: 200}}
                    >
                        <Image
                            className='w-full h-full'
                            source={Carticons.marketplace}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <Text
                    className="text-xl text-primary mb-4 text-center"
                    style={{ fontFamily: 'roboto-medium' }}
                >Welcome to Nerands — your everyday marketplace
                </Text>
                <Text
                    className="text-base text-center text-black"
                    style={{ fontFamily: 'roboto', textAlign: 'center' }}
                >
                    From shopping and deliveries to services and errands, Nerands helps you get more done every day.
                </Text>
            </View>

            {/* Bottom area */}
            <View className='w-full'>
                <View className="w-full">
                    <Text className="text-black text-base" style={{ fontFamily: "roboto" }}>
                        By continuing, you agree to our{" "}
                        <Text
                            onPress={openTerms}
                            className="text-blue-500 text-base"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Terms of Service
                        </Text>
                        {" "}and{" "}
                        <Text
                            onPress={openPrivacy}
                            className="text-blue-500 text-base"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            Privacy Policy
                        </Text>
                        .
                    </Text>
                    <View className="my-5">
                        <BouncyCheckbox
                            isChecked={agreement}
                            onPress={() => setAgreement(!agreement)}
                            text={agreement ? "I understand and agree" : "Please accept to continue"}
                            textStyle={{
                                textDecorationLine: 'none',
                                color: COLORS.slate,
                                marginLeft: -10,
                                fontSize: 13,
                                fontFamily: 'roboto-medium',
                            }}
                            size={22}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderWidth: 2, borderRadius: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>
                </View>

                <View className="flex-row justify-center mb-4">
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
                    <View className="rounded-full mx-1"
                        style={{
                            height: 8, width: 8, backgroundColor: COLORS.lite
                        }}
                    />
                </View>

                <TouchableOpacity
                    className={`flex-row bg-primary py-3 ${agreement ? 'opacity-100' : 'opacity-50'} rounded-lg justify-center items-center mb-8`}
                    disabled={!agreement}
                    onPress={() => router.push('/onboardscreen2')}
                >
                    <Text
                        className='text-white text-lg mr-2'
                        style={{ fontFamily: "roboto-medium" }}
                    >Continue</Text>
                    <Feather name="arrow-right" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Index