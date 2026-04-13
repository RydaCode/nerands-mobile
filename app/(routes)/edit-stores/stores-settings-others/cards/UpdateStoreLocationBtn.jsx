import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons'
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
            <TouchableOpacity
                className='flex-1 justify-center items-center'
                onPress={() => setUpdateStoreLocationModalVisible(false)}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={updateStoreLocationModalVisible}
                    onRequestClose={() => setUpdateStoreLocationModalVisible(false)}
                >
                    <Pressable
                        style={styles.centeredView}
                        onPress={() => setUpdateStoreLocationModalVisible(false)}
                    />
                    <View style={styles.centeredView}>
                        <View
                            className='bg-white w-full p-[10px] rounded-md'
                            style={[styles.modalView, {maxWidth: width}]}
                        >
                            {/* Container */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22}/>
                                    <Text className='text-2xl ml-1' style={{fontFamily: 'maven-medium'}}>Update Store Location</Text>
                                </View>
                                <Pressable
                                    onPress={() => setUpdateStoreLocationModalVisible(false)}
                                    className='h-[30px] w-[30px] rounded-full justify-center items-center bg-red'>
                                    <FontAwesome5 name='times' color={COLORS.white} size={15} />
                                </Pressable>

                            </View>
                            {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                            <UpdateStoreLocation params={params} setUpdateStoreLocationModalVisible={setUpdateStoreLocationModalVisible} />
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End store location modal */}

            <TouchableOpacity
                onPress={() => setUpdateStoreLocationModalVisible(true)}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
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
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
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