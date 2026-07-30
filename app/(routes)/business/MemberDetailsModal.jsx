import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { USER_IMAGE_URI } from '../../../RequestMethods'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { usePermissions } from '../../../hook/usePermissions'
import { getAvatarColor, getInitials } from '../../../utils/getInitials'
import { toast } from '../../../utils/toast'

const MemberDetailsModal = ({
    openMemberDetails,
    setOpenMemberDetails,
    item,
    roles,
    user_id,
    business_id,
    reload,
    loggedInUserRole
}) => {
    const { can } = usePermissions();
    const [errors, setErrors] = useState({});
    const [removeerrors, setRemoveErrors] = useState({});
    const {data, isLoading, error, patch} = useApi(
        `/businesses/members-roles/update`
    );

    const {data: deletemember, isLoading: loadingDeleteMember, error: errorDeleteMember, del} = useApi(
        `/businesses/members/delete`
    );

    const [formData, setFormData] = useState({
        user_id: item?.member?.user_id,
        business_id: business_id,
        role_id: ''
    });

    useEffect(() => {
        if (item?.member?.user_id) {
            setFormData(prev => ({
                ...prev,
                user_id: item.member.user_id
            }));
        }
    }, [item]);

    const availableRoles = roles?.data?.map((r) => ({
        value: r.id,
        label: r.name
    })) || [];

    // Filter owner role
    const availableRolesForAssignment = availableRoles.filter(
        role => role?.label !== "OWNER"
    );

    // Can remove member?
    const canRemove =
        item?.member?.user_id !== user_id && item?.role?.name !== "OWNER" && can("remove_member");

    // Delete member
    const removeMember = async () => {
        let newErrors = {};

        // Must have permission
        if (!can("remove_member")) {
            newErrors.role_id =
                "You do not have permission to remove members from this business.";
        }

        // Cannot remove yourself
        if (item?.member?.user_id === user_id) {
            newErrors.role_id =
                "You cannot remove yourself from this business.";
        }

        // Cannot remove business owner
        if (item?.role?.name === "OWNER") {
            newErrors.role_id =
                "The business owner cannot be removed.";
        }

        setRemoveErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.role_id);
            setOpenMemberDetails(false);
            return;
        }

        try {
            const res = await del({
                business_id,
                member_id: item?.member?.user_id
            });

            if (res?.success) {
                toast.success(res?.message || "Member deleted successfully.");
                setOpenMemberDetails(false);
                reload();
                return;
            }
            else if (!res?.success) {
                toast.error(res?.message || "Member was not deleted");
                setOpenMemberDetails(false);
                return;
            }
            else if (error) {
                toast.error(error.message || "Member was not deleted, try again later");
                setOpenMemberDetails(false);
                return;
            }
        } catch (err) {
            toast.error(err.message || "Failed to delete member");
            setOpenMemberDetails(false);
            return;
        }
    }

    // Update member roles
    const updateRole = async () => {
        let newErrors = {};

        if (!can('update_member')) {
            newErrors.role_id = "You have no permissions to update members roles in this business.";
        }

        if (!formData.role_id) {
            newErrors.role_id = "Select a role to update.";
        }

        if (formData.role_id === item.role.id) {
            newErrors.role_id = "Select new role";
        }

        if (item?.member?.user_id === user_id) {
            newErrors.role_id = "Can not change your own role";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.role_id);
            return;
        }

        try {
            const res = await patch(formData);

            if (res?.data?.success) {
                toast.success(res?.data?.message || "Role updated");
                setOpenMemberDetails(false);
                reload();
            }
            else if (!res?.data?.success) {
                toast.error(res?.data?.message || "Role was not upatad");
            }
            else if (error) {
                toast.error(error.message || "Role was not upatad, try again later");
            }
        } catch (err) {
            toast.error(err.message || "Failed to update role");
        }
    };

    return (
        <Modal
            visible={openMemberDetails}
            transparent
            animationType="none"
            onRequestClose={() => setOpenMemberDetails(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenMemberDetails(false)}
            >
                {/* Inner content wrapper (prevents closing when tapped) */}
                <View
                    onStartShouldSetResponder={() => true}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 80 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 80}}
                        className="bg-white px-4 pt-3"
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-2xl"
                                style={{ fontFamily: "outfit-medium" }}
                            >
                                Member Details
                            </Text>
                            <TouchableOpacity
                                className='bg-grey_bg rounded-full justify-center items-center'
                                style={{width: 30, height: 30}}
                                onPress={() => setOpenMemberDetails(false)}
                            >
                                <FontAwesome name='times' size={15} color={'red'}/>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full bg-lavender my-3' style={{height: 1}} />
                        {/* Content */}
                        <ScrollView className='w-full'>
                            <View className='w-full flex-row items-center justify-between'>
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
                                    className=''
                                    style={{width: '79%'}}
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
                            </View>

                            <View className='w-full mb-4'>
                                <View className='w-full flex-row items-center mb-6 mt-2'>
                                    <Text
                                        className='text-black text-sm'
                                        style={{fontFamily: 'roboto'}}
                                    >{item?.role?.description}</Text>
                                </View>

                                {can('view_member_contact') && (
                                    <>
                                        <View
                                            className='w-full flex-row items-center mb-2'
                                        >
                                            <FontAwesome name='phone' size={17} color={COLORS.primary}/>   
                                            <Text
                                                className='ml-2'
                                                style={{fontFamily: 'roboto-medium'}}
                                            > {item?.member?.phone_num}</Text>
                                        </View>
                                        <View
                                            className='w-full flex-row items-center mb-2'
                                        >
                                            <FontAwesome name='envelope' size={15} color={COLORS.primary}/>
                                            <Text
                                                className='ml-2'
                                                style={{fontFamily: 'roboto-medium'}}
                                            > {item?.member?.email_add}</Text>
                                        </View>  
                                    </>
                                )}
                                <View
                                    className='w-full flex-row items-center mb-2'
                                >
                                    <MaterialCommunityIcons name="timer" size={17} color={COLORS.primary} />
                                    <Text className='text-green1 text-sm ml-2'>
                                        Created on: {new Date(item?.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </View>
                            </View>

                            {can('update_member_role') && (
                                <View className='w-full bg-lavender my-1' style={{height: 1}} />
                            )}
                            
                            {/* Update member roles */}
                            {can('update_member_role') && item?.member?.user_id !== user_id && item?.role?.name !== 'OWNER' && (
                                <View className="my-5">
                                    <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Update Role</Text>
                                    <Text
                                        className="text-sm mb-1 text-slate"
                                        style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                                    >
                                        Please select the new role for this member.
                                    </Text>
                                    <Dropdown
                                        data={availableRolesForAssignment}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={item?.role?.name}
                                        value={formData.role_id}
                                        mode="modal"
                                        onChange={(item) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                role_id: item?.value
                                            }));
                                        }}

                                        style={{
                                            borderWidth: 2,
                                            borderColor: errors.role_id ? "red" : "#E2E8F0",
                                            borderRadius: 12,
                                            paddingHorizontal: 12,
                                            height: 50,
                                        }}
                                    />
                                    {errors.role_id && (
                                        <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                            {errors.role_id} *
                                        </Text>
                                    )}

                                    <TouchableOpacity
                                        className='mt-4 py-3 rounded-2xl justify-center items-center'
                                        style={{
                                            backgroundColor: COLORS.extra_blue
                                        }}
                                        onPress={() => updateRole()}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size={27} color={COLORS.white}/>
                                        ) : (
                                            <Text
                                                style={{fontFamily: 'outfit-medium'}}
                                                className='text-white text-2xl'
                                            >Update</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Remove member */}
                            {canRemove && (
                                <View>
                                    <Text className="text-base mb-1 mt-4" style={{ fontFamily: "roboto-bold" }}>Remove Member</Text>
                                    <Text
                                        className="text-sm mb-2 text-slate"
                                        style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                                    >
                                        Press the button below to remove this member from this business.
                                    </Text>

                                    {removeerrors.role_id && (
                                        <Text className='text-red text-sm my-2' style={{fontFamily: 'roboto'}}>
                                            {removeerrors.role_id} *
                                        </Text>
                                    )}
                                    <TouchableOpacity
                                        className='bg-red py-3 rounded-2xl justify-center items-center'
                                        onPress={() => removeMember()}
                                    >
                                        {loadingDeleteMember ? (
                                            <ActivityIndicator size={28} color={COLORS.white}/>
                                        ) : (
                                            <Text
                                                style={{fontFamily: 'outfit-medium'}}
                                                className='text-white text-2xl'
                                            >Remove</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </MotiView>
                </View>
            </Pressable>
        </Modal>
    )
}

export default MemberDetailsModal