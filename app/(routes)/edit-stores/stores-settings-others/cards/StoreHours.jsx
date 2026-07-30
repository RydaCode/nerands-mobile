import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS, SIZES } from '../../../../../constants/constants';

const StoreHours = (params) => {
    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();

    // Make the image height and width responsive based on the screen size
    const imageWidth = width * 0.25;
    const imageHeight = height * 0.09;
    
    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons
    return (
        <>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '../../../update-store-hours',
                    params: {
                        business_id: params.params.business_id,
                        store_id: params.params.store_id,
                    }
                })}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
            >
                <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <MaterialCommunityIcons name="timer-outline" size={20} color="#54C571" />
                </View>
                <View className='justify-center items-center'>
                    <Text className='text-sm'>Working Hours</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default StoreHours