import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import LoadingIndicator from '../../app/LoadingIndicator';
import { COLORS } from '../../constants/constants';
import useApi from '../../hook/useApi';
import { toast } from '../../utils/toast';
import CustomButton from '../Buttons/CustomButton';
import DescriptionInput from '../FormFields/DescriptionInput';
import FormInputs from '../FormFields/FormInputs';

const LocalParcelDelivery = () => {
    const [agreement, setAgreement] = useState(true);
    const { latitude, longitude, } = useSelector((state) => state.location);
    const { user_id  } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        user_id: user_id,
        package_description:'',
        recievers_full_names:'',
        recivers_phone_number:'',
        delivery_price:'25',
        pickup_latitude: latitude || '-00.00000',
        pickup_longitude: longitude || '00.00000',
        destination_latitude: '-00.00000',
        destination_longitude: '00.00000',
        pick_up_location:'',
        distance: 'SHORT'
    });

    const [errorMessage, setErrorMessage] = useState('');

    // Custom hook for API call
    const { send, isLoading, error, post } = useApi('/parcel/send_parcel/', formData);
    console.log(send)

    useEffect(() => {
        if (send?.Response) {
            setErrorMessage(send.Response);
            toast.error(send.Response);
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

        if (!formData.pick_up_location) {
            setErrorMessage('Please enter the pickup address!');
            toast.error('Please enter the pickup address!');
            return;
        }

        if (!formData.recievers_area_address) {
            setErrorMessage("Please enter the recipient's area address!");
            toast.error("Please enter the recipient's area address!");
            return;
        }

        if (!formData.recievers_full_names) {
            setErrorMessage("Please enter the recipient's full name!");
            toast.error("Please enter the recipient's full name!");
            return;
        }

        if (!formData.recivers_phone_number) {
            setErrorMessage("Please enter the recipient's phone number!");
            toast.error("Please enter the recipient's phone number!");
            return;
        }

        if (!formData.package_description) {
            setErrorMessage("Please enter the parcel description!");
            toast.error("Please enter the parcel description!");
            return;
        }

        // Trigger API request
        post();
    };
    errorMessage === 'Success' ?
    setTimeout(() => {
        <Redirect href='./index/' />
    }, 5000) : ''

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='w-full mt-1 pb-8'>
                    <View className='mt-8'>
                        <View className='mb-4'>
                            <Text className='text-primary text-base' style={{fontFamily: 'roboto-medium'}}>NOTE*</Text>
                            <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                Nerands transporters are strictly prohibited from carrying illegal or restricted items, 
                                including but not limited to marijuana, cocaine, firearms, and similar substances.
                            </Text>
                        </View>
                        <View>
                            <FormInputs
                                title="Pick up address"
                                handleChangeText={(value) => handleChangeText('pick_up_location', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="If the parcel is not collected from your current location, please specify the pickup address."
                            />
                            <FormInputs
                                title="Recipient's area address"
                                placeholder=''
                                handleChangeText={(value) => handleChangeText('recievers_area_address', value)}
                                borderStyle='border border-lavender'
                                lines={2}
                                desc="Please search for the destination address before sending your item(s)."
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
                                desc="Please ensure that you provide a correct phone number for easy and efficient communication."
                            />
                            <DescriptionInput
                                title='Parcel Description'
                                handleChangeText={(value) => handleChangeText('package_description', value)}
                                otherStyles=''
                                placeholder=''
                                desc='Please ensure that you provide an accurate description of the parcel.'
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
                            <Text className={`${errorMessage === 'Success' ? 'text-green1' : 'text-red' } text-lg`} style={{fontFamily: 'roboto-medium'}}>{errorMessage === 'Success' ? 'Please wait...' : errorMessage}</Text>
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
            {isLoading && <LoadingIndicator loading_text='Preparing parcel...'/>}
            {/* {errorMessage === 'Success' ? <Redirecting title='Success'/> : <></>} */}
        </>
    )
}         

export default LocalParcelDelivery