import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormInputs from '../../../components/FormFields/FormInputs'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { COLORS } from '../../../constants/constants';
import CustomButton from '../../../components/Buttons/CustomButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';
import { SERVER_URI } from '../../../RequestMethods';
import LoadingIndicator from '../../LoadingIndicator';
import Redirecting from '../../Redirecting';

const index = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [profileimage, setProfileImage] = useState(null);
    const [date, setDate] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [age, setAge] = useState(null); // Store calculated age
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isSuccess, setIsSuccess] = useState(false);
    const [residentialaddress, setResidetialAddress] =  useState('');
    const [dateofbirth, setDateOfBirth] = useState(date.toDateString());
    const [carbikename, setCarBikeName] = useState();
    const [carbikeregnumber, setCarBikeRegNumber] = useState();
    const [carbikecolor, setCarBikeColor] = useState();
    const [carmodel, setCarModel] = useState();
    const [caryear, setCaryear] = useState();

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        setIsVisible(false);

        // Calculate Age
        const today = new Date();
        let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
        }

        setAge(calculatedAge); // Update age state
    };

    const user_id='20250224_1629007291740407340729_67bc822cb1de46.283611430da19cbb202460a3e5c9b65232566259';

    // Pick images from the library
    const pickImage = async () => {
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
    
                setProfileImage(selectedImage);
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    // Function to handle upload
    const handleUpload = async () => {
        const fields = [
            { value: residentialaddress, error: 'Please provide your residential address' },
            { value: dateofbirth, error: 'Please select your date of birth' },
            { value: carbikename, error: 'Please provide your bike / car name' },
            { value: carbikeregnumber, error: 'Please provide your car / bike reg number' },
            { value: carbikecolor, error: 'Please provide your car / bike color' },
            { value: profileimage, error: 'Please select profile image' },
        ];
    
        for (let field of fields) {
            if (!field.value) {
                setErrorMessage(field.error);
                showToast('error', 'Error', field.error);
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
    
        const getFile = getFileNameAndType(profileimage);
    
        let formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('transporter_car_bike_name', carbikename);
        formData.append('transporter_car_bike_reg_number', carbikeregnumber);
        formData.append('transporter_car_model', carmodel);
        formData.append('transporter_car_year', caryear);
        formData.append('transporter_car_bike_color', carbikecolor);
        formData.append('transporter_residential_address', residentialaddress);
        formData.append('date_of_birth', dateofbirth);
        formData.append('latitude', '-15.02359');
        formData.append('longitude', '28.032547');
        formData.append('transporter_type', params.courier_type);
        formData.append('user_profile_iamge', {
            uri: profileimage,
            name: getFile.fileName,
            type: getFile.fileType,
        });
    
        try {
            const response = await fetch(`${SERVER_URI}/deliveryman/complete_account_setup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            });
    
            const text = await response.text();
            console.log('Response Status:', response.status);
            console.log('Raw Server Response:', text);
    
            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                console.error('Could not parse JSON:', err);
                throw new Error('Server returned non-JSON response');
            }
    
            if (response.ok && result.Response === 'Success') {
                setErrorMessage('');
                setIsSuccess(true);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Your account has successfully been completed.',
                    position: 'bottom',
                    visibilityTime: 3000,
                    style: {
                        backgroundColor: '#d4edda',
                        borderLeftColor: '#32CD32',
                        borderLeftWidth: 5,
                        padding: 10,
                    },
                    text1Style: {
                        fontSize: 16,
                        color: '#32CD32',
                        fontFamily: 'maven-bold'
                    },
                    text2Style: {
                        fontSize: 14,
                        color: '#32CD32',
                    },
                });
            } else {
                const message = result?.Response || 'There was an issue activating your account. Please try again.';
                setErrorMessage(message);
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
                    text2: message,
                    position: 'bottom',
                    visibilityTime: 3000
                });
            }
    
        } catch (error) {
            console.error('Upload Error:', error);
            setErrorMessage('Network error. Please try again.');
            Toast.show({
                type: 'error',
                text1: 'Network Error',
                text2: 'Unable to connect to the server. Please try again.',
                position: 'bottom',
                visibilityTime: 3000,
                style: {
                    backgroundColor: '#f8d7da',
                    borderLeftColor: 'red',
                    borderLeftWidth: 5,
                    padding: 10,
                },
                text1Style: {
                    fontSize: 16,
                    color: 'red',
                    fontFamily: 'maven-bold'
                },
                text2Style: {
                    fontSize: 14,
                    color: 'red',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isSuccess) {
        router.back();
    }

    const showToast = (type, text1, text2) => {
        Toast.show({
            type,
            text1,
            text2,
            position: 'bottom',
            visibilityTime: 3000,
            style: {
                backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
                borderLeftColor: type === 'error' ? 'red' : '#32CD32',
                borderLeftWidth: 5,
                padding: 10,
            },
            text1Style: {
                fontSize: 14,
                color: type === 'error' ? 'red' : '#32CD32',
                fontFamily: 'maven-bold'
            },
            text2Style: {
                fontSize: 14,
                color: type === 'error' ? 'red' : '#32CD32',
            },
        });
    };

    return (
        <SafeAreaView className='flex-1 bg-white justify-center items-center'>
            <Text className='text-xl' style={{fontFamily: 'maven-bold'}}>Update Transporter Account</Text>
            <ScrollView showsVerticalScrollIndicator={false} className='w-full' >
                <View className='w-full my-8 px-4'>
                    
                    {/* Residential Address Input */}
                    <FormInputs
                        title='Residential Address'
                        handleChangeText={(value) => setResidetialAddress(value)}
                        desc='Please enter your residential address'
                        borderStyle='border border-lavender'
                    />
                    {/* Date of birth Input */}
                    <View className='justify-center items-center'>
                        <View className='w-full'>
                            <Text className='text-lg mb-2 text-gray-700' style={{fontFamily: 'maven-bold'}}>Select Date of Birth</Text>
                        </View>
                        <TouchableOpacity
                            className='py-3 bg-white flex-row rounded-md w-full border border-gray-200 justify-between px-4 items-center'
                            onPress={() => setIsVisible(true)}
                        >
                            <View className='flex-row'>
                                <Text className='text-base text-slate mb-2' style={{fontFamily: 'roboto-medium'}}>{date.toDateString()}</Text>
                                <Text className='ml-2 text-green-600 text-sm'>({age} Years)</Text>
                            </View>
                            <Entypo name="calendar" size={20} color="black" />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={() => setIsVisible(false)}
                            maximumDate={new Date()} // Prevents future dates
                        />
                    </View>
                    {params.courier_type === 'Biker' || params.courier_type === 'Motor-Car' ? (
                        <View className='w-full mt-4'>
                            {/* Bike Name Input */}
                            <FormInputs
                                title={params.courier_type === 'Biker' ? 'Bike Name' : 'Car Make'}
                                handleChangeText={(value) => setCarBikeName(value)}
                                // desc="Please enter your bike name"
                                desc={params.courier_type === 'Biker' ? 'Please provide your bike name' : 'Please provide your car make, (Eg: Toyota, Subaru, Nissan etc)'}
                                borderStyle='border border-lavender w-full'
                                otherStyles=''
                            />
                                {params.courier_type === 'Motor-Car' ?
                                    <>
                                        {/*Car model input */}
                                        <FormInputs
                                            title='Car model'
                                            handleChangeText={(value) => setCarModel(value)}
                                            desc='Please provide the car model, (Eg: Vits, Belta, Impreza)'
                                            borderStyle='border border-lavender w-full'
                                            otherStyles=''
                                        />
                                        {/*Car year input */}
                                        <FormInputs
                                            title='Car year'
                                            handleChangeText={(value) => setCaryear(value)}
                                            desc='Please provide the car year'
                                            borderStyle='border border-lavender w-full'
                                            otherStyles=''
                                        />
                                    </> : <></>
                                }
                            {/* Bike Reg Number */}
                            <FormInputs
                                title={params.courier_type === 'Biker' ? 'Bike Reg Number' : 'Car Reg Number'}
                                handleChangeText={(value) => setCarBikeRegNumber(value)}
                                desc={params.courier_type === 'Biker' ? 'Please provide your bike reg number' : 'Please provide your car reg number'}
                                borderStyle='border border-lavender'
                            />
                            {/* Bike Color Input */}
                            <FormInputs
                                title={params.courier_type === 'Biker' ? 'Bike Color' : 'Car Color'}
                                handleChangeText={(value) => setCarBikeColor(value)}
                                desc={params.courier_type === 'Biker' ? 'Please provide your bike color' : 'Please provide your car color'}
                                borderStyle='border border-lavender'
                            />
                        </View>
                    ) : params.courier_type === 'Cycler' ? (
                        <View className='w-full'></View>
                    ) : params.courier_type === 'Foot' ? (
                        <View className='w-full'></View>
                    ) : (
                        <View className='w-full'></View>
                    )}

                    {/* Profile Image */}
                    <View className='w-full justify-center'>
                        <Text className='my-3 text-lg text-gray-700' style={{fontFamily: 'maven-bold'}}>Choose image</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{ width: '35%', height: 90 }}
                            className="border-2 bg-white border-primary p-1 rounded-lg justify-center items-center"
                        >
                            {profileimage ? (
                                <Image className="w-full h-full rounded-lg" source={{ uri: profileimage }} />
                            ) : (
                                <>
                                    <FontAwesome5 name="camera" size={40} color={COLORS.primary} />
                                    <Text className="text-sm font-bold text-slate mt-2">Profile Image</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Upload Button */}
                    <CustomButton
                        title={isLoading ? 'Updating...' : "Update"} // Change title based on loading state
                        handlePress={handleUpload} 
                        disabled={isLoading} // Disable if loading or not agreed
                        // otherStyles={`bg-primary p-4 mt-6`} // Apply opacity when loading or not agreed
                        otherStyles={`bg-primary p-4 mt-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`} // Apply opacity when loading or not agreed
                        textStyles="text-2xl"
                    />
                </View>
            </ScrollView>
            <Toast />
            {isLoading ? <LoadingIndicator loading_text='Setting up account...'/> : <></>}
            {isSuccess && <Redirecting title="Success" />}
        </SafeAreaView>
    )
}

export default index