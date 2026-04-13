import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/Buttons/CustomButton';
import FormInputs from '../../../components/FormFields/FormInputs';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';
import Redirecting from '../../Redirecting';

const CreateStoreExtras = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    const [formData, setFormData] = useState({
        store_id: params.store_id,
        extra_name: '',
        extra_price: '',
    });
    
    const { data: response,isLoading,error,post } = useApi('/stores/extras/create');
        
    useEffect(() => {
        if (response) {
            if (response.Response === 'Success') {
                toast.success('Extra created successfully!');
        
                setIsRedirecting(true);
                setTimeout(() => {
                    router.back(); // Navigate back
                }, 5000);
            } else {
                toast.error(response.Response || 'Something went wrong');
            }
        }
        
        if (error) {
            toast.error('An error occurred. Please try again.');
        }
    }, [response, error]);
            
    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
        
    const handleCreateExtra = () => {
        setErrorMessage(''); // Clear error message
        
        const validations = [
            { field: formData.extra_name, message: 'Enter extra name.' },
            { field: formData.extra_price, message: 'Enter extra price.' },
        ];
        
        for (let i = 0; i < validations.length; i++) {
            const { field, message, validate } = validations[i];
            const isValid = validate ? validate() : !!field;
        
            if (!isValid) {
                setErrorMessage(message);
                showErrorToast(message);
                return;
            }
        }
        
        // Trigger API request
        post(formData);
        setFormData((prev) => ({
            ...prev,
            extra_name: '',
            extra_price: '',
        }));
    };

    return (
        <>
            <SafeAreaView className='flex-1 bg-white justify-center items-center'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full justify-center"
                >
                    <View className="w-full bg-white p-4" animation="slideInUp" duration={500} easing="ease-in-out">
                        <ScrollView className="w-full">
                            <View className="p-2 items-center">
                                <View className="w-full flex-row items-center">
                                    <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                    <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                                        Create Extras
                                    </Text>
                                </View>
                            </View>
                            <View className="h-[1px] mb-8 mx-2 mt-1 w-full bg-lavender" />
                            <View className="w-full p-2">
                                <FormInputs
                                    title='Extra Name'
                                    handleChangeText={(value) => handleChangeText('extra_name', value)}
                                    desc='Enter extra name. (Eg: Extra sauce, Extra large chips, etc)'
                                    borderStyle='border border-lavender'
                                />
                                <FormInputs
                                    title='Extra Price'
                                    handleChangeText={(value) => handleChangeText('extra_price', value)}
                                    // desc='Enter extra price'
                                    borderStyle='border border-lavender'
                                />
                                <View className='w-full'>
                                    <Text className='text-sm' style={{fontFamily: 'roboto-medium'}}>{errorMessage}</Text>
                                </View>
                                <CustomButton
                                    title={isLoading ? 'Creating...' : 'Create'}
                                    handlePress={handleCreateExtra}
                                    disabled={isLoading}
                                    otherStyles={`bg-primary p-4 my-1`}
                                    textStyles='text-2xl'
                                />
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading ? <LoadingIndicator loading_text="Creating extra..." /> : null}
            {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null}
        </>
    )
}

export default CreateStoreExtras