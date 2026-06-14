import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useDelete from '../../../hook/useDelete';
import { toast } from '../../../utils/toast';

const DeleteStoreOthers = ({setDeleteStoreModalVisible, params}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { remove, delLoading, delerror, redel } = useDelete(`/store/delete/`, {
        store_id: params.store_id,
    });

    //Handle error for delete operation
    useEffect(() => {
        if (delerror) {
            toast.error('An error occurred while removing the admin. Please try again.');
        }

        if (remove && remove.Response === 'Success') {
            toast.success('Store deleted successfully');
            setIsRedirecting(true);
            setTimeout(() => {
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
        if (remove && remove.Response !== 'Success') {
            toast.error(remove.Response);
            setIsRedirecting(true);
            setTimeout(() => {
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
    }, [remove, delerror]);

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
            <View className='pb-10'/>
        </View>
    )
}

export default DeleteStoreOthers