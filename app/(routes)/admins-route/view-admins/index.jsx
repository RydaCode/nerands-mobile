import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Headers from '../../../../components/Headers'
import { COLORS } from '../../../../constants/constants'
import useApi from '../../../../hook/useApi'
import { STORES_IMAGE_URI } from '../../../../RequestMethods'
import { capitalize } from '../../../../utils/capitalize'
import ViewAdminsCard from './ViewAdminsCard'

const Index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [deletingUserId, setDeletingUserId] = useState(null);
    const store_id = params.store_id;
    
    const { data, isLoading, error, get, } = useApi(
        `/stores/business/${params.business_id}/store-members/${store_id}`
    );

    useEffect(() => {
        if (store_id) {
            get(); // Fetch stores
        }
    }, [store_id]);

    const adminsList = data?.data ?? [];
    const storeCount = data?.count ?? 0;

    return (
        <SafeAreaView className='px-2 items-center bg-white flex-1'>
            <Headers fontFamily="outfit-medium" textStyles='text-2xl' header_name="Branch Members"
                icon={<FontAwesome6 name='users' size={15} color={COLORS.black}/>}
            />

            <View className='mt-8 justify-center items-center w-full flex-1'>
                {isLoading ? (
                    <View className='justify-center items-center flex-1'>
                        <ActivityIndicator size={35} color={COLORS.primary}/>
                        <Text
                            className='text-slate mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading store members...</Text>
                    </View>
                ) : error ? (
                    <View className='justify-center items-center flex-1'>
                        <FontAwesome6 name="users" size={25} color="black" />
                        <Text
                            className='text-red mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >Error loading members</Text>
                        <Text
                            className='text-slate mt-2 text-sm'
                            style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                        >This may be due to bad internet connectivity, tap button below to reload.</Text>

                        <TouchableOpacity
                            className='flex-row items-center bg-primary px-10 py-3 rounded mt-4'
                            onPress={() => get()}
                        >
                            <MaterialCommunityIcons name="reload" size={20} color="white" />
                            <Text
                                className='text-white text-base ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (adminsList?.length ?? 0) === 0 ? (
                    <View className='justify-center items-center flex-1'>
                        <FontAwesome6 name="users" size={25} color="black" />
                        <Text
                            className='text-slate mt-4'
                            style={{fontFamily: 'roboto', textAlign: 'center'}}
                        >There are no members in assigned to this store / branch.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={adminsList}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({item}) => (
                            <ViewAdminsCard
                                store_id={store_id}
                                user_id={item?.member?.user_id}
                                first_name={item?.member?.first_name}
                                last_name={item?.member?.last_name}
                                profile_image={item?.member?.profile_image}
                                phone_num={item?.member?.phone_num}
                                email_add={item?.member?.email_add}
                                updated_at={item?.created_at}
                                gender={item?.member?.gender}
                                role_name={item?.role?.name}
                                role_description={item?.role?.description}
                                role_id={item?.role?.role_id}
                                reload={get}
                                deletingUserId={deletingUserId}
                                setDeletingUserId={setDeletingUserId}
                                params={params}
                            />
                        )}

                        ListHeaderComponent={() => (
                            <>
                                <View className="w-full flex-row justify-between items-center">
                                    <View
                                        style={{ height: 63, width: 63 }}
                                        className="border-2 bg-grey_bg border-lavender rounded-full justify-center items-center"
                                    >
                                        {!params.store_profileimage ? (
                                            <FontAwesome5 name="store-alt" size={18} color="black" />
                                        ) : (
                                            <Image
                                                className="h-full w-full border-2 border-white rounded-full"
                                                source={{
                                                    uri: `${STORES_IMAGE_URI}${params.store_profileimage}`,
                                                }}
                                            />
                                        )}
                                    </View>
                                    <View className='' style={{width: '78%'}}>
                                        <Text className="text-xl" numberOfLines={1} style={{ fontFamily: 'roboto-medium' }}>
                                            {params.store_name}
                                        </Text>
                                        <Text className="text-sm text-slate" style={{ fontFamily: 'roboto' }}>
                                            {capitalize(params.store_category)}
                                        </Text>
                                    </View>
                                </View>
                                <View className='bg-grey_bg mt-8 mb-4 px-2 py-1'>
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-sm'>
                                        This store is managed by {storeCount} {storeCount === 1 ? 'member' : 'members'}
                                    </Text>
                                </View>
                            </>
                        )}
                        ListFooterComponent={<View className='pb-8' />}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default Index