import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CustomButton from '../../../components/Buttons/CustomButton';
import FormInputs from '../../../components/FormFields/FormInputs';
import { COLORS } from '../../../constants/constants';
import { SERVER_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';
import Redirecting from '../../Redirecting';

const index = () => {
    const router = useRouter();
    const {
        user_id,
        first_name,
        last_name,
        phone_num,
        email_add,
        user_type,
        gender,
        date_of_birth,
        country,
        province,
        profile_image
    } = useSelector((state) => state.auth);

    const { latitude, longitude, } = useSelector((state) => state.location);

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [agreement, setAgreement] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [idNumber, setIdNumber] = useState('');
    const [identityType, setIdentityType] = useState('');
    const [transporterType, setTransporterType] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Pick images from the library
    const pickImage = async (type) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (!result.canceled) {
                const selectedImage = result.assets[0].uri;
                const fileName = selectedImage.split('/').pop(); // Get the file name
                const fileExtension = fileName.split('.').pop().toLowerCase(); // Get file extension
    
                // Allowed extensions
                const allowedExtensions = ['png', 'jpg', 'jpeg'];
    
                if (!allowedExtensions.includes(fileExtension)) {
                    Alert.alert("Invalid File", "Only PNG, JPG, and JPEG files are allowed.");
                    return;
                }
    
                if (type === 'front') {
                    setFrontImage(selectedImage);
                } else {
                    setBackImage(selectedImage);
                }
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };    

    // Function to handle upload
    const handleUpload = async () => {
        const fields = [
            { value: identityType, error: 'Please select ID type' },
            { value: idNumber, error: 'Please enter ID number' },
            { value: transporterType, error: 'Please select transporter type' },
            { value: frontImage, error: 'Please select front ID image' },
            { value: backImage, error: 'Please select back ID image' },
        ];
        
        for (let field of fields) {
            if (!field.value) {
                setErrorMessage(field.error);
                toast.error(field.error);
                return;
            }
        }

        setIsLoading(true);

        const getFileNameAndType = (uri) => {
            const fileName = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName);
            const fileType = match ? `image/${match[1]}` : `image`;
            return { fileName, fileType };
        };

        const frontFile = getFileNameAndType(frontImage);
        const backFile = getFileNameAndType(backImage);

        let formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('transporter_identity_type', identityType);
        formData.append('transporter_identity_number', idNumber);
        formData.append('courier_type', transporterType);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('front_image', {
            uri: frontImage,
            name: frontFile.fileName,
            type: frontFile.fileType,
        });
        formData.append('back_image', {
            uri: backImage,
            name: backFile.fileName,
            type: backFile.fileType,
        });

        try {
            const token = await SecureStore.getItemAsync('authToken');

            const response = await fetch(`${SERVER_URI}/transporter/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok && result.success) {
                // ✅ Backend says success
                setErrorMessage('');
                setIsSuccess(true);
                toast.success(result.message || 'Your request has been submitted successfully.');
                return;
            } else {
                // ❌ Backend sends failure
                const errorMsg = result.message || 'Upload failed. Please try again.';
                setErrorMessage(errorMsg);
                toast.error('Upload Failed');
                return;
            }
        } catch (error) {
            // console.error('Upload Error:', error);
            setErrorMessage('Network error. Please try again.');
            toast.error('Network Error', 'Unable to connect to the server. Please try again.');
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text className="text-2xl" style={{ fontFamily: 'ubuntu-medium' }}>
                Create Transporter Account
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                <View className="mt-6 w-full px-4">
                    {/* Identity Type Picker */}
                    <View className="my-5">
                        <Text className="text-gray-700 text-lg mb-1" style={{ fontFamily: 'roboto-bold' }}>
                            Identity Type
                        </Text>
                        <Text className="text-sm mb-1 text-slate" style={{ fontFamily: 'roboto-medium' }}>
                            Please select your identity type
                        </Text>
                        <View className="rounded-md" style={{ borderWidth: 1, borderColor: 'lavender' }}>
                            <Picker
                                selectedValue={identityType}
                                onValueChange={(itemValue) => setIdentityType(itemValue)}
                                className="border p-2 mb-2 rounded"
                            >
                                <Picker.Item label="Select identity type" value="" />
                                <Picker.Item label="NRC" value="NRC" />
                                <Picker.Item label="Passport" value="Passport" />
                            </Picker>
                        </View>
                    </View>

                    {/* ID Number Input */}
                    <FormInputs
                        title="Identity Number"
                        handleChangeText={(value) => setIdNumber(value)}
                        desc="Please enter your identity number"
                        borderStyle="border border-lavender"
                    />

                    {/* Identity Type Picker */}
                    <View className="my-5">
                        <Text className="text-gray-700 text-lg mb-1" style={{ fontFamily: 'ubuntu-bold' }}>
                            Transporter type
                        </Text>
                        <Text className="text-sm mb-1 text-slate" style={{ fontFamily: 'roboto-medium' }}>
                            Please select transporter type
                        </Text>
                        <View className="rounded-md" style={{ borderWidth: 1, borderColor: 'lavender' }}>
                            <Picker
                                selectedValue={transporterType}
                                onValueChange={(itemValue) => setTransporterType(itemValue)}
                                className="border p-2 mb-2 rounded"
                            >
                                <Picker.Item label="Select transporter type" value="" />
                                <Picker.Item label="Foot transporter" value="Foot" />
                                <Picker.Item label="Cycler transporter" value="Cycler" />
                                <Picker.Item label="Biker transporter" value="Biker" />
                                <Picker.Item label="Motor car transporter" value="Motor-Car" />
                            </Picker>
                        </View>
                    </View>

                    {/* Image Selection */}
                    <View>
                        <Text className="text-sm text-slate" style={{ fontFamily: 'roboto-medium' }}>
                            Please select images of your identity document, including both the front and back views.
                        </Text>
                    </View>

                    <View className="w-full flex-row justify-center gap-3 items-center mt-4">
                        {/* Front Image */}
                        <TouchableOpacity
                            onPress={() => pickImage('front')}
                            style={{ width: '40%', height: 100 }}
                            className="border-2 bg-white border-primary p-1 rounded-lg justify-center items-center"
                        >
                            {frontImage ? (
                                <Image source={{ uri: frontImage }} className="w-full h-full rounded-lg" />
                            ) : (
                                <>
                                    <FontAwesome5 name="camera" size={50} color={COLORS.primary} />
                                    <Text className="text-base font-bold mt-2">Front ID Image</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Back Image */}
                        <TouchableOpacity
                            onPress={() => pickImage('back')}
                            style={{ width: '40%', height: 100 }}
                            className="border-2 bg-white border-primary p-1 rounded-lg justify-center items-center"
                        >
                            {backImage ? (
                                <Image className="w-full h-full rounded-lg" source={{ uri: backImage }} />
                            ) : (
                                <>
                                    <FontAwesome5 name="camera" size={50} color={COLORS.primary} />
                                    <Text className="text-base font-bold mt-2">Back ID Image</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Agreement Checkbox */}
                    <View className="w-full">
                        <Text className="text-slate text-sm my-8" style={{ fontFamily: 'roboto-medium' }}>
                            By pressing the create button, you sign up to the terms and conditions.
                        </Text>
                        <BouncyCheckbox
                            isChecked={agreement}
                            onPress={() => setAgreement(!agreement)}
                            text="I agree"
                            textStyle={{
                                textDecorationLine: 'none',
                                color: COLORS.slate,
                                marginLeft: -10,
                                fontSize: 13,
                            }}
                            size={20}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>

                    <View className='w-full my-2 justify-center items-center'>
                        <Text className='text-red text-base' style={{fontFamily: 'roboto-medium'}}>{errorMessage}</Text>
                    </View>
                </View>
            </ScrollView>
            {/* Upload Button */}
            <View className='w-full px-4'>
                <CustomButton
                    title={isLoading ? "Loading..." : "Join Now"}
                    handlePress={handleUpload} 
                    disabled={isLoading || !agreement} // Disable if loading or not agreed
                    otherStyles={`bg-primary p-4 mt-4 ${agreement ? (isLoading ? 'opacity-50' : 'opacity-100') : 'opacity-50'}`} // Apply opacity when loading or not agreed
                    textStyles="text-2xl"
                />
            </View>
            {isLoading && <LoadingIndicator loading_text='Creating account...'/>}
            {isSuccess && <Redirecting title="Success" />}
        </SafeAreaView>
    );
};

export default index;