import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { usePermissions } from '../../../hook/usePermissions';
import { STORES_IMAGE_URI } from '../../../RequestMethods';
import { capitalize } from '../../../utils/capitalize';
import { formatText, getAvatarColor, getInitials } from '../../../utils/getInitials';
import { toast } from '../../../utils/toast';
import AdminStoresCard from './AdminStoresCard';

const Index = () => {
    const { can } = usePermissions();
    const {
        business_id,
        display_name,
        legal_name,
        business_type,
        business_category,
        email,
        country,
        logo_url,
        phone,
        province,
        registration_number,
        status,
        t_pin,
        tax_number,
        city
    } = useLocalSearchParams();
    const { user_id } = useSelector((state) => state.auth);
    const router = useRouter();

    const { data, isLoading, error, get, } = useApi(`/stores/business/${business_id}`);

    useEffect(() => {
        if (business_id) {
            get(); // Fetch stores
        }
    }, [business_id]);

    const storeList = data?.data?.data ?? [];
    const storeCount = data?.data?.count ?? 0;

    const reload = () => {
        get();
    }

    console.log(business_type)

    return (
        <SafeAreaView className="flex-1 px-2 items-center bg-white">
            <Headers
                header_name='Branches'
                fontFamily='outfit-medium'
                textStyles='text-2xl'
                icon={
                    <FontAwesome5 name="store-alt" size={15} color={COLORS.slate} />
                }
            />
            {isLoading ? (
                <View className='w-full h-full justify-center items-center'>
                    <ActivityIndicator size={35} color={COLORS.primary}/>
                    <Text className='text-base text-slate mt-4' style={{fontFamily: 'roboto-medium'}}>
                        Loading stores and branches...
                    </Text>
                </View>
            ) : (storeCount === 0) ? (
                <View className="flex-1 justify-center items-center w-full">
                    <FontAwesome5 name="store-alt" size={25} color={COLORS.slate} />
                    <Text
                        className='text-slate text-sm mt-4'
                        style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}>
                        {display_name} has no stores yet. Create one to get started.
                    </Text>
                    
                    <TouchableOpacity
                        style={{width: '50%'}}
                        className='mt-4 bg-primary py-3 justify-center items-center rounded elevation-sm'

                        onPress={() => {
                            if (!can('create_store')) {
                                toast.error('You do not have permissions to create branches / stores');
                                return;
                            }

                            router.push({
                                pathname: '../create-store',
                                params: {
                                    business_id: business_id,
                                    display_name,
                                    legal_name,
                                    business_type,
                                    business_category: business_category,
                                    email: email,
                                    country: country,
                                    logo_url: logo_url,
                                    phone: phone,
                                    province: province,
                                    registration_number: registration_number,
                                    status: status,
                                    t_pin: t_pin,
                                    tax_number: tax_number,
                                    city: city
                                }
                            });
                        }}
                    >
                        <Text
                            className='text-white text-xl'
                            style={{fontFamily: 'outfit-medium'}}
                        >Create</Text>
                    </TouchableOpacity>
                </View>
            ) : error ? (
                <View className='w-full h-full justify-center items-center'>
                    <MaterialCommunityIcons name="connection" size={25} color={COLORS.slate} />
                    <Text
                        className='text-slate text-sm mt-4'
                        style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}
                    >
                        Failed to load data. Check your internet connection and tap below to retry.
                    </Text>

                    <TouchableOpacity
                        style={{width: '50%'}}
                        className='mt-4 flex-row bg-primary py-3 justify-center items-center rounded elevation-sm'

                        onPress={() => {
                            if (!can('view_stores')) {
                                toast.error('You do not have permission to view branches / stores');
                                return;
                            }
                            reload();
                        }}
                    >
                        <AntDesign name="reload" size={17} color="white" />
                        <Text
                            className='text-white text-xl ml-2'
                            style={{fontFamily: 'outfit-medium'}}
                        >Reload</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className='w-full'>
                    <FlatList
                        data={storeList}
                        keyExtractor={(item) => item.store_id?.toString() ?? Math.random().toString()}
                        renderItem={({ item }) => (
                            <AdminStoresCard
                                {...item}
                                business_id={business_id}
                                legal_name={legal_name}
                                display_name={display_name}
                                business_type={business_type}
                                business_category={business_category}
                                router={router}
                            />
                        )}
                        ListHeaderComponent={() => (
                            <View className='w-full'>
                                <View className="flex-row mb-8 bg-grey_bg w-full mt-4 px-2 items-center justify-between rounded py-1">
                                    <View
                                        className='border justify-center items-center rounded bg-lavender border-white'
                                        style={{width: '11%', height: 33}}
                                    >
                                        <FontAwesome5 name="store-alt" size={16} style={{ color: COLORS.primary }} />
                                    </View>
                                    <Text style={{ fontFamily: 'roboto', width: '86%', textAlign: 'justify' }} className="ml-1 text-sm">
                                        You have <Text className='text-green2'>{storeCount}</Text> {storeCount === 1 ? 'store / brach running under' : 'stores / branches running under'}
                                        <Text className='text-green2'> {capitalize(legal_name)}</Text>
                                    </Text>
                                </View>

                                <View className='flex-row justify-between items-center mb-10'>
                                    <View
                                        className='border-2 border-lavender justify-center items-center rounded-full'
                                        style={{height: 70, width: 70, backgroundColor: getAvatarColor(business_id)}}
                                    >
                                        {!logo_url ? (
                                            <Text
                                                className='text-white'
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'roboto-medium',
                                                    fontSize: 20,
                                                }}
                                            >{getInitials(display_name)}</Text>
                                        ) : (
                                            <Image style={{}} className='w-full h-full rounded-full border-2 border-white'
                                                source={{uri:`${STORES_IMAGE_URI}${logo_url}`}}
                                            />
                                        )}
                                    </View>
                                    <View
                                        style={{width: '77%'}}
                                        className=''
                                    >
                                        <Text
                                            className='text-xl'
                                            numberOfLines={2}
                                            style={{fontFamily: 'roboto-medium'}}
                                        >
                                            {capitalize(display_name)}
                                        </Text>
                                        <Text
                                            className='text-sm text-slate'
                                            numberOfLines={2}
                                            style={{fontFamily: 'roboto-medium'}}
                                        >
                                            {capitalize(formatText(business_type))}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListFooterComponent={<View className='mb-8'/>}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default Index;