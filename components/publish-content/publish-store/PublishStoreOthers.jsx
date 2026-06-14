import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const PublishStoreOthers = ({ router, params, setPublishStoreModalVisible }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const isPublished = params.active_status === true || params.active_status === 1 || params.active_status === 'true';
    const [activeStatus, setActiveStatus] = useState(isPublished); // Local UI state
    const [lastToggledStatus, setLastToggledStatus] = useState(null); // Store what we sent to the API

    const {
        data: update,
        isLoading,
        error,
        patch: updateStore,
    } = useApi(`/stores/update/`);

    useEffect(() => {
        if (update?.response) {
            const message = update?.response;

            if (message === 'Success') {
                toast.success(`Store ${lastToggledStatus ? 'published' : 'unpublished'}!`);

                setIsRedirecting(true);
                setTimeout(() => {
                    router.back();
                }, 5000);
            } else {
                toast.error(message);
            }
        }

        if (error) {
            toast.error('An error occurred. Please try again.');
        }
    }, [update, error]);

    const handlePublishStore = () => {
        const toggledStatus = !activeStatus;

        updateStore({
            store_id: params.store_id,
            active_status: toggledStatus,
            unpublish: !toggledStatus, // ✅ only true when unpublishing
        });

        setLastToggledStatus(toggledStatus); // Optional: track what was sent
        setActiveStatus(toggledStatus);      // Immediate UI feedback
    };

    return (
        <View className='w-full items-center justify-center mt-10 mb-0'>
            <Text
            className={`text-sm ${activeStatus ? 'text-red-600' : 'text-black'}`}
                style={{ fontFamily: 'roboto-medium' }}
            >
                Are you sure you want to {activeStatus ? 'unpublish' : 'publish'} this store?
            </Text>

            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={handlePublishStore}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setPublishStoreModalVisible(false)}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-green2'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>No</Text>
                </TouchableOpacity>
            </View>

            <View className='pb-10' />
            {isLoading && <LoadingIndicator loading_text={activeStatus ? "Publishing store..." : "Unpublishing store..."} />}
            {isRedirecting && <Redirecting />}
        </View>
    );
};

export default PublishStoreOthers;