import { AntDesign, FontAwesome, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, SectionList, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const RoleAndPermisionsModal = ({
    openRoleAndPermisionsModal,
    setOpenRoleAndPermisionsModal,
    item,
    business_id,
    user_id,
    reloadPermissions
}) => {
    const router = useRouter();
    const [selected, setSelected] = useState([]);

    const [feedback, setFeedback] = useState({
        status: 'idle',
        message: ''
    });

    const {data, isLoading, error, get} = useApi(
        `/businesses/me/permissions`
    );

    const {data: getPermissions, isLoading: loadingPermissions, error: permissionsError, get: permissions} = useApi(
        `/businesses/role/permissions/${item?.id}`
    );

    const {data: removePermission, isLoading: loadingRemovePermission, error: RemovePermission, del} = useApi(
        `/businesses/permissions/delete`
    );

    const {data: deleteRole, isLoading: loadingDeleteRole, error: deleteRoleError, del: delRole} = useApi(
        `/businesses/role/delete`
    );

    console.log('deleteRole', deleteRoleError)

    useEffect(() => {
        get();
    }, []);

    useEffect(() => {
        if (item?.id) {
            permissions();   
        }
    }, [item?.id]);

    useEffect(() => {
        if (feedback.status === 'success' || feedback.status === 'error') {
            const timer = setTimeout(() => {
                setFeedback({
                    status: 'idle',
                    message: ''
                });
            }, 3000); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [feedback.status]);

    const selectedIds = new Set(
        getPermissions?.data?.map(item => item.permission_id)
    );

    const availablePermissions = Object.fromEntries(
        Object.entries(data?.data || {})
            .map(([category, permissions]) => [
                category,
                permissions.filter(permission =>
                    selectedIds.has(permission.id)
                )
            ])
            .filter(([_, permissions]) => permissions.length > 0)
    );

    const sections = Object.entries(availablePermissions).map(
        ([category, items]) => ({
            title: category,
            data: items,
        })
    );

    const reload = () => {
        get();
        permissions();
    }

    // Remove permissions
    const handleRemovePermission = async (id) => {
        const payload = {
            business_id,
            role_id: item?.id,
            user_id,
            permission_id: id
        };

        // Validation
        if (!payload.permission_id) {
            setFeedback({
                status: 'error',
                message: 'Missing permission ID'
            });
            return;
        }

        if (!payload.business_id) {
            setFeedback({
                status: 'error',
                message: 'Missing business ID'
            });
            return;
        }

        // Loading starts HERE
        setFeedback({
            status: 'loading',
            message: 'Removing permission...'
        });

        try {
            const res = await del(payload);

            if (!res?.success) {
                setFeedback({
                    status: 'error',
                    message: res?.message || 'Failed to remove permission'
                });
                return;
            }

            setFeedback({
                status: 'success',
                message: res?.message || 'Permission removed successfully'
            });

            reload();
        } catch (error) {
            setFeedback({
                status: 'error',
                message: error?.message || 'An error occurred'
            });
        }
    };

    const isEmpty =
        !data ||
        Object.keys(data.data).length === 0;

    const isPermissionsEmpty =
        !getPermissions?.data ||
        getPermissions.data.length === 0;

    const handleDeleteBusinessRole = async () => {
        const payload = {
            business_id,
            role_id: item?.id,
            user_id: user_id
        };

        // Validation
        if (!payload.role_id) {
            setFeedback({
                status: 'error',
                message: 'Missing role ID'
            });
            return;
        }

        if (!payload.business_id) {
            setFeedback({
                status: 'error',
                message: 'Missing business ID'
            });
            return;
        }

        if (!payload.user_id) {
            setFeedback({
                status: 'error',
                message: 'Missing user ID'
            });
            return;
        }

        // Loading starts HERE
        setFeedback({
            status: 'loading',
            message: 'Deleting role...'
        });

        try {
            const res = await delRole(payload);

            if (!res?.success) {
                setFeedback({
                    status: 'error',
                    message: res?.message || 'Failed to delete role'
                });
                return;
            }

            setOpenRoleAndPermisionsModal(false);
            reloadPermissions();
            toast.success(res?.message || 'Role deleted successfully');
            return;
        } catch (error) {
            setFeedback({
                status: 'error',
                message: 'An error occurred'
            });
            setOpenRoleAndPermisionsModal(false);
            toast.error('An error occurred');
            return;
        }
    }

    return (
        <Modal
            visible={openRoleAndPermisionsModal}
            transparent
            animationType="none"
            onRequestClose={() => setOpenRoleAndPermisionsModal(false)}
        >
            {/* Inner content wrapper (prevents closing when tapped) */}
            <View
                // onStartShouldSetResponder={() => true}
                className='flex-1 justify-end relative'
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack"
                    style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    }}
                    onPress={() => setOpenRoleAndPermisionsModal(false)}
                />
                <MotiView
                    from={{ opacity: 0, translateY: 80 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 300 }}
                    style={{
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        maxHeight: "95%"   // important
                    }}
                    className="bg-white px-4 pt-3"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center">
                        <View className='flex-row items-center'>
                            <AntDesign name="team" size={21} color={COLORS.primary} />
                            <Text
                                className="text-xl ml-1"
                                style={{ fontFamily: "outfit-medium" }}
                            >
                            {item?.name}
                            </Text>
                        </View>
                        <TouchableOpacity
                            className='bg-grey_bg rounded-full justify-center items-center'
                            style={{width: 33, height: 33}}
                            onPress={() => setOpenRoleAndPermisionsModal(false)}
                        >
                            <FontAwesome name='times' size={15} color={'red'}/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender mt-3' style={{height: 1}} />
                    {/* Start Content */}

                    {(isLoading || loadingPermissions) ? (
                        <View className='justify-center items-center' style={{height: '50%'}}>
                            <ActivityIndicator size={40} color={COLORS.primary}/>
                            <Text
                                className='text-lg pt-2'
                                style={{fontFamily: 'roboto-medium'}}
                            >Loading permissions, please wait...</Text>
                        </View>
                    ) : (isEmpty || isPermissionsEmpty) ? (
                        <View className='justify-center items-center mt-10' style={{height: '50%'}}>
                            <MaterialCommunityIcons
                                name="shield-account"
                                size={30}
                                color={COLORS.red}
                            />
                            <Text
                                className='text-lg ml-2 text-primary'
                                style={{fontFamily: 'roboto-medium'}}
                            >No permissions found for this role</Text>
                            <Text
                                className='text-sm ml-2 text-slate'
                                style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                            >
                                This role has not been granted any permissions yet. Assign permissions to allow access.
                            </Text>

                            <TouchableOpacity
                                style={{backgroundColor: COLORS.extra_blue, width: '50%'}}
                                className='flex-row mt-4 rounded justify-center items-center py-3 elevation-sm'
                                onPress={() => router.push({
                                    pathname: './AddPermissions',
                                    params: {name: item?.name, role_id: item?.id, business_id}
                                })}
                            >
                                <MaterialCommunityIcons
                                    name="shield-account"
                                    size={18}
                                    color={COLORS.white}
                                />
                                <Text
                                    className='text-white ml-1 text-sm'
                                    style={{fontFamily: 'roboto-medium'}}
                                >Assign Permissions</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (data && getPermissions) ? (
                        <>
                            <SectionList
                                sections={sections}
                                keyExtractor={(item) => item.id || item.key}
                                renderSectionHeader={({ section }) => (
                                    <TouchableOpacity
                                        className='bg-grey_bg flex-row justify-between items-center w-full rounded mb-2 py-1'
                                        style={{
                                            marginTop: 20
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 8 }}>
                                            {section.title.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                renderItem={({ item }) => (
                                    <View
                                        className='flex-row justify-between items-center w-full mb-2'
                                    >
                                        <View
                                            style={{ flexDirection: "row", alignItems: "center" }}
                                        >
                                            <MaterialIcons
                                                name="check-box"
                                                name={"check-box"}
                                                size={28}
                                                color={COLORS.primary}
                                            />
                                            <Text style={{ marginLeft: 8, fontFamily: 'roboto-medium' }}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            className='py-1 flex-row justify-end items-center'
                                            onPress={() => handleRemovePermission(item?.id)}
                                        >
                                            <FontAwesome6 name='trash' size={14} color='red' />
                                            <Text
                                                className='text-sm text-red'
                                                style={{ marginLeft: 3, fontFamily: 'roboto-medium' }}
                                            >
                                                Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                ListHeaderComponent={
                                    (!isPermissionsEmpty) && (
                                        <View className='w-full'>
                                            <View
                                                className='flex-row justify-between items-center w-full mt-4 mb-10'
                                            >
                                                <TouchableOpacity
                                                    style={{backgroundColor: COLORS.extra_blue, width: '100%'}}
                                                    className='flex-row mt-4 rounded justify-center items-center py-3 elevation-sm'
                                                    onPress={() => router.push({
                                                        pathname: './AddPermissions',
                                                        params: {name: item?.name, role_id: item?.id, business_id}
                                                    })}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="shield-account"
                                                        size={18}
                                                        color={COLORS.white}
                                                    />
                                                    <Text
                                                        className='text-white ml-1'
                                                        style={{fontFamily: 'roboto-medium'}}
                                                    >Update Permissions</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View
                                                className='flex-row items-center bg-grey_bg rounded px-2 py-1 mt-3'
                                            >
                                                <MaterialCommunityIcons
                                                    name="shield-account"
                                                    size={24}
                                                    color={COLORS.extra_blue}
                                                />
                                                <Text
                                                    className='text-2xl ml-1'
                                                    style={{fontFamily: 'roboto-medium'}}
                                                >Permissions</Text>
                                            </View>
                                        </View>       
                                    )
                                }

                                showsVerticalScrollIndicator={false}
                                
                                ListFooterComponent={
                                    <View className='items-center w-full mt-4 mb-6'/>
                                }
                            />
                        </>
                    ) : (error || permissionsError) ? (
                        <View className='justify-center items-center flex-1 mt-10'>
                            <MaterialCommunityIcons
                                name="shield-account"
                                size={30}
                                color={COLORS.red}
                            />
                            <Text
                                className='text-lg ml-2 text-primary'
                                style={{fontFamily: 'roboto-medium'}}
                            >Unknown error occured</Text>
                            <Text
                                className='text-sm ml-2 text-slate'
                                style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                            >
                                Press the button below to reload
                            </Text>

                            <TouchableOpacity
                                style={{backgroundColor: COLORS.primary, width: '50%'}}
                                className='flex-row mt-4 rounded justify-center items-center py-3 elevation-sm'
                                onPress={() => reload()}
                            >
                                <MaterialCommunityIcons
                                    name="shield-account"
                                    size={18}
                                    color={COLORS.white}
                                />
                                <Text
                                    className='text-white ml-1 text-sm'
                                    style={{fontFamily: 'roboto-medium'}}
                                >Reload</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View
                        className='items-center w-full mb-14'
                    >
                        {feedback.status === 'loading' && (
                            <View className='flex-row justify-center items-center'>
                                <ActivityIndicator size={22} color={COLORS.primary}/>
                                <Text className='text-sm ml-2 text-primary' style={{fontFamily: 'roboto-medium'}}>
                                    {feedback.message}
                                </Text>
                            </View>
                        )}

                        {feedback.status === 'error' && (
                            <Text className='text-red text-sm' style={{fontFamily: 'roboto-medium'}}>
                                Error: {feedback.message}
                            </Text>
                        )}

                        {feedback.status === 'success' && (
                            <Text className='text-green1 text-sm' style={{fontFamily: 'roboto-medium'}}>
                                {feedback.message}
                            </Text>
                        )}
                        
                        <TouchableOpacity
                            style={{backgroundColor: COLORS.red, width: '100%'}}
                            className='flex-row mt-4 rounded justify-center items-center py-3 elevation-sm'
                            onPress={() => handleDeleteBusinessRole()}
                            disabled={loadingDeleteRole}
                        >
                            {loadingDeleteRole ? (
                                <ActivityIndicator size={22} color={COLORS.white}/>
                            ) : (
                            <View className='flex-row justify-center items-center'>
                                <FontAwesome6 name="trash" size={15} color={COLORS.white} />
                                <Text
                                    className='text-white text-lg ml-2'
                                    style={{fontFamily: 'roboto-medium'}}
                                >Delete Role</Text>
                            </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* End Content */}
                </MotiView>
            </View>
        </Modal>
    )
}

export default RoleAndPermisionsModal