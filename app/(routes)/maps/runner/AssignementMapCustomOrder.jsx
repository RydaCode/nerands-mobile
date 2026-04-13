// AssignementMapCustomOrder.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useApi from '../../../../hook/useApi';
import BottomSheetMenu from './BottomSheetMenu';
import MapSection from './MapSection';
import OrderActionsModal from './OrderActionsModal';
import OrderNotesModal from './OrderNotesModal';
import OrdersListModal from './OrdersListModal';

const AssignementMapCustomOrder = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const { latitude, longitude } = useSelector(state => state.location);
    const { user_id } = useSelector(state => state.auth);

    const [openOrders, setOpenOrders] = useState(false);
    const [openCloseMenu, setOpenCloseMenu] = useState(false);
    const [openOrderNotes, setOpenOrderNotes] = useState(false);
    const [openOrderActions, setOpenOrdersActions] = useState(false);

    const mapRef = useRef();
    const [coords, setCoords] = useState([]);

    const { data: OrderItems, get: getOrderItems } = useApi(
        `/customorders/order/${params.custom_order_id}/`
    );

    useEffect(() => {
        getOrderItems();
    }, []);

    return (
        <SafeAreaView className='flex-1 justify-center relative'>
            {/* Map */}
            <MapSection
                mapRef={mapRef}
                origin={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
                destination={{
                    latitude: parseFloat(params.custom_order_latitude),
                    longitude: parseFloat(params.custom_order_longitude),
                }}
                coords={coords}
                setCoords={setCoords}
                runner={{ first_name: params.first_name, last_name: params.last_name }}
                openCloseMenu={openCloseMenu}
                setOpenCloseMenu={setOpenCloseMenu}
            />

            {/* Bottom Menu */}
            <BottomSheetMenu
                openCloseMenu={openCloseMenu}
                setOpenCloseMenu={setOpenCloseMenu}
                setOpenOrders={setOpenOrders}
                setOpenOrderNotes={setOpenOrderNotes}
                setOpenOrdersActions={setOpenOrdersActions}
                runner={params}
            />

            {/* Order Notes Modal */}
            {openOrderNotes && (
                <OrderNotesModal
                    order={params}
                    onClose={() => {
                        setOpenOrderNotes(false);
                        setOpenCloseMenu(true);
                    }}
                />
            )}

            {/* Order Actions Modal */}
            {openOrderActions && (
                <OrderActionsModal
                    orderId={params.custom_order_id}
                    custom_order_number={params.custom_order_num}
                    onClose={() => {
                        setOpenOrdersActions(false);
                        setOpenCloseMenu(true);
                    }}
                    orderList={() => {
                        setOpenOrdersActions(false);
                        setOpenOrders(true);
                    }}
                    orderDetails={() => {
                        setOpenOrdersActions(false);
                        setOpenOrderNotes(true);
                    }}
                />
            )}

            {/* Orders List Modal */}
            {openOrders && (
                <OrdersListModal
                    orders={OrderItems?.data?.custom_products || []}
                    onClose={() => {
                        setOpenOrders(false);
                        setOpenCloseMenu(true);
                    }}
                    router={router}
                />
            )}

            {/* Button to open Bottom Sheet */}
            
            {openCloseMenu === true ||
                openOrders === true ||
                openOrderNotes === true ||
                openOrderActions === true ? <></> :
                <TouchableOpacity
                    className='bg-transparentBlack absolute bottom-0 pt-2 pb-4 rounded-t-md left-0 right-0 items-center'
                    onPress={() => setOpenCloseMenu(true)}
                >
                    <View className='h-1 rounded-full bg-lavender' style={{width: '30%'}}/>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

export default AssignementMapCustomOrder;