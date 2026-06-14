import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';

const NewCustomTransporter = ({created_by, custom_order_id, store_order_id, order_type, is_runner}) => {
    const router = useRouter();
    const [form, setForm] = useState({
        created_by: created_by,
        custom_order_id: custom_order_id,
        store_order_id: store_order_id,
        firstName: "",
        lastName: "",
        regNumber: "",
        phoneNumber: "",
        type: "",
        source: "manual",
        order_type: order_type,
        is_runner
    });

    const {data: createCustomTransporter, isLoading, error, post} = useApi(
        '/transporter/custom/create'
    );

    const updateField = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAssignCustomTransporter = async () => {
        if (!form.firstName) return toast.error('Enter first name');
        if (!form.lastName) return toast.error('Enter last name');
        if (!form.regNumber) return toast.error('Enter reg number');
        if (!form.phoneNumber) return toast.error('Enter phone number');
        if (!form.type || form.type === 'none') return toast.error('Select transporter type');

        try {
            const res = await post(form);

            if (res?.success) {
                toast.success(res.message || 'Transporter assigned successfully.');
            } else {
                toast.error(res?.message || 'Failed to assign transporter.');
            }

        } catch (error) {
            toast.error('An error occurred.');
        }
    };

    return (
        <ScrollView className='h-full w-full' style={{}}>
            {isLoading ?
                <View className='w-full justify-center items-center'>
                    <ActivityIndicator size={40} color={COLORS.primary}/>
                    <Text className='text-slate text-base' style={{fontFamily: 'roboto-medium'}}>Assigning, please wait...</Text>
                </View> :
                <View className='h-full'>
                    {createCustomTransporter?.success ?
                        <View className='h-full justify-center items-center mt-10 rounded'>
                            <AntDesign name="check" size={40} color={COLORS.green2} />
                            <Text className='text-green2 text-2xl' style={{fontFamily: 'roboto-medium'}}>
                                Success
                            </Text>
                            <TouchableOpacity
                                style={{width: '70%'}}
                                className='flex-row bg-green2 mt-4 elevation-sm border border-white rounded py-4 justify-center items-center'
                                onPress={() => router.back()}
                            >
                                <FontAwesome5 name="arrow-left" size={18} color="white" />
                                <Text
                                     className='text-white ml-2 text-2xl' style={{fontFamily: 'roboto-medium'}}
                                >
                                    Go Back
                                </Text>
                            </TouchableOpacity>
                        </View> :
                        <View className='w-full'>
                            <View className='mb-10 w-full'>
                                <Text className='mb-1' style={{ fontFamily: "roboto-medium" }}>First Name</Text>
                                <TextInput
                                    placeholder="Enter first name"
                                    keyboardType="default"
                                    onChangeText={(text) => updateField("firstName", text)}
                                    style={{
                                        width: '100%',
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        padding: 10,
                                        paddingVertical: 13,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                            <View className='mb-10 w-full '>
                                <Text className='mb-1' style={{ fontFamily: "roboto-medium" }}>Last Name</Text>
                                <TextInput
                                    placeholder="Enter last name"
                                    keyboardType="default"
                                    onChangeText={(text) => updateField("lastName", text)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        padding: 10,
                                        paddingVertical: 13,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                            <View className='mb-10'>
                                <Text className='mb-1' style={{ fontFamily: "roboto-medium" }}>Motor Reg Number. (Eg: ABF-2154)</Text>
                                <TextInput
                                    placeholder="Enter reg number"
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    onChangeText={(text) => updateField("regNumber", text)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        padding: 10,
                                        paddingVertical: 13,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                            <View className='mb-10'>
                                <Text className='mb-1' style={{ fontFamily: "roboto-medium" }}>Phone Number</Text>
                                <TextInput
                                    placeholder="Enter phone number"
                                    keyboardType="numeric"
                                    onChangeText={(text) => updateField("phoneNumber", text)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        padding: 10,
                                        paddingVertical: 13,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>

                            <View className='mb-10'>
                                <Text className='mb-1' style={{ fontFamily: "roboto-medium" }}>
                                    Select transporter type
                                </Text>
                                <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, height: 50 }}>
                                    <Picker
                                        selectedValue={form.type}
                                        onValueChange={(value) => updateField("type", value)}
                                    >
                                        <Picker.Item label="Select Type" value="none" />
                                        <Picker.Item label="Foot" value="Foot" />
                                        <Picker.Item label="Bicycle" value="Cycler" />
                                        <Picker.Item label="Motor Bike" value="Biker" />
                                        <Picker.Item label="Car" value="Motor-Car" />
                                    </Picker>
                                </View>
                            </View>

                            <TouchableOpacity
                                className='justify-center items-center bg-primary my-4 rounded py-3'
                                onPress={handleAssignCustomTransporter}
                                style={{opacity: isLoading ? 0.6 : 1}}
                                disabled={isLoading}
                            >
                                <Text className='text-white text-2xl' style={{fontFamily: 'maven-medium'}}>
                                    {isLoading ? 'Assigning...' : 'Assign'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
        </ScrollView>
    )
}

export default NewCustomTransporter