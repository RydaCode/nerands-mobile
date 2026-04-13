import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';

const TodayOrders = (params) => {
    const router = useRouter();
    console.log(params)

    return (
        <View className='justify-center items-center mt-1'>
            <FlatList
                data={[]}
                ListHeaderComponent={() => (
                    <View className='justify-center items-center mt-4'>
                        <View className='w-full mb-2'>
                            <Text className='text-lg mb-2' style={{fontFamily: 'roboto-medium'}}>You have 2 orders today</Text>
                            <Text className='text-base text-red' style={{textAlign: 'center'}}>
                                Make sure you complete all accepted errands today to avoid inconveniencing customers.
                            </Text>
                        </View>
                        <TouchableOpacity
                            className='elevation-sm w-full border border-lavender rounded mb-8 p-2 bg-white'
                            onPress={() => router.push({
                                pathname: 'runner-single-order',
                                params: {
                                    router: router,
                                    runner_id:params.zrunner_id
                                }
                            })}
                        >
                            <View className='items-center'>
                                <View className='w-full flex-row justify-start items-center mb-0.5'>
                                    <Entypo name='box' size={16} color={COLORS.primary}/>
                                    <Text className='ml-2 text-lg text-black' style={{fontFamily: 'roboto-medium'}}>202315678</Text>
                                </View>
                                <View className='w-full flex-row justify-between items-center'>
                                    <View className='flex-row justify-start items-center'>
                                        <Entypo name='location' size={16} color={COLORS.primary}/>
                                        <Text className='text-base ml-2 text-slate' style={{fontFamily: 'roboto-medium'}}>
                                            Ndola
                                        </Text>
                                        <View className='bg-grey_bg ml-3 px-2 py-1 rounded-full'>
                                            <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                                1170.85Km
                                            </Text>
                                        </View>
                                    </View>
                                    <View className='border border-lavender rounded p-2'>
                                        <Text className='ml-2 text-base text-black' style={{fontFamily: 'roboto-medium'}}>View Order</Text>
                                    </View>
                                </View>
                            </View>
                            <View className='flex-row mt-4 justify-between items-center'>
                                <View className='w-[48.5%] py-2 justify-center items-center bg-navBtnBgHome rounded'>
                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                                        TYPE: <Text className='ml-1 text-green2 text-base' style={{fontFamily: 'roboto-medium'}}>CUSTOM</Text>
                                    </Text>
                                </View>
                                <View className='w-[48.5%] py-2 justify-center items-center bg-red rounded'>
                                    <Text className='ml-1 text-white text-base' style={{fontFamily: 'roboto-medium'}}>PENDING</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },

    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },

    large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
})

export default TodayOrders