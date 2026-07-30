import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Redirecting from '../../../app/Redirecting';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { usePermissions } from '../../../hook/usePermissions';
import { toast } from '../../../utils/toast';

const PublishStoreOthers = ({ router, params, setPublishStoreModalVisible }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const isPublished = params.active_status === true || params.active_status === 1 || params.active_status === 'true';
    const [activeStatus, setActiveStatus] = useState(isPublished); // Local UI state
    const [lastToggledStatus, setLastToggledStatus] = useState(null); // Store what we sent to the API
    const { user_id } = useSelector(state => state.auth);
    const {can} = usePermissions();

    const {
        data: update,
        isLoading,
        error,
        patch: updateStore,
    } = useApi(`/stores/update/`);

    useEffect(() => {
        if (update) {

            if (update?.success) {
                toast.success(`Store ${lastToggledStatus ? 'published' : 'unpublished'}!`);

                setIsRedirecting(true);
                setPublishStoreModalVisible(false);
                setTimeout(() => {
                    router.back();
                }, 2000);
                return;
            } else {
                toast.error(error?.message || 'Failed to publish store/branch.');
                setPublishStoreModalVisible(false);
                return;
            }
        }

        if (error) {
            toast.error(error.message || 'An error occurred. Please try again.');
            setPublishStoreModalVisible(false);
            return;
        }
    }, [update, error]);

    const handlePublishStore = () => {
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
            active_status: toggledStatus,
            unpublish: !toggledStatus, // ✅ only true when unpublishing
        });

        setLastToggledStatus(toggledStatus); // Optional: track what was sent
        setActiveStatus(toggledStatus);      // Immediate UI feedback
    };

    // console.log(can('update_store'))

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
                            {activeStatus ? "Publishing store, please wait..." : "Unpublishing store, please wait..."}
                        </Text>
                    </View>
                </View>
            ) : (
                <View className='w-full items-center justify-center mt-10 mb-0'>
                    <Text
                        className="text-base text-red mb-4"
                        style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}
                    >
                        Are you sure you want to {activeStatus ? 'unpublish' : 'publish'} this store/branch?
                    </Text>

                    <Text
                        className="text-base"
                        style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}
                    >
                        {activeStatus
                            ? 'This will hide the store / branch and its products from the public.'
                            : 'This will make the store / branch and its products visible to the public.'
                        }
                    </Text>

                    <View className='flex-row justify-between items-center w-full mt-5'>
                        <TouchableOpacity
                            onPress={handlePublishStore}
                            className='py-3 rounded w-[48%] items-center justify-center bg-red'
                        >
                            <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>Yes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPublishStoreModalVisible(false)}
                            className='py-3 rounded w-[48%] items-center justify-center bg-green2'
                        >
                            <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>No</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='pb-10' />
                    {isRedirecting && <Redirecting />}
                </View>
            )}
        </>
    );
};

export default PublishStoreOthers;