import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'

const MenuModal = ({
    openActionBtns,
    setOpenActionBtns,
    business_id,
    roles,
    user_id,
    business_name,
    business_type
}) => {
    const router = useRouter();
    const [errors, setErrors] = useState({});

    return (
        <Modal
            visible={openActionBtns}
            transparent
            animationType="none"
            onRequestClose={() => setOpenActionBtns(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenActionBtns(false)}
            >
                {/* Inner content wrapper (prevents closing when tapped) */}
                <View
                    onStartShouldSetResponder={() => true}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 80 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60}}
                        className="bg-white px-4 pt-3"
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-2xl"
                                style={{ fontFamily: "ubuntu-medium" }}
                            >
                            Settings
                            </Text>
                            <TouchableOpacity
                                className='bg-grey_bg rounded-full justify-center items-center'
                                style={{width: 33, height: 33}}
                                onPress={() => setOpenActionBtns(false)}
                            >
                                <FontAwesome name='times' size={15} color={'red'}/>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full bg-lavender my-3' style={{height: 1}} />
                        {/* Start Content */}

                        {/* Start business structure */}
                        <View
                            className='w-full mt-2'
                        >
                            <View className='flex-row items-center mb-2'>
                                <View
                                    className='border rounded-full border-lavender justify-center items-center'
                                    style={{width: 32, height: 32, backgroundColor: COLORS.extra_blue}}
                                >
                                    <Ionicons name="business-sharp" size={13} color={COLORS.white} />
                                </View>
                                <Text
                                    className='text-black text-xl ml-2'
                                    style={{fontFamily: 'outfit-medium'}}
                                >Business Structure</Text>
                            </View>

                            <View
                                className='flex-row flex-wrap justify-between items-center w-full mt-2'
                            >
                                <TouchableOpacity
                                    className='bg-white border py-4 border-lavender rounded justify-center items-center'
                                    style={{width: '32%'}}
                                >
                                    <Ionicons name="create-outline" size={25} color={COLORS.primary} />
                                    <Text
                                        className='text-sm'
                                    >Create Branches</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className='bg-white border py-5 border-lavender rounded justify-center items-center'
                                    style={{width: '32%'}}
                                >
                                    <FontAwesome5 name="store-alt" size={17} color={COLORS.primary} />
                                    <Text
                                        className='text-sm'
                                    >Branches</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className='bg-red border py-4 border-grey_bg rounded justify-center items-center'
                                    style={{width: '32%'}}
                                >
                                    <Ionicons name="business-sharp" size={25} color={COLORS.white} />
                                    <Text
                                        className='text-sm text-white'
                                    >Deactivate</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* End business structure */}

                        <View className='w-full my-4 bg-lavender' style={{height: 1}}/>

                        {/* Begin team management */}
                        <View
                            className='w-full'
                        >
                            <View className='flex-row items-center mb-2'>
                                <View
                                    className='border rounded-full border-lavender justify-center items-center'
                                    style={{width: 32, height: 32, backgroundColor: COLORS.extra_blue}}
                                >
                                    <Ionicons name="people" size={16} color={COLORS.white} />
                                </View>
                                <Text
                                    className='text-black text-xl ml-2'
                                    style={{fontFamily: 'outfit-medium'}}
                                >Team Management</Text>
                            </View>

                            <View
                                className='flex-row flex-wrap justify-between items-center w-full mt-2'
                            >
                                <TouchableOpacity
                                    className='bg-white border py-4 border-lavender rounded justify-center items-center'
                                    style={{width: '32%'}}
                                    onPress={() => router.push({
                                        pathname: './AddBusinessMember',
                                        params: {
                                            business_id: business_id,
                                            roles: roles,
                                            user_id: user_id
                                        }
                                    })}
                                >
                                    <AntDesign name="user-add" size={23} color={COLORS.primary} />
                                    <Text
                                        className='text-sm'
                                    >Add Member</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* End team management */}

                        <View className='w-full my-4 bg-lavender' style={{height: 1}}/>

                        {/* Begin access control */}
                        <View
                            className='w-full'
                        >
                            <View className='flex-row items-center '>
                                <View
                                    className='border rounded-full border-lavender justify-center items-center'
                                    style={{width: 32, height: 32, backgroundColor: COLORS.extra_blue}}
                                >
                                    {/* <Ionicons name="user-shield" size={17} color={COLORS.white} /> */}
                                    <FontAwesome5 name="user-shield" size={13} color={COLORS.white} />
                                </View>
                                <Text
                                    className='text-black text-xl ml-2'
                                    style={{fontFamily: 'outfit-medium'}}
                                >Access Control</Text>
                            </View>

                            <View
                                className='flex-row flex-wrap justify-between items-center w-full mt-2'
                            >
                                <TouchableOpacity
                                    className='bg-white border py-4 border-lavender rounded justify-center items-center'
                                    style={{width: '32%'}}
                                    onPress={() => router.push({
                                        pathname: './CreateRole',
                                        params: {
                                            user_id: user_id,
                                            business_id: business_id,
                                            business_name,
                                            business_type
                                        }
                                    })}
                                >
                                    <AntDesign name="team" size={23} color={COLORS.primary} />
                                    <Text
                                        className='text-sm text-black'
                                    >Create Roles</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className='bg-white border py-4 border-lavender rounded justify-center items-center mt-4'
                                    style={{width: '32%'}}
                                    onPress={() => router.push({
                                        pathname: './BusinessRoles',
                                        params: {
                                            business_id: business_id,
                                            user_id: user_id
                                        }
                                    })}
                                >
                                    <AntDesign name="team" size={21} color={COLORS.primary} />
                                    <Text
                                        className='text-sm text-black'
                                    >View Roles</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* End access control */}
                        
                        {/* End Content */}
                    </MotiView>
                </View>
            </Pressable>
        </Modal>
    )
}

export default MenuModal