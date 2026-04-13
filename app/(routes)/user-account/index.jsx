import { Entypo, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useLogout from '../../(auth)/auth/useLogout';
import CustomButton from '../../../components/Buttons/CustomButton';
import HomeHeader from '../../../components/home/HomeHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { SERVER_URI, USER_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';

const Index = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const [openChangeProfileImage, setOpenChangeProfileImage] = useState(false);
    const { displayCurrentLocation } = useSelector((state) => state.location);
    const [image, setImage] = useState(null);
    const router = useRouter();
    const { logout, isLoggingOut } = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
        profile_image,
        is_runner,
        is_transporter
    } = useSelector((state) => state.auth);

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

    const confirmLogout = async () => {
        const result = await logout();

        if (result.success) {
            toast.success('You have been logged out');
            router.replace('../(auth)/login');
        } else {
            toast.error('Error', result.error);
        }
    };

    useApi(`/users/${user_id}`);

    // -----------------------
        // UPLOAD IMAGE
        // -----------------------
        const handleUpload = async () => {
            if (!image) {
                toast.error('Please select an image.');
                return;
            }
    
            setIsLoading(true);
    
            try {
                const token = await SecureStore.getItemAsync('authToken');
    
                if (!token) {
                    throw new Error('Session expired. Please login again.');
                }
    
                const formData = new FormData();
    
                formData.append('user_id', user_id);
    
                const file = {
                    uri: image,
                    name: `user_image.${image.split('.').pop() || 'jpg'}`,
                    type: getMimeType(image),
                };
    
                formData.append('user_image', file);
    
                const response = await fetch(`${SERVER_URI}/users/upload-image`, {
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
    
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(error.message || 'Upload failed.');
                setErrorMessage('Upload Failed');
            } finally {
                setIsLoading(false);
            }
        };

    if (isLoggingOut) {
        return <LoadingIndicator loading_text="Logging out..." />;
    }

    return (
        <SafeAreaView className='flex-1 px-2 bg-white relative'>
            {/* HEADER */}
            <View className=''>
                <HomeHeader title="Home Header" location={displayCurrentLocation} />
            </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View className='mt-8'>
                    <View className='justify-center items-center  mb-4 p-4 rounded-lg bg-white'>
                        <View className='w-full justify-center items-center'>
                            <TouchableOpacity className='relative'
                                onPress={() => setOpenChangeProfileImage(true)}
                            >
                                <View
                                    className='border-2 z-20 top-0 absolute bg-grey_bg border-white justify-center items-center rounded-full'
                                    style={{height: 35, width: 35, right: -15}}
                                >
                                    <FontAwesome name='camera' size={16} color={COLORS.slate}/>
                                </View>
                                <View className='rounded-full justify-center items-center'
                                    style={{ borderWidth: 2, borderColor: COLORS.lavender, height: 80, width: 80 }}
                                >
                                    {profile_image === null ?
                                        <FontAwesome name="user" size={55} color={COLORS.slate} />
                                        : <Image
                                            source={{ uri: `${USER_IMAGE_URI}${profile_image}` }}
                                            style={{ height: '100%', width: '100%' }}
                                            className='rounded-full border-2 border-white'
                                        />
                                    }
                                </View>
                            </TouchableOpacity>
                            <View className=''>
                                <Text className='text-2xl' style={{ fontFamily: 'ubuntu-medium'}}>
                                    {first_name} {last_name}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className='justify-start w-full border border-grey_bg rounded-lg bg-white p-4'>
                            <View className='flex-row items-center mb-6'>
                                <View className='flex-row items-center'>
                                    <FontAwesome6 name='envelope' color={COLORS.primary} size={20}/>
                                    <Text className='text-black text-base ml-2' style={{fontFamily: 'roboto-bold'}}>Email: </Text>
                                </View>
                                <Text numberOfLines={1} className='text-slate text-base ml-2' style={{fontFamily: 'roboto-medium'}}>{email_add}</Text>
                            </View>
                            <View className='flex-row items-center mb-6'>
                                <View className='flex-row items-center'>
                                    <FontAwesome6 name='phone' color={COLORS.primary} size={20}/>
                                    <Text className='text-black text-base ml-2' style={{fontFamily: 'roboto-bold'}}>Phone: </Text>
                                </View>
                                <Text numberOfLines={1} className='text-slate text-base ml-2' style={{fontFamily: 'roboto-medium'}}>{phone_num}</Text>
                            </View>
                            <View className='flex-row items-center mb-6'>
                                <View className='flex-row items-center'>
                                    <FontAwesome6 name='user' color={COLORS.primary} size={20}/>
                                    <Text className='text-black text-base ml-2' style={{fontFamily: 'roboto-bold'}}>User Type: </Text>
                                </View>
                                <Text numberOfLines={1} className='text-slate text-base ml-2' style={{fontFamily: 'roboto-medium'}}>
                                    {user_type} |
                                    <Text className='text-green-600'> {is_runner && 'Runner'} </Text>
                                    |<Text className='text-red'> {is_transporter && 'Transporter'}</Text>
                                </Text>
                            </View>
                            <View className='flex-row items-center mb-6'>
                                <View className='flex-row items-center'>
                                    <FontAwesome6 name='clock' color={COLORS.primary} size={20}/>
                                    <Text className='text-black text-base ml-2' style={{fontFamily: 'roboto-bold'}}>Joned: </Text>
                                </View>
                                <Text numberOfLines={1} className='text-slate text-base ml-2' style={{fontFamily: 'roboto-medium'}}>26, Sep, 2026 (2 months ago)</Text>
                            </View>
                        </View>

                    <View className='mb-1 mt-8'>
                        <Text className='text-2xl font-semibold ' style={{fontFamily: 'maven-medium'}}>Explore</Text>
                    </View>
                    {/* <View className='bg-grey_bg mb-4 mt-1' style={{height: 1}}/> */}



                <MotiView
                    from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                    animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                    transition={{ duration: 1000 }}
                    className='justify-end'
                >
                    <View className='w-full flex-row mb-8 flex-wrap justify-between bg-white rounded-lg border border-grey_bg'>
                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center py-5 rounded-md'
                            onPress={() => router.push({
                                pathname: "/(routes)/edit-user-account/",
                                params: {
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
                                },
                            })}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <MaterialIcons name="create" color={COLORS.green1} size={20} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Edit Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => router.push('/(routes)/create-store/')}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <Ionicons name="create-outline" size={25} color={COLORS.green1} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Create Store</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => router.push('/(routes)/admin-stores/')}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <FontAwesome5 name="store-alt" color={COLORS.green1} size={17} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>My Stores</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => router.push('/(routes)/runner/')}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <MaterialIcons name="directions-run" size={27} color={COLORS.green1} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Runner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => router.push('/(routes)/transporter/')}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <MaterialCommunityIcons name="bike-fast" color={COLORS.green1} size={24} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Transporter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => router.push('/(routes)/saved-locations/')}
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <Entypo name='location' size={22} color={COLORS.green1} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Locations</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <Entypo name='thumbs-up' size={24} color={COLORS.green1} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Rate Us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                        >
                            <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <Entypo name='info-with-circle' size={24} color={COLORS.green1} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>About Us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                            onPress={() => setOpenLogout(true)}
                        >
                            <View className='bg-navBtnBgHome justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <FontAwesome5 name='sign-out-alt' size={20} color={COLORS.red} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Logout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{width: '32%'}}
                            className='justify-center items-center borde py-5 rounded-md'
                        >
                            <View className='bg-navBtnBgHome justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                <MaterialCommunityIcons name="delete" size={24} color={COLORS.primary} />
                            </View>
                            <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Delete Account</Text>
                        </TouchableOpacity>

                        {isLoggingOut && (
                            <LoadingIndicator loading_text="Logging out..." />
                        )}
                    </View>
                </MotiView>
                </View>

            {openLogout &&
                <>
                    <Pressable className='absolute inset-0 bg-transparentBlack'
                        onPress={() => setOpenLogout(false)}
                    />
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 700 }}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View className='justify-center bg-white rounded-md absolute bottom-2 items-center w-full'>
                            <View className='p-4 pb-4 bg-white w-full elevation-xl rounded-md'>
                                <Text className='mb-4 text-xl' style={{fontFamily: 'roboto-medium'}}>Logout</Text>
                                <Text className='mb-4' style={{fontFamily: 'roboto-medium'}}>Are you sure you want to logout</Text>
                                <View className='flex-row justify-between w-full'>
                                    <TouchableOpacity className='bg-green2 py-4 rounded-sm justify-center items-center' style={{width: '48%'}}
                                        onPress={() => setOpenLogout(false)}
                                    >
                                        <Text className='text-white text-lg' style={{fontFamily: 'roboto-medium'}}>No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className='bg-red py-4 rounded-sm justify-center items-center' style={{width: '48%'}}
                                        onPress={confirmLogout}
                                    >
                                        <Text className='text-white text-lg' style={{fontFamily: 'roboto-medium'}}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </MotiView>
                </>
            }

            {openChangeProfileImage &&
                <>
                    <Pressable className='absolute inset-0 bg-transparentBlack'
                        onPress={() => setOpenChangeProfileImage(false)}
                    />
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 700 }}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View className='justify-center bg-white rounded-md absolute bottom-2 items-center w-full'>
                            <View
                                className='bg-red w-full mb-3 rounded-tl-md rounded-tr-md justify-center items-center'
                            >
                                <Text className='py-1 text-white text-xl' style={{fontFamily: 'roboto-medium'}}>Update Profile Image</Text>
                            </View>
                           {/* ---------------- MAIN CONTENT ---------------- */}
                            <View className="flex-1 justify-center items-center w-full px-2">

                                {/* Pick Image Button */}
                                <TouchableOpacity
                                    onPress={pickImage}
                                    activeOpacity={0.2}
                                    className={`
                                     bg-grey_bg px-6 py-4 mb-6 rounded-lg w-full flex-row justify-center items-center`}
                                >
                                    <FontAwesome5 name="camera" size={24} color={COLORS.green1} />
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
                                    disabled={isLoading || !image}
                                />
                            </View>
                        </View>
                    </MotiView>
                </>
            }
            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;