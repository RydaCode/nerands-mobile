import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DeleteAllProductsOthers from '../../../../../components/delete-content/delete-product-others/DeleteAllProductsOthers';
import { COLORS, SIZES } from '../../../../../constants/constants';

const DeleteAllProductsModal = ({deleteAllProductsModalVisible, setDeleteAllProductsModalVisible, params}) => {
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
            {/* Start delete all products modal */}
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => setDeleteAllProductsModalVisible(false)}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={deleteAllProductsModalVisible}
                    onRequestClose={() => setDeleteAllProductsModalVisible(false)}
                >
                    <Pressable
                        style={styles.centeredView}
                        onPress={() => setDeleteAllProductsModalVisible(false)}
                    />
                    <View style={styles.centeredView}>
                        <View
                            style={[styles.modalView, {
                                backgroundColor: '#fff',
                                borderRadius: SIZES.radius,
                                padding: 10,
                                width: '100%',  // Set the width to full screen
                                maxWidth: width, // Ensure it does not exceed the device width
                                
                            }]}
                        >
                            {/* Container */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22}/>
                                    <Text className='text-xl ml-1' style={{fontFamily: 'roboto-medium'}}>Delete all products</Text>
                                </View>
                                <Pressable
                                    onPress={() => setDeleteAllProductsModalVisible(false)}
                                    className='h-[30px] w-[30px] rounded-full justify-center items-center bg-red'>
                                    <FontAwesome5 name='times' color={COLORS.white} size={15} />
                                </Pressable>

                            </View>
                            {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                            <DeleteAllProductsOthers
                                setDeleteAllProductsModalVisible={setDeleteAllProductsModalVisible}
                                params={params}
                            />
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End  delete all products modal */}

            <TouchableOpacity
                onPress={() => setDeleteAllProductsModalVisible(true)}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <FontAwesome5 name="trash" color="red" size={16} />
                </View>
                <View className='justify-center items-center'>
                    <Text className='text-sm text-primary'>Delete Products</Text>
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

export default DeleteAllProductsModal