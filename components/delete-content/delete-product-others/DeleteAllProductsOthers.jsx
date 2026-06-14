import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LoadingIndicator from '../../../app/LoadingIndicator';
import Redirecting from '../../../app/Redirecting';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const DeleteAllProductsOthers = ({ setDeleteAllProductsModalVisible, params }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data, isLoading, error, del } = useApi(`/products/delete-selected-products`);

    // -------------------- HANDLE RESPONSE --------------------
    useEffect(() => {
        if (!data && !error) return;

        if (data?.message) {
        toast.success(data.message);
        setIsRedirecting(true);

        // Close modal after short delay
        setTimeout(() => setDeleteAllProductsModalVisible(false), 2000);
        } else if (error?.message) {
            toast.error(error.message);
        }
    }, [data, error]);

    // -------------------- DELETE ACTION --------------------
    const handleDeleteAllProducts = () => {
        if (!params?.product_ids || params.product_ids.length === 0) {
        const message = 'No products selected.';
        toast.error(message);
        return;
        }

        // Trigger DELETE request via useApi
        del({
            product_ids: params.product_ids,
        });
    };

    return (
        <View className="w-full items-center justify-center mt-6 mb-0">
        <View>
            <Text className="text-base text-black" style={{ fontFamily: 'roboto-medium' }}>
            Are you sure you want to delete all products from {params?.store_name}?
            </Text>
            <Text className="text-base text-red mt-3" style={{ fontFamily: 'roboto-medium' }}>
            When you press yes, the process cannot be undone.
            </Text>
        </View>

        <View className="flex-row justify-between items-center w-full mt-5">
            <TouchableOpacity
            onPress={handleDeleteAllProducts}
            className="p-4 rounded-md w-[48%] items-center justify-center bg-red"
            >
            <Text className="text-xl text-white" style={{ fontFamily: 'roboto-medium' }}>
                Yes
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => setDeleteAllProductsModalVisible(false)}
            className="p-4 rounded-md w-[48%] items-center justify-center bg-green2"
            >
            <Text className="text-xl text-white" style={{ fontFamily: 'roboto-medium' }}>
                No
            </Text>
            </TouchableOpacity>
        </View>

        {/* Loading and redirect indicators */}
        {isLoading && <LoadingIndicator loading_text="Deleting products..." />}
        {isRedirecting && <Redirecting title="Success" />}

        <View className="pb-10" />
        </View>
    );
};

export default DeleteAllProductsOthers;