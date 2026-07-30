import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from '../../../constants/constants';

const NotRunnerView = ({ router }) => {
    const [agreed, setAgreed] = useState(false);
    const benefits = [
        {
            icon: "💰",
            title: "Earn Money",
            description: "Complete deliveries and earn from every successful trip."
        },
        {
            icon: "📍",
            title: "Get Nearby Requests",
            description: "Receive delivery opportunities close to your location."
        },
        {
            icon: "🕒",
            title: "Work Flexibly",
            description: "Choose when you want to be available."
        },
        {
            icon: "🚴",
            title: "Choose Your Transport",
            description: "Accept requests that match your transport option."
        },
        {
            icon: "⭐",
            title: "Build Your Rating",
            description: "Provide great service and unlock more opportunities."
        },
        {
            icon: "📈",
            title: "Grow Your Earnings",
            description: "Complete more deliveries and increase your income."
        }
    ];

    return (
        <ScrollView 
            className="flex-1 bg-slate-50"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
            }}
        >

            <View className="bg-white rounded-3xl w-full">

                <Text
                    className="text-3xl text-center mb-2"
                    style={{ fontFamily: 'roboto-bold' }}
                >
                    🏃
                </Text>

                <Text
                    className="text-2xl text-green-700 text-center mb-3"
                    style={{ fontFamily: 'roboto-bold' }}
                >
                    Become a Nerands Runner
                </Text>

                <View
                    className='bg-grey_bg mb-6 p-1 rounded'
                >
                    <Text
                        className="text-base text-slate-600 text-center leading-6"
                        style={{ fontFamily: 'roboto-medium' }}
                    >
                        Deliver orders, earn income, and become part of the Nerands delivery network.
                    </Text>
                </View>


                <Text
                    className="text-lg text-slate-800 mb-4"
                    style={{ fontFamily: 'roboto-bold' }}
                >
                    Why become a runner?
                </Text>


                <View>

                    {benefits.map((item, index) => (
                        <View
                            key={index}
                            className="flex-row items-center bg-slate-50 rounded-xl mb-8"
                        >

                            <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-3">
                                <Text className="text-2xl">
                                    {item.icon}
                                </Text>
                            </View>

                            <View className="flex-1 ml-2">
                                <Text
                                    className="text-base text-slate-800"
                                    style={{ fontFamily:'roboto-bold' }}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    className="text-sm text-slate-600 mt-1"
                                    style={{ fontFamily:'roboto-medium' }}
                                >
                                    {item.description}
                                </Text>
                            </View>

                        </View>
                    ))}

                </View>

                <View className="mt-5 mb-3 flex-row items-start">
                    <BouncyCheckbox
                        size={22}
                        fillColor={COLORS.primary}
                        unFillColor="#FFFFFF"
                        iconStyle={{
                            borderColor: COLORS.primary,
                            borderRadius: 3,
                            borderWidth: 2,
                        }}
                        innerIconStyle={{
                            borderWidth: 2,
                        }}
                        isChecked={agreed}
                        onPress={(isChecked) => setAgreed(isChecked)}
                    />

                    <Text
                        className="flex-1 text-sm text-slate-600 ml-1 leading-5"
                        style={{ fontFamily: "roboto-medium" }}
                    >
                        I agree to the Nerands Terms and Conditions and understand that I am joining as a Runner.
                    </Text>

                </View>
                <TouchableOpacity
                    className={`py-3 rounded-xl items-center mt-5 bg-primary`}
                    disabled={!agreed}
                    onPress={() => router.push({ pathname:'../create-runner-ac' })}
                    style={{opacity: agreed ? 1 : 0.6}}
                >
                    <Text
                        className="text-white text-lg"
                        style={{ fontFamily:'roboto-medium' }}
                    >
                        Start Your Runner Journey
                    </Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
};

export default NotRunnerView;