import { View, Text, TouchableOpacity } from 'react-native'
import useDelete from '../../../hook/useDelete';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import Redirecting from '../../../app/Redirecting';
import LoadingIndicator from '../../../app/LoadingIndicator';

const DeleteStoreOthers = ({setDeleteStoreModalVisible, params}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    // //Custom hook for handling API request (Remove admin from store)
    const { remove, delLoading, delerror, redel } = useDelete(`/store/delete/`, {
        store_id: params.store_id,
    });

    //Handle error for delete operation
    useEffect(() => {
        if (delerror) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while removing the admin. Please try again.',
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

        if (remove && remove.Response === 'Success') {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Store deleted successfully!',
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
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
        if (remove && remove.Response !== 'Success') {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: remove.Response,
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
            setIsRedirecting(true);
            setTimeout(() => {
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
    }, [remove, delerror]);

    // //Handle the API request to remove admin
    const handleDeleteStore = () => {
        redel(); //Trigger the delete API request
    };

    return (
        <View className='w-full items-center justify-center mt-6 mb-0'>
            <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>Are you sure, you want to delete this store?</Text>
            <Text className='text-sm text-red' style={{fontFamily: 'roboto-medium'}}>If yes, the process can not be undone?</Text>
            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={() => handleDeleteStore()}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {setDeleteStoreModalVisible(false)}}
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

export default DeleteStoreOthers