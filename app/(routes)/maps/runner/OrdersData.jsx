// OrdersData.js
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from '../../../../constants/constants';

const OrdersData = ({ order, markready, setMarkReady }) => {
    const { width, height } = useWindowDimensions();

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [orderFullInfoModalVisible, setOrderFullInfoModalVisible] = useState(false);
    const [quantityControl, setQuantityControl] = useState(1);
    const [extras, setExtras] = useState(false);

    return (
        <TouchableOpacity
            className='flex-row justify-between items-center mt-2 w-full elevation-lg z-50'
        >
            <BouncyCheckbox
                isChecked={markready}
                onPress={() => setMarkReady(prev => !prev)}
                fillColor={COLORS.primary}
                size={20}
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
            />
            <View className='flex-row justify-between w-full items-center'>
                <View style={{height: 55, width: '22%'}} className='border-2 rounded-md border-lavender justify-center items-center'>
                    <Entypo size={25} name="box" color={COLORS.primary} />
                </View>
                <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
                    <View className='w-[90%]'>
                        <View className=''>
                            <Text numberOfLines={2} className='text-lg' style={{fontFamily: 'roboto-medium'}}>{order}</Text>
                        </View>
                        {/* <View className='flex-row justify-between items-center'>
                            <View>
                                <Text className='text-lg text-primary' style={{fontFamily: 'maven-bold'}}>K0</Text>
                            </View>
                            <View className='flex-row items-center justify-start mr-4'>
                                <Text className='text-slate text-sm' style={{fontFamily: 'maven-medium',}}>Qty:0</Text>
                            </View>
                        </View> */}
                        <View className='flex-row justify-between items-center'>
                            <View className='flex-row items-center justify-start mr-4'>
                                <Text numberOfLines={1} className='text-grey text-sm' style={{fontFamily: 'roboto-medium'}}>Product</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default OrdersData;