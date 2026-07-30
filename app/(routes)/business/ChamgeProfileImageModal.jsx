import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { MotiView } from 'moti'
import { useState } from 'react'
import { ActivityIndicator, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import { SERVER_URI } from '../../../RequestMethods'
import { toast } from '../../../utils/toast'

const ChamgeProfileImageModal = ({
    openChnageProfileImage,
    setOpenChnageProfileImage,
    business_id,
    user_id,
    business_name,
    display_name,
    business_type
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState(null);

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

    // Upload business profile image
    // -----------------------
    // UPLOAD IMAGE
    // -----------------------
    const handleUpload = async () => {
        if (!image) {
            toast.error('Select an image.');
            return;
        }

        setIsLoading(true);

        try {
            const token = await SecureStore.getItemAsync('authToken');

            if (!token) {
                throw new Error('Session expired. Please login again.');
                toast.error('Session expired. Please login again.');
                setOpenChnageProfileImage(false);
            }

            const formData = new FormData();

            formData.append('business_id', business_id);
            formData.append('user_id', user_id);

            const file = {
                uri: image,
                name: `business_logo.${image.split('.').pop() || 'jpg'}`,
                type: getMimeType(image)
            };

            formData.append('business_logo', file);

            const response = await fetch(`${SERVER_URI}/businesses/upload-logo`, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${token}`,
                // DO NOT set Content-Type manually
                },
                body: formData,
            });

            const res = await response.json().catch(() => ({}));

            if (!res?.success) {
                throw new Error(res?.message || 'Upload failed.');
                setOpenChnageProfileImage(false)
            }

            toast.success('Image uploaded successfully');
            setErrorMessage('Image uploaded successfully');
            setImage(null);
            setOpenChnageProfileImage(false)

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Upload failed.');
            setErrorMessage('Upload Failed');
            setOpenChnageProfileImage(false)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={openChnageProfileImage}
            transparent
            animationType="none"
            onRequestClose={() => setOpenChnageProfileImage(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenChnageProfileImage(false)}
            >
                {/* Inner content wrapper (prevents closing when tapped) */}
                <View
                    onStartShouldSetResponder={() => true}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 80 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60}}
                        className="bg-white px-4 pt-3"
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-2xl"
                                style={{ fontFamily: "outfit-medium" }}
                            >
                                Update Logo
                            </Text>
                            <TouchableOpacity
                                className='bg-grey_bg rounded-full justify-center items-center'
                                style={{width: 33, height: 33}}
                                onPress={() => setOpenChnageProfileImage(false)}
                            >
                                <FontAwesome name='times' size={15} color={'red'}/>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full bg-lavender my-3' style={{height: 1}} />
                        {/* Start Content */}


                            {/* Pick Image */}
                            <TouchableOpacity
                                onPress={pickImage}
                                className="bg-grey_bg px-6 py-4 mb-6 rounded w-full flex-row justify-center items-center"
                            >
                                <FontAwesome5
                                    name="camera"
                                    size={24}
                                    color={COLORS.green1}
                                />
                                <Text className="text-lg ml-2 font-semibold" style={{fontFamily: 'roboto-medium'}}>
                                    {!image ? "Pick Image" : "Change Image"}
                                </Text>
                            </TouchableOpacity>

                            {/* Preview */}
                            {image && (
                                <View className="items-center mb-5">
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: 220, height: 180 }}
                                        className="border-2 border-lavender rounded-md"
                                    />
                                </View>
                            )}

                            {/* Status */}
                            {errorMessage ? (
                                <View className="items-center mb-4">
                                    <Text
                                        className={`text-lg ${
                                            errorMessage === "Success"
                                                ? "text-green2"
                                                : "text-red"
                                        }`}
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        {errorMessage}
                                    </Text>
                                </View>
                            ) : null}

                            {/* Upload */}
                            <TouchableOpacity
                                className='bg-primary mb-3 justify-center items-center rounded-xl py-3'
                                onPress={() => handleUpload()}
                                disabled={isLoading || !image}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size={27} color={'white'}/>
                                ) : (
                                    <Text
                                        className='text-white text-2xl'
                                        style={{fontFamily: 'outfit-medium'}}
                                    >Upload</Text>
                                )}
                            </TouchableOpacity>
                        {/* End Content */}
                    </MotiView>
                </View>
            </Pressable>
        </Modal>
    )
}

export default ChamgeProfileImageModal