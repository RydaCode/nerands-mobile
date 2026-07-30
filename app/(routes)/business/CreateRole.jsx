import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DescriptionInput from '../../../components/FormFields/DescriptionInput';
import FormInputs from '../../../components/FormFields/FormInputs';
import Headers from '../../../components/Headers';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import AuthLayout from '../../AuthLayout';

const CreateRole = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [openAddMember, setOpenAddMember] = useState(false);
    const {data, isLoading, error, post} = useApi(
        `/businesses/role/create`
    );

    const [formData, setFormData] = useState({
        user_id: params.user_id,
        business_id: params.business_id,
        role_name: '',
        role_description: '',
        is_system: false
    });

    const handleChangeText = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));

        setErrors(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    }, []);

    const handleCreateRole = async () => {
        let newErrors = {};
        
        if (!formData.role_name) {
            newErrors.role_name = "Role name is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            const res = await post(formData);
            if (res?.success) {
                toast.success(res?.message || "Business role created");
                setSuccess(true);
                setTimeout(() => {
                    router.back();
                }, 3000);
                return;
            }
            else if (!res?.success) {
                toast.error(res?.message || "Business role was not created");
                return;
            }
            else if (error) {
                toast.error(error.message || "Business role was not created, try again later");
                return;
            }
        } catch (err) {
            toast.error(err.message || "Failed to create business role");
            return;
        }
    }

    return (
        <AuthLayout>
            <SafeAreaView className='flex-1 px-4 bg-white justify-between relative'>
                <Headers header_name='Business Hub' fontFamily='outfit-medium' textStyles='text-2xl' icon={<Ionicons name='business-sharp' size={15} color={COLORS.slate}/>}/>
                {isLoading && (
                    <View className='h-full justify-center items-center absolute' style={{zIndex: 900, left: 0, right: 0, bottom: 0}}/>
                )}
                <View className='flex-1 justify-center'>
                    <View className='w-full mb-8 bg-grey_bg p-1 rounded-xl justify-center items-center'>
                        <Text
                            className='text-base'
                            style={{fontFamily: 'roboto-medium'}}
                        >Create new role for 
                        <Text
                            className='text-base text-green1'
                            style={{fontFamily: 'roboto-medium'}}
                        > {params.business_name}</Text>
                        </Text>
                    </View>

                    <FormInputs
                        title="Role Name"
                        placeholder='Eg: Admin'
                        handleChangeText={(value) =>
                            handleChangeText("role_name", value)
                        }
                        borderStyle={`border ${errors.role_name ? "border-red" : "border-[#E2E8F0]"}`}
                        autoFocus={true}
                        error={errors.role_name}
                    />

                    <View className='mb-8'/>

                    <DescriptionInput
                        title='Role Description (Optional)'
                        handleChangeText={(value) => handleChangeText('role_description', value)}
                        desc='Add a short description about this role.'
                        otherStyles='text-lg'
                        borderStyle='border-2 border-lavender rounded-xl w-full'
                        lines={4}
                    />

                    {success && (
                        <View className='w-full my-8 bg-green1 p-2 rounded-xl justify-center items-center'>
                            <Text
                                className='text-base text-white'
                                style={{fontFamily: 'roboto-medium'}}
                            >
                                Role created successfully!
                            </Text>
                        </View>
                    )}
                    
                    <TouchableOpacity
                        className='bg-primary w-full rounded-xl justify-center items-center py-3'
                        onPress={() => handleCreateRole()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={22} color={COLORS.white}/>
                        ) : (
                            <Text
                                className='text-2xl text-white'
                                style={{fontFamily: 'maven-medium'}}
                            >Create</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </AuthLayout>
    )
}

export default CreateRole