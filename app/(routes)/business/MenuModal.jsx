import { useResponsive } from '@/hook/useResponsive'
import { AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../../constants/constants'
import { usePermissions } from '../../../hook/usePermissions'
import { toast } from '../../../utils/toast'

const MenuModal = ({
    openActionBtns,
    setOpenActionBtns,
    business_id,
    roles,
    user_id,
    legal_name,
    display_name,
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
}) => {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const { can } = usePermissions();

    const {
        wp,
        listCardHeight,
        responsiveSize,
        isTablet
    } = useResponsive();

    return (
        <SafeAreaView>
        <View className='px-2 py-2'>
            {/* Header */}
            <View className="flex-row justify-between items-center">
                <Text
                    className="text-2xl"
                    style={{ fontFamily: "outfit-medium" }}
                >
                Dashboard
                </Text>
                <TouchableOpacity
                    className='bg-grey_bg rounded-full justify-center items-center'
                    style={{
                        height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                    }}
                    onPress={() => setOpenActionBtns(false)}
                >
                    <FontAwesome name='times' size={15} color={'red'}/>
                </TouchableOpacity>
            </View>

            <View className='w-full bg-lavender mt-3' style={{height: 1}} />
            {/* Start Content */}

            <ScrollView
                style={{ paddingTop: 4 }}
                contentContainerStyle={{
                    paddingBottom: 0,
                    flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
            >
            {/* Start business structure */}
            <View
                className='w-full mt-2'
            >
                <View className='flex-row items-center mb-2'>
                    <View
                        className='border rounded-full border-lavender justify-center items-center'
                        style={{
                            backgroundColor: COLORS.extra_blue,
                            height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                        }}
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
                        style={{
                            width: wp(31),
                            height: wp(21),
                        }}
                        onPress={() => {
                            if (!can('create_store')) {
                                toast.error('You do not have permission to create branches / stores');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: '../create-store',
                                params: {
                                    business_id: business_id,
                                    display_name,
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
                        <Ionicons name="create-outline" size={25} color={COLORS.primary} />
                        <Text
                            className='text-sm'
                        >Create Branch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-white border py-5 border-lavender rounded justify-center items-center'
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}

                        onPress={() => {
                            if (!can('view_stores')) {
                                toast.error('You do not have permission to view branches / stores');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: '../admin-stores',
                                params: {
                                    business_id: business_id,
                                    display_name: display_name,
                                    legal_name: legal_name,
                                    business_type: business_type,
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
                        <FontAwesome5 name="store-alt" size={17} color={COLORS.primary} />
                        <Text
                            className='text-sm'
                        >Branches</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-red border py-5 mt-8 border-grey_bg rounded justify-center items-center'
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}
                        disabled={true}

                        onPress={() => {
                            if (!can('deactivate_business')) {
                                toast.error('You do not have permission to deactivate business');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: '../stores',
                                params: {
                                    business_id: business_id,
                                    display_name: display_name,
                                    business_type: business_type,
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
                        <Ionicons name="business-sharp" size={19} color={COLORS.white} />
                        <Text
                            className='text-sm text-white'
                        >Deactivate</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* End business structure */}

            {/* Start business products */}
            <View className='w-full mt-2'>
                <View className='flex-row items-center mb-2'>
                    <View
                        className='border rounded-full border-lavender justify-center items-center'
                        style={{
                            backgroundColor: COLORS.extra_blue,
                            height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                        }}
                    >
                        <FontAwesome name="product-hunt" size={25} color={COLORS.white} />
                    </View>
                    <Text
                        className='text-black text-xl ml-2'
                        style={{fontFamily: 'outfit-medium'}}
                    >Products</Text>
                </View>

                <View
                    className='flex-row flex-wrap justify-between items-center w-full mt-2'
                >
                    <TouchableOpacity
                        className='bg-white border py-4 border-lavender rounded justify-center items-center'
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}

                        onPress={() => {
                            if (!can('view_product_category')) {
                                toast.error('You do not have permissions to view categories');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: './ProductCategories',
                                params: {
                                    user_id: user_id,
                                    business_id: business_id,
                                    display_name: display_name,
                                    business_type: business_type,
                                    business_category: business_category
                                }
                            });
                        }}
                    >
                        <MaterialIcons name="category" size={24} color={COLORS.primary} />
                        <Text className='text-sm text-black'>
                            Categories
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='border py-4 border-grey_bg rounded justify-center items-center'
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}

                        onPress={() => {
                            if (!can('view_products')) {
                                toast.error('You do not have permission to view products');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: './BusinessProducts',
                                params: {
                                    user_id,
                                    business_id: business_id,
                                    display_name: display_name,
                                    business_type: business_type,
                                    business_category: business_category
                                }
                            });
                        }}
                    >
                        <AntDesign name="product" size={22} color={COLORS.primary} />
                        <Text className='text-sm text-black'>Products</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* End business products */}

            <View className='w-full my-4 bg-lavender' style={{height: 1}}/>

            {/* Begin team management */}
            <View
                className='w-full'
            >
                <View className='flex-row items-center mb-2'>
                    <View
                        className='border rounded-full border-lavender justify-center items-center'
                        style={{
                            backgroundColor: COLORS.extra_blue,
                            height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                        }}
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
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}
                        onPress={() => {
                            if (!can('add_member')) {
                                toast.error('You do not have permission to add members');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: './AddBusinessMember',
                                params: { business_id, roles, user_id }
                            });
                        }}
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
                        style={{
                            backgroundColor: COLORS.extra_blue,
                            height: responsiveSize(8, 32, 50), width: responsiveSize(8, 32, 50)
                        }}
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
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}
                        onPress={() => {
                            if (!can('create_role')) {
                                toast.error('You do not have permission to create roles');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                                pathname: './CreateRole',
                                params: {
                                    user_id: user_id,
                                    business_id: business_id,
                                    business_name: legal_name,
                                business_type
                            }
                        })}}
                    >
                        <AntDesign name="team" size={23} color={COLORS.primary} />
                        <Text
                            className='text-sm text-black'
                        >Create Roles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-white border py-4 border-lavender rounded justify-center items-center mt-4'
                        style={{
                            width: wp(31),
                            height: wp(21)
                        }}
                        onPress={() => {
                            if (!can('view_roles')) {
                                toast.error('You do not have permission to view roles');
                                setOpenActionBtns(false);
                                return;
                            }

                            router.push({
                            pathname: './BusinessRoles',
                            params: {
                                business_id: business_id,
                                user_id: user_id
                            }
                        })}}
                    >
                        <AntDesign name="team" size={21} color={COLORS.primary} />
                        <Text
                            className='text-sm text-black'
                        >View Roles</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* End access control */}
            </ScrollView>

            {/* End Content */}
        </View>
        </SafeAreaView>
    )
}

export default MenuModal