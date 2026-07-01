import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headers from '../../../../components/Headers';
import { COLORS } from '../../../../constants/constants';
import useApi from '../../../../hook/useApi';
import { USER_IMAGE_URI } from '../../../../RequestMethods';
import { toast } from '../../../../utils/toast';
import OverLay from '../../../OverLay';

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
        is_verified: params.is_verified
    });

    // Custom hook for API call
    const { data, isLoading, error, post } = useApi('/stores/admin/add-admin/', formData);

    useEffect(() => {
        console.log('API Response:', error); // Debug API response

        if (data) {
            setErrorMessage(data.message);

            if (data.success) {
                toast.success(data.message || 'Admin added successfully');

                setIsRedirecting(true);
                setTimeout(() => router.back(), 5000);
            } else {
                toast.error(data.message);
            }
        } else if (error) {
            toast.error(error.message || 'An error occurred. Please try again.');
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
            toast.error('Please select admin level.');
            return;
        }
        if (!formData.user_id || !formData.store_id) {
            toast.error('Missing required fields.')
            return;
        }
        post(formData);
    };

    const adminlevels = [
        { label: 'Level 1', value: '1' },
        { label: 'Level 2', value: '2' },
        { label: 'Level 3', value: '3' },
        { label: 'Level 4', value: '4' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <Headers fontFamily="maven-medium" textStyles='text-2xl' header_name="Results"
                icon={<FontAwesome name='user' size={15} color={COLORS.slate}/>}
            />
            
            <View className="flex-1 mt-8 justify-center items-center w-full">
                {/* <View className="w-full flex-row justify-start items-center">
                    <Image
                        className="h-20 w-20 border-2 border-white rounded-full"
                        source={{ uri: `${STORES_IMAGE_URI}${params.store_profileimage}` }}
                    />
                    <Text className="ml-2 text-2xl font-bold">{params.store_name}</Text>
                </View>
                <Text className="text-sm text-gray-500 mt-2">{params.store_description}</Text> */}

                {params.is_verified ? (
                    <Text className="text-sm self-center mt-8">
                        User was found for this phone number / email
                    </Text>
                ) : !params.is_verified ? (
                    <Text className="text-sm self-center text-red mt-8">
                        User was found for this phone number / email, but account is unverified.
                    </Text>
                ) : null}

                <View className="w-full flex-row items-center mt-4">
                    <Image
                        className="h-20 w-20 border-2 border-white rounded-full"
                        source={{ uri: `${USER_IMAGE_URI}${params.profile_image}` }}
                    />
                    <View className="ml-2">
                        <Text className="text-base font-bold">{params.first_name} {params.last_name}</Text>
                        <Text className="text-sm text-gray-500">{params.phone_num}</Text>
                    </View>
                </View>

                <View className="mt-10 mb-10 w-full">
                    <Text className="text-lg mb-1 font-bold">Select Admin Level</Text>
                    <Dropdown
                        data={adminlevels}
                        placeholder='Select admin level'
                        labelField="label"
                        valueField="value"
                        value={selectedLevel}
                        onChange={(item) => {
                            setFormData(prev => ({
                                ...prev,
                                admin_status: item.value
                            }));
                        }}

                        style={{
                            borderWidth: 2,
                            borderColor: "#E2E8F0",
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            height: 50,
                        }}
                    />
                </View>

                <TouchableOpacity
                    className='bg-primary py-3 justify-center items-center rounded-xl w-full'
                    style={{opacity: !params.is_verified ? 0.5 : 0.9}}
                    onPress={() => handleAddStoreAdmin()}
                    disabled={isLoading || !params.is_verified}
                >
                    {isLoading ? (
                        <ActivityIndicator size={27} color='white'/>
                    ) : (
                        <Text
                            style={{fontFamily: 'maven-medium'}}
                            className='text-white text-2xl'
                        >
                            Add
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {isLoading && <OverLay />}
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