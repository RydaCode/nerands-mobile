import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS } from '../../../../../constants/constants';

const StoreExtrasModal = ({router, params, setStoreExtrasModalVisible}) => {
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
                                    <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                    <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                                        Extras
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setStoreExtrasModalVisible(false)}
                                    className='bg-grey_bg justify-center items-center rounded-full'
                                    style={{width: 33, height: 33}}
                                >
                                    <FontAwesome name="times" size={15} color={COLORS.red} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="h-[1px] mb-8 mt-1 w-full bg-lavender" />
                        <View className="w-full">
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '../../store-extras/ViewStoreExtras',
                                        params: {
                                            store_id: params.store_id,
                                        },
                                    })
                                }
                                className='bg-indigo-600 py-4 rounded-md mb-5 justify-center items-center'
                            >
                                <Text className='text-white text-lg' style={{fontFamily: 'outfit-medium'}}>View Extras</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                    pathname: '../../store-extras/CreateStoreExtras',
                                        params: {
                                            store_id: params.store_id,
                                        },
                                    })
                                }
                                className='bg-green2 py-4 rounded-md mb-4 justify-center items-center'
                            >
                                <Text className='text-white text-lg' style={{fontFamily: 'outfit-medium'}}>Create Extras</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default StoreExtrasModal