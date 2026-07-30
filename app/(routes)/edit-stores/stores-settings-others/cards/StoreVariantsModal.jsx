import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS } from '../../../../../constants/constants';

const StoreVariantsModal = ({router, params, setStoreVariantsModalVisible}) => {
    // Get the window dimensions for responsiveness
    const { width } = useWindowDimensions();
    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View
                    style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    className="w-full bg-white p-4 mb-14" animation="slideInUp" duration={500} easing="ease-in-out">
                    <ScrollView className="w-full px-2" contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                        <View className="justify-center items-center">
                            <View className="w-full flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="tune" size={27} color="#2563EB" />
                                    <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                                        Variants
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setStoreVariantsModalVisible(false)}
                                    className="bg-grey_bg justify-center items-center rounded-full"
                                    style={{width: 33, height: 33}}
                                >
                                    <FontAwesome name="times" size={16} color={COLORS.red} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="h-[1px] mb-8 mt-1 w-full bg-lavender" />
                        <View className="w-full">
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '../../store-variants/ViewGroupVariants',
                                        params: {
                                            store_id: params.store_id,
                                        },
                                    })
                                }
                                className='bg-indigo-600 p-4 rounded-md mb-5 justify-center items-center'
                            >
                                <Text className='text-white text-lg' style={{fontFamily: 'outfit-medium'}}>View Groups</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '../../store-variants/CreateGroupVariants',
                                        params: {
                                            store_id: params.store_id,
                                        },
                                    })
                                }
                                className='bg-green2 p-4 rounded-md mb-4 justify-center items-center'
                            >
                                <Text className='text-white text-lg' style={{fontFamily: 'outfit-medium'}}>Create Groups</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default StoreVariantsModal