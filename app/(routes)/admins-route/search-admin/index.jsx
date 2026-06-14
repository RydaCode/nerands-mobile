import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomButton from '../../../../components/Buttons/CustomButton';
import FormInputs from '../../../../components/FormFields/FormInputs';
import MainHeader from '../../../../components/MainHeader';
import useApi from '../../../../hook/useApi';
import { STORES_IMAGE_URI } from '../../../../RequestMethods';
import { toast } from '../../../../utils/toast';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const Index = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        admin_id: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [hasNavigated, setHasNavigated] = useState(false);
    const admin_id = formData.admin_id.trim();
    const [showRedirecting, setShowRedirecting] = useState(false);

    const { data, isLoading, error, get } = useApi(`/stores/admin/search?search_id=${admin_id}`);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSearchAdmin = () => {
        if (!admin_id) {
            setErrorMessage('Please enter user phone number / email!');
            toast.error('Please enter user phone number / email!');
            return;
        }

        setErrorMessage('');
        setHasNavigated(false);
        get();
    };

    useEffect(() => {
        if (!data || hasNavigated) return;

        if (data?.success && Array.isArray(data?.data) && data?.data?.length > 0) {
            setErrorMessage('Success');
            toast.success(`Found ${data?.data?.length} user(s).`);

            setHasNavigated(true);
            setTimeout(() => {
                router.push({
                    pathname: '../admins-route/admin-search-results/',
                    params: {
                        store_name: params.store_name,
                        store_profileimage: params.store_profileimage,
                        store_description: params.store_description,
                        store_id: params.store_id,
                        user_id: data?.data[0]?.user_id,
                        first_name: data?.data[0]?.first_name,
                        last_name: data?.data[0]?.last_name,
                        phone_num: data?.data[0]?.phone_num,
                        status: data?.data[0]?.status,
                    },
                });
            }, 1000);
        } else if (!data?.success) {
            setErrorMessage(data?.message || 'No users found.');
            toast.error(data?.message || 'No user found with that ID.');
        }
    }, [data]);

    useEffect(() => {
        if (errorMessage === 'Success') {
            setShowRedirecting(true);

            const timeout = setTimeout(() => {
            setShowRedirecting(false);
            }, 3000); // hide after 3 seconds

            return () => clearTimeout(timeout); // cleanup
        }
    }, [errorMessage]);

    return (
        <SafeAreaView className="items-center flex-1 bg-white">
            <View className="px-4 w-full">
                <MainHeader fontFamily="maven-bold" header_name="User Search" />
            </View>

            <View className="flex-1 px-4 justify-center items-center">
                <View className="mt-8 justify-center items-center w-full">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="w-full flex-row justify-start items-center">
                            <View
                                style={{ height: 80, width: 80 }}
                                className="border-2 border-lavender rounded-full justify-center items-center"
                            >
                                <Image
                                    className="h-full w-full border-2 border-white rounded-full"
                                    source={{
                                        uri: `${STORES_IMAGE_URI}${params.store_profileimage || 'default.jpg'}`,
                                    }}
                                    onError={(e) => {
                                        console.warn('Image load failed:', e.nativeEvent);
                                    }}
                                />
                            </View>
                            <Text className="ml-2 text-xl" style={{ fontFamily: 'maven-bold' }}>
                                {params.store_name}
                            </Text>
                        </View>

                        <View className="w-full mt-10">
                            <FormInputs
                                title="Phone number / Email"
                                handleChangeText={(value) => handleChangeText('admin_id', value)}
                                desc="Enter phone number / email of a user you want to add as admin to this store."
                                borderStyle="border border-lavender"
                            />

                            <View className="w-full justify-center items-center">
                                <Text
                                    className={`${
                                        errorMessage === 'Success' ? 'text-green2' : 'text-red'
                                    } text-sm`}
                                    style={{ fontFamily: 'roboto-medium' }}
                                >
                                    {/* {errorMessage === 'Success' ? 'Please wait...' : errorMessage} */}
                                    {showRedirecting && 'Please wait...'}
                                </Text>
                            </View>

                            <View className="w-full">
                                <CustomButton
                                    title={isLoading ? 'Please wait...' : 'Search'}
                                    handlePress={handleSearchAdmin}
                                    disabled={isLoading}
                                    otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                                    textStyles="text-2xl"
                                />
                            </View>
                        </View>
                        <View className="pb-20" />
                    </ScrollView>
                </View>
            </View>

            <Toast />

            {isLoading && <LoadingIndicator loading_text="Searching user..." />}
            {showRedirecting && <Redirecting title="Success" />}
        </SafeAreaView>
    );
};

export default Index;
