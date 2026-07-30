import { FontAwesome6, Fontisto } from '@expo/vector-icons'
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
            {/* Modal for publish/unpublish confirmation */}
            <Modal
                visible={openStoreModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setOpenStoreModalVisible(false)}
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack justify-end"
                    // onPress={() => setOpenStoreModalVisible(false)}
                >
                    {/* Inner content wrapper (prevents closing when tapped) */}
                    <View
                        // onStartShouldSetResponder={() => true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 80 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60}}
                            className="bg-white px-4 pt-3"
                        >
                            {/* Header */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22} />
                                    <Text className='text-2xl ml-1' style={{ fontFamily: 'outfit-medium' }}>
                                        {isCloseOpen ? 'Close Store' : 'Open Store'}
                                    </Text>
                                </View>
                            </View>
    
                            <View className='w-full bg-lavender my-3' style={{height: 1}} />
                            {/* Start Content */}
                            <OpenCloseStoreComponent
                                router={router}
                                params={params}
                                setOpenStoreModalVisible={setOpenStoreModalVisible}
                            />
                            {/* End Content */}
                        </MotiView>
                    </View>
                </Pressable>
            </Modal>
































            <TouchableOpacity
                onPress={() => setOpenStoreModalVisible(true)}
                disabled={!isPublished}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center bg-white border-1 border-lavender w-full '
                accessible={true}
                accessibilityLabel={isCloseOpen ? 'Close store' : 'Open store'}
            >
                <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45, opacity: isPublished ? 1 : 0.3}}>
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