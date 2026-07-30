import { AntDesign, Entypo, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { usePermissions } from '../../../hook/usePermissions'
import { clearBusinessContext, setPermissions } from '../../../redux/store/slices/permissionsSlice'
import { STORES_IMAGE_URI, USER_IMAGE_URI } from '../../../RequestMethods'
import { formatDate } from '../../../utils/formatDateTime'
import { getAvatarColor, getFirstLetter, getInitials } from '../../../utils/getInitials'
import { toast } from '../../../utils/toast'
import ChamgeProfileImageModal from './ChamgeProfileImageModal'
import MemberDetailsModal from './MemberDetailsModal'
import MenuModal from './MenuModal'

const BusinessDetails = () => {
    const { can } = usePermissions();
    const router = useRouter();
    const dispatch = useDispatch();
    const {id} = useLocalSearchParams();
    const [selectedMember, setSelectedMember] = useState(null);
    const [openEditBusinessModal, setOpenEditBusinessModal] = useState(false);
    const [openActionBtns, setOpenActionBtns] = useState(false);
    const [openChnageProfileImage, setOpenChnageProfileImage] = useState(false);
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

    // Get the role of the logged in user for this business
    const {data: userData, isLoading: userLoading, error: userError, get: getUserData} = useApi(
        `/businesses/member/role/${id}`
    );

    // Get the permissions of the logged in user for this business
    const {data:userPermissions, isLoading: permissionsLoading, error: permissionsError, get: getUserPermissions} = useApi();

    // Fetch branches
    const { data: branches, isLoading: loadingBranches, error: errorBranches, get: getBranches, } = useApi(`/stores/business/${id}`);
    
    useEffect(() => {
        if (id) {
            getBranches(); // Fetch stores
        }
    }, [id]);

    const storeCount = branches?.data?.count ?? 0;

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

    useEffect(() => {
        if (user_id && id) {
            getUserData();
        }
    }, [user_id, id]);

    useEffect(() => {
        if (userData?.data[0]?.role?.id) {
            getUserPermissions(`/businesses/role/permissions/${userData?.data[0]?.role?.id}`);
        }
    }, [userData?.data[0]?.role?.id]);

    useEffect(() => {
        const response = userPermissions?.data;

        if (!response || !response.length) return;

        // 1. clear old business context first
        dispatch(clearBusinessContext());

        // 2. build permission map
        const permissionMap = response.reduce((acc, permission) => {
            acc[permission.key] = true;
            return acc;
        }, {});

        // 3. set new permissions
        dispatch(setPermissions(permissionMap));
    }, [userPermissions?.data]);

    const reload = async() => {
        await get();
    }

    const business = data?.data[0];
    const userroles = roles?.data;

    const filteredMembers = members?.data?.filter(item => {
        // If member is OWNER
        if (item?.role?.name === 'OWNER') {
            return can('view_owner_members');
        }

        return true;
    });

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
                        data={filteredMembers}
                        keyExtractor={(item) => item?.member?.user_id}
                        renderItem={({item}) =>{
                            return (
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
                                            style={{width: 63, height: 63, backgroundColor: getAvatarColor(item?.member?.user_id)}}
                                        >
                                            {item?.member?.profile_image === null ?
                                                <Text
                                                    className='text-white'
                                                    numberOfLines={1}
                                                    style={{
                                                        fontFamily: 'roboto-medium',
                                                        fontSize: 30,
                                                    }}
                                                >{getInitials(item?.member?.first_name)}</Text>
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
                        )}}

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
                                <View className='justify-center items-center mt-6 p-3 rounded mb-10'>
                                    <TouchableOpacity
                                        className='border-2 border-lavender relative justify-center items-center rounded-full'
                                        style={{ width: 80, height: 80, backgroundColor: getAvatarColor(business?.id) }}
                                        onPress={() => setOpenChnageProfileImage(true)}
                                    >
                                        <View
                                            style={{width: 32, height: 32, right: -14, top: -4, zIndex: 5}}
                                            className='absolute bg-lavender justify-center items-center rounded-full border-2 border-white'
                                        >
                                            <FontAwesome name='camera' color={COLORS.primary}/>
                                        </View>
                                        {!business?.logo_url ? (
                                            <Text
                                                className='text-white'
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'roboto-medium',
                                                    fontSize: 30,
                                                }}
                                            >{getFirstLetter(business?.legal_name)}</Text>
                                        ) : (
                                            <Image
                                                source={{ uri: `${STORES_IMAGE_URI}${business?.logo_url}` }}
                                                style={{ height: '100%', width: '100%' }}
                                                className='rounded-full border-2 border-white'
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <Text
                                        className='text-lg'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >{business?.legal_name}</Text>
                                    <Text
                                        className='text-sm text-black'
                                        style={{fontFamily: 'roboto'}}
                                    >
                                        {business?.business_type.replace('_', ' ')
                                            .replace(/\b\w/g, c => c.toUpperCase())
                                        }
                                    </Text>
                                    <Text
                                        className='text-sm text-slate'
                                        style={{fontFamily: 'roboto'}}
                                    >{business?.address || 'No location'}</Text>
                                    <View className='bg-white px-2 w-full justify-center items-center rounded-2xl py-1 mt-2'>
                                        <Text
                                            className='text-sm text-slate'
                                            style={{fontFamily: 'roboto'}}
                                        >
                                            Registration date: {formatDate(business?.created_at) || 'No location'}
                                        </Text>
                                    </View>

                                    <View
                                        className='my-6 flex-row justify-center items-center w-full'
                                    >
                                        <TouchableOpacity
                                            className='justify-center items-center'
                                            style={{width: '29%'}}
                                            onPress={() => {
                                                if (!can('view_stores')) {
                                                    toast.error('You do not have permission to view branches / stores');
                                                    setOpenActionBtns(false);
                                                    return;
                                                }
        
                                                router.push({
                                                    pathname: '../admin-stores',
                                                    params: {
                                                        business_id: id,
                                                        display_name: business?.display_name,
                                                        legal_name: business?.legal_name,
                                                        business_type: business?.business_type,
                                                        business_category: business?.category_id,
                                                        email: business?.email,
                                                        country: business?.country,
                                                        logo_url: business?.logo_url,
                                                        phone: business?.phone,
                                                        province: business?.province,
                                                        registration_number: business?.registration_number,
                                                        status: business?.status,
                                                        t_pin: business?.t_pin,
                                                        tax_number: business?.tax_number,
                                                        city: business?.city
                                                    }
                                                });
                                            }}
                                        >
                                            <View className='flex-row justify-center items-center'>
                                                <FontAwesome5 name='store-alt' color={COLORS.slate}/>
                                                <Text
                                                    className='text-base text-slate ml-1'
                                                    style={{fontFamily: 'roboto'}}
                                                >{storeCount || 0}</Text>
                                            </View>
                                            <Text
                                                className='text-sm text-slate'
                                                style={{fontFamily: 'roboto'}}
                                            >Branches</Text>
                                        </TouchableOpacity>
                                        <View className='bg-grey_bg mx-1' style={{width: 1, height: 27}}/>
                                        <View
                                            className='justify-center items-center'
                                            style={{width: '30%'}}
                                        >
                                            <View className='flex-row justify-center items-center'>
                                                <FontAwesome6 name='users' color={COLORS.slate}/>
                                                <Text
                                                    className='text-base text-slate ml-1'
                                                    style={{fontFamily: 'roboto'}}
                                                >{members?.data?.length || 0}</Text>
                                            </View>
                                            <Text
                                                className='text-sm text-slate'
                                                style={{fontFamily: 'roboto'}}
                                            >Members</Text>
                                        </View>
                                        <View className='bg-grey_bg mx-1' style={{width: 1, height: 27}}/>
                                        <TouchableOpacity
                                            className='justify-center items-center'
                                            style={{width: '30%'}}

                                            onPress={() => {
                                                if (!can('view_roles')) {
                                                    toast.error('You do not have permissions to view roles');
                                                    setOpenActionBtns(false);
                                                    return;
                                                }
        
                                                router.push({
                                                pathname: './BusinessRoles',
                                                params: {
                                                    business_id: id,
                                                    user_id: user_id
                                                }
                                            })}}
                                        >
                                            <View className='flex-row justify-center items-center'>
                                                {/* <FontAwesome5 name='user-shield' color={COLORS.slate}/> */}
                                                <AntDesign name="team" size={15} color={COLORS.primary} />
                                                <Text
                                                    className='text-base text-slate ml-1'
                                                    style={{fontFamily: 'roboto'}}
                                                >{userroles?.length || 0}</Text>
                                            </View>
                                            <Text
                                                className='text-sm text-slate'
                                                style={{fontFamily: 'roboto'}}
                                            >Roles</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className='w-full flex-row justify-between items-center'>
                                        <TouchableOpacity
                                            className='flex-row rounded justify-center items-center elevation-sm py-3'
                                            style={{width: '63%', backgroundColor: COLORS.green1}}

                                            onPress={() => {
                                                if (!can('update_business_settings')) {
                                                    toast.error('You do not have permissions to edit business');
                                                    setOpenActionBtns(false);
                                                    return;
                                                }
                                                router.push({
                                                    pathname: './EditBusinessDetails',
                                                    params: {
                                                        user_id: user_id,
                                                        business_id: id,
                                                        legal_name: business?.legal_name,
                                                        business_type: business?.business_type,
                                                        display_name: business?.display_name,
                                                        phone: business?.phone,
                                                        email: business?.email,
                                                        category_id: business?.category_id,
                                                        province: business?.province,
                                                        city: business?.city,
                                                        address: business?.address,
                                                    }
                                                });
                                            }}
                                        >
                                            <Entypo name="edit" size={17} color="white" />
                                            <Text
                                                className='text-white text-sm ml-1'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >Edit business details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className='flex-row rounded justify-center items-center elevation-sm py-3'
                                            style={{width: '35%', backgroundColor: COLORS.extra_blue}}
                                            onPress={() => setOpenActionBtns(true)}
                                        >
                                            {/* <Entypo name="edit" size={17} color="white" /> */}
                                            <MaterialIcons name="menu-open" size={17} color="white" />
                                            <Text
                                                className='text-white text-sm ml-1'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >Menu</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className='w-full relative border border-grey_bg rounded px-1 pb-4 pt-10 flex-row justify-between items-center mb-10'>
                                    <View
                                        style={{top: -14, left: 2}}
                                        className='px-2 mb-3 absolute bg-white justify-center items-center'>
                                        <Text
                                            className='text-lg'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >Logged in as:</Text>
                                    </View>
                                    
                                    <View
                                        className='border-2 relative border-lavender justify-center items-center rounded-full'
                                        style={{width: 63, height: 63, backgroundColor: getAvatarColor(userData?.data[0]?.member?.user_id)}}
                                    >
                                        <View className='absolute bg-green2 rounded-full border-2 border-white' style={{height: 16, width: 16, top: -2, right: 1, zIndex: 1}}/>
                                        {userData?.data[0]?.member?.profile_image === null ?
                                            <Text
                                                className='text-white'
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'roboto-medium',
                                                    fontSize: 30,
                                                }}
                                            >{getInitials(userData?.data[0]?.member?.first_name)}</Text>
                                            : <Image
                                                source={{ uri: `${USER_IMAGE_URI}${userData?.data[0]?.member?.profile_image}` }}
                                                style={{ height: '100%', width: '100%' }}
                                                className='rounded-full border-2 border-white'
                                            />
                                        }
                                    </View>
                                    <View
                                        className='' style={{width: '80%'}}
                                    >
                                        <Text
                                            className='text-black text-base'
                                            style={{fontFamily: 'roboto-medium'}}
                                        >{userData?.data[0]?.member?.first_name} {userData?.data[0]?.member?.last_name}</Text>
                                        <Text
                                            className='text-slate text-sm'
                                            style={{fontFamily: 'roboto'}}
                                        >{userData?.data[0]?.role?.name || 'No role assigned'}</Text>
                                    </View>
                                </View>

                                <Text
                                    className='text-black text-2xl mb-3'
                                    style={{fontFamily: 'outfit-medium'}}
                                >Business Members</Text>
                            </>
                        }

                        ListFooterComponent={<View className='mb-20'/>}
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
                reload={getMembers}
                loggedInUserRole={userData?.data[0]?.role?.name}
            />

            <MenuModal
                openActionBtns={openActionBtns}
                setOpenActionBtns={setOpenActionBtns}
                business_id={id}
                roles={userroles}
                user_id={user_id}
                legal_name={business?.legal_name}
                display_name={business?.display_name}
                business_type={business?.business_type}
                business_category={business?.category_id}
                email={business?.email}
                country={business?.country}
                logo_url={business?.logo_url}
                phone={business?.phone}
                province={business?.province}
                registration_number={business?.registration_number}
                status={business?.status}
                t_pin={business?.t_pin}
                tax_number={business?.tax_number}
                city={business?.city}
            />

            <ChamgeProfileImageModal
                openChnageProfileImage={openChnageProfileImage}
                setOpenChnageProfileImage={setOpenChnageProfileImage}
                business_id={id}
                user_id={user_id}
                business_name={business?.business_name}
                display_name={business?.display_name}
                business_type={business?.business_type}
            />
        </SafeAreaView>
    )
}

export default BusinessDetails