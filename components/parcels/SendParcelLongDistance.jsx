import { View, Text, ScrollView } from 'react-native'
import FormInputs from '../FormFields/FormInputs'
import CustomButton from '../Buttons/CustomButton'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS, SIZES } from '../../constants/constants';
import DescriptionInput from '../FormFields/DescriptionInput';
import { useEffect, useState } from 'react';
import useSend from '../../hook/useSend';
import Toast from 'react-native-toast-message';
import Redirecting from '../../app/Redirecting';
import LoadingIndicator from '../../app/LoadingIndicator';
import { useSelector } from "react-redux";
import { Redirect } from 'expo-router';

const SendParcelLongDistance = () => {
    // Get location data from Redux store with fallback to prevent errors
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector((state) => state.location) || {};
    const [agreement, setAgreement] = useState(true);

    const [formData, setFormData] = useState({
        user_id: '20250224_1629007291740407340729_67bc822cb1de46.283611430da19cbb202460a3e5c9b65232566259',
        package_description:'',
        recievers_full_names:'',
        recivers_phone_number:'',
        delivery_price:'25',
        pickup_latitude: latitude || '-00.000000',
        pickup_longitude: longitude || '00.000000',
        destination_latitude: '-00.000000',
        destination_longitude: '00.000000',
        pick_up_location:'',
        distance: 'LONG'
    });

    const [errorMessage, setErrorMessage] = useState('');

    // Define the toastConfig globally
    const toastConfig = {
        tomatoToast: ({ text1, text2, props }) => (
            <View style={{
                width: '96%',
                backgroundColor: errorMessage === 'Success' ? COLORS.green2 : COLORS.primary,
                paddingVertical: 17,
                paddingHorizontal: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SIZES.border }}>
                    {/* <Text style={{ color: 'white', fontSize: 16, fontFamily: 'maven-bold' }}>{text1}</Text> */}
                    <Text numberOfLines={2} style={{ color: 'white', fontSize: 16, fontFamily: 'maven-medium' }}>
                    {text2 === 'Success' ? 'Parcel sent successfully' : text2}</Text>
            </View>
        ),
    };

    // Custom hook for API call
    const { send, isLoading, error, resend, clear } = useSend('/parcel/send_parcel/', formData);

    useEffect(() => {
        if (send?.Response) {
            setErrorMessage(send.Response);
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                // text1: 'Response',
                text2: send.Response,
                visibilityTime: 4000,
                animationType: 'slide',
            });
        }
    }, [send]);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSendParcels = () => {
        setErrorMessage(''); // Clear error message on submit

        // Client-side validation
        if (!formData.pick_up_location) {
            setErrorMessage('Please enter pick up address!');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Please enter pick up address!',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.recievers_area_address) {
            setErrorMessage("Please enter recipient's area address!");
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: "Please enter recipient's area address!",
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.recievers_full_names) {
            setErrorMessage("Please enter recipient's full names!");
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: "Please ent recipient's names!",
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.recivers_phone_number) {
            setErrorMessage("Please enter recipient's phone number!");
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: "Please ent recipient's phone number!",
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.package_description) {
            setErrorMessage("Please enter parcel description!");
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: "Please ent parcel description!",
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        // Trigger API request
        resend();
    };
    errorMessage === 'Success' ?
    setTimeout(() => {
        <Redirect href='./index/' />
    }, 5000) : ''

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='w-full mt-1 pb-8'>
                    <View className='mx-2 mt-8'>
                        <View className='mb-4'>
                            <Text className='text-primary text-lg font-bold'>NOTE*</Text>
                            <Text className='text-slate text-base' style={{fontFamily: 'roboto-medium'}}>
                                Items that are prohibited shall not be transport by any Nerands transporter. This will include items like:
                                Marijuana, Cocaine, Guns etc.
                            </Text>
                        </View>
                        <View>
                            <FormInputs
                                title="Pick up address"
                                handleChangeText={(value) => handleChangeText('pick_up_location', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="Search for area address you are sending the item(s) to"
                            />
                            <FormInputs
                                title="Recipient's area address"
                                placeholder=''
                                handleChangeText={(value) => handleChangeText('recievers_area_address', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="Search for area address you are sending the item's to"
                            />
                            <FormInputs
                                title="Recipient's full names"
                                placeholder=''
                                handleChangeText={(value) => handleChangeText('recievers_full_names', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="Please ensure that you provide the correct names."
                            />
                            <FormInputs
                                title="Recipient's phone number"
                                placeholder=''
                                handleChangeText={(value) => handleChangeText('recivers_phone_number', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="Please ensure that you provide the correct phone number for easy and quick communication."
                            />
                            <DescriptionInput
                                title='Parcel Description'
                                handleChangeText={(value) => handleChangeText('package_description', value)}
                                otherStyles=''
                                placeholder=''
                                desc='Please ensure that you provide correct parcel description.'
                                lines={4}
                            />
                        </View>
                        <View>
                            <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>
                            By pressing the send button, you agree to the terms and conditions the Nerands. 
                            </Text>
                            <View className='my-4'>
                                <BouncyCheckbox
                                    onPress={(text) => {setAgreement(text)}}
                                    text='I agree'
                                    isChecked={true}
                                    textStyle={{ textDecorationLine: "none", color: COLORS.slate, marginLeft: -10, fontSize: 13 }}
                                    size={20}
                                    fillColor={COLORS.primary}
                                    iconStyle={{ borderColor: COLORS.primary, borderRadius: 2, }}
                                    innerIconStyle={{ borderWidth: 2, borderRadius: 2, }}
                                />
                            </View>
                        </View>
                        <View className='w-full justify-center items-center mb-5'>
                            <Text className={`${errorMessage === 'Success' ? 'text-green2' : 'text-red' } text-lg`} style={{fontFamily: 'maven-bold'}}>{errorMessage === 'Success' ? 'Please wait...' : errorMessage}</Text>
                        </View>
                        <View className='w-full'>
                            <CustomButton
                                title={isLoading ? 'Please wait...' : 'Send'}
                                handlePress={handleSendParcels}
                                disabled={isLoading || !agreement}
                                otherStyles={`bg-primary p-4 'opacity-100' : 'opacity-50'} ${isLoading || !agreement ? 'opacity-50' : 'opacity-100'}`}
                                textStyles='text-2xl'
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            {/* Toast component with custom config */}
            <Toast config={toastConfig}/>
            {isLoading ? <LoadingIndicator loading_text='Preparing parcel...'/> : <></>}
            {/* {errorMessage === 'Success' ? <Redirecting title='Success'/> : <></>} */}
        </>
    )
}         

export default SendParcelLongDistance