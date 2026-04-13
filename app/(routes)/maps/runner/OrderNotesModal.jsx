// OrderNotesModal.js
import { MotiView } from 'moti';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../../../constants/constants';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const OrderNotesModal = ({ order, onClose }) => {

    const [contentHeight, setContentHeight] = useState(0);
      
          const maxHeight = SCREEN_HEIGHT * 0.7;       // Max modal height
          const finalHeight = Math.min(contentHeight, maxHeight); // Actual animated height

    return (
        <>
            <Pressable className='absolute flex-1 w-full h-full bg-transparentBlack' onPress={onClose} />
            <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 700 }}
                style={styles.sheetContainer}
            >
                <TouchableOpacity className='bg-primary py-1 w-full justify-center items-center'
                    onPress={onClose}
                >
                    <View className='h-1 bg-lavender rounded-full ' style={{width: '30%'}}/>
                </TouchableOpacity>   
                <ScrollView style={{ padding: 16, backgroundColor: 'white', width: '100%' }}>
                    <Text className='text-2xl' style={{fontFamily: 'roboto-medium'}}>Order Details</Text>
                    <View className='bg-lavender mb-3' style={{height: 1}}/>
                    <View className='flex-row justify-between mb-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Custom Stores</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>: {order.custom_stores}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between mb-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Recipient Phone</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>: {order.receipients_phone_number}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between mb-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Delivery Mode:</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>: {order.delivery_mode}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between mb-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Estimated Spend:</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>: K{order.estimated_spend_amount}</Text>
                        </View>
                    </View>
                    <View className='flex-row justify-between mb-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Recipients Names:</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>: {order.recipients_full_names}</Text>
                        </View>
                    </View>
                    <View className='my-3'>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>Order Notes:</Text>
                        </View>
                        <View className='' style={{width: '48.5%'}}>
                            <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>{order.order_notes}</Text>
                        </View>
                    </View>
                </ScrollView>
            </MotiView>
        </>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: "white",
    borderRadius: SIZES.border,
    marginBottom: 10,
    alignSelf: 'center',
    overflow: "hidden",
  },
});

export default OrderNotesModal;