import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import DeleteStoreOthers from '../../../../../components/delete-content/delete-store-others/DeleteStoreOthers'
import { COLORS, SIZES } from '../../../../../constants/constants'

const DeleteStoreModal = ({deleteStoreModalVisible, setDeleteStoreModalVisible, params}) => {
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
            {/* Start delete store modal */}
            <TouchableOpacity
                className='justify-center items-center'
                onPress={() => setDeleteStoreModalVisible(false)}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={deleteStoreModalVisible}
                    onRequestClose={() => setDeleteStoreModalVisible(false)}
                >
                    <Pressable
                        style={styles.centeredView}
                    />
                    <MotiView className='mt-5 w-full items-center'
                        from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                        animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                        transition={{ duration: 1000 }}
                    >
                        <View style={styles.centeredView}>
                            <View
                                className='bg-white p-2 w-full'
                                style={[styles.modalView, {borderRadius: SIZES.radius, maxWidth: width}]}
                            >
                                {/* Container */}
                                <View className='p-1 flex-row justify-between items-center'>
                                    <View className='flex-row justify-center items-center'>
                                        <FontAwesome6 name="trash" size={19}/>
                                        <Text className='text-2xl ml-1' style={{fontFamily: 'roboto-medium'}}>Delete store</Text>
                                    </View>
                                </View>
                                {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                                <DeleteStoreOthers setDeleteStoreModalVisible={setDeleteStoreModalVisible} params={params} />
                            </View>
                        </View>
                    </MotiView>
                </Modal>
            </TouchableOpacity>
            {/* End  delete store modal */}

            <TouchableOpacity
                onPress={() => setDeleteStoreModalVisible(true)}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center w-full'
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <FontAwesome5 name="trash" color="red" size={18} />
                </View>
                <Text className='text-sm text-red'>Delete Store</Text>
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

export default DeleteStoreModal