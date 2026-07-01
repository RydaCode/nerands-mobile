import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import RoleAndPermisionsModal from './RoleAndPermisionsModal';

const BusinessRoles = () => {
    const params = useLocalSearchParams();
    const [selectedRole, setSelectedRole] = useState(null);

    const {data: roles, isLoading: loadingRoles, error: errorRoles, get: getRoles} = useApi(
        `/businesses/roles/${params.business_id}`
    );

    useEffect(() => {
        if (params.business_id) {
            getRoles();
        }
    }, [params.business_id]);

    const userroles = roles?.data;

    const reloadPermissions = () => {
        getRoles();
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-2 justify-between items-center'>
            <Headers header_name='Business Roles'
                fontFamily='outfit-medium'
                textStyles='text-2xl'
                icon={<Ionicons name='business-sharp' size={17} color={COLORS.slate}/>}
                // handlePress={openMenu}
            />

            <View className='flex-1 w-full'>
                {loadingRoles ? (
                    <View className='justify-center items-center flex-1'>
                        <ActivityIndicator size={37} color={COLORS.primary}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading business roles...</Text>
                    </View>
                ) : !roles ? (
                    <View className='justify-center items-center flex-1'>
                        <ActivityIndicator size={37} color={COLORS.primary}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading business roles...</Text>
                    </View>
                ) : roles ? (
                  <FlatList
                        data={userroles}
                        keyExtractor={(item) => item?.id}
                        renderItem={({item}) => (
                            <View className='flex-1 border border-lavender rounded-xl px-2 py-4 mb-6'>
                                <TouchableOpacity
                                    className='flex-row justify-between items-center'
                                    onPress={() => setSelectedRole(item)}
                                >
                                    <View className='flex-row items-center'
                                        style={{width: '90%'}}
                                    >
                                        <View
                                            className='border-2 border-lavender rounded-full justify-center items-center'
                                            style={{width: 45, height: 45}}
                                        >
                                            <AntDesign name="team" size={21} color={COLORS.primary} />
                                        </View>
                                        <View
                                            className='ml-2'
                                            style={{width: '82%'}}
                                        >
                                            <Text
                                                style={{fontFamily: 'roboto-medium'}}
                                                className='text-base'
                                            >{item?.name}</Text>
                                            <Text className='text-slate text-sm'>
                                                Created on: {new Date(item?.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className='' style={{width: '7%'}}>
                                        <Entypo name="dots-three-vertical" size={17} color={COLORS.slate} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        showsVerticalScrollIndicator={false}

                        ListHeaderComponent={
                            <View className='my-6 w-full justify-center items-center' style={{}}>
                                <View className='w-full justify-center items-center px-2 bg-grey_bg py-2 rounded-xl'>
                                    <Text
                                        style={{fontFamily: 'roboto-medium'}}
                                        className='text-base text-green1'
                                    >Tap on a role to view its details and permissions</Text>
                                </View>
                            </View>
                        }
                        
                        ListFooterComponent={
                            <View className='mb-6' style={{height: 1}}/>
                        }
                    />  
                ) : errorRoles ? (
                    <View className='justify-center items-center flex-1'>
                        <FontAwesome name='search' size={37} color={COLORS.slate}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading business roles...</Text>
                    </View>
                ) : null}
            </View>

            <RoleAndPermisionsModal
                openRoleAndPermisionsModal={!!selectedRole}
                setOpenRoleAndPermisionsModal={(value) => {
                    if (!value) setSelectedRole(null);
                }}
                item={selectedRole}
                business_id={params.business_id}
                user_id={params.user_id}
                reloadPermissions={reloadPermissions}
            />
        </SafeAreaView>
    )
}

export default BusinessRoles