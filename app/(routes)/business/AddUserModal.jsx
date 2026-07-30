import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { USER_IMAGE_URI } from '../../../RequestMethods'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const AddUserModal = ({
    business_id,
    user,
    openAddMember,
    setOpenAddMember,
    user_id
}) => {
    const [errors, setErrors] = useState({});
    const [userFound, setUserFound] = useState(true);
    const {data, isLoading, error, post} = useApi(
        `/businesses/add-member`
    );

    const {data: roles, isLoading: loadingRoles, error: errorRoles, get: getRoles} = useApi(
        `/businesses/roles/${business_id}`
    );

    console.log("ADD", error)

    useEffect(() => {
        if (business_id) {
            getRoles();
        }
    }, [business_id]);

    const [formData, setFormData] = useState({
        user_id: user_id,
        member_id: user?.user_id,
        business_id: business_id,
        role_id: '',
        name: ''
    });

    useEffect(() => {
        if (user && business_id) {
            setFormData({
                user_id: user_id,
                member_id: user?.user_id,
                business_id: business_id,
                role_id: '',
                name: ''
            });
        }
    }, [user, business_id]);

    useEffect(() => {
        if (!openAddMember) return;

        setUserFound(true);

        const timer = setTimeout(() => {
            setUserFound(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [openAddMember]);

    const availableRoles = roles?.data
        ?.filter((r) => r.name !== "OWNER")
        ?.map((r) => ({
            value: r.id,
            label: r.name,
            is_system: r.is_system
        })) || [];

        console.log(availableRoles)

    const addMember = async() => {
        let newErrors = {};

        if (!formData.role_id) {
            newErrors.role_id = "Please select member role";
        }

        const selectedRole = roles?.data?.find(
            r => r.id === formData.role_id
        );

        if (selectedRole?.name === "OWNER") {
            newErrors.role_id = "The OWNER role cannot be assigned to new members.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.role_id);
            return;
        }

        try {
            const result = await post(formData);

            console.log("U", result)

            if (!result?.success) {
                toast.error(result?.message || 'User not found');
                newErrors.search_id = result?.message || 'User not found';
                setOpenAddMember(false);
                setErrors(newErrors);
                return;
            }

            setOpenAddMember(false);
            toast.success(`${user?.first_name} is now added as a business member`);
        } catch (error) {
            console.error(error);
            setOpenAddMember(false);
            toast.error('Network error');
            newErrors.search_id = 'Network error';
            setErrors(newErrors);
        }
    }

    return (
        <Modal
            visible={openAddMember}
            transparent
            animationType="none"
            onRequestClose={() => setOpenAddMember(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenAddMember(false)}
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
                                Add Member
                            </Text>
                            <TouchableOpacity
                                className='bg-grey_bg rounded-full justify-center items-center'
                                style={{width: 30, height: 30}}
                                onPress={() => setOpenAddMember(false)}
                            >
                                <FontAwesome name='times' size={15} color={'red'}/>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full bg-lavender my-3' style={{height: 1}} />
                        {/* Content */}
                        {userFound ? (
                            <View className='w-full justify-end items-center z-50'>
                                <View className='bg-white w-full rounded-xl py-4 justify-center items-center'>
                                    <ActivityIndicator size={33} color={COLORS.primary}/>
                                    <Text
                                        className='text-base text-green-600 mt-2'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >User found, please wait...</Text>
                                </View>
                            </View>
                        ) : (loadingRoles && !roles) ? (
                            <View className='w-full justify-end items-center z-50'>
                                <View className='bg-white w-full rounded-xl py-4 justify-center items-center'>
                                    <ActivityIndicator size={33} color={COLORS.primary}/>
                                    <Text
                                        className='text-base text-green-600 mt-2'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Loading roles, please wait...</Text>
                                </View>
                            </View>
                        ) : (
                        <ScrollView className='w-full'>
                            <View className='w-full flex-row items-center justify-between'>
                                <View
                                    className='border-2 border-lavender justify-center items-center rounded-full'
                                    style={{width: 63, height: 63}}
                                >
                                    {user?.profile_image === null ?
                                        <FontAwesome name="user" size={24} color={COLORS.slate} />
                                        : <Image
                                            source={{ uri: `${USER_IMAGE_URI}${user?.profile_image}` }}
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
                                        className='text-black text-lg'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >{user?.first_name} {user?.last_name}</Text>
                                    {/* <Text
                                        className='text-slate text-sm'
                                        style={{fontFamily: 'roboto'}}
                                    >{item.role.name}</Text> */}
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
                                    > {user?.phone_num}</Text>
                                </View>
                                <View
                                    className='w-full flex-row items-center mb-2'
                                >
                                    <FontAwesome name='envelope' size={15} color={COLORS.primary}/>
                                    <Text
                                        className='ml-2'
                                        style={{fontFamily: 'roboto-medium'}}
                                    > {user?.email_add}</Text>
                                </View>
                                <View
                                    className='w-full flex-row items-center mb-2'
                                >
                                    <MaterialCommunityIcons name="timer" size={17} color={COLORS.primary} />
                                    {user?.created_at && (
                                        <Text className='text-green1 text-sm ml-2'>
                                            Joined on: {new Date(user.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View className='w-full bg-lavender my-1' style={{height: 1}} />
                            
                            {/* Update member roles */}
                            <View className="my-5">
                                    <Text className="text-base mb-1" style={{ fontFamily: "roboto-bold" }}>Select Role</Text>
                                    <Text
                                        className="text-sm mb-1 text-slate"
                                        style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}
                                    >
                                        Please select a suitable role for this member.
                                    </Text>
                                    <Dropdown
                                        data={availableRoles}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={'Select Role'}
                                        value={formData.role_id}
                                        mode='modal'
                                        onChange={(item) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                role_id: item.value,
                                                name: item.label
                                            }));

                                            setErrors(prev => ({
                                                ...prev,
                                                role_id: null
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
                                            backgroundColor: COLORS.primary,
                                            // opacity: isLoading ? 0.4 : 0.9
                                        }}
                                        onPress={() => addMember()}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size={27} color={COLORS.white}/>
                                        ) : (
                                            <Text
                                                style={{fontFamily: 'outfit-medium'}}
                                                className='text-white text-2xl'
                                            >Add</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                        </ScrollView>
                        )}
                    </MotiView>
                </View>
            </Pressable>
        </Modal>
    )
}

export default AddUserModal