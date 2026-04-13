import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import useUpdate from '../../../hook/useUpdate';
import Redirecting from '../../../app/Redirecting';
import LoadingIndicator from '../../../app/LoadingIndicator';

const PublishProductOthers = ({onClose, product_id, product_name, product_description, product_actual_price, product_status, store_id}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const isPublished = true;

    // Custom hook for handling API request (publish product)
    const { update, updateLoading, updateError, resend } = useUpdate(`/product/update/`, {
        product_id: product_id,
        store_id: store_id,
        product_status: !isPublished === false
    });

    // Effect to handle API responses for update
    useEffect(() => {
        if (update) {
            const message = update.Response;
            if (message === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Product published!',
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
                    onClose(false);
                }, 3000);
            }
            else if (message === 'No changes made!') {
                Toast.show({
                    type: 'success',
                    text1: 'No changes',
                    text2: 'No changes made!',
                    visibilityTime: 4000,
                    animationType: 'slide',
                    position: 'bottom',
                    text1Style: {
                        color: 'rgba(5, 173, 117, 0.884)',
                        fontSize: 18,
                        fontFamily: 'maven-bold',
                    },
                    text2Style: {
                        color: 'rgba(5, 173, 117, 0.884)',
                        fontSize: 14,
                        fontFamily: 'maven-medium',
                    },
                });
                setIsRedirecting(true);
                setTimeout(() => {
                    onClose(false);
                }, 3000);
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: message || 'Unknown error.',
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

        // Handle error for update
        if (updateError) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while updating. Please try again.',
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
    }, [update, updateError]);

    // Handle the API request and state update for update
    const handlePublishProduct = () => {
        resend(); // Trigger the API request
    };

    return (
        <View className='w-full items-center justify-center mt-10 mb-0'>
            <Text className='text-lg text-green2' style={{fontFamily: 'maven-medium'}}>
                Are you sure, you want to publish this product?
            </Text>
            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={handlePublishProduct}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity className='p-4 rounded-md w-[48%] items-center justify-center bg-green2'
                    onPress={onClose}
                >
                    <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>No</Text>
                </TouchableOpacity>
            </View>
            <View className='pb-10'/>
            <Toast />
            {updateLoading && <LoadingIndicator loading_text="Publishing..." />}
            {isRedirecting && <Redirecting />}
        </View>
    );
};

export default PublishProductOthers;
