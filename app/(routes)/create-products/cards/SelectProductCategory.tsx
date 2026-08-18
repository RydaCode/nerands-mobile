import { COLORS } from '@/constants/constants';
import { useResponsive } from '@/hook/useResponsive';
import type { CategoriesResponse, Category } from '@/types/category';
import { getAvatarColor } from '@/utils/getInitials';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CatModalContentProps {
    onClose: () => void;
    user_id: string;
    category: Category | null;

    setSelectedCategory: React.Dispatch<
        React.SetStateAction<Category | null>
    >;

    getCategories: CategoriesResponse | null;

    reload: () => void;
}

const SelectProductCategory = ({
    onClose,
    user_id,
    category,
    setSelectedCategory,
    getCategories,
    reload
}: CatModalContentProps) => {

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    const categoryCount = getCategories?.data.length ?? 0;
    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-row w-full justify-between items-center p-4'>
                <View
                    className='flex-row items-center'
                >
                    <MaterialIcons name="category" size={24} color={COLORS.green1} />
                    <Text
                        className='ml-1 text-2xl'
                        style={{fontFamily: 'outfit-medium'}}
                    >Categories</Text>
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

            <View className='flex-1 items-center'>
                <Text
                    style={{ fontFamily: 'roboto-medium' }}
                    className="text-sm mt-3"
                >
                    There {categoryCount === 1 ? 'is' : 'are'} {categoryCount} product categor{categoryCount === 1 ? 'y' : 'ies'} in this business
                </Text>

                <FlatList
                    data={getCategories?.data ?? []}
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
                                setSelectedCategory(item);
                                onClose();
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
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

export default SelectProductCategory