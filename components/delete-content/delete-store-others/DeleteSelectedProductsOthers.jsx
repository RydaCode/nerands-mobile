import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const DeleteSelectedProductsModal = ({ setDeleteSelectedProductsModalVisible, selectedItems, setSelectedItems, store_id }) => {
    const [errorMessage, setErrorMessage] = useState('');

    // const { remove, delLoading, delerror, redel } = useDelete(`/product/delete_selected_products/`, {product_id:selectedItems});
    const { data, isLoading, error, del } = useApi(`/products/delete-selected-products`);

    useEffect(() => {
        if (data && data?.message) {
            setErrorMessage(data?.message); // Update the error message

            if (data?.message !== 'Success') {
                toast.error(data?.message,);
                setTimeout(() => {
                    setDeleteSelectedProductsModalVisible(false)
                }, 3000);
            } else {
                toast.success(data?.message);
                setSelectedItems([]);
                setTimeout(() => {
                    setDeleteSelectedProductsModalVisible(false)
                }, 3000);
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
            {errorMessage ? (
                <View className='mb-10 pb-10 w-full justify-center items-center'>
                    <FontAwesome name='check' size={25} color={COLORS.green2}/>
                    <Text
                        className='text-green2'
                        style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                    >{errorMessage}</Text>
                </View>
            ) : (
                <>
                    {!isLoading && (
                        <>
                            <Text className='text-base text-red' style={{ fontFamily: 'roboto-medium' }}>
                                Are you sure, you want to delete these products?
                            </Text>
                            <Text className='text-sm text-slate' style={{ fontFamily: 'roboto-medium' }}>
                                Because this action can not be undone.
                            </Text>
                        </>
                    )}

                    {isLoading ? (
                        <View className='mb-10'>
                            <ActivityIndicator size={30} color={COLORS.primary}/>
                            <Text
                                className='text-slate text-base mt-2'
                                style={{fontFamily: 'roboto-medium'}}
                            >Deleting products, please wait...</Text>
                        </View>
                    ) : (
                        <View className='flex-row justify-between items-center w-full my-5'>
                            <TouchableOpacity
                                onPress={handleDeleteSelectedProducts}
                                className='py-3 rounded w-[48%] items-center justify-center bg-red'
                            >
                                <Text className='text-xl text-white' style={{ fontFamily: 'roboto-medium' }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setDeleteSelectedProductsModalVisible(false)}
                                className='py-3 rounded w-[48%] items-center justify-center bg-green2'
                            >
                                <Text className='text-xl text-white' style={{ fontFamily: 'roboto-medium' }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View className='pb-10' />
                </>
            )}
        </View>
    );
};

export default DeleteSelectedProductsModal;