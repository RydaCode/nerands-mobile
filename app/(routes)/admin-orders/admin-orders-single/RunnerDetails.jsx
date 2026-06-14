import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../../../constants/constants';
import { toast } from '../../../../utils/toast';

const RunnerDetails = ({ isRunnerActive, order_number }) => {
    const [orderNumber, setOrderNumber] = useState('');

    if (!isRunnerActive) return null;

    const handleConfirm = () => {
        if (!orderNumber.trim()) {
            toast.error('Please enter an order number');
            return;
        }

        if (orderNumber.trim() !== order_number.trim()) {
            toast.error('Please enter a correct order number');
            return;
        }

        toast.success('Order Confirmed', orderNumber);
        console.log('Order Number:', orderNumber);
    };

    return (
        <View className='my-8'>
            <View className='bg-navBtnBgHome my-8 p-2 rounded'>
                <Text className='text-lg text-red' style={{fontFamily: 'roboto-medium'}}>Note*</Text>
                <Text className='text-slate' style={{textAlign: 'justify', fontFamily: 'roboto-medium'}}>
                    Kindly note that a runner will come and collect this item(s), because the owner has activated runner.
                </Text>
                <Text className='mt-2 text-slate' style={{textAlign: 'justify', fontFamily: 'roboto-medium'}}>
                    Let the runner provide an order ID which corresponds with this order and enter it below to confirm.
                </Text>
            </View>

            <View>
                <Text className='text-black mb-1 text-lg' style={{fontFamily: 'roboto-medium'}}>Order Number</Text>
                <TextInput
                    placeholder='Enter order number'
                    value={orderNumber}
                    onChangeText={setOrderNumber}
                    style={{
                        borderWidth: 1,
                        borderColor: 'lavender',
                        borderRadius: SIZES.border,
                        paddingHorizontal: 10,
                        height: 50,
                        fontFamily: 'roboto-medium',
                    }}
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    onPress={handleConfirm}
                    className='rounded bg-primary my-6 justify-center items-center py-3 elevation-sm border border-white'
                >
                    <Text className='text-white text-2xl' style={{fontFamily: 'roboto-medium'}}>
                        Confirm
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RunnerDetails;