import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Headers from '../../../../components/Headers';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { usePermissions } from '../../../../hook/usePermissions';
import { STORES_IMAGE_URI, USER_IMAGE_URI } from '../../../../RequestMethods';
import { capitalize } from '../../../../utils/capitalize';
import { formatDate } from '../../../../utils/formatDateTime';
import { toast } from '../../../../utils/toast';
import OverLay from '../../../OverLay';

const Index = () => {
    const { can } = usePermissions();
    const params = useLocalSearchParams();
      const {
        user_id
    } = useSelector((state) => state.auth);
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleSelection = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const [formData, setFormData] = useState({
        admin_id: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [hasNavigated, setHasNavigated] = useState(false);
    const admin_id = formData.admin_id.trim();
    const [showRedirecting, setShowRedirecting] = useState(false);

    const { data: currentMembers, isLoading: currentMemberLoading, error: currentMembersError, get: getCureentMembers } = useApi(
        `/stores/business/${params.business_id}/store-members/${params.store_id}`
    );

    const {data: members, isLoading: loadingMembers, error: errorMembers, get: getMembers} = useApi(
        `/businesses/members/${params.business_id}`
    );

    const { data, isLoading, error, get } = useApi(`/stores/admin/search?search_id=${admin_id}`);

    const {data: addMembers, isLoading: loadingAddMembers, error: errorAddMembers, post: postmembers} = useApi(
        `/stores/business/members/add`
    );

    console.log(currentMembers?.data)

    const payload = {
        business_id: params.business_id,
        store_id: params.store_id,
        user_id: user_id,
        userIds: [...selectedIds]
    }

    const handleAddMembers = async() => {

        if (!payload.business_id) {
            toast.error('Missing business ID');
            return;
        }

        if (!payload.store_id) {
            toast.error('Missing store ID');
            return;
        }

        if (!payload.userIds || payload.userIds.size === 0) {
            toast.error('Select at least 1 member');
            return;
        }

        const res = await postmembers(payload);

        if (!res?.success) {
            toast.error(res?.message || 'Failed to add member to this store');
            return;
        }

        if (res?.success) {
            toast.success(res?.message || 'Member added successfully.');
            getCureentMembers();
            getMembers();
            return;
        }
    }

    useEffect(() => {
        if (params.store_id) {
            getCureentMembers();
        }
    }, [params.store_id]);

    useEffect(() => {
        if (params.business_id) {
            getMembers();
        }
    }, [params.business_id]);

    // Create a Set of existing member IDs
    const current = currentMembers?.data || [];

    const currentMemberIds = new Set(
        current.map(member => member.user_id)
    );

    const filteredMembers = (members?.data || []).filter(item => {
        // Hide owners if the user lacks permission
        if (item?.role?.name === "OWNER" && !can("view_owner_members")) {
            return false;
        }

        // Exclude members already in currentMembers
        return !currentMemberIds.has(item.member.user_id);
    });

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSearchAdmin = () => {
        if (!admin_id) {
            setErrorMessage('Please enter user phone number / email!');
            toast.error('Please enter user phone number / email!');
            return;
        }

        if ((filteredMembers?.length ?? 0) === 0) {
            setErrorMessage('There are no available members to add to this store.');
            toast.error('There are no available members to add to this store.');
            return;
        }

        setErrorMessage('');
        setHasNavigated(false);
        get();
    };

    useEffect(() => {
        if (!data || hasNavigated) return;

        if (data?.success && Array.isArray(data?.data) && data?.data?.length > 0) {
            setErrorMessage('Success');
            toast.success(`Found ${data?.data?.length} ${data?.data?.length === 1 ? 'user' : 'users'}.`);

            setHasNavigated(true);
            setTimeout(() => {
                router.push({
                    pathname: '../admins-route/admin-search-results/',
                    params: {
                        business_id: params.business_id,
                        business_name: params.business_name,
                        business_type: params.business_type,
                        store_name: params.store_name,
                        store_profileimage: params.store_profileimage,
                        store_description: params.store_description,
                        store_id: params.store_id,
                        user_id: data?.data[0]?.user_id,
                        profile_image: data?.data[0]?.profile_image,
                        first_name: data?.data[0]?.first_name,
                        last_name: data?.data[0]?.last_name,
                        phone_num: data?.data[0]?.phone_num,
                        status: data?.data[0]?.status,
                        is_verified: data?.data[0]?.is_verified
                    },
                });
            }, 1000);
        } else if (!data?.success) {
            setErrorMessage(data?.message || 'No users found.');
            toast.error(data?.message || 'No user found with that ID.');
        }
    }, [data]);

    useEffect(() => {
        if (errorMessage === 'Success') {
            setShowRedirecting(true);

            const timeout = setTimeout(() => {
            setShowRedirecting(false);
            }, 3000); // hide after 3 seconds

            return () => clearTimeout(timeout); // cleanup
        }
    }, [errorMessage]);

    const reloadApp = () => {
        getCureentMembers();
        getMembers();
    }

    return (
        <SafeAreaView className="justify-center items-center flex-1 bg-white px-4">
            <Headers fontFamily="outfit-medium" textStyles='text-2xl' header_name="Add Branch Members"
                icon={<FontAwesome6 name='users' size={15} color={COLORS.black}/>}
            />

            <View className="flex-1 items-center justify-between w-full">
                <View className="w-full mt-4">
                    <View className="w-full flex-row border border-lavender rounded justify-between items-center">
                        <TextInput
                            style={{width: '86%'}}
                            className='px-2'
                            placeholder='Email / phone number'
                            onChangeText={(value) => handleChangeText('admin_id', value)}
                        />

                        <TouchableOpacity
                            className='bg-primary rounded justify-center items-center py-3'
                            style={{width: '13%'}}
                            onPress={() => handleSearchAdmin()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size={17} color='white'/>
                            ) : (
                                <FontAwesome name='search' size={20} color={COLORS.white}/>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View
                    className='flex-1 w-full pt-4'
                >
                    {(currentMemberLoading || loadingMembers) ? (
                        <View className='justify-center items-center flex-1'>
                            <ActivityIndicator size={35} color={COLORS.primary}/>
                            <Text
                                className='text-slate mt-4'
                                style={{fontFamily: 'roboto-medium'}}
                            >Loading available members...</Text>
                        </View>
                    ) : (currentMembersError || errorMembers) ? (
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
                                onPress={() => reloadApp()}
                            >
                                <MaterialCommunityIcons name="reload" size={20} color="white" />
                                <Text
                                    className='text-white text-base ml-1'
                                    style={{fontFamily: 'roboto-medium'}}
                                >Reload</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (filteredMembers?.length ?? 0) === 0 ? (
                        <View className='justify-center items-center flex-1'>
                            <FontAwesome6 name="users" size={25} color="black" />
                            <Text
                                className='text-slate mt-4'
                                style={{fontFamily: 'roboto-medium'}}
                            >There are no available members to add to this store.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredMembers}
                            keyExtractor={(item) => item?.member?.user_id}
                            renderItem={({item}) => (
                                <View className='w-full'>
                                    <View className='flex-row justify-between items-center'>
                                        <View
                                            className='bg-grey_bg rounded-full border-2 border-lavender justify-center items-center'
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
                                            style={{width: '68%'}}
                                            className=''
                                        >
                                            <Text
                                                numberOfLines={1}
                                                className='text-base'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >
                                                {item?.member?.first_name} {item?.member?.last_name}
                                            </Text>
                                            <Text
                                                className='text-sm text-slate'
                                                style={{fontFamily: 'roboto-medium'}}
                                            >{item?.role?.name || 'No role assigned'} | Joined: {formatDate(item?.created_at)}</Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => toggleSelection(item?.member?.user_id)}
                                        >
                                            {selectedIds.has(item?.member?.user_id) ? (
                                                <MaterialIcons
                                                    name="check-box"
                                                    size={27}
                                                    color={COLORS.primary}
                                                />
                                            ) : (
                                                <MaterialIcons
                                                    name="check-box-outline-blank"
                                                    size={27}
                                                    color={COLORS.slate}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <View className='bg-grey_bg w-full my-6' style={{height: 1}}/>
                                </View>
                            )}

                            ListHeaderComponent={
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

                                    <View className='mt-4 bg-grey_bg px-2 rounded py-2'>
                                        <Text
                                            className='text-sm'
                                            style={{fontFamily: 'roboto', textAlign: 'justify'}}
                                        >Select members to be added to {params.store_name} and update.</Text>
                                    </View>

                                    <View className='bg-grey_bg w-full mb-6 mt-4' style={{height: 1}}/>
                                </>
                            }

                            ListFooterComponent={
                                <View className='mb-8'/>
                            }

                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <TouchableOpacity
                        className='w-full bg-primary mb-3 justify-center items-center py-3 rounded elevation-sm'
                        disabled={selectedIds?.size === 0}
                        style={{opacity: selectedIds?.size === 0 ? 0.6 : 1}}
                        onPress={() => {
                            if (!can('add_store_member')) {
                                toast.error('You don not have permissions to add members to this store.');
                                return;
                            }
                            handleAddMembers()
                        }}
                    >
                        {loadingAddMembers ? (
                            <ActivityIndicator size={25} color={COLORS.white}/>
                        ) : (
                            <Text
                                className='text-white text-xl'
                                style={{fontFamily: 'outfit-medium'}}
                            >Update</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading && <OverLay />}
        </SafeAreaView>
    );
};

export default Index;