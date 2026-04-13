import { FontAwesome5 } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../../components/MainHeader'
import useApi from '../../../../hook/useApi'
import { STORES_IMAGE_URI } from '../../../../RequestMethods'
import LoadingIndicator from '../../../LoadingIndicator'
import ViewAdminsCard from './ViewAdminsCard'

const index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const store_id = params.store_id;
    
    const { data, isLoading, error, get, } = useApi(`/stores/admins/${store_id}`);

    console.log(data)

    useEffect(() => {
        if (store_id) {
            get(); // Fetch stores
        }
    }, [store_id]);

    if (isLoading) return <LoadingIndicator loading_text="Fetching admins..." />;
    if (error) return <Text>Error: {error.message}</Text>;

    const storeList = data?.data ?? [];
    const storeCount = data?.count ?? 0;

    console.log(params.store_profileimage)

    return (
        <SafeAreaView className='px-2 items-center bg-white flex-1'>
            <View className='px-2 w-full'>
                <MainHeader fontFamily='ubutuntu-medium' textStyles='text-2xl' header_name='View Admins'/>
            </View>
            <View className='px-2 mt-8 justify-center items-center w-full'>
                <View>
                    <FlatList
                        data={storeList}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({item}) => (
                            <ViewAdminsCard
                                store_id={item.store_id}
                                user_id={item.user_id}
                                first_name={item.first_name}
                                last_name={item.last_name}
                                profile_image={item.profile_image}
                                phone_num={item.phone_num}
                                email_add={item.email_add}
                                admin_status={item.admin_status}
                                params={params}
                            />
                        )}

                        ListHeaderComponent={() => (
                            <View>
                                <View className='w-full flex-row justify-satrt items-center'>
                                    <View style={{height: 70, width: 70}} className='rounded-full border-2 border-lavender justify-center items-center'>
                                        {!params.store_profileimage ?
                                            <FontAwesome5 name="store-alt" color="#000" size={26} /> :
                                            <Image
                                                source={{uri:`${STORES_IMAGE_URI}${params.store_profileimage}`}}
                                                className='h-full w-full rounded-full border-2 border-white'
                                            />
                                        }
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg' style={{fontFamily: 'roboto-medium'}}>{params.store_name}</Text>
                                        <Text className='text-sm text-slate'>{params.store_category}</Text>
                                    </View>
                                </View>
                                <Text style={{fontFamily: 'roboto-medium'}} className='text-base mt-8'>This store is managed by {storeCount} {storeCount === 1 ? 'admin' : 'admins'}</Text>
                            </View>
                        )}
                        // ListEmptyComponent={() => (
                        //     <EmptyState
                        //         title='Items founds'
                        //         subtitle='Create store'
                        //     />
                        // )}
                        showsVerticalScrollIndicator={false}
                    />
                    <View className='pb-20' />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index