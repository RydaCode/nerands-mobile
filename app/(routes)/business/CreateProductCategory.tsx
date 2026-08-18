import Headers from '@/components/Headers'
import { COLORS } from '@/constants/constants'
import { usePermissions } from '@/hook/usePermissions'
import { useResponsive } from '@/hook/useResponsive'
import { AntDesign } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'
import OverLay from '../../OverLay'

const CreateProductCategory = () => {
    const { can } = usePermissions();
    const params = useLocalSearchParams();

    const user_id = String(params.user_id ?? '');
    const business_id = String(params.business_id ?? '');
    const display_name = String(params.display_name ?? '');
    const business_type = String(params.business_type ?? '');
    const business_category = String(params.business_category ?? '');

    const {data, isLoading, error, post} = useApi(
        '/businesses/products/category/create'
    );

    const [formData, setFormData] = useState({
        business_id: String(business_id),
        name: '',
        description: '',
        is_active: true
    });

    const handleChange = (
        field: 'name' | 'description',
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createCategory = async () => {
        if (!can('create_product_category')) {
            toast.info('You do not have permissions to create categories.');
            return;
        }

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            toast.error('Category name is required.');
            return;
        }

        const data = {
            ...formData,
            name,
            description,
        };

        try {
            const res = await post(data);

            if (!res?.success) {
                toast.error(res?.message || 'Failed to create category');
                return;
            }

            toast.success(res?.message || 'Category created successfully.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to create category.');
            } else {
                console.log('An unknown error occurred:', error);
                toast.error('An unknown error occurred');
            }
        }
    };

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    const placeHolder =
    business_category === 'fashion'
        ? 'Eg: Shoes / Dresses / Suits etc'
        : business_category === 'restaurant'
            ? 'Eg: Any / Lunch / Drinks etc'
            : 'Enter category';

    return (
        <SafeAreaView className='flex-1 bg-white p-4'>
            <View className='w-full'>
                <Headers header_name='Create Categories'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                    // handlePress={openMenu}
                />
            </View>

            <View className='flex-1 justify-center items-center mt-6'>
                <View className='w-full'>
                    <View
                        className='w-full mb-2'
                    >
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Category Name</Text>
                    </View>
                    <TextInput
                        placeholder={placeHolder}
                        onChangeText={(value) => handleChange('name', value)}
                        className='rounded-xl w-full px-3'
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 50
                        }}
                    />
                </View>

                {/* <View className='w-full mt-6'>
                    <View
                        className='w-full mb-2'
                    >
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Category Description</Text>
                    </View>
                    <TextInput
                        value={formData.description}
                        placeholder="Enter category description"
                        onChangeText={(value) => handleChange('description', value)}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="rounded-xl w-full px-3 py-3"
                        style={{
                            fontFamily: 'roboto-medium',
                            borderWidth: 2,
                            borderColor: COLORS.lavender,
                            height: 110
                        }}
                    />
                </View> */}
                <TouchableOpacity
                    className='w-full mt-10 bg-green2 justify-center items-center rounded-xl py-3'
                    onPress={createCategory}
                >
                    {isLoading ? (
                        <ActivityIndicator size={25} color={COLORS.white}/>
                    ) : (
                        <Text
                            className='text-xl text-white'
                            style={{fontFamily: 'outfit-medium'}}
                        >Create</Text>
                    )}
                </TouchableOpacity>
            </View>
            {isLoading ? (<OverLay/>) : null}
        </SafeAreaView>
    )
}

export default CreateProductCategory