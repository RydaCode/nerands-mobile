import { Picker } from '@react-native-picker/picker'
import { useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/Buttons/CustomButton'
import FormInputs from '../../../components/FormFields/FormInputs'
import { COLORS } from '../../../constants/constants'

const index = () => {
    const params = useLocalSearchParams()

    const handleChangeText = () => {}
    const [selectedCategory, setSelectedCategory] = useState();

    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const selectedItems = ['Shirts', 'T-Shirts', 'Trousers'];

    const handlePress = () => {}
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-2'>
                {/* <MainHeader header_name='Edit Accounts' /> */}
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='w-full px-4'>
                    <View className='mt-10 w-full'>
                        <FormInputs
                            title='First Name'
                            defaultValue={params.first_name}
                            handleChangeText={handleChangeText}
                            otherStyles=''
                            desc=''
                            borderStyle="border border-lavender"
                        />
                        <FormInputs
                            title='Last Name'
                            defaultValue={params.last_name}
                            handleChangeText={handleChangeText}
                            otherStyles=''
                            desc=''
                            borderStyle="border border-lavender"
                        />
                        <FormInputs
                            title='Email Address'
                            defaultValue={params.email_add}
                            handleChangeText={handleChangeText}
                            otherStyles=''
                            desc=''
                            borderStyle="border border-lavender"
                        />
                        <FormInputs
                            title='Phone Number'
                            defaultValue={params.phone_num}
                            handleChangeText={handleChangeText}
                            otherStyles=''
                            desc=''
                            borderStyle="border border-lavender"
                        />

                        <View className='my-5'>
                            <Text className='text-gray-700 text-lg mb-1' style={{fontFamily: 'maven-medium'}}>Province</Text>
                            <View className='rounded-md' style={{borderWidth: 1, borderColor: 'lavender'}}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem} // Optional, for item styling
                                >
                                    <Picker.Item label="Shirts" value="Shirts" />
                                    <Picker.Item label="Skirts" value="Skirts" />
                                </Picker>
                            </View>
                        </View>

                        <FormInputs
                            title='City / Town'
                            value=''
                            handleChangeText={handleChangeText}
                            otherStyles=''
                            desc=''
                            borderStyle="border border-lavender"
                        />

                        <CustomButton
                            title='Update'
                            handlePress={handlePress}
                            otherStyles='bg-primary py-4'
                            textStyles='text-xl'
                            disabled={false}
                        />
                    </View>
                </View>
                <View className='pb-20'/>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
    },
    pickerItem: {
        color: COLORS.slate,
        fontSize: 13,
        fontFamily: 'maven-medium'
    },
});

export default index