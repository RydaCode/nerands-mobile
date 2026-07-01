import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Redirecting from '../../../app/Redirecting';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const DeleteStoreOthers = ({setDeleteStoreModalVisible, params}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data, isLoading, error, post } = useApi(`/stores/delete/${params.store_id}`);

    console.log(error)

    //Handle error for delete operation
    useEffect(() => {
        if (error) {
            setDeleteStoreModalVisible(false);
            toast.error(error?.message || 'An error occurred, please try again.');
        }

        if (data && data.success) {
            toast.success(data.message || 'Store deleted successfully');
            setIsRedirecting(true);
            setTimeout(() => {
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
        if (data && !data?.success) {
            toast.error(data?.message);
            setIsRedirecting(true);
            setTimeout(() => {
                setDeleteStoreModalVisible(false);
                setIsRedirecting(false);
            }, 5000);
        }
    }, [data, error]);

    const handleDeleteStore = () => {
        post(); //Trigger the delete API request
    };

    return (
        <View className='w-full items-center justify-center mt-6 mb-4'>
            {!isLoading && (
                <View className='justify-center items-center'>
                    <Text className='text-base text-red' style={{fontFamily: 'roboto-medium', textAlign: 'center'}}>Are you sure, you want to delete this store?</Text>
                    <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium', textAlign: 'center'}}>
                        If yes, the process can not be undone, all content related to this store will be permanently deleted.
                    </Text>
                </View>
            )}
            {isLoading ? (
                <View className='p-2 w-full justify-center items-center'>
                    <ActivityIndicator size={35} color={COLORS.primary}/>
                    <Text
                        className='text-slate text-base mt-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Deleting store, please wait...</Text>
                </View>
            ) : (
                <View className='flex-row justify-between items-center w-full mt-5'>
                    <TouchableOpacity
                        onPress={() => handleDeleteStore()}
                        className='py-3 rounded w-[48%] items-center justify-center bg-red'
                    >
                        <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {setDeleteStoreModalVisible(false)}}
                        className='py-3 rounded w-[48%] items-center justify-center bg-green2'
                    >
                        <Text className='text-xl text-white' style={{fontFamily: 'maven-medium'}}>No</Text>
                    </TouchableOpacity>
                </View>
            )}
            {isRedirecting && <Redirecting />}
            <View className='pb-10'/>
        </View>
    )
}

export default DeleteStoreOthers