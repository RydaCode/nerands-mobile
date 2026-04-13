import { FontAwesome } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomButton from '../../../../components/Buttons/CustomButton';
import useApi from '../../../../hook/useApi';
import { toast } from '../../../../utils/toast';
import LoadingIndicator from '../../../LoadingIndicator';
import Redirecting from '../../../Redirecting';

const CreateGroupOptionVariants = () => {

    const router = useRouter();
    const params = useLocalSearchParams();

    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [options, setOptions] = useState([
        { name: '', price: '' }
    ]);
        
    const {
        data: response,
        isLoading,
        error,
        post,
    } = useApi(`/variants/create-options`);
    
    const handleAddOptions = async () => {
        setErrorMessage('');

        // Validate
        for (let i = 0; i < options.length; i++) {
            const opt = options[i];

            if (!opt.name.trim()) {
                toast.error(`Option ${i + 1}: name is required`);
                return;
            }

            if (!opt.price || isNaN(opt.price)) {
                toast.error(`Option ${i + 1}: valid price required`);
                return;
            }
        }

        // Prevent duplicates
        const names = options.map(o => o.name.toLowerCase().trim());
        if (new Set(names).size !== names.length) {
            toast.error('Duplicate option names not allowed');
            return;
        }

        // Clean data
        const cleanedOptions = options.map(opt => ({
            name: opt.name.trim(),
            price: parseFloat(opt.price)
        }));

        const payload = {
            store_id: params.store_id,
            variant_group_id: params.id,
            options: cleanedOptions
        };

        try {
            const res = await post(payload);
            if (res?.success) {
                toast.success(res.message || 'Options added successfully');
                setIsRedirecting(true);

                setTimeout(() => {
                    router.back();
                }, 1500);
            } else {
                toast.error(res?.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Request failed');
        }
    };

    const MAX_OPTIONS = (params.name === 'size'
        || params.name === 'size'
        || params.name === 'Size'
        || params.name === 'Sizes'
        || params.name === 'SIZE'
        || params.name === 'SIZES'
    ) ? 100 : 20;

    const addOption = () => {
        if (options.length >= MAX_OPTIONS) {
            alert(`You can only add up to ${MAX_OPTIONS} options`);
            return;
        }
        setOptions([...options, { name: '', price: '' }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    return (
        <>
            <SafeAreaView className='flex-1 bg-white px-2'>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className='bg-primary rounded-full justify-center items-center'
                    style={{ width: 35, height: 35 }}
                >
                    <FontAwesome name="angle-left" size={24} color="white" />
                </TouchableOpacity>

                <View className="p-2 items-center">
                    <View className="w-full flex-row items-center">
                        <MaterialCommunityIcons name="tune" size={27} color="#2563EB" />
                        <Text className="text-2xl ml-1" style={{ fontFamily: 'maven-medium' }}>
                            Add Options
                        </Text>
                    </View>
                </View>
                <View className="h-[1px] mb-8 mx-2 mt-1 w-full bg-lavender" />
                
                <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 w-full justify-center"
                    >
                        <View className="w-full bg-white" animation="slideInUp" duration={500} easing="ease-in-out">
                            <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
                                <View className="w-full p-2">
                                    <View className='mb-2'>
                                        <Text
                                            style={{fontFamily: 'roboto-medium'}}
                                            className='text-lg'
                                        
                                        >Group Name: <Text className='text-primary'>[{params.name}]</Text></Text>
                                    </View>
                                    <View className='mb-1'>
                                        {/* Header */}
                                        <Text className="text-base mb-1 text-slate" style={{fontFamily: 'roboto-medium'}}>
                                            Add options to this group <Text className='text-green1'>({options.length}/{MAX_OPTIONS})</Text>
                                        </Text>
                                    </View>
                                    <View className="">
                                        {options.map((option, index) => (
                                            <View key={index} className="flex-row items-center mb-3">

                                            {/* Name Input */}
                                            <TextInput
                                                placeholder="Option name (e.g Small)"
                                                value={option.name}
                                                onChangeText={(text) => handleChange(index, 'name', text)}
                                                style={{height: 40}}
                                                className="border border-lavender p-2 rounded w-[56%] mr-2"
                                            />

                                            {/* Price Input */}
                                            <TextInput
                                                placeholder="Price"
                                                value={option.price}
                                                keyboardType="numeric"
                                                onChangeText={(text) => handleChange(index, 'price', text)}
                                                style={{height: 40}}
                                                className="border border-lavender p-2 rounded w-[28%] mr-2"
                                            />

                                            {/* Remove Button */}
                                            {options.length > 1 && (
                                                <TouchableOpacity
                                                    style={{height: 40}}
                                                    className='bg-lavender w-[12%] rounded justify-center items-center'
                                                    onPress={() => removeOption(index)}
                                                >
                                                    <Text className="text-red">✕</Text>
                                                </TouchableOpacity>
                                            )}

                                            </View>
                                        ))}

                                        {/* Add Button */}
                                        <TouchableOpacity
                                            style={{width: '40%'}}
                                            className='bg-green2 flex-row mb-8 mt-3 rounded justify-center items-center py-3'
                                            onPress={addOption}
                                        >
                                            <FontAwesome name='plus' color='white'/>
                                            <Text className="text-white ml-1" style={{fontFamily: 'roboto-medium'}}>Add Option</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <CustomButton
                                        title={'Add'}
                                        handlePress={handleAddOptions}
                                        disabled={isLoading}
                                        otherStyles={`bg-primary p-4 my-1`}
                                        textStyles='text-2xl'
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
            </SafeAreaView>
            {isLoading ? <LoadingIndicator loading_text="Updating group..." /> : null}
            {isRedirecting && !isLoading ? <Redirecting redirect_text="Please wait..." /> : null}
        </>
    )
}

export default CreateGroupOptionVariants