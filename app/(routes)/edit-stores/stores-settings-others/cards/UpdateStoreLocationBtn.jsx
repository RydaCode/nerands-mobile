import { Ionicons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import UpdateStoreLocation from '../../../../../components/edit-content/update-location/UpdateStoreLocation'
import { COLORS, SIZES } from '../../../../../constants/constants'

const UpdateStoreLocationBtn = ({params, updateStoreLocationModalVisible, setUpdateStoreLocationModalVisible}) => {
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
            {/* Start store location modal */}
            <Modal
                visible={updateStoreLocationModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setUpdateStoreLocationModalVisible(false)}
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack justify-end"
                    onPress={() => setUpdateStoreLocationModalVisible(false)}
                >
                    {/* Inner content wrapper (prevents closing when tapped) */}
                    <View
                        onStartShouldSetResponder={() => true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 80 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60}}
                            className="bg-white px-4 pt-3"
                        >
                            {/* Header */}
                            <View className="flex-row justify-start items-center">
                                {/* <FontAwesome6 name="edit" size={22}/> */}
                                <Text className='text-2xl ml-1' style={{fontFamily: 'outfit-medium'}}>
                                    Update Store Location
                                </Text>
                            </View>
    
                            <View className='w-full bg-lavender my-3' style={{height: 1}} />
                            {/* Start Content */}
                            <UpdateStoreLocation params={params} setUpdateStoreLocationModalVisible={setUpdateStoreLocationModalVisible} />
                            {/* End Content */}
                        </MotiView>
                    </View>
                </Pressable>
            </Modal>
            {/* End store location modal */}

            <TouchableOpacity
                onPress={() => setUpdateStoreLocationModalVisible(true)}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
            >
                <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <Ionicons name='location-sharp' size={20} color={"#54C571"} />
                </View>
                <View className='justify-center items-center'>
                    <Text className='text-sm'>Update Location</Text>
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

export default UpdateStoreLocationBtn