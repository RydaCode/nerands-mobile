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

const EditStoreExtras = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [formData, setFormData] = useState({
        store_id: params.store_id,
        extra_id: params.extra_id,
        extra_name: params.extra_name || '',
        extra_price: params.extra_price || '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [lastToastMessage, setLastToastMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { data: response, patch, isLoading, error } = useApi('/stores/extras/update');

    // Handle API response
    useEffect(() => {
        if (response) {
            response.success ? toast.success(response.message) : toast.error(response.message)

            if (response.success) {
                setIsRedirecting(true);
                setTimeout(() => {
                    router.back();
                }, 5000);
            }
        }

        if (error) {
            toast.error(error.message || 'An unexpected error occurred.');
        }
    }, [response, error]);

    // Reset lastToastMessage
    useEffect(() => {
        if (lastToastMessage) {
            const timer = setTimeout(() => setLastToastMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [lastToastMessage]);

    const handleChangeText = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdateExtra = () => {
        setErrorMessage('');

        const validations = [
            { field: formData.extra_name, message: 'Enter extra name.' },
            { field: formData.extra_price, message: 'Enter extra price.' },
        ];

        for (const { field, message } of validations) {
            if (!field) {
                setErrorMessage(message);
                toast.error('Validation Error', message);
                return;
            }
        }
        patch(formData);
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 w-full justify-center"
                >
                    <View className="w-full bg-white p-4">
                        <ScrollView className="w-full">
                            <View className="p-2 items-center">
                                <View className="w-full flex-row items-center">
                                    <MaterialCommunityIcons name="french-fries" size={27} color="#2563EB" />
                                    <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                                        Edit Extras
                                    </Text>
                                </View>
                            </View>
                            <View className="h-[1px] mb-8 mx-2 mt-1 w-full bg-lavender" />
                            <View className="w-full p-2">
                                <FormInputs
                                    title="Extra Name"
                                    defaultValue={formData.extra_name}
                                    handleChangeText={value => handleChangeText('extra_name', value)}
                                    borderStyle="border border-lavender"
                                />

                                <FormInputs
                                    title="Extra Price"
                                    defaultValue={formData.extra_price}
                                    handleChangeText={value => handleChangeText('extra_price', value)}
                                    borderStyle="border border-lavender"
                                />

                                <Text className="text-sm text-red-500" style={{ fontFamily: 'roboto-medium' }}>
                                    {errorMessage}
                                </Text>

                                <CustomButton
                                    title="Update"
                                    handlePress={handleUpdateExtra}
                                    disabled={isLoading}
                                    otherStyles="bg-primary p-4 my-1"
                                    textStyles="text-2xl"
                                />
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading && <LoadingIndicator loading_text="Updating extra..." />}
            {isRedirecting && !isLoading && <Redirecting redirect_text="Please wait..." />}
        </>
    );
};

export default EditStoreExtras;
