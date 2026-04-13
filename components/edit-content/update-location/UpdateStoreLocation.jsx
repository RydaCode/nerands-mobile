import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useApi from '../../../hook/useApi';

const UpdateStoreLocation = ({ params, setUpdateStoreLocationModalVisible }) => {
    const { latitude, longitude } = useSelector(state => state.location);

    const [isRedirecting, setIsRedirecting] = useState(false);

    // useApi with PATCH method
    const {
        data: update,
        isLoading,
        error,
        patch: updateStoreLocation,
    } = useApi(`/stores/update/`);

    useEffect(() => {
        if (update?.response) {
            const message = update.response;

            if (message === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Store location updated!',
                    visibilityTime: 4000,
                    animationType: 'slide',
                    position: 'bottom',
                    text1Style: {
                        color: '#32CD32',
                        fontSize: 18,
                        fontFamily: 'maven-bold',
                    },
                    text2Style: {
                        color: '#32CD32',
                        fontSize: 14,
                        fontFamily: 'maven-medium',
                    },
                });

                setIsRedirecting(true);
                setTimeout(() => {
                    setUpdateStoreLocationModalVisible(false);
                }, 5000);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: message,
                    visibilityTime: 4000,
                    animationType: 'slide',
                    position: 'bottom',
                    text1Style: {
                        color: 'red',
                        fontSize: 18,
                        fontFamily: 'maven-bold',
                    },
                    text2Style: {
                        color: 'red',
                        fontSize: 14,
                        fontFamily: 'maven-medium',
                    },
                });
            }
        }

        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred. Please try again.',
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
                text1Style: {
                    color: 'red',
                    fontSize: 18,
                    fontFamily: 'maven-bold',
                },
                text2Style: {
                    color: 'red',
                    fontSize: 14,
                    fontFamily: 'maven-medium',
                },
            });
        }
    }, [update, error]);

    const handleUpdateStoreLocation = () => {
        const payload = {
            store_id: params.store_id,
            store_latitude: latitude || params.store_latitude,
            store_longitude: longitude || params.store_longitude,
        };

        updateStoreLocation(payload);
    };

    console.log(error)

    return (
        <View className='w-full items-center justify-center mt-10 mb-0'>
            <Text className='text-sm text-black' style={{ fontFamily: 'roboto-medium' }}>
                Are you sure you want to update the store location?
            </Text>

            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={handleUpdateStoreLocation}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>
                        Yes
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setUpdateStoreLocationModalVisible(false)}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-green2'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'maven-medium' }}>
                        No
                    </Text>
                </TouchableOpacity>
            </View>

            <Toast />
            {isLoading && <LoadingIndicator loading_text="Updating location..." />}
            {isRedirecting && <Redirecting />}
        </View>
    );
};

export default UpdateStoreLocation;