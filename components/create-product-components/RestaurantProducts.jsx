import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import FormInputs from '../FormFields/FormInputs'
import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import { COLORS, SIZES } from '../../constants/constants'
import DescriptionInput from '../FormFields/DescriptionInput'
import CustomButton from '../Buttons/CustomButton'
import Toast from 'react-native-toast-message';
import LoadingIndicator from '../../app/LoadingIndicator'
import Redirecting from '../../app/Redirecting'
import useSend from '../../hook/useSend'

const RestaurantProducts = ({params}) => {
    // const [selectedCategory, setSelectedCategory] = useState('');
    // const [selectedChillieOption, setSelectedChillieOption] = useState('');

    const [formData, setFormData] = useState({
        user_id:'12023459756.0245879',
        store_id:params.id,
        product_name:'',
        product_category:'',
        product_description:'',
        product_actual_price:'',
        extras_1:'',
        extras_2:'',
        extras_3:'',
        extras_price_1:'',
        extras_price_2:'',
        extras_price_3:'',
        chili_option:'',
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
                    {text2 === 'Success' ? 'Product created successfully' : text2}</Text>
            </View>
        ),
    };

    // Custom hook for API call
    const { data, isLoading, error, refetch } = useSend('/product/create/', formData);

    useEffect(() => {
        if (data?.Response) {
            setErrorMessage(data.Response);
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                // text1: 'Response',
                text2: data.Response,
                visibilityTime: 4000,
                animationType: 'slide',
            });
        }
    }, [data]);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCreateProduct = () => {
        setErrorMessage(''); // Clear error message on submit

        // Client-side validation
        if (!formData.product_name) {
            setErrorMessage('Please enter product name.');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Please enter product name.',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.product_category) {
            setErrorMessage('Select product category!');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Select product category!',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.chili_option) {
            setErrorMessage('Select product chillie option!');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Select product chillie option!',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.product_actual_price) {
            setErrorMessage('Please enter product price!');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Please enter product price!',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        if (!formData.product_description) {
            setErrorMessage('Please enter product description!');
            Toast.show({
                type: 'tomatoToast', // Use custom 'tomatoToast' type
                text2: 'Please enter product description!',
                visibilityTime: 4000,
                animationType: 'slide',
            });
            return;
        }
        // Trigger API request
        refetch();
        {errorMessage === 'Success' ?
        setTimeout(() => {
            router.push({pathname: 'filename'})
        }, 5000) : ''};
    };

    return (
        <View className='px-2 mt-8 justify-center items-center w-full'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='w-full flex-row justify-satrt items-center'>
                    <View style={{height: 80, width: 80}} className='rounded-full justify-center items-center border-2 border-lavender'>
                        <Image className='h-full w-full rounded-full border-2 border-white' source={params.image} />
                    </View>
                    <View className='w-[75%] ml-1'>
                        <Text className='text-2xl' style={{fontFamily: 'maven-bold'}}>{params.name}</Text>
                        <Text className='text-md text-slate' style={{fontFamily: 'maven-medium'}}>Fast Foods</Text>
                    </View>
                </View>
                <View className='w-full mt-10'>
                    <FormInputs
                        title='Product Name'
                        handleChangeText={(value) => handleChangeText('product_name', value)}
                        desc='Please enter product name, ensure that the product name corresponds with product category'
                        borderStyle='border border-lavender'
                    />
                    {/* <View className='mb-4'>
                        <Text className='text-gray-700 text-lg mb-1' style={{fontFamily: 'maven-medium'}}>Select Category</Text>
                        <Text className='text-sm text-slate'>Please select product category</Text>
                        <View className='rounded-md' style={{borderWidth: 1, borderColor: 'lavender'}}>
                            <Picker
                                selectedCategory={selectedCategory}
                                onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem} // Optional, for item styling
                            >
                                <Picker.Item label='Select product category' value='' />
                                <Picker.Item label='Fashion' value='Fashion' />
                                <Picker.Item label='Electronics' value='Electronics' />
                                <Picker.Item label='Grocary' value='Grocary' />
                                <Picker.Item label='Cosmetics' value='Cosmetics' />
                            </Picker>
                        </View>
                    </View> */}
                    {/* <View className='mb-4'>
                        <Text className='text-gray-700 text-lg mb-1' style={{fontFamily: 'maven-medium'}}>Select chillie option</Text>
                        <Text className='text-sm text-slate mb-1'>Please select chillie option if the product has the option</Text>
                        <View className='rounded-md' style={{borderWidth: 1, borderColor: 'lavender'}}>
                            <Picker
                                selectedChillieOption={selectedChillieOption}
                                onValueChange={(itemValue, itemIndex) => setSelectedChillieOption(itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem} // Optional, for item styling
                            >
                                <Picker.Item label='Select chillie option' value='' />
                                <Picker.Item label='Yes' value='True' />
                                <Picker.Item label='No' value='False' />
                            </Picker>
                        </View>
                    </View> */}
                    <FormInputs
                        title='Product category'
                        handleChangeText={(value) => handleChangeText('product_category', value)}
                        desc='Please select product category'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Product Price'
                        handleChangeText={(value) => handleChangeText('product_actual_price', value)}
                        desc='Please enter product order price'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Chillie option'
                        handleChangeText={(value) => handleChangeText('chili_option', value)}
                        desc='Please select chillie option'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Product Extras_1 (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_1', value)}
                        desc='Please enter product extras 1, please ensure that the extras is correct and corresponds with the extras 1 price'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Product Extras_2 (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_2', value)}
                        desc='Please enter product extras_2, please ensure that the extras is correct and corresponds with the extras 2 price'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Product Extras_3 (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_3', value)}
                        desc='Please enter product extras 3, please ensure that the extras is correct and corresponds with the extras3 price'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Extras_1 Price (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_price_1', value)}
                        desc='Please enter product extras 1 price, please ensure that the extras 1 price is correct and corresponds with the extras 1 product'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Extras_2 Price (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_price_2', value)}
                        desc='Please enter product extras 2 price, please ensure that the extras 2 price is correct and corresponds with the extras 2 product'
                        borderStyle='border border-lavender'
                    />
                    <FormInputs
                        title='Extras_3 Price (Optional)'
                        handleChangeText={(value) => handleChangeText('extras_price_3', value)}
                        desc='Please enter product extras 3 price, please ensure that the extras 3 price is correct and corresponds with the extras 3 product'
                        borderStyle='border border-lavender'
                    />
                    <DescriptionInput
                        title='Description'
                        handleChangeText={(value) => handleChangeText('product_description', value)}
                        desc='Please add a descrpition to your product. Ensure to put a description that best describe your product.'
                        otherStyles='text-lg '
                        borderStyle='border border-lavender rounded-md'
                        lines={4}
                    />

                    <View className='w-full justify-center items-center'>
                        <Text className={`${errorMessage === 'Success' ? 'text-green2' : 'text-red' } text-lg`} style={{fontFamily: 'maven-bold'}}>{errorMessage === 'Success' ? 'Please wait...' : errorMessage}</Text>
                    </View>

                    <View className='w-full'>
                        <CustomButton
                            title={isLoading ? 'Please wait...' : 'Create'}
                            handlePress={handleCreateProduct}
                            disabled={isLoading === true}
                            otherStyles={`bg-primary p-4 mt-4 'opacity-100' : 'opacity-50'} ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                            textStyles='text-2xl'
                        />
                    </View>
                </View>
                <View className='pb-20' />
            </ScrollView>
            {/* Toast component with custom config */}
            <Toast config={toastConfig} />
            {isLoading ? <LoadingIndicator loading_text='Creating product...'/> : <></>}
            {errorMessage === 'Success' ? <Redirecting title='Success' /> : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
        width: '100%'
    },
    pickerItem: {
        color: COLORS.slate,
        fontSize: 12,
        fontFamily: 'maven-medium',
    },
});

export default RestaurantProducts