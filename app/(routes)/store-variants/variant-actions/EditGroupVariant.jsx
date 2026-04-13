import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Switch } from 'react-native';
import CustomButton from '../../../../components/Buttons/CustomButton';
import FormInputs from '../../../../components/FormFields/FormInputs';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const EditGroupVariant = () => {

    const router = useRouter();
    const params = useLocalSearchParams();

    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const parseBoolean = (value) => value === 'true';
        
    const [formData, setFormData] = useState({
        store_id: params.store_id,
        name: params.name || '',
        is_required: parseBoolean(params.is_required),
        multi_select: parseBoolean(params.multi_select),
    });
        
    const {
        data: response,
        isLoading,
        error,
        patch,
    } = useApi(`/variants/update/groups/${params.id}`);
        
    const handleUpdateGroup = async () => {
        setErrorMessage('');

        const error_msg = 'Please enter group name.';

        if (!formData.name) {
            setErrorMessage(error_msg);
            toast.error(error_msg);
            return;
        }

        try {
            const res = await patch(formData);

            if (res?.success) {
                toast.success(res.message || 'Group updated  successfully');

                setIsRedirecting(true);
                setTimeout(() => {
                    router.back();
                }, 1500);
            } else {
                toast.error(res?.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Request failed');
        }
    };

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <>
            <SafeAreaView className='flex-1 bg-white px-4'>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className='bg-primary rounded-full justify-center items-center'
                    style={{ width: 35, height: 35 }}
                >
                    <FontAwesome name="angle-left" size={24} color="white" />
                </TouchableOpacity>
                
                <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 w-full justify-center"
                    >
                        <View className="w-full bg-white" animation="slideInUp" duration={500} easing="ease-in-out">
                            <ScrollView className="w-full">
                                <View className="p-2 items-center">
                                    <View className="w-full flex-row items-center">
                                        <MaterialCommunityIcons name="tune" size={27} color="#2563EB" />
                                        <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                                            Edit Group Name
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-[1px] mb-8 mx-2 mt-1 w-full bg-lavender" />
                                <View className="w-full p-2">
                                    <FormInputs
                                        title='Group Name'
                                        defaultValue={formData.name}
                                        handleChangeText={(value) => handleChangeText('name', value)}
                                        desc='Enter group name (Size, Portion, etc)'
                                        borderStyle='border border-lavender'
                                        error={errorMessage}
                                    />

                                    <Text className='text-sm mb-1 text-slate' style={{fontFamily: 'roboto-medium'}}>Please mark below if this group is required.</Text>
                                    <View className="flex-row items-center justify-between mb-6 bg-grey_bg rounded-md">
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium', marginLeft: 6}}>Required</Text>
                                        <Switch
                                            value={formData.is_required}
                                            onValueChange={(value) =>
                                                setFormData(prev => ({ ...prev, is_required: value }))
                                            }
                                            thumbColor={formData.is_required ? COLORS.primary : '#ffffff'}
                                            ios_backgroundColor="#D1D5DB"
                                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                        />
                                    </View>

                                    <Text className='text-sm mb-1 text-slate' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>Mark below if this group is required and supports multiple selections.</Text>
                                    <View className="flex-row items-center justify-between my-4 bg-grey_bg rounded-md">
                                        <Text className='text-base' style={{fontFamily: 'roboto-medium', marginLeft: 6}}>Allow Multiple Selection</Text>
                                        <Switch
                                            value={formData.multi_select}
                                                onValueChange={(value) =>
                                                setFormData(prev => ({ ...prev, multi_select: value }))
                                            }
                                            thumbColor={formData.multi_select ? COLORS.primary : '#ffffff'}
                                            ios_backgroundColor="#D1D5DB"
                                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                        />
                                    </View>
                                    <CustomButton
                                        title={'Update'}
                                        handlePress={handleUpdateGroup }
                                        disabled={isLoading}
                                        otherStyles={`bg-primary p-4 my-1`}
                                        textStyles='text-2xl'
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading ? <LoadingIndicator loading_text="Updating group..." /> : null}
            {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null}
        </>
    )
}

export default EditGroupVariant