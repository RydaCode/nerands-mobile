import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../../../components/Buttons/CustomButton';
import MainHeader from '../../../../components/MainHeader';
import { COLORS } from '../../../../constants/constants';
import { SERVER_URI } from '../../../../RequestMethods';
import { toast } from '../../../../utils/toast';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const imageTypes = [
    { label: 'Profile Image', value: 'profile' },
    { label: 'Cover Image', value: 'cover' },
];

const ChangeStoreImage = () => {
    const [image, setImage] = useState(null);
    const [imagetype, setImageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const params = useLocalSearchParams();

    // -----------------------
    // MIME TYPE DETECTION
    // -----------------------
    const getMimeType = (uri) => {
        const extension = uri.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'webp':
                return 'image/webp';
            case 'heic':
                return 'image/heic';
            default:
                return 'image/jpeg';
        }
    };

    // -----------------------
    // PICK IMAGE
    // -----------------------
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], // ✅ new format
                allowsMultipleSelection: false,
                allowsEditing: true,
                aspect: undefined,
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length > 0) {
                setImage(result.assets[0].uri);
            } else {
                toast.info('No image selected.');
            }
        } catch (error) {
            console.error('Image picker error:', error);
            toast.error('Image picker error');
        }
    };

    // -----------------------
    // UPLOAD IMAGE
    // -----------------------
    const handleUpload = async () => {
        if (!image) {
            toast.error('Please select an image.');
            return;
        }

        if (!imagetype) {
            toast.error('Please select image type.');
            return;
        }

        setIsLoading(true);

        try {
            const token = await SecureStore.getItemAsync('authToken');

            if (!token) {
                throw new Error('Session expired. Please login again.');
            }

            const formData = new FormData();

            formData.append('store_id', params.store_id);
            formData.append('image_type', imagetype);

            const file = {
                uri: image,
                name: `store_image.${image.split('.').pop() || 'jpg'}`,
                type: getMimeType(image),
            };

            formData.append('store_images', file);

            const response = await fetch(`${SERVER_URI}/stores/upload-image`, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${token}`,
                // DO NOT set Content-Type manually
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.Response || 'Upload failed.');
            }

            toast.success('Image uploaded successfully!');
            setErrorMessage('Success');
            setImage(null);
            setImageType('');

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Upload failed.');
            setErrorMessage('Upload Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center">
            <View className="px-4 w-full mb-8">
                <MainHeader
                    fontFamily="ubuntu-medium"
                    textStyles="text-2xl"
                    header_name="Change Image"
                />
            </View>

            {/* ---------------- RADIO BUTTONS ---------------- */}
            <View className="my-5 flex-row items-center justify-center">
                {imageTypes.map((type, index) => (
                    <TouchableOpacity
                        key={type.value}
                        activeOpacity={0.7}
                        onPress={() => setImageType(type.value)}
                        className={`flex-row items-center ${index !== 0 ? 'ml-6' : ''}`}
                    >
                        <View
                            className={`h-5 w-5 rounded-full border-2 justify-center items-center ${
                                imagetype === type.value
                                ? 'border-primary'
                                : 'border-gray-400'
                            }`}
                        >
                            {imagetype === type.value && (
                                <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                            )}
                        </View>

                        <Text className="ml-2 text-sm text-slate-600">
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ---------------- MAIN CONTENT ---------------- */}
            <View className="flex-1 justify-center items-center w-full px-4">

                {/* Pick Image Button */}
                <TouchableOpacity
                    onPress={pickImage}
                    activeOpacity={0.8}
                    className={`border-2 ${
                        !image ? 'border-lavender' : 'border-green2'
                    } bg-grey_bg px-6 py-4 mb-6 rounded-lg w-full flex-row justify-center items-center`}
                >
                    <FontAwesome5 name="camera" size={24} color="#32CD32" />
                    <Text className="text-lg font-bold ml-2">
                        {!image ? 'Pick Image' : 'Change Image'}
                    </Text>
                </TouchableOpacity>

                {/* Image Preview */}
                <ScrollView className="w-full mb-4" showsVerticalScrollIndicator={false}>
                    {image && (
                        <View className="relative mt-3 items-center">
                            <Image
                                source={{ uri: image }}
                                style={{ width: 220, height: 180 }}
                                className="border-2 border-lavender rounded-md"
                            />

                            <TouchableOpacity
                                onPress={() => setImage(null)}
                                className="absolute top-2 right-2 bg-red rounded-full p-2"
                            >
                                <FontAwesome5 name="times" color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Status Message */}
                <View className="w-full items-center justify-center p-2 mb-2">
                    <Text
                        className={`text-lg ${
                            errorMessage === 'Success' ? 'text-green2' : 'text-red'
                        }`}
                        style={{ fontFamily: 'roboto-medium' }}
                    >
                        {errorMessage}
                    </Text>
                </View>

                {/* Upload Button */}
                <CustomButton
                    title={isLoading ? 'Uploading...' : 'Upload'}
                    handlePress={handleUpload}
                    otherStyles="bg-primary p-4 mb-4 w-full"
                    textStyles="text-2xl text-white"
                    disabled={isLoading || !image || !imagetype}
                />
            </View>

            {isLoading && (
                <LoadingIndicator loading_text="Uploading store image..." />
            )}

            {errorMessage === 'Success' && (
                <Redirecting title="Success" />
            )}
        </SafeAreaView>
    );
};

export default ChangeStoreImage;