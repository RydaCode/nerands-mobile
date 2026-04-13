import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import MainHeader from '../../../components/MainHeader'
import FormInputs from '../../../components/FormFields/FormInputs'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS, SIZES } from '../../../constants/constants';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

const index = () => {
    const [termsAndConditions, setTermsAndConditions] = useState(true);
    const [deliveryAddres, setDeliveryAddress] = useState(false);
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='mx-2'>
                <MainHeader header_name='Book Room' />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View className='mt-8 px-2 w-full'>
                <View className=''>
                    <Text className='font-semibold mb-1'>Booking a room</Text>
                    <Text className='text-slate'>You are about to book this room from Ludo Lodge, therefore, you are adviced to provide acurate information about yoursel.</Text>
                </View>

                <View className='my-8'>
                    <BouncyCheckbox
                        isChecked={false}
                        onPress={(text) => {setDeliveryAddress(text)}}
                        text='Are you booking on behalf of someone else?'
                        textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 13 }}
                        size={20}
                        fillColor={COLORS.primary}
                        iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, }}
                        innerIconStyle={{ borderWidth: 2, borderRadius: 2, }}
                    />
                </View>

                {/* title, value, handleChangeText, otherStyles, placeholder, desc */}
                {deliveryAddres === false ? <></> :
                <View>
                    <FormInputs
                        title='First Name'
                        desc='Please ensure that you provide the correct first name to avoid any inconvenience.'
                        placeholder='Pease enter first name'
                        otherStyles='text-sm'
                    />
                    <FormInputs
                        title='Last Name'
                        desc='Please ensure that you provide the correct last name to avoid any inconvenience.'
                        placeholder='Pease enter first name'
                        otherStyles='text-sm'
                    />
                    <FormInputs
                        title='Phone Number'
                        desc='Please ensure that you provide a correct contact number for the person you are booking this room for to avoid any inconvenience.'
                        placeholder='Enter phone number '
                        otherStyles='text-sm'
                    />
                </View>
                }
                <View>
                    <FormInputs
                        title='ID type'
                        desc='Please select the ID type.'
                        otherStyles='text-sm'
                    />
                    <FormInputs
                        title='ID Number'
                        desc='Please ensure that you provide the correct ID number to avoid any inconvenience.'
                        otherStyles='text-sm'
                    />
                    <FormInputs
                        title='check-in date'
                        desc='When are you checking in?'
                        otherStyles='text-sm'
                    />
                    <FormInputs
                        title='check-out date'
                        desc='When are you checking out?'
                        otherStyles='text-sm'
                    />
                </View>

                <View style={{width: '33%'}} className='justify-center items-center'>
                    <Text>Days</Text>
                    <View className='flex-row justify-center items-center w-full'>
                        <TouchableOpacity
                            style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                            className='bg-grey_bg px-3 py-2 w-[30px] rounded-full h-[30px] justify-center items-center'
                        >
                            <FontAwesome name="minus" style={{ color: COLORS.black }} />
                        </TouchableOpacity>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={10}
                            editable={false}
                            style={{ textAlign: 'center', fontSize: SIZES.main, color: COLORS.slate, width: '30%' }}
                            value="1"
                        />
                        <TouchableOpacity
                            style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                            className='bg-grey_bg px-3 py-2  w-[30px] rounded-full h-[30px] justify-center items-center'
                        >
                            <FontAwesome name="plus" style={{ color: COLORS.black }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='mt-6'>
                    <Text>By pressing book now button, you agree to our terms and conditions.</Text>
                </View>

                <View className='my-4'>
                    <BouncyCheckbox
                        isChecked={true}
                        onPress={(text) => {setTermsAndConditions(text)}}
                        text='I agree'
                        textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 13 }}
                        size={20}
                        fillColor={COLORS.primary}
                        iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, }}
                        innerIconStyle={{ borderWidth: 2, borderRadius: 2, }}
                    />
                </View>

                <TouchableOpacity
                    disabled={termsAndConditions === false ? true : false}
                    style={{opacity: termsAndConditions === false ? 0.6 : 0.9, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                    className='flex-row bg-primary py-4 justify-center items-center w-full rounded-md'
                >
                    <Text className='ml-2 text-white' style={{ fontSize: 18, fontFamily: 'maven-medium', fontWeight: SIZES.h1 }}>Reserve Now</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default index