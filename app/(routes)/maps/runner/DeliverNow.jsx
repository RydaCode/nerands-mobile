import { MotiView } from 'moti';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import FormInputs from '../../../../components/FormFields/FormInputs';
import { SIZES } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';

const DeliverNow = ({ custom_order_id, custom_order_number, setVisible, onClose, orderList, orderDetails }) => {
    const {
        user_id,
        is_runner
    } = useSelector(state => state.auth);
    const [ordernumber, setOrderNumber] = useState('');

    const {data, error, isLoading, patch } = useApi(`/customorders/update`);

    const buildParams = () => ({
        order_number:ordernumber,
        custom_order_id: custom_order_id,
        order_status: 'Completed'
    });

    const handleDeliverOrder = async () => {
        // quick guard
        if (!ordernumber || ordernumber === '') {
            toast.error('Empty Order Number','Please provide order number to deliver order.');
            return;
        }

        // normalize comparison so "123" === 123 works
        if (Number(custom_order_number) !== Number(ordernumber)) {
            toast.error('Incorect Order Number','This Order number does not match any order.');
            return;
        }

        // prevent double submit
        if (isLoading) return;
        try {
            const params = buildParams();
            const response = await patch(params); // await the patch

            // log raw response for debugging
            console.log('DeliverNow -> response:', response);

            // 773287772718

            if (response.success || response.message === 'Success') {
                toast.success('Success', 'Order delivered successfully.');
                // close modal if desired
                onClose && onClose();
            } else {
                // show any message returned by server
                const serverMsg = response?.message || response?.error || JSON.stringify(response);
                toast.error('Delivery Failed', serverMsg);
            }
        } catch (err) {
            console.error('DeliverNow -> error:', err);
            toast.info('Network Error', err?.message || 'Could not complete delivery. Please try again.');
        }
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: onClose ? 1 : 0, translateY: onClose ? 0 : 50 }}
            transition={{ duration: 700 }}
            style={styles.sheetContainer}
        >
            <View className=" bg-white rounded-md pb-2 mb-6">
                
                {/* DRAG HANDLE */}
                <TouchableOpacity
                    className="py-1 items-center bg-primary"
                    onPress={() => { setVisible(false); onClose?.(); }}
                    activeOpacity={0.6}
                >
                    <View
                        className="h-1 w-1/3 rounded-full bg-lavender"
                    />
                </TouchableOpacity>

                {/* SECTION 1 */}
                <View className="px-4 mt-4">
                    <Text className="text-2xl" style={{ fontFamily: "ubuntu-medium" }}>
                        Deliver Order
                    </Text>
                </View>

                {/* SECTION 2 */}
                <View className="px-4 z-50">
                    <FormInputs
                        value={ordernumber}
                        handleChangeText={(value) => setOrderNumber(value)}
                        borderStyle='border-slate'
                        keyboardType='numeric'
                        desc='Enter the order number provided by the client receiving this package and comfirm before you hand it over.'
                    />

                    <View className='flex-row justify-between items-center my-4'>
                        <TouchableOpacity
                            className='elevation-sm justify-center items-center py-4 rounded-md bg-purple-700' style={{width: '32.5%'}}
                            onPress={orderList}
                        >
                            <Text className='text-white text-sm' style={{fontFamily: 'roboto-medium'}}>See Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='elevation-sm justify-center items-center py-4 rounded-md bg-blue-700' style={{width: '32.5%'}}
                            onPress={orderDetails}
                        >
                            <Text className='text-white text-sm' style={{fontFamily: 'roboto-medium'}}>Order Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='elevation-sm justify-center items-center py-4 rounded-md bg-coral' style={{width: '32.5%'}}
                        >
                            <Text className='text-white text-sm' style={{fontFamily: 'roboto-medium'}}>Order Details</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="mt-4 bg-green-700 py-4 rounded-lg items-center elevation-md"
                        onPress={handleDeliverOrder}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                        <Text
                            className="text-white text-lg"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            {isLoading ? 'Delivering...' : 'Deliver Now'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </MotiView>
    );
};

const styles = {
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // width: SCREEN_WIDTH * 0.95,
        backgroundColor: "white",
        borderRadius: SIZES.border,
        marginBottom: 10,
        alignSelf: 'center',
        overflow: "hidden",
    },
};

export default DeliverNow;