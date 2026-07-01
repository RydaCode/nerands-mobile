import { Entypo, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';

const Index = () => {
    const router = useRouter();
    const {
        user_id,
    } = useSelector((state) => state.auth);

    const params = useLocalSearchParams();
    const {data, isLoading, error, get} = useApi(
        `/businesses/${user_id}`
    );

    useEffect(() => {
        if (user_id) {
            get();   
        }
    }, [user_id]);

    const reload = () => {
        get();
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <Headers header_name='Business Hub' fontFamily='outfit-medium' textStyles='text-2xl' icon={<Ionicons name='business-sharp' size={15} color={COLORS.slate}/>}/>
            <View className='mt-4'>
                <TouchableOpacity
                    className='border-2 justify-center items-center py-2 rounded bg-white'
                    style={{borderColor: COLORS.extra_blue, width: '37%'}}
                >
                    <Entypo name='plus' size={24} color={COLORS.extra_blue}/>
                    <Text
                        style={{fontFamily: 'roboto-medium', color: COLORS.extra_blue}}
                    >Create Business</Text>
                </TouchableOpacity>
            </View>
            <View className='pt-4 justify-center h-full'>
                {isLoading ? (
                    <View className='justify-center items-center'>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading businesses...</Text>
                    </View>
                ) : error && (error.status === 500 || error.message === 'Server is unreachable. Please try again later.') ? (
                    <View className='justify-center items-center'>
                        <MaterialCommunityIcons name="connection" size={40} color={COLORS.slate} />
                        <Text
                            className='text-lg text-red mt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Connection to server lost.</Text>
                        <Text
                            className='text-base text-slate pt-2'
                            style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                        >Please check your network & try reload the app</Text>

                        <TouchableOpacity
                            className='flex-row bg-primary justify-center items-center mt-4 px-8 rounded py-3 elevation-sm'
                            onPress={() => reload()}
                        >
                            <MaterialCommunityIcons name="reload" size={20} color="white" />
                            <Text
                                className='text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (!data) ? (
                    <View className='flex-1 justify-center items-center'>
                        <Text
                            className='text-lg text-red pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Failed to load account data.</Text>
                        <Text
                            className='text-base text-slate pt-2'
                            style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                        >This may be due to bad internet connectivity, press button below to reload</Text>

                        <TouchableOpacity
                            className='flex-row bg-primary justify-center items-center mt-4 px-8 rounded py-3 elevation-sm'
                            onPress={() => reload()}
                        >
                            <MaterialCommunityIcons name="reload" size={20} color="white" />
                            <Text
                                className='text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (data) ? (
                    <FlatList
                        data={data?.data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className='mb-6 flex-row items-center border border-lavender p-2 rounded-xl elevation-sm bg-white'
                                onPress={() => router.push(`/business/${item.id}`)}
                            >
                                <View
                                    className='border-2 border-lavender justify-center items-center rounded-full'
                                    style={{ width: 60, height: 60 }}
                                >
                                    <Ionicons name="business-sharp" size={24} color={COLORS.primary} />
                                </View>

                                <View className='ml-2' style={{width: '80%'}}>
                                    <Text
                                        className='text-base'
                                        style={{ fontFamily: 'roboto-medium', color: COLORS.black }}
                                    >
                                        {item.name}
                                    </Text>

                                    <View className='w-full flex-row justify-between items-center'>
                                        <Text className='text-slate text-sm'>
                                            {item.type.replace('_', ' ')
                                                .replace(/\b\w/g, c => c.toUpperCase())
                                            }
                                        </Text>
                                        <Feather name="arrow-right-circle" size={23} color={COLORS.primary} />
                                    </View>
                                    <View className='w-full flex-row justify-end'>
                                        <Text className='text-green1 text-sm'>
                                            Created on: {new Date(item.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListHeaderComponent={
                            <View>
                                <Text
                                    className='text-lg mb-2'
                                    style={{ fontFamily: 'roboto-medium', color: COLORS.black }}
                                >
                                    Manage Your Businesses
                                </Text>

                                <View className='bg-grey_bg w-full rounded-2xl justify-center items-center p-2 mb-4'>
                                    <Text
                                        className='text-sm'
                                        style={{ fontFamily: 'roboto-regular', color: COLORS.gray }}
                                    >
                                        You have {data?.data?.length || 0} business{data?.data?.length === 1 ? '' : 'es'} running on Nerands
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                ): (
                    <View className='flex-1 justify-center items-center'>
                        <Text
                            className='text-base pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Failed to load user data, please reload the app.
                        </Text>
                    </View>
                )}
            </View>
            {/* Reserved for tabs */}
            {/* <Text>Tabs</Text> */}
        </SafeAreaView>
    )
}

export default Index