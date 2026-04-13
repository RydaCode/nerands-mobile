import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import EmptyState from '../../../components/EmptyState';
import FormInputs from '../../../components/FormFields/FormInputs';
import MainHeader from '../../../components/MainHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import useUpdate from '../../../hook/useUpdate';
import { USER_IMAGE_URI } from '../../../RequestMethods';

const FindTransporter = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {data: transporters, isLoading: loadingtransporters, error: transportererror} = useApi(`/deliveryman/search_transporter/${params.store_latitude}/${params.store_longitude}/`);

    const [randomtransporter, setRandomTransporter] = useState(true);
    const [owntransporter, setOwnTransporter] = useState(false);
    const [customtransporter, setCustomTransporter] = useState(false);

    // Initialize the state with the toggle logic
    const parameters = {
        user_id: transporters[0]?.user_id,
        is_assigned: 'YES',
        assigned_store_id: params.assigned_store_id,
        assign_order_id: params.assign_order_id,
        assigned_order_number: params.assigned_order_number,
        assigned_store_name: params.assigned_store_name,
        assign_store_latitude: params.assign_store_latitude,
        assign_store_longitude: params.assign_store_longitude,
        destination_latitude: params.destination_latitude,
        destination_longitude: params.destination_longitude,
        store_assign_phone: params.store_assign_phone,
        destination_phone: params.destination_phone,
        store_profileImage: params.store_profileImage,
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Custom hook for handling the API request
    const { update: assigntransporter, updateLoading: assignLoading, updateError: assignError, resend: resendassign } = useUpdate('/deliveryman/update/', parameters);

    // console.log(assigntransporter);

    // Effect to handle API responses
    useEffect(() => {
        if (assigntransporter) {
            const message = assigntransporter.Response;
            setErrorMessage(message);

            // Dynamic success toast with parameters (e.g., transporter and order number)
            if (message === 'Success') {
                Toast.show({
                    type: 'success',
                    text1: `Success`,
                    text2: `Order has been successfully assigned to the transporter.`,
                    
                    visibilityTime: 4000,
                    animationType: 'slide',
                    position: 'bottom',
                    text1Style: {
                        color: '#32CD32',
                        fontSize: 18,
                        fontFamily: 'maven-bold',
                    },
                    text2Style: {
                        color: '#32CD32',
                        fontSize: 14,
                        fontFamily: 'maven-medium',
                    },
                });
                setIsRedirecting(true); // This flag can be used for redirect logic
            } else {
                // Dynamic error message based on failure
                Toast.show({
                    type: 'error',
                    text1: `Assignment Failed`,
                    text2: message || 'An unexpected error occurred while assigning the transporter.',
                    visibilityTime: 4000,
                    animationType: 'slide',
                    position: 'bottom',
                    text1Style: {
                        color: 'red',
                        fontSize: 18,
                        fontFamily: 'maven-bold',
                    },
                    text2Style: {
                        color: 'red',
                        fontSize: 14,
                        fontFamily: 'maven-medium',
                    },
                });
            }
        }

        // Handling errors from the custom hook
        if (assignError) {
            Toast.show({
                type: 'error',
                text1: 'Error Occurred',
                text2: `Details: ${assignError || 'Please try again later.'}`,
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
                text1Style: {
                    color: 'red',
                    fontSize: 18,
                    fontFamily: 'maven-bold',
                },
                text2Style: {
                    color: 'red',
                    fontSize: 14,
                    fontFamily: 'maven-medium',
                },
            });
        }
    }, [assigntransporter, assignError, transporters, params]);

    // Handle the API request and state update
    const handleAssignRandomTransporter = () => {
        // Check if the transporter already has an assignment
        if (transporters[0]?.is_assigned === 'YES') {
            Toast.show({
                type: 'error',
                text1: `Transporter Already Assigned`,
                text2: 'This transporter already has an assignment. Please try to research!',
                visibilityTime: 4000,
                animationType: 'slide',
                position: 'bottom',
                text1Style: {
                    color: 'red',
                    fontSize: 18,
                    fontFamily: 'maven-bold',
                },
                text2Style: {
                    color: 'red',
                    fontSize: 14,
                    fontFamily: 'maven-medium',
                },
            });
            return;
        }
        setErrorMessage(''); // Clear previous error messages
        resendassign(); // Trigger the API request
    };

    const handleAssignOwnTransporter = () => {}
    const handleAssignCustomTransporter = () => {}
    const handleResearchTransporter = () => {}

    const MakeCall = (phone_num) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {phoneNumber = `tel: +260${phone_num}`; }
        else {phoneNumber = `telprompt: +260${phone_num}`; }
        Linking.openURL(phoneNumber);
    };
    
    return (
        <SafeAreaView className='flex-1 bg-white items-center'>
            <View className='px-2'>
                <MainHeader fontFamily='maven-bold' header_name='Transporters' />
            </View>
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className='w-full justify-center  items-center my-6'>
                            <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>Select a suitable transporter type</Text>
                            <View className='flex-row w-full mt-4 px-2 justify-center items-center'>
                                <View className='' style={{width: '30%'}}>
                                    <BouncyCheckbox                    
                                        isChecked={randomtransporter}
                                        onPress={(text) => {setRandomTransporter(text)}}
                                        text='Random'
                                        textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 15 }}
                                        size={20}
                                        fillColor={COLORS.green2}
                                        iconStyle={{ borderColor: COLORS.green2, borderRadius: 2 }}
                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                    />
                                </View>
                                <View className='mx-2' style={{width: '30%'}}>
                                    <BouncyCheckbox                    
                                        isChecked={owntransporter}
                                        onPress={(text) => {setOwnTransporter(text)}}
                                        text='Own'
                                        textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 15 }}
                                        size={20}
                                        fillColor={COLORS.green2}
                                        iconStyle={{ borderColor: COLORS.green2, borderRadius: 2 }}
                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                    />
                                </View>
                                <View className='' style={{width: '30%'}}>
                                    <BouncyCheckbox                    
                                        isChecked={customtransporter}
                                        onPress={(text) => {setCustomTransporter(text)}}
                                        text='Custom'
                                        textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 15 }}
                                        size={20}
                                        fillColor={COLORS.green2}
                                        iconStyle={{ borderColor: COLORS.green2, borderRadius: 2 }}
                                        innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                                    />
                                </View>
                            </View>
                        </View>

                        {randomtransporter === false ? <></> :
                            <>
                                <View className='px-2 w-full'>
                                    <Text className='mt-2 text-lg text-green2' style={{fontFamily: 'maven-medium'}}>{transporters.length} Random Transporter found</Text>
                                </View>

                                <FlatList
                                    data={transporters}
                                    keyExtractor={(item) => item.user_id}
                                    renderItem={({item}) => (
                                        <View className='w-full px-2 justify-center items-center'>
                                            <View className='mt-2 w-full flex-row justify-between items-center'>
                                                <View className='rounded-full border-2 border-lavender' style={{height: 70, width: 70}}>
                                                    <Image className='h-full w-full rounded-full' source={{uri: `${USER_IMAGE_URI}${item.profile_image}`}} />
                                                </View>
                                                <View className='mx-2' style={{width: '60%'}}>
                                                    <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>{item.first_name} {item.last_name}</Text>
                                                    <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>{item.phone_num}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    className='border-2 border-green1 rounded-full justify-center items-center' style={{height: 47, width: 47}}
                                                    onPress={() => MakeCall(item.phone_num)}
                                                >
                                                    <View className='w-full h-full bg-green2 rounded-full border-2 border-white items-center justify-center'>
                                                        <FontAwesome5 name='phone' size={19} color={COLORS.white}/>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            {item.courier_type === 'Motor-Car' || 'Bike' ?
                                                <>
                                                    <View className='mt-2 flex-row justify-center items-center'>
                                                        <View className='flex-row justify-start items-center'>
                                                            <Text className='text-base' style={{fontFamily: 'maven-bold'}}>{item.courier_type === 'Bike' ? 'Bike Name' : 'Car Name'}:</Text>
                                                            <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>{item.transporter_car_bike_name}</Text>
                                                        </View>
                                                        <Text className=' mx-4 text-2xl font-bold text-'>|</Text>
                                                        <View className='flex-row justify-start items-center'>
                                                            <Text className='text-base' style={{fontFamily: 'maven-bold'}}>{item.courier_type === 'Bike' ? 'Bike Color' : 'Car Color'}:</Text>
                                                            <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>{item.transporter_car_bike_color}</Text>
                                                        </View>
                                                    </View>
                                                    <View className='mt-2 flex-row justify-center items-center'>
                                                        <View className='flex-row justify-start items-center'>
                                                            <Text className='text-base' style={{fontFamily: 'maven-bold'}}>{item.courier_type === 'Bike' ? 'Bike Reg No' : 'Car Reg No'}:</Text>
                                                            <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>{item.transporter_car_bike_reg_number}</Text>
                                                        </View>
                                                    </View>
                                                </> : <></>
                                            }
                                            <View className='mt-4 flex-row justify-start items-center'>
                                                <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                                <Text className='text-base text-red' style={{fontFamily: 'maven-bold'}}>{item.distance} away from the store</Text>
                                            </View>

                                            <View className='flex-row justify-center items-center w-full mt-8'>
                                                <TouchableOpacity
                                                    className='rounded-full justify-center items-center bg-green2' style={{height: 50, width: '45%'}}
                                                    onPress={handleAssignRandomTransporter}
                                                >
                                                    <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Assigne</Text>
                                                </TouchableOpacity>
                                                <View className='mx-1' />
                                                <TouchableOpacity
                                                    className='rounded-full justify-center items-center bg-indigo-600' style={{height: 50, width: '45%'}}
                                                    onPress={handleResearchTransporter}
                                                >
                                                    <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Re-search</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View className='w-full bg-grey_bg my-4 mx-2' style={{height: 1}}/>
                                        </View>
                                    )}
                                    ListEmptyComponent={() => (
                                        <View className='flex-1 justify-center items-center relative'>
                                            <EmptyState icon={<MaterialCommunityIcons name="bike-fast" color="#000" size={31} />} description='No random transporter was found within the the radius of 2Km' />
                                            {/* <EmptyState icon={<Ionicons size={80} name="bag-outline" color={COLORS.slate} />} description='Your food cart is empty' /> */}
                                        </View>
                                    )}
                                />
                            </>
                        }

                        <FlatList
                            ListFooterComponent={() => (
                                <>
                                    {owntransporter === false ? <></> :
                                        <View className='w-full px-2 mt-10'>
                                            <Text className='text-2xl' style={{fontFamily: 'maven-bold'}}>Own Transporters</Text>
                                            <Text className='text-sm text-slate'>You can assigne your own registered transporters</Text>
                                            <View className='w-full justify-center items-center'>
                                                <View className='mt-2 w-full flex-row justify-between items-center'>
                                                    <View className='rounded-full border-2 border-lavender' style={{height: 70, width: 70}}>
                                                        <View className='w-full h-full border-2 border-white rounded-full bg-grey_bg' />
                                                    </View>
                                                    <View className='mx-2' style={{width: '60%'}}>
                                                        <Text className='text-lg' style={{fontFamily: 'maven-bold'}}>Millan Nyimbili</Text>
                                                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>0973304006</Text>
                                                    </View>
                                                    <TouchableOpacity className='border-2 border-green1 rounded-full justify-center items-center' style={{height: 47, width: 47}}>
                                                        <View className='w-full h-full bg-green2 rounded-full border-2 border-white items-center justify-center'>
                                                            <FontAwesome5 name='phone' size={19} color={COLORS.white}/>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View className='mt-2 flex-row justify-center items-center'>
                                                    <View className='flex-row justify-start items-center'>
                                                        <Text className='text-base' style={{fontFamily: 'maven-bold'}}>Bike Name:</Text>
                                                        <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>Boxer</Text>
                                                    </View>
                                                    <Text className=' mx-4 text-2xl font-bold text-'>|</Text>
                                                    <View className='flex-row justify-start items-center'>
                                                        <Text className='text-base' style={{fontFamily: 'maven-bold'}}>Bike Color:</Text>
                                                        <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>Red</Text>
                                                    </View>
                                                </View>
                                                <View className='mt-2 flex-row justify-center items-center'>
                                                    <View className='flex-row justify-start items-center'>
                                                        <Text className='text-base' style={{fontFamily: 'maven-bold'}}>Bike Reg No:</Text>
                                                        <Text className='text-base ml-2' style={{fontFamily: 'maven-bold'}}>AAT 5326</Text>
                                                    </View>
                                                </View>
                                                <View className='mt-4 flex-row justify-start items-center'>
                                                    <Ionicons name='location-sharp' size={20} color={COLORS.green2} />
                                                    <Text className='text-base text-red' style={{fontFamily: 'maven-bold'}}>5Km away from the store</Text>
                                                </View>

                                                <View className='flex-row justify-center items-center w-full mt-8'>
                                                    <TouchableOpacity
                                                        onPress={handleAssignOwnTransporter}
                                                        className='rounded-full justify-center items-center bg-green2' style={{height: 50, width: '80%'}}
                                                    >
                                                        <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Assigne</Text>
                                                    </TouchableOpacity>
                                                    <View className='mx-1' />
                                                </View>
                                                <View className='w-full bg-grey_bg my-4 mx-2' style={{height: 1}}/>
                                            </View>
                                        </View>
                                    }

                                    {customtransporter === false ? <></>:
                                        <View className='w-full px-2'>
                                            <Text className='text-2xl' style={{fontFamily: 'maven-bold'}}>Custom Transporter</Text>
                                            <Text className='mt-2 text-base text-slate'>You can use transporters that are not registered on Nerands</Text>
                                            <Text className='my-2 text-red text-base'>NOTE: For custom transporters, the store is liable for anything that happens.</Text>
                                            <View className='w-full justify-center items-center'>
                                                
                                                <View className='mt-6 w-full'>
                                                    <FormInputs
                                                        title="Transporter's Names"
                                                        handleChangeText={(value) => handleChangeText('colors', value)}
                                                        desc='Please enter transporters full names names'
                                                        borderStyle='border border-lavender'
                                                    />
                                                    <FormInputs
                                                        title="Transporter's Phone Number"
                                                        handleChangeText={(value) => handleChangeText('colors', value)}
                                                        desc="Please provide transporter's phone, and ensure it's a correct number"
                                                        borderStyle='border border-lavender'
                                                    />
                                                </View>

                                                <View className='flex-row justify-center items-center w-full mt-4'>
                                                    <TouchableOpacity
                                                        className='rounded-full justify-center items-center bg-green2' style={{height: 50, width: '80%'}}
                                                        onPress={handleAssignCustomTransporter}
                                                    >
                                                        <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>Assigne</Text>
                                                    </TouchableOpacity>
                                                    <View className='mx-1' />
                                                </View>
                                                <View className='w-full bg-grey_bg my-4 mx-2' style={{height: 1}}/>
                                            </View>
                                        </View>
                                    }
                                </>
                            )}
                        />
                    </>
                )}
                showsVerticalScrollIndicator={false}
            />
            <Toast/>
        </SafeAreaView>
    )
}

export default FindTransporter