import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import OpenCloseStoreComponent from '../../../../../components/publish-content/publish-store/OpenCloseStoreComponent'
import { COLORS, SIZES } from '../../../../../constants/constants'

const OpenCloseStore = ({router, params, openStoreModalVisible, setOpenStoreModalVisible}) => {
    // Get the window dimensions for responsiveness
    const { width } = useWindowDimensions();

    const isPublished = params.active_status === true || params.active_status === 1 || params.active_status === 'true';
    const isCloseOpen = params.open_close === true || params.open_close === 1 || params.open_close === 'true';
    return (
        <>
            {/* Start publish store modal */}
            <TouchableOpacity className='flex-1 items-center'
                onPress={() => setOpenStoreModalVisible(false)}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={openStoreModalVisible}
                    onRequestClose={() => setOpenStoreModalVisible(false)}
                >
                    <Pressable style={styles.centeredView}
                        onPress={() => setOpenStoreModalVisible(false)}
                    />
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                        animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                        transition={{ duration: 1000 }}
                        style={styles.centeredView}>
                        <View className='bg-white p-2 w-full rounded-md' style={[styles.modalView, {maxWidth: width}]}>
                            {/* Container */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <MaterialIcons name="lock" size={22}/>
                                    <Text className='text-2xl ml-1' style={{fontFamily: 'roboto-medium'}}>
                                        {isCloseOpen ? 'Close Store' : 'Open Store'}
                                    </Text>
                                </View>
                            </View>
                            {/* <View className='h-[1px] mb-2 mt-1 w-full bg-lavender' /> */}
                            <OpenCloseStoreComponent router={router} params={params} setOpenStoreModalVisible={setOpenStoreModalVisible} />
                        </View>
                    </MotiView>
                </Modal>
            </TouchableOpacity>
            {/* End publish store modal */}

            <TouchableOpacity
                onPress={() => setOpenStoreModalVisible(true)}
                disabled={!isPublished}
                style={{borderRadius: SIZES.border, opacity: isPublished ? 0.9 : 0.3}}
                className='h-full items-center justify-center bg-white border-1 border-lavender w-full '
                accessible={true}
                accessibilityLabel={isCloseOpen ? 'Close store' : 'Open store'}
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <Fontisto
                        name={isCloseOpen ? "unlocked" : "locked"}
                        size={18} color={"#54C571"}
                    />
                </View>
                <Text className='text-sm'>
                    {isCloseOpen ? 'Close Store' : 'Open Store'}
                </Text>
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

export default OpenCloseStore