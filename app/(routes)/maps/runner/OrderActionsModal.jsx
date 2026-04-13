import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import useApi from '../../../../hook/useApi';
import DeliverNow from './DeliverNow';
import FindTransporterModal from './FindTransporterModal';
import MarkOrderAsReady from './MarkOrderAsReady';

const OrderActionsModal = ({
    orderId,
    custom_order_number,
    onClose,
    orderList,
    orderDetails
}) => {
    const { data: OrderItems, get: getOrderItems, isLoading: OrderItemsLoading } = useApi(`/customorders/order/${orderId}/`);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        getOrderItems();
    }, []);

    if (!visible || OrderItemsLoading) return null;

    const orderData = OrderItems?.data;

    return (
        <View className="absolute inset-0 justify-end items-center">
            {/* OVERLAY */}
            <Pressable
                className="absolute inset-0 bg-transparentBlack"
                onPress={() => { setVisible(false); onClose?.(); }}
            />

            {/* MODAL CONTENT */}
            <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 300 }}
                style={{ width: '95%' }}
            >
                <View pointerEvents="box-none">
                    {orderData?.order_status === 'Processing' && (
                        <MarkOrderAsReady
                            setVisible={() => setVisible(false)}
                            onClose={onClose}
                            custom_order_id={orderId}
                        />
                    )}

                    {orderData?.order_status === 'Ready' && (
                        <FindTransporterModal
                            custom_order_id={orderId}
                            setVisible={() => setVisible(false)}
                            onClose={onClose}
                        />
                    )}

                    {orderData?.order_status === 'In_progress' && (
                        <DeliverNow
                            custom_order_id={orderId}
                            custom_order_number={custom_order_number}
                            setVisible={() => setVisible(false)}
                            onClose={onClose}
                            orderList={orderList}
                            orderDetails={orderDetails}
                        />
                    )}

                    {orderData?.order_status === 'Completed' && (
                        <Text>COMPLETED</Text>
                    )}
                </View>
            </MotiView>
        </View>
    );
};

export default OrderActionsModal;
