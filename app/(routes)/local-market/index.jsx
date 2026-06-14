import { FontAwesome } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import MainHeader from '../../../components/MainHeader'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import StoresCard from './cards/StoresCard'

const Index = () => {
    const { user_id  } = useSelector((state) => state.auth);
    const {data, isLoading, error, get} = useApi(
        `/stores/category?cat_name=local_market&user_id=${user_id || ''}`
    );

    useEffect(() => {
        get()
    }, []);

    return (
        <SafeAreaView className='flex-1 px-2 bg-white w-full items-center'>
            <View className='px-2'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Local Market'/>
            </View>

            <View
                className='justify-center items-center w-full h-full'
            >
                {(isLoading || data?.length === 0) ? (
                    <View>
                        <ActivityIndicator size={35} color={COLORS.primary}/>
                        <Text
                            className='text-lg mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Loading stores, please wait...
                        </Text>
                    </View>
                ) : data?.stores?.length === 0 ? (
                    <View className='justify-center items-center'>
                        <FontAwesome name='search' size={36} color={COLORS.slate}/>
                        <Text
                            className='text-xl mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            No stores found.
                        </Text>
                        <Text
                            className='text-base mt-4 text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            There are no listings yet in the local market category.
                        </Text>
                    </View>
                ) : error ? (
                    <View className='justify-center items-center'>
                        <FontAwesome name='exclamation-triangle' size={36} color={COLORS.red}/>
                        <Text
                            className='text-xl mt-4'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            Error occurred.
                        </Text>
                        <Text
                            className='text-base mt-4 text-slate'
                            style={{fontFamily: 'roboto-medium'}}
                        >
                            There was an error fetching the stores. Please try again later.
                        </Text>
                    </View>
                ) : data?.stores.length > 0 ? (
                    <View className='w-full flex-1 mt-8'>
                        <FlatList
                            data={data?.stores || []} // Required, but empty because actual content is in ListHeaderComponent
                            keyExtractor={(item) => item.store_id.toString()}
                            renderItem={({item}) => (
                                <StoresCard
                                    item={item}
                                />
                            )}
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={refreshing}
                            //         onRefresh={onRefresh}
                            //         colors={[COLORS.primary]}
                            //         tintColor={COLORS.primary}
                            //     />
                            // }
                            
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    )
}

export default Index