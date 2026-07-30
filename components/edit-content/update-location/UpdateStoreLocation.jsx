import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { usePermissions } from '../../../hook/usePermissions';
import { toast } from '../../../utils/toast';

const UpdateStoreLocation = ({ params, setUpdateStoreLocationModalVisible }) => {
    const {can} = usePermissions();
    const { latitude, longitude } = useSelector(state => state.location);

    const [isRedirecting, setIsRedirecting] = useState(false);

    // useApi with PATCH method
    const {
        data: update,
        isLoading,
        error,
        patch: updateStoreLocation,
    } = useApi(`/stores/update`);

    useEffect(() => {
        if (update) {
            if (update?.success) {
                toast.success('Store location updated!');
                setIsRedirecting(true);
                setUpdateStoreLocationModalVisible(false);
            } else {
                toast.error(update?.message || 'failed to update location.');
                setUpdateStoreLocationModalVisible(false);
            }
        }

        if (error) {
            toast.error(error?.message || 'An error occurred. Please try again.');
            setUpdateStoreLocationModalVisible(false);
        }
    }, [update, error]);

    const handleUpdateStoreLocation = () => {
        if (!can('update_store')) {
            toast.error('You do not have permissions to update stores location.');
            setPublishStoreModalVisible(false);
            return;
        }
        const payload = {
            business_id: params.business_id,
            store_id: params.store_id,
            store_latitude: latitude || params.store_latitude,
            store_longitude: longitude || params.store_longitude,
        };

        updateStoreLocation(payload);
    };

    console.log(update)

    return (
        <View className='w-full items-center justify-center mt-2'>
            <Text className='text-base text-red' style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}>
                Are you sure you want to update the store location?
            </Text>
            <Text className='text-sm text-slate' style={{ fontFamily: 'roboto-medium', textAlign: 'justify' }}>
                If yes, the location will be updated to this device's current location.
            </Text>

            {isLoading && (
                <View className='w-full flex-row bg-white my-5 justify-center items-center'>
                    <ActivityIndicator color={COLORS.primary}/>
                    <Text
                        className='text-primary ml-1'
                        style={{fontFamily: 'roboto-medium'}}
                    >Updating to current location...</Text>
                </View>
            )}

            <View
                style={{marginTop: isLoading ? 0 : 20 }}
                className='flex-row justify-between items-center w-full'>
                <TouchableOpacity
                    onPress={handleUpdateStoreLocation}
                    className='py-3 rounded w-[48%] items-center justify-center bg-red'
                    disabled={isLoading}
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>
                        Yes
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setUpdateStoreLocationModalVisible(false)}
                    className='p-3 rounded w-[48%] items-center justify-center bg-green2'
                    disabled={isLoading}
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>
                        No
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UpdateStoreLocation;