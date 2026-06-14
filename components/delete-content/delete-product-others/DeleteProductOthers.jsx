import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useDelete from '../../../hook/useDelete';
import { toast } from '../../../utils/toast';

const DeleteProductOthers = ({onClose, product_id, store_id}) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { remove, delLoading, delerror, redel } = useDelete(`/product/delete/`, {
        store_id: store_id,
        product_id: product_id
    });

    // Effect to handle API responses for delete
    useEffect(() => {
        if (remove) {
            const message = remove.Response;
            if (message === 'Success') {
                toast.success('Product deleted');
                setIsRedirecting(true);
                setTimeout(() => {
                    onClose(false);
                }, 3000);
            }
            else if (message !== 'Success') {
                toast.error(message);
                setIsRedirecting(true);
                setTimeout(() => {
                    onClose(false);
                }, 3000);
            }
            else {
                toast.error(message || 'Unknown error.');
            }
        }

        // Handle error for delete
        if (delerror) {
            toast.error('An error occurred while updating. Please try again.');
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
            <View className='pb-10'/>
        </View>
    )
}

export default DeleteProductOthers