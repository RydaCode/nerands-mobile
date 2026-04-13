import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../../components/Buttons/CustomButton';
import MainHeader from '../../../../components/MainHeader';
import { SIZES } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { STORES_IMAGE_URI } from '../../../../RequestMethods';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';
const Index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [selectedLevel, setSelectedLevel] = useState('1'); // Default to Level 1
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [formData, setFormData] = useState({
        user_id: params.user_id,
        store_id: params.store_id,
        admin_status: selectedLevel,
    });

    // Custom hook for API call
    const { data, isLoading, error, post } = useApi('/stores/admin/add-admin/', formData);

    useEffect(() => {
        console.log('API Response:', data); // Debug API response

        if (data?.Response) {
            const message = data.Response;
            setErrorMessage(message);

            if (message === 'Success') {
                showToast({
                    type: 'error',
                    title: 'Response',
                    message: 'Admin added successfully!',
                    position: 'bottom',
                });

                setIsRedirecting(true);
                setTimeout(() => router.back(), 5000);
            } else {
                showToast({
                    type: 'error',
                    title: 'Response',
                    message: message,
                    position: 'bottom',
                });
            }
        } else if (error) {
            console.error('API Error:', error);
            showToast({
                type: 'error',
                title: 'Response',
                message: 'An error occurred. Please try again.',
                position: 'bottom',
            });
        }
    }, [data, error]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            admin_status: selectedLevel,
        }));
    }, [selectedLevel]);

    const handleAddStoreAdmin = () => {
        setErrorMessage('');

        if (!formData.admin_status) {
            showToast({
                type: 'error',
                title: 'Response',
                message: 'Please select admin level.',
                position: 'bottom',
            });
            return;
        }
        if (!formData.user_id || !formData.store_id) {
            showToast({
                type: 'error',
                title: 'Response',
                message: 'Missing required fields.',
                position: 'bottom',
            });
            return;
        }
        post(formData);
    };

    const showToast = ({ type = 'error', title = 'Alert', message = '', position = 'top' }) => {
        if (!message) return;

        Toast.show({
            type,
            text1: title,
            text2: message,
            position,
            visibilityTime: 4000,
            autoHide: true,
            text1Style: { fontWeight: 'bold' },
            text2Style: { color: type === 'error' ? 'red' : 'green', fontSize: SIZES.small },
        });
    };

    return (
        <SafeAreaView className="items-center flex-1 bg-white">
            <MainHeader fontFamily="maven-bold" header_name="Search Results" otherStyles="px-4" />
            
            <View className="px-4 mt-8 justify-center items-center w-full">
                {/* <View className="w-full flex-row justify-start items-center">
                    <Image
                        className="h-20 w-20 border-2 border-white rounded-full"
                        source={{ uri: `${STORES_IMAGE_URI}${params.store_profileimage}` }}
                    />
                    <Text className="ml-2 text-2xl font-bold">{params.store_name}</Text>
                </View>
                <Text className="text-sm text-gray-500 mt-2">{params.store_description}</Text> */}

                <Text className="text-base self-center mt-8">1 User found for this phone number</Text>

                <View className="w-full flex-row items-center mt-4">
                    <Image
                        className="h-20 w-20 border-2 border-white rounded-full"
                        source={{ uri: `${STORES_IMAGE_URI}${params.store_profileimage}` }}
                    />
                    <View className="ml-2">
                        <Text className="text-base font-bold">{params.first_name} {params.last_name}</Text>
                        <Text className="text-sm text-gray-500">{params.phone_num}</Text>
                    </View>
                </View>

                <View className="mt-10 mb-10 w-full">
                    <Text className="text-lg mb-1 font-bold">Select Admin Level</Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={selectedLevel}
                            onValueChange={setSelectedLevel}
                            style={styles.picker}
                        >
                            <Picker.Item label="Level 1" value="1" />
                            <Picker.Item label="Level 2" value="2" />
                            <Picker.Item label="Level 3" value="3" />
                            <Picker.Item label="Level 4" value="4" />
                        </Picker>
                    </View>
                </View>

                <CustomButton
                    title={isLoading ? 'Please wait...' : 'Add'}
                    handlePress={handleAddStoreAdmin}
                    otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                    textStyles="text-xl"
                    disabled={isLoading}
                />
            </View>

            <Toast />
            {isLoading && <LoadingIndicator loading_text="Adding admin..." />}
            {isRedirecting && <Redirecting title="Success" />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
    },
});

export default Index;