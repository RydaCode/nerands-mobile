import { Entypo, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { STORES_IMAGE_URI } from '../../../RequestMethods';
import { formatDate } from '../../../utils/formatDateTime';
import { getAvatarColor, getFirstLetter } from '../../../utils/getInitials';

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

    console.log(data)

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-2'>
                <Headers header_name='Business Hub' fontFamily='outfit-medium' textStyles='text-2xl' icon={<Ionicons name='business-sharp' size={15} color={COLORS.slate}/>}/>
            </View>
            <View className='flex-1 pt-4 px-2'>
                {isLoading ? (
                    <View className='justify-center items-center flex-1'>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading businesses...</Text>
                    </View>
                ) : error && (error.status === 500 || error.message === 'Server is unreachable. Please try again later.') ? (
                    <View className='justify-center items-center flex-1'>
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
                ) : (data?.length === 0) ? (
                    <View className='flex-1 justify-center items-center'>
                        <Text
                            className='text-lg text-red pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Failed to load business data.</Text>
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
                                className='mb-6 flex-row items-center border border-lavender p-2 rounded-xl bg-white'
                                onPress={() => router.push(`/business/${item.id}`)}
                            >
                                <View
                                    className='border-2 border-lavender justify-center items-center rounded-full'
                                    style={{ width: 60, height: 60, backgroundColor: getAvatarColor(item.id) }}
                                >
                                    {!item?.logo_url ? (
                                        <Text
                                            className='text-white'
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: 'roboto-medium',
                                                fontSize: 20,
                                            }}
                                        >{getFirstLetter(item?.legal_name)}</Text>
                                    ) : (
                                        <Image
                                            source={{ uri: `${STORES_IMAGE_URI}${item?.logo_url}` }}
                                            style={{ height: '100%', width: '100%' }}
                                            className='rounded-full border-2 border-white'
                                        />
                                    )}
                                </View>

                                <View className='ml-2' style={{width: '80%'}}>
                                    <Text
                                        className='text-base'
                                        style={{ fontFamily: 'roboto-medium', color: COLORS.black }}
                                    >
                                        {item.legal_name}
                                    </Text>

                                    <View className='w-full flex-row justify-between items-center'>
                                        <Text className='text-slate text-sm'>
                                            {item.business_type.replace('_', ' ')
                                                .replace(/\b\w/g, c => c.toUpperCase())
                                            }
                                        </Text>
                                        <Feather name="arrow-right-circle" size={23} color={COLORS.primary} />
                                    </View>
                                    <View className='w-full flex-row justify-end'>
                                        <Text className='text-green1 text-sm'>
                                            Created on: {formatDate(item?.created_at)}
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
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View className='mb-6'/>}
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
            
            {/* Bottom create business button */}
            <View className='bg-white relative border-r border-l border-grey_bg py-5'>
                <View className='absolute top-0 left-0 h-[1px] w-[41%] bg-grey_bg' />
                <View className='absolute top-0 right-0 h-[1px] w-[41%] bg-grey_bg' />

                <TouchableOpacity
                    className='absolute -top-7 self-center'
                    onPress={() => router.push({
                        pathname: '/business/CreateBusiness',
                        params: {
                            user_id: user_id,
                        }
                    })}
                >
                    <View className='bg-white w-14 h-14 elevation-sm rounded-full justify-center items-center border-2 border-white'>
                        <Entypo name='plus' size={25} color={COLORS.primary}/>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Index