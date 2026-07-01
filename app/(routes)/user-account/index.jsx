import { Entypo, FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useLogout from '../../(auth)/auth/useLogout';
import agoTimeStamp from '../../../components/agoTimeStamp';
import CustomButton from '../../../components/Buttons/CustomButton';
import HomeHeader from '../../../components/home/HomeHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { SERVER_URI, USER_IMAGE_URI } from '../../../RequestMethods';
import { formatDate, formatTime } from '../../../utils/formatDateTime';
import { toast } from '../../../utils/toast';
import LoadingIndicator from '../../LoadingIndicator';


const Index = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const [openChangeProfileImage, setOpenChangeProfileImage] = useState(false);
    const { displayCurrentLocation } = useSelector((state) => state.location);
    const [image, setImage] = useState(null);
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
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
        is_transporter,
        created_at,
        is_verified
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated]);

    const {data, isLoading: isLoadingUserData, error, get} = useApi(
        `/users/user/${user_id}`
    );

    useEffect(() => {
        if (user_id) {
            get();
        }
    }, [user_id]);

    const reload = () => {
        get();
    }

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

    const handleVerifyAccount = () => {
        if (!first_name || !last_name || !gender) {
            router.push({
                pathname: '../(auth)/personaldetails',
                params: {user_id: user_id}
            });
        } else if (!province) {
            router.push({
                pathname: '../(auth)/otherinputs',
                params: {user_id: user_id}
            });
        }
    }

    if (isLoggingOut) {
        return <LoadingIndicator loading_text="Logging out..." />;
    }

    return (
        <SafeAreaView className='flex-1 px-2 bg-white relative'>
            {/* HEADER */}
            <View className=''>
                <HomeHeader title="Home Header" location={displayCurrentLocation} />
            </View>
                {(isLoadingUserData) ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator size={40} color={COLORS.primary}/>
                        <Text
                            className='text-lg pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Loading user data...</Text>
                    </View>
                ) : error && (error.status === 500 || error.message === 'Server is unreachable. Please try again later.') ? (
                    <View className='flex-1 justify-center items-center'>
                        <MaterialCommunityIcons name="connection" size={40} color={COLORS.slate} />
                        <Text
                            className='text-lg text-red mt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Connection to server lost.</Text>
                        <Text
                            className='text-base text-slate pt-2'
                            style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                        >Please check your network & try reload the app</Text>

                        <TouchableOpacity
                            className='flex-row bg-primary justify-center items-center mt-4 px-8 rounded py-3 elevation-sm'
                            onPress={() => reload()}
                        >
                            <MaterialCommunityIcons name="reload" size={20} color="white" />
                            <Text
                                className='text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (!data) ? (
                    <View className='flex-1 justify-center items-center'>
                        <Text
                            className='text-lg text-red pt-2'
                            style={{fontFamily: 'roboto-medium'}}
                        >Failed to load account data.</Text>
                        <Text
                            className='text-base text-slate pt-2'
                            style={{fontFamily: 'roboto-medium', textAlign: 'center'}}
                        >This may be due to bad internet connectivity, press button below to reload</Text>

                        <TouchableOpacity
                            className='flex-row bg-primary justify-center items-center mt-4 px-8 rounded py-3 elevation-sm'
                            onPress={() => reload()}
                        >
                            <MaterialCommunityIcons name="reload" size={20} color="white" />
                            <Text
                                className='text-white ml-1'
                                style={{fontFamily: 'roboto-medium'}}
                            >Reload</Text>
                        </TouchableOpacity>
                    </View>
                ) : (data) ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View className='mt-8'>
                        <View className='justify-center items-center  mb-4'>
                            <View className='w-full justify-center items-center bg-white border border-grey_bg py-4 rounded'>
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
                                        {data?.profile_image === null ?
                                            <FontAwesome name="user" size={55} color={COLORS.slate} />
                                            : <Image
                                                source={{ uri: `${USER_IMAGE_URI}${data?.profile_image}` }}
                                                style={{ height: '100%', width: '100%' }}
                                                className='rounded-full border-2 border-white'
                                            />
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View className=''>
                                    <Text
                                        className={`${!data?.is_verified ? 'text-lg text-red' : 'text-2xl text-black'}`}
                                        style={{ fontFamily: 'ubuntu-medium' }}
                                    >
                                        {!data?.is_verified
                                            ? 'Unverified Account'
                                            : data?.first_name + ' ' + data?.last_name
                                        }
                                    </Text>
                                </View>

                                {!data?.is_verified &&
                                    <TouchableOpacity
                                        className='py-2 justify-center items-center mt-6 rounded elevation-lg'
                                        style={{backgroundColor: COLORS.purple, width: '65%'}}
                                        onPress={() => handleVerifyAccount()}
                                    >
                                        <Text
                                            className='text-xl text-white'
                                            style={{fontFamily: 'maven-medium'}}
                                        >Verify</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            {!data?.is_verified &&
                                <View
                                    className='justify-center items-center mt-6 border border-[#EF4444] rounded p-2 bg-[#FEF2F2]'
                                >
                                    <Text
                                        className='text-base text-black'
                                        style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                                    >
                                        Account verification required. Complete your account setup by tapping the Verify button above to gain access to all features.
                                    </Text>
                                </View>
                            }
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
                                        <Text className='text-black text-base ml-2' style={{fontFamily: 'roboto-bold'}}>Joined: </Text>
                                    </View>
                                    <Text numberOfLines={1} className='text-slate text-base ml-2' style={{fontFamily: 'roboto-medium'}}>
                                        {formatDate(created_at)} • {formatTime(created_at)} ({agoTimeStamp(created_at)})
                                    </Text>
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
                                    <MaterialIcons name="create" color={COLORS.primary} size={20} />
                                </View>
                                <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Edit Account</Text>
                            </TouchableOpacity>

                            {data?.is_verified &&
                                <>
                                    <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!is_verified ? '50' : '100'}`}
                                    onPress={() => router.push({
                                        pathname: '/(routes)/business/',
                                        params: {
                                            user_id: data?.user_id,
                                            is_verified: data?.is_verified,
                                        }
                                    })}
                                    disabled={!data?.is_verified}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        {/* <Ionicons name="business-sharp" size={25} color={COLORS.primary} /> */}
                                        <MaterialIcons name="business-center" size={25} color={COLORS.primary} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Business</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!is_verified ? '50' : '100'}`}
                                    onPress={() => router.push('/(routes)/create-store/')}
                                    disabled={!is_verified}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        <Ionicons name="create-outline" size={25} color={COLORS.primary} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Create Store</Text>
                                </TouchableOpacity> */}
                                </>
                            }

                            {/* {is_verified &&
                                <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!is_verified ? '50' : '100'}`}
                                    onPress={() => router.push('/(routes)/admin-stores/')}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        <FontAwesome5 name="store-alt" color={COLORS.primary} size={17} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>My Stores</Text>
                                </TouchableOpacity>
                            } */}

                            {data?.is_verified &&
                                <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!data?.is_verified ? '50' : '100'}`}
                                    onPress={() => router.push('/(routes)/runner/')}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        <MaterialIcons name="directions-run" size={27} color={COLORS.primary} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Runner</Text>
                                </TouchableOpacity>
                            }

                            {is_verified &&
                                <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!is_verified ? '50' : '100'}`}
                                    onPress={() => router.push('/(routes)/transporter/')}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        <MaterialCommunityIcons name="bike-fast" color={COLORS.primary} size={24} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Transporter</Text>
                                </TouchableOpacity>
                            }

                            {is_verified &&
                                <TouchableOpacity
                                    style={{width: '32%'}}
                                    className={`justify-center items-center borde py-5 rounded-md opacity-${!is_verified ? '50' : '100'}`}
                                    onPress={() => router.push('/(routes)/saved-locations/')}
                                >
                                    <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                        <Entypo name='location' size={22} color={COLORS.primary} />
                                    </View>
                                    <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Locations</Text>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity
                                style={{width: '32%'}}
                                className='justify-center items-center borde py-5 rounded-md'
                            >
                                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                    <Entypo name='thumbs-up' size={24} color={COLORS.primary} />
                                </View>
                                <Text className='text-sm' style={{ fontFamily: 'roboto' }}>Rate Us</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{width: '32%'}}
                                className='justify-center items-center borde py-5 rounded-md'
                            >
                                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 47, height: 47}}>
                                    <Entypo name='info-with-circle' size={24} color={COLORS.primary} />
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
                </ScrollView>
            ) :  (
                <View className='flex-1 justify-center items-center'>
                    <Text
                        className='text-base pt-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >
                        Failed to load user data, please reload the app.
                    </Text>
                </View>
            )}

            <Modal
                visible={openLogout}
                transparent
                animationType="none"
                onRequestClose={() => setOpenLogout(false)}
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack justify-end"
                    onPress={() => setOpenLogout(false)}
                >
                    {/* Inner content wrapper (prevents closing when tapped) */}
                    <View
                        onStartShouldSetResponder={() => true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 80 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 80}}
                            className="bg-white px-4 pt-3"
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-center">
                                <View className='flex-row justify-start items-center'>
                                    <FontAwesome5 name='sign-out-alt' size={20} />
                                    <Text
                                        className="text-xl ml-1"
                                        style={{ fontFamily: "roboto-medium" }}
                                    >
                                        Logout
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className='bg-grey_bg rounded-full justify-center items-center'
                                    style={{width: 27, height: 27}}
                                    onPress={() => setOpenLogout(false)}
                                >
                                    <FontAwesome name='times' size={17} color={'red'}/>
                                </TouchableOpacity>
                            </View>

                            <View className='w-full bg-lavender my-3' style={{height: 1}} />

                            <View className='p-4 bg-white w-full elevation-xl rounded-md'>
                                    <Text className='mb-4' style={{fontFamily: 'roboto-medium'}}>Are you sure you want to logout</Text>
                                    <View className='flex-row justify-between w-full'>
                                        <TouchableOpacity className='bg-green2 py-3 rounded justify-center items-center' style={{width: '48%'}}
                                            onPress={() => setOpenLogout(false)}
                                        >
                                            <Text className='text-white text-lg' style={{fontFamily: 'roboto-medium'}}>No</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='bg-red py-3 rounded justify-center items-center' style={{width: '48%'}}
                                            onPress={confirmLogout}
                                        >
                                            <Text className='text-white text-lg' style={{fontFamily: 'roboto-medium'}}>Yes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        </MotiView>
                    </View>
                </Pressable>
            </Modal>

            <Modal
                visible={openChangeProfileImage}
                transparent
                animationType="none"
                onRequestClose={() => setOpenChangeProfileImage(false)}
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack justify-end"
                    onPress={() => setOpenChangeProfileImage(false)}
                >
                    {/* Inner content wrapper (prevents closing when tapped) */}
                    <View
                        onStartShouldSetResponder={() => true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 80 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 80}}
                            className="bg-white px-4 pt-3"
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-center">
                                <Text
                                    className="text-xl"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    Update Profile Image
                                </Text>
                                <TouchableOpacity
                                    className='bg-grey_bg rounded-full justify-center items-center'
                                    style={{width: 27, height: 27}}
                                    onPress={() => setOpenChangeProfileImage(false)}
                                >
                                    <FontAwesome name='times' size={17} color={'red'}/>
                                </TouchableOpacity>
                            </View>

                            <View className='w-full bg-lavender my-3' style={{height: 1}} />

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
                            <CustomButton
                                title={isLoading ? "Uploading..." : "Upload"}
                                handlePress={handleUpload}
                                otherStyles="bg-primary py-3 w-full"
                                textStyles="text-2xl text-white"
                                disabled={isLoading || !image}
                            />
                        </MotiView>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

export default Index;