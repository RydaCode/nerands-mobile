import AppModal from '@/components/modals/AppModal'
import { COLORS } from '@/constants/constants'
import { RootState } from '@/hook/storeTypes'
import useApi from '@/hook/useApi'
import { useResponsive } from '@/hook/useResponsive'
import { getAvatarColor } from '@/utils/getInitials'
import { toast } from '@/utils/toast'
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Headers from '../../../components/Headers'
import { usePermissions } from '../../../hook/usePermissions'
import CategoriesModalContent from './CategoriesModalContent'

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

interface CategoriesResponse {
    success: boolean;
    data: Category[];
}

interface CategoriesProps {
    user_id: string,
    business_id: string,
    display_name: string,
    business_type: string,
    business_category: string
}

interface CategoriesResponse {
    data: Category[];
}

const ProductCategories = () => {
    const { can } = usePermissions();
    const {
        // user_id,
        business_id,
        display_name,
        business_type,
        business_category
    } = useLocalSearchParams();

    const { user_id } = useSelector(
        (state: RootState) => state.auth
    );
    
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [openCatModal, setOpenCatModal] = useState(false);
    
    const { data, isLoading, error, get } = useApi() as {
        data: CategoriesResponse | null;
        isLoading: boolean;
        error: unknown;
        get: (url: string) => void;
    };

    useEffect(() => {
        if (business_id) {
            get(`/businesses/products/categories/${business_id}`);
        }
    }, [business_id]);

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    const categoryCount = data?.data.length ?? 0;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-3'>
                <Headers header_name='Product Categories'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={<AntDesign name="product" size={18} color={COLORS.primary} />}
                    // handlePress={openMenu}
                />
            </View>
            <View className='flex-1 px-3 items-center'>
                <Text
                    style={{ fontFamily: 'roboto-medium' }}
                    className="text-sm mt-3"
                >
                    There {categoryCount === 1 ? 'is' : 'are'} {categoryCount} product categor{categoryCount === 1 ? 'y' : 'ies'} in this business
                </Text>

                <FlatList
                    data={data?.data ?? []}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={{
                        paddingTop: 30,
                        paddingBottom: 20,
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                width: wp(30),
                                height: wp(20),
                            }}

                            className="justify-center items-center mb-5"
                            onPress={() => {
                                if (!can('update_product_category')) {
                                    toast.info('You do not have permissions to update categories');
                                    return;
                                }

                                setOpenCatModal(true);
                                setSelectedCategory(item);
                            }}
                        >
                            <View
                                style={{
                                    width: wp(15),
                                    height: wp(15),
                                    backgroundColor: getAvatarColor(item.id)
                                }}
                                className="rounded-full justify-center items-center"
                            >
                                <MaterialIcons
                                    name="category"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </View>

                            <View className="w-full flex-row justify-center items-center">
                                <Text
                                    className="text-sm"
                                    style={{ fontFamily: 'roboto-medium' }}
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>

                                <FontAwesome
                                    name="pencil"
                                    color={COLORS.green2}
                                    size={16}
                                    style={{ marginLeft: 5 }}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Bottom create business button */}
            <View className='bg-white relative border-r border-l border-grey_bg py-5'>
                <View className='absolute top-0 left-0 h-[1px] w-[41%] bg-grey_bg' />
                <View className='absolute top-0 right-0 h-[1px] w-[41%] bg-grey_bg' />

                <TouchableOpacity
                    className='absolute -top-7 self-center'
                    onPress={() => router.push({
                        pathname: './CreateProductCategory',
                        params: {
                            user_id,
                            business_id,
                            display_name,
                            business_type,
                            business_category
                        }
                    })}
                >
                    <View className='bg-white w-14 h-14 elevation-sm rounded-full justify-center items-center border-2 border-white'>
                        <Entypo name='plus' size={25} color={COLORS.primary}/>
                    </View>
                </TouchableOpacity>
            </View>

            <AppModal
                visible={openCatModal}
                onClose={() => setOpenCatModal(false)}
            >
                <CategoriesModalContent
                    onClose={() => setOpenCatModal(false)}
                    user_id={user_id}
                    category={selectedCategory}
                    reload={() => get(`/businesses/products/categories/${business_id}`)}
                />
            </AppModal>

            {/* <AppModal
                visible={openCreateCatModal}
                onClose={() => setOpenCreateCatModal(false)}
            >
                <CreateCategoryModalContent
                    onClose={() => setOpenCreateCatModal(false)}
                    user_id={user_id}
                />
            </AppModal> */}
        </SafeAreaView>
    )
}

export default ProductCategories