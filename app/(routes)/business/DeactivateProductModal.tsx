import { COLORS } from '@/constants/constants';
import useApi from '@/hook/useApi';
import { useResponsive } from '@/hook/useResponsive';
import { Product } from '@/types/product';
import { toast } from '@/utils/toast';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface DeactivateProductProps {
    onClose: () => void;
    user_id: string;
    business_id: string;
    product: Product

    reload: () => void
}

const DeactivateProductModal = ({
    user_id,
    business_id,
    product,
    onClose,
    reload
}: DeactivateProductProps) => {
    const { wp, responsiveSize } = useResponsive()
    const {data, isLoading, error, patch} = useApi(
        `/businesses/product/update`
    );

    const toggleProductStatus = async () => {
        if (!user_id || !business_id || !product.id) {
            toast.error('Missing IDs');
            onClose();
            return;
        }

        try {
            const response = await patch({
                user_id,
                business_id,
                product_id: product.id,
                is_active: !product.is_active,
            });

            if (!response?.success) {
                toast.error(
                    `Failed to ${product.is_active ? 'deactivate product' : 'activate product'}`
                );
                return;
            }

            toast.success(
                `Product ${product.is_active ? 'deactivate product' : 'activate product'}`
            );
            reload();
            onClose();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update product');
            }
        }
    };

    return (
        <View className="w-full justify-center items-center px-6 py-4">
            <View className="mb-10 w-full">
                <View className="flex-row justify-between">
                    <View className="flex-row justify-center items-center mb-6">
                        <AntDesign
                            name="poweroff"
                            size={19}
                            color={COLORS.extra_blue}
                        />
                        <Text
                            className="text-2xl ml-1"
                            style={{ fontFamily: 'outfit-medium' }}
                        >
                            {product.is_active ? 'Deactivate' : 'Activate'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="bg-grey_bg justify-center items-center rounded-full"
                        style={{
                            height: responsiveSize(8, 33, 40),
                            width: responsiveSize(8, 33, 40),
                        }}
                        onPress={onClose}
                    >
                        <FontAwesome name="times" color={COLORS.red} />
                    </TouchableOpacity>
                </View>

                <Text
                    className="text-sm self-center mb-4"
                    style={{ fontFamily: 'roboto' }}
                >
                    {product.is_active
                        ? 'Are you sure you want to deactivate this product?'
                        : 'Are you sure you want to activate this product?'
                    }
                </Text>

                <View className="w-full flex-row justify-between items-center mb-6">
                    <TouchableOpacity
                        className="bg-red rounded py-3"
                        style={{ width: '48%' }}
                        onPress={toggleProductStatus}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} size={24}/>
                        ) : (
                            <Text
                                className="text-lg self-center text-white"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                Yes
                            </Text>  
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-green2 rounded py-3"
                        style={{ width: '48%' }}
                        onPress={onClose}
                    >
                        <Text
                            className="text-lg self-center text-white"
                            style={{ fontFamily: 'roboto-medium' }}
                        >
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default DeactivateProductModal