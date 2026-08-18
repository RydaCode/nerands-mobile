import { COLORS } from '@/constants/constants'
import useApi from '@/hook/useApi'
import { usePermissions } from '@/hook/usePermissions'
import { useResponsive } from '@/hook/useResponsive'
import { getAvatarColor } from '@/utils/getInitials'
import { toast } from '@/utils/toast'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Category {
    id: string;
    business_id: string;
    name: string;
    description: string;
    image: string | null;
    is_active: boolean;
    platform_category_id: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface CatModalContentProps {
    onClose: () => void;
    user_id: string;
    category: Category | null;
    reload: () => void;
}

const CategoriesModalContent = ({
    onClose,
    user_id,
    category,
    reload
}: CatModalContentProps) => {
    const { can } = usePermissions();
    const [formError, setFormError] = useState<string | null>(null);
    const {data, isLoading, error, patch} = useApi(
        '/businesses/products/category/update'
    );

    const {data: deleteCat, isLoading: loadingCat, error: errorCat, del} = useApi(
        '/businesses/products/category/delete'
    );

    const [formData, setFormData] = useState({
        business_id: category?.business_id,
        category_id: category?.id,
        name: '',
        description: ''
    });

    useEffect(() => {
        setFormData({
            business_id: category?.business_id,
            category_id: category?.id,
            name: category?.name ?? '',
            description: category?.description ?? ''
        });
    }, [category]);

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    const editCategory = async() => {
        if (!can('update_product_category')) {
            toast.info('You do not have permissions to create categories.');
            return;
        }

        if (!formData.name.trim()) {
            setFormError('Category name is required.');
            return;
        }

        // if (!formData.description.trim()) {
        //     setFormError('Description is required.');
        //     return;
        // }

        try {
            const res = await patch(formData);

            if (!res?.data?.success) {
                setFormError(res?.message || 'Failed to updated category');
                toast.error(res?.data?.message || 'Failed to updated category');
                return;
            } 
            
            if (res?.data?.success) {
                onClose();
                reload();
                toast.success(res?.data?.message || 'Category updated successfully.');
                return;
            }
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message || 'Failed to updated category.');
                toast.error(error.message || 'Failed to updated category.');
                return;
            } else {
                console.log('An unknown error occurred:', error);
                setFormError('An unknown error occurred');
                toast.error('An unknown error occurred');
                return;
            }
        }
    }

    // Delete category
    const deletCategory = async() => {
        if (!can('delete_product_category')) {
            toast.info('You do not have permissions to create categories.');
            return;
        }

        if (!category?.business_id) {
            setFormError('Business ID is required.');
            return;
        }

        if (!category?.id) {
            setFormError('Category ID is required.');
            return;
        }

        const payload = {
            business_id: category?.business_id,
            category_id: category?.id
        }

        try {
            const res = await del(payload);

            if (!res?.data?.success) {
                setFormError(res?.message || 'Failed to delete category');
                toast.error(res?.data?.message || 'Failed to delete category');
                return;
            } 
            
            if (res?.data?.success) {
                onClose();
                reload();
                toast.success(res?.data?.message || 'Category deleted successfully.');
                return;
            }
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message || 'Failed to deleted category.');
                toast.error(error.message || 'Failed to deleted category.');
                return;
            } else {
                console.log('An unknown error occurred:', error);
                setFormError('An unknown error occurred');
                toast.error('An unknown error occurred');
                return;
            }
        }
    }

    return (
        <SafeAreaView className='p-4'>
            <View className='flex-row w-full justify-between items-center'>
                <View
                    className='flex-row items-center'
                >
                    <MaterialIcons name="category" size={24} color={COLORS.green1} />
                    <Text
                        className='ml-1 text-2xl'
                        style={{fontFamily: 'outfit-medium'}}
                    >Category</Text>
                </View>
                <TouchableOpacity
                    className='rounded-full justify-center items-center'
                    style={{
                        backgroundColor: COLORS.grey_bg,
                        height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                    }}
                    onPress={onClose}
                >
                    <FontAwesome name='times' size={17} color={COLORS.red} />
                </TouchableOpacity>
            </View>

            <View
                className='mt-8 flex-1 w-full flex-row flex-wrap justify-between items-center'
            >
                <View
                    style={{
                        width: wp(30),
                        height: wp(20),
                    }}
                    className='justify-center items-center mb-5 relative'
                >
                    <View
                        style={{
                            width: wp(15),
                            height: wp(15),
                            backgroundColor: getAvatarColor(category?.id)
                        }}
                        className='rounded-full justify-center items-center'
                    >
                        <MaterialIcons name="category" size={24} color={COLORS.white} />
                    </View>
                    <View className='w-full flex-row justify-center items-center'>
                        <Text
                            className='text-base'
                        >{category?.name}</Text>
                    </View>
                </View>
            </View>

            <View className='w-full mt-6'>
                <Text
                    className='tetx-sm mb-2'
                    style={{fontFamily: 'roboto-medium'}}
                >Edit Category</Text>
                <TextInput
                    className="rounded-xl px-3"
                    style={{
                        borderWidth: 2,
                        borderColor: COLORS.lavender,
                        height: 50
                    }}
                    value={formData.name}
                    onChangeText={(value) => {
                        setFormData(prev => ({
                            ...prev,
                            name: value
                        }));

                        if (formError) {
                            setFormError(null);
                        }
                    }}
                />

                {formError && (
                    <Text className='text-red text-sm mt-4 self-center'>
                        {formError}
                    </Text>
                )}

                <TouchableOpacity
                    className='w-full mt-10 bg-green2 justify-center items-center rounded-xl py-3'
                    onPress={editCategory}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size={25} color={COLORS.white}/>
                    ) : (
                        <Text
                            className='text-xl text-white'
                            style={{fontFamily: 'outfit-medium'}}
                        >Update</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View className="relative w-full my-6 items-center justify-center">
                {/* Left line */}
                <View className="absolute left-0 right-0 h-[1px] bg-lavender" />

                {/* OR text */}
                <View className="bg-white px-4">
                    <Text className="text-slate" style={{fontFamily: 'roboto-medium'}}>OR</Text>
                </View>
            </View>

            <TouchableOpacity
                className='w-full bg-primary justify-center items-center rounded-xl py-3'
                onPress={deletCategory}
                disabled={loadingCat}
            >
                {loadingCat ? (
                    <ActivityIndicator size={25} color={COLORS.white}/>
                ) : (
                    <Text
                        className='text-lg text-white'
                        style={{fontFamily: 'outfit-medium'}}
                    >Delete Category</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default CategoriesModalContent