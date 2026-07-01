import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { USER_IMAGE_URI } from '../../../RequestMethods'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const MemberDetailsModal = ({
    openMemberDetails,
    setOpenMemberDetails,
    item,
    roles,
    user_id,
    business_id,
    reload
}) => {
    const [errors, setErrors] = useState({});
    const [removeerrors, setRemoveErrors] = useState({});
    const {data, isLoading, error, patch} = useApi(
        `/businesses/members-roles/update`
    );

    const [formData, setFormData] = useState({
        user_id: item?.member?.user_id,
        business_id: business_id,
        role_id: ''
    });

    const availableRoles = roles?.data?.map((r) => ({
        value: r.id,
        label: r.name
    })) || [];

    const removeMember = async () => {
        let newErrors = {};

        if (!formData.role_id || (formData.role_id === item.role.id)) {
            newErrors.role_id = "You can not remove your self from this business.";
        }

        setRemoveErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.role_id);
            return;
        }
    }

    const updateRole = async () => {
        let newErrors = {};

        if (!formData.role_id) {
            newErrors.role_id = "Select a role to update.";
        }

        if (formData.role_id === item.role.id) {
            newErrors.role_id = "Select new role";
        }

        if (item?.member?.user_id === user_id) {
            newErrors.role_id = "Can not chnage your role";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.role_id);
            return;
        }

        try {
            const res = await patch(formData);
            if (res?.success) {
                toast.success(res?.message || "Role updated");
                setOpenMemberDetails(false);
                reload();
            }
            else if (!res?.success) {
                toast.error(res?.message || "Role was not upatad");
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

                            <View className='w-full my-4'>
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

                            {(item?.role?.name === 'OWNER' || item?.role?.name === 'ADMIN') && (item?.member?.user_id !== user_id) && (
                                <View className='w-full bg-lavender my-1' style={{height: 1}} />
                            )}
                            
                            {/* Update member roles */}
                            {(item?.role?.name === 'OWNER' || item?.role?.name === 'ADMIN') && (item?.member?.user_id !== user_id) && (
                                <View className="my-5">
                                    <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Update Role</Text>
                                    <Text
                                        className="text-sm mb-1 text-slate"
                                        style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                                    >
                                        Please select the new role for this member.
                                    </Text>
                                    <Dropdown
                                        data={availableRoles}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={item?.role?.name}
                                        value={formData.role_id}
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
                                            backgroundColor: COLORS.extra_blue,
                                            opacity: isLoading ? 0.4 : 0.9
                                        }}
                                        onPress={() => updateRole()}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size={27} color={COLORS.primary}/>
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
                            {(item?.role?.name === 'OWNER') && (
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
                                        <Text
                                            style={{fontFamily: 'outfit-medium'}}
                                            className='text-white text-2xl'
                                        >Remove</Text>
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