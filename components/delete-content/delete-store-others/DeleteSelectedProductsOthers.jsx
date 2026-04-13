import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const DeleteSelectedProductsModal = ({ setDeleteSelectedProductsModalVisible, selectedItems, store_id }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false); 

    // const { remove, delLoading, delerror, redel } = useDelete(`/product/delete_selected_products/`, {product_id:selectedItems});
    const { data, isLoading, error, del } = useApi(`/products/delete-selected-products`);

    console.log(error);

    useEffect(() => {
        if (data && data?.message) {
            setErrorMessage(data?.message); // Update the error message

            if (data?.message !== 'Success') {
                toast.error(data?.message,);
            } else {
                toast.success(data?.message);

                setIsRedirecting(true);
                setTimeout(() => {
                    // Assuming `router` is available from your context or props
                    // router.back(); // Redirects after success
                }, 5000);
            }
        }
    }, [data]);

    const handleDeleteSelectedProducts = () => {
        setErrorMessage('');
        // Client-side validation
        if (!store_id) {
            setErrorMessage('This action can not be performed.');
            toast('This action can not be performed.');
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            setErrorMessage('Please select products to delete.');
            toast.error('Please select products to delete.')
            return;
        }
        //Trigger the API request to delete the selected products
        del({
            product_ids: selectedItems
        });
    }

    return (
        <View className='w-full items-center justify-center mt-10 mb-0'>
            <Text className='text-md text-black' style={{ fontFamily: 'roboto-medium' }}>
                Are you sure, you want to delete these products?
            </Text>
            <Text className='text-md text-red' style={{ fontFamily: 'roboto-medium' }}>
                Because this action can not be undone.
            </Text>
            <View className='flex-row justify-between items-center w-full mt-5'>
                <TouchableOpacity
                    onPress={handleDeleteSelectedProducts}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-red'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'roboto-medium' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setDeleteSelectedProductsModalVisible(false)}
                    className='p-4 rounded-md w-[48%] items-center justify-center bg-green2'
                >
                    <Text className='text-xl text-white' style={{ fontFamily: 'roboto-medium' }}>No</Text>
                </TouchableOpacity>
            </View>
            {/* Toast component with custom config */}
            <Toast />
            {isLoading && <LoadingIndicator loading_text='Deleting products...' />}
            {errorMessage === 'Success' && <Redirecting title='Success' />}
            <View className='pb-10' />
        </View>
    );
};

export default DeleteSelectedProductsModal;