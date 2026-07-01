import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { USER_IMAGE_URI } from '../../../RequestMethods'
import EditBusinessModal from './EditBusinessModal'
import MemberDetailsModal from './MemberDetailsModal'
import MenuModal from './MenuModal'

const BusinessDetails = () => {
    const router = useRouter();
    const {id} = useLocalSearchParams();
    const [selectedMember, setSelectedMember] = useState(null);
    const [openEditBusinessModal, setOpenEditBusinessModal] = useState(false);
    const [openActionBtns, setOpenActionBtns] = useState(false);
    const {
        user_id,
    } = useSelector((state) => state.auth);

    const {data, isLoading, error, get} = useApi(
        `/businesses?user_id=${user_id}&business_id=${id}`
    );

    const {data: roles, isLoading: loadingRoles, error: errorRoles, get: getRoles} = useApi(
        `/businesses/roles/${id}`
    );

    const {data: members, isLoading: loadingMembers, error: errorMember, get: getMembers} = useApi(
        `/businesses/members/${id}`
    );

    useEffect(() => {
        if (user_id && id) {
            get();
        }
    }, [user_id, id]);

    useEffect(() => {
        if (id) {
            getRoles();
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getMembers();
        }
    }, [id]);

    const reload = () => {
        get();
    }

    const business = data?.data[0];
    const userroles = roles?.data;

    const openMenu = () => {
        setOpenActionBtns(true);
    }

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <Headers header_name='Business Hub'
                fontFamily='outfit-medium'
                textStyles='text-2xl'
                icon={<Entypo name='menu' size={24} color={COLORS.slate}/>}
                handlePress={openMenu}
            />
            <View className='h-full justify-center'>
            {isLoading ? (
                <View className='justify-center items-center'>
                    <ActivityIndicator size={40} color={COLORS.primary}/>
                    <Text
                        className='text-lg pt-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Loading business data...</Text>
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
                <View className='flex-1'>
                    <FlatList
                        data={members?.data}
                        keyExtractor={(item) => item?.member?.user_id}
                        renderItem={({item}) => (
                            <MotiView
                                from={{ opacity: 0, translateY: 80 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: "timing", duration: 800 }}
                            >
                                <View className='justify-center items-center'>
                                    <TouchableOpacity
                                        className='w-full flex-row justify-between items-center'
                                        onPress={() => setSelectedMember(item)}
                                    >
                                        <View
                                            className='border-2 border-lavender justify-center items-center rounded-full'
                                            style={{width: 63, height: 63}}
                                        >
                                            {item?.member?.profile_image === null ?
                                                <FontAwesome name="user" size={24} color={COLORS.slate} />
                                                : <Image
                                                    source={{ uri: `${USER_IMAGE_URI}${item?.member?.profile_image}` }}
                                                    style={{ height: '100%', width: '100%' }}
                                                    className='rounded-full border-2 border-white'
                                                />
                                            }
                                        </View>
                                        <View
                                            className='' style={{width: '70%'}}
                                        >
                                            <Text
                                                className='text-black text-base'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >{item?.member?.first_name} {item?.member?.last_name}</Text>
                                            <Text
                                                className='text-slate text-sm'
                                                style={{fontFamily: 'roboto'}}
                                            >{item?.role?.name || 'No role assigned'}</Text>
                                        </View>
                                        <View className=''>
                                            <Entypo name="dots-three-vertical" size={24} color={COLORS.slate} />
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{height: 1}} className='w-full bg-grey_bg my-4'/>
                                </View>
                            </MotiView>
                        )}

                        ListEmptyComponent={
                            loadingMembers ? (
                                <View className='justify-center items-center py-12'>
                                    <ActivityIndicator size={33} color={COLORS.primary}/>
                                    <Text
                                        className='text-sm text-slate pt-2'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Loading members, please wait...</Text>
                                </View>
                            ) : (
                                <View className='justify-center items-center'>
                                    <Text
                                        className='text-lg pt-2'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >No members found</Text>
                                </View>
                            )
                        }

                        ListHeaderComponent={
                            <>
                                <View className='justify-center items-center mt-6 border border-lavender p-3 rounded mb-10'>
                                    <View
                                        className='border-2 border-lavender justify-center items-center rounded-full'
                                        style={{ width: 70, height: 70 }}
                                    >
                                        <Ionicons name="business-sharp" size={30} color={COLORS.primary} />
                                    </View>
                                    <Text
                                        className='text-lg'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >{business.name}</Text>
                                    <Text
                                        className='text-sm text-black'
                                        style={{fontFamily: 'roboto'}}
                                    >
                                        {business.type.replace('_', ' ')
                                            .replace(/\b\w/g, c => c.toUpperCase())
                                        }
                                    </Text>
                                    <Text
                                        className='text-sm text-slate'
                                        style={{fontFamily: 'roboto'}}
                                    >{business.location || 'No location'}</Text>

                                    <View className='w-full flex-row justify-between items-center mt-6'>
                                        <TouchableOpacity
                                            className='flex-row rounded justify-center items-center elevation-sm py-3'
                                            style={{width: '100%', backgroundColor: COLORS.green1}}
                                            onPress={() => setOpenEditBusinessModal(true)}
                                        >
                                            <Entypo name="edit" size={17} color="white" />
                                            <Text
                                                className='text-white text-sm ml-1'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >Edit business details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text
                                    className='text-black text-2xl mb-3'
                                    style={{fontFamily: 'outfit-medium'}}
                                >Business Members</Text>
                            </>
                        }
                        contentContainerStyle={{paddingBottom: 80}}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
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
            <MemberDetailsModal
                openMemberDetails={!!selectedMember}
                setOpenMemberDetails={(value) => {
                    if (!value) setSelectedMember(null);
                }}
                item={selectedMember}
                roles={roles}
                user_id={user_id}
                business_id={id}
                reload={get}
            />

            <EditBusinessModal
                openEditBusinessModal={openEditBusinessModal}
                setOpenEditBusinessModal={setOpenEditBusinessModal}
                roles={roles}
                user_id={user_id}
                business_id={id}
                business={business}
                reload={get}
            />

            <MenuModal
                openActionBtns={openActionBtns}
                setOpenActionBtns={setOpenActionBtns}
                business_id={id}
                roles={userroles}
                user_id={user_id}
                business_name={business?.name}
                business_type={business?.type}
            />
        </SafeAreaView>
    )
}

export default BusinessDetails