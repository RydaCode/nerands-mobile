import { View, Text, TouchableOpacity } from 'react-native'
import useDelete from '../../../hook/useDelete';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import Redirecting from '../../../app/Redirecting';
import LoadingIndicator from '../../../app/LoadingIndicator';

const DeleteProductOthers = ({onClose, product_id, store_id}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    // //Custom hook for handling API request (Remove admin from store)
    const { remove, delLoading, delerror, redel } = useDelete(`/product/delete/`, {
        store_id: store_id,
        product_id: product_id
    });

    // Effect to handle API responses for delete
    useEffect(() => {
        if (remove) {
            const message = remove.Response;
            if (message === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Product deleted!',
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
            else if (message !== 'Success') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: message,
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

        // Handle error for delete
        if (delerror) {
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
    }, [remove, delerror]);

    // Handle the API request and state delete for delete
    const handleDeleteProduct = () => {
        redel(); // Trigger the API request
    };
    return (
        <View className='w-full items-center justify-center mt-10 mb-0'>
            <Text  className='text-base text-red'  style={{fontFamily: 'maven-medium'}}>Are you sure you want to delete this product?</Text>
            <Text  className='text-lg text-red'  style={{fontFamily: 'maven-medium'}}>This process can not be undone.</Text>
            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={handleDeleteProduct}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onClose}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-green2'
                >
                    <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>No</Text>
                </TouchableOpacity>
            </View>
            {delLoading ? <LoadingIndicator loading_text="Deleteing..." /> : null}
            {isRedirecting && <Redirecting />}
            <Toast />
            <View className='pb-10'/>
        </View>
    )
}

export default DeleteProductOthers