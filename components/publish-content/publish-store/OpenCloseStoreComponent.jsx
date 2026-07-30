import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Redirecting from '../../../app/Redirecting';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { usePermissions } from '../../../hook/usePermissions';
import { toast } from '../../../utils/toast';

const OpenCloseStoreComponent = ({ router, params, setOpenStoreModalVisible }) => {

const [isRedirecting, setIsRedirecting] = useState(false);
    const isPublished = params.open_close === true || params.open_close === 1 || params.open_close === 'true';
    const [activeStatus, setActiveStatus] = useState(isPublished); // Local UI state
    const [lastToggledStatus, setLastToggledStatus] = useState(null); // Store what we sent to the API
    const {can} = usePermissions();

    const {
        data: update,
        isLoading,
        error,
        patch: updateStore,
    } = useApi(`/stores/update`);

    useEffect(() => {
        if (update) {
            if (update?.success) {
                toast.success(`Store ${lastToggledStatus ? 'Opened' : 'Closed'}!`);

                setIsRedirecting(true);
                setOpenStoreModalVisible(false);
                setTimeout(() => {
                    router.back();
                }, 2000);
            } else {
                toast.error(update?.message);
                setOpenStoreModalVisible(false);
                return;
            }
        }

        if (error) {
            toast.error(error.message || 'An error occurred. Please try again.');
            setOpenStoreModalVisible(false);
            return;
        }
    }, [update, error]);

    const handleOpenCloseStore = () => {
        if (!can('update_store')) {
            toast.error('You do not have permissions to pulish stores');
            setPublishStoreModalVisible(false);
            return;
        }
        const toggledStatus = !activeStatus;

        updateStore({
            user_id: params.user_id,
            business_id: params.business_id,
            store_id: params.store_id,
            open_close: toggledStatus,
        });

        setLastToggledStatus(toggledStatus); // Track what was sent
        setActiveStatus(toggledStatus); // Update local UI state
    };

    return (
        <>
            {isLoading ? (
                <View className='w-full items-center justify-center mt-10 mb-4'>
                    <View className='w-full justify-center items-center flex-row'>
                        <ActivityIndicator color={COLORS.primary} size={30}/>
                        <Text
                            className='ml-1 text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            {activeStatus ? "Opening store, please wait..." : "Closing store, please wait..."}
                        </Text>
                    </View>
                </View>
            ) : (
                <View className='w-full items-center justify-center mt-10 mb-0'>
                    <Text className="text-sm text-black" style={{ fontFamily: "roboto-medium" }}>
                        Are you sure you want to {activeStatus ? "close" : "open"} this store?
                    </Text>

                    <View className='flex-row justify-between items-center w-full mt-5'>
                        <TouchableOpacity
                            onPress={handleOpenCloseStore}
                            className='p-3 rounded w-[48%] items-center justify-center bg-red'
                        >
                            <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setOpenStoreModalVisible(false)}
                            className='p-3 rounded w-[48%] items-center justify-center bg-green2'
                        >
                            <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>No</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='pb-10' />
                    {isRedirecting ? <Redirecting /> : null}
                </View>
            )}
        </>
    );
};

export default OpenCloseStoreComponent;