import Headers from '@/components/Headers'
import AppModal from '@/components/modals/AppModal'
import { COLORS } from '@/constants/constants'
import useApi from '@/hook/useApi'
import { usePermissions } from '@/hook/usePermissions'
import { useResponsive } from '@/hook/useResponsive'
import { Category } from '@/types/category'
import { toast } from '@/utils/toast'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectProductCategory from './SelectProductCategory'

const EditBusinessProduct = () => {
    const { can } = usePermissions();
    const router = useRouter();
    const params = useLocalSearchParams();
    const user_id = String(params.user_id ?? '');
    const business_id = String(params.business_id ?? '');
    const id = String(params.id);
    const name = String(params.name ?? '');
    const category_id = String(params.category_id ?? '');
    const category_name = String(params.category_name ?? '');
    const description = String(params.description ?? '');
    const ingredients = String(params.ingredients ?? '');
    const business_category = String(params.business_category ?? '');

    console.log("PRODD", params)

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [openCatModal, setOpenCatModal] = useState(false);

    const {data: getCategories, isLoading: loadCategories, error: categoriesErrors, get} = useApi();

    const {data: updateProduct, isLoading: loadingUpdateProduct, error :errorUpdateProduct, patch} = useApi(
        `/businesses/product/update`
    );

    useEffect(() => {
        if (business_id) {
            get(`/businesses/products/categories/${business_id}`)
        }
    }, [business_id]);

    const [formData, setFormData] = useState({
        business_id,
        product_id: id,
        category_id,
        name: name ?? '',
        description: description ?? '',
        is_active: true,
        ingredients: ingredients ?? ''
    });

    useEffect(() => {
        if (selectedCategory) {
            setFormData(prev => ({
                ...prev,
                category_id: selectedCategory.id
            }));
        }
    }, [selectedCategory]);

    const handleUpdateProduct = async () => {
        if (!can('update_product')) {
            toast.error('Permission Error', 'You do not have permissions to update product.');
            return;
        }

        if (!formData.name?.trim()) {
            toast.error('Product name is required.');
            return;
        }

        if (!formData.description?.trim()) {
            toast.error('Description is required.');
            return;
        }

        if (!formData.category_id) {
            toast.error('Please select a product category.');
            return;
        }

        try {
            const response = await patch({
                business_id,
                product_id: id,
                name: formData.name.trim(),
                description: formData.description.trim(),
                category_id: formData.category_id,
                ingredients: formData.ingredients || null,
            });

            if (!response?.success) {
                toast.error(
                    response?.message || 'Failed to update product'
                );
                return;
            }

            toast.success(
                response?.message || 'Product updated successfully'
            );

            router.back();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update product');
            }
        }
    };

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    return (
        <SafeAreaView className='flex-1 bg-white p-4'>
            <View className='w-full'>
                <Headers header_name='Edit Product'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                    // handlePress={openMenu}
                />
            </View>

            <ScrollView
                className='flex-1 mt-6'
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                showsVerticalScrollIndicator={false}
            >
                <View
                    className='w-full mb-2'
                >
                    <Text
                        className='text-base mb-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Product Name</Text>

                    <TextInput
                        className='rounded-xl w-full px-3 text-sm'
                        value={formData.name}
                        onChangeText={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                name: value
                            }))
                        }
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 50
                        }}
                    />
                </View>
                <View
                    className='w-full mb-2 mt-4'
                >
                    <Text
                        className='text-base mb-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Description</Text>

                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="rounded-xl w-full px-3 py-3 text-sm"
                        value={formData.description}
                        onChangeText={(value) =>
                            setFormData(prev => ({
                                ...prev,
                                description: value
                            }))
                        }
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 110
                        }}
                    />
                </View>

                {/* Select category */}
                <View className='w-full mb-6 mt-4'>
                    <View
                        className='w-full mb-2'
                    >
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Select Category</Text>
                    </View>

                    <TouchableOpacity
                        className='flex-row justify-between items-center border-2 border-lavender rounded-xl p-3'
                        onPress={() => setOpenCatModal(true)}
                    >
                        {!selectedCategory ? (
                            <Text
                                className='text-slate text-sm'
                                style={{fontFamily: 'roboto-medium'}}
                            >{category_name}</Text>
                        ) : (
                            <Text
                                className='text-slate text-sm'
                                style={{fontFamily: 'roboto-medium'}}
                            >{selectedCategory?.name}</Text>
                        )}
                        <FontAwesome name='angle-down' color={COLORS.slate} size={24} />
                    </TouchableOpacity>
                </View>
                
                {/* Ingridients */}
                {(business_category === 'restaurant' || business_category === 'local_markte') && (
                    <View className="w-full mb-6">
                        <View className="w-full mb-2">
                            <Text
                                className="text-base"
                                style={{ fontFamily: 'roboto-medium' }}
                            >
                                Ingredients
                            </Text>
                        </View>

                        <TextInput
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="rounded-xl w-full px-3 py-3 text-sm"
                            value={formData.ingredients}
                            onChangeText={(value) =>
                                setFormData(prev => ({
                                    ...prev,
                                    ingredients: value
                                }))
                            }
                            style={{
                                fontFamily: 'roboto-medium',
                                borderWidth: 2,
                                borderColor: COLORS.lavender,
                                height: 110
                            }}
                        />
                    </View>
                )}
                
                <TouchableOpacity
                    className='w-full mt-10 bg-green2 justify-center items-center rounded-xl py-3'
                    onPress={handleUpdateProduct}
                    disabled={loadingUpdateProduct}
                >
                    {loadingUpdateProduct ? (
                        <ActivityIndicator size={25} color={COLORS.white}/>
                    ) : (
                        <Text
                            className='text-xl text-white'
                            style={{fontFamily: 'outfit-medium'}}
                        >Update</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <AppModal
                visible={openCatModal}
                onClose={() => setOpenCatModal(false)}
            >
                <SelectProductCategory
                    onClose={() => setOpenCatModal(false)}
                    user_id={user_id}
                    category={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    getCategories={getCategories}
                    reload={() => get(`/businesses/products/categories/${business_id}`)}
                />
            </AppModal>
        </SafeAreaView>
    )
}

export default EditBusinessProduct