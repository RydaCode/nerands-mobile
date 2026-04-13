import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS, SIZES } from '../../../../../constants/constants';
import StoreExtrasModal from './StoreExtrasModal';

const StoreExtras = ({router, params, stroeextrastmodalvisible, setStoreExtrasModalVisible}) => {

    // Get the window dimensions for responsiveness
    const { width } = useWindowDimensions();
    return (
        <>
            {/* Start edit store list modal */}
            <View className='w-full'>
                <TouchableOpacity className='flex-1 items-center'
                    onPress={() => setStoreExtrasModalVisible(false)}
                >
                    <Modal
                        animationType="slide"
                        transparent={true}
                        statusBarTranslucent={true}
                        visible={stroeextrastmodalvisible}
                        onRequestClose={() => setStoreExtrasModalVisible(false)}
                    >
                        <Pressable style={styles.centeredView}
                            onPress={() => setStoreExtrasModalVisible(false)}
                        />
                        <MotiView
                            from={{ translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            style={styles.centeredView}>
                            <View className='w-full rounded-md' style={[styles.modalView, {maxWidth: width}]}>
                                {/* Container */}
                                <StoreExtrasModal router={router} params={params} setStoreExtrasModalVisible={setStoreExtrasModalVisible}/>
                            </View>
                        </MotiView>
                    </Modal>
                </TouchableOpacity>
            </View>
            {/* End edit store list modal */}

            <TouchableOpacity
                onPress={() => setStoreExtrasModalVisible(true)}
                style={{borderRadius: SIZES.border, width: '100%'}}
                className='h-full items-center justify-center border-1 bg-white border-lavender w-full'
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <MaterialCommunityIcons name="french-fries" size={22} color="#2563EB" />
                </View>
                <Text className='text-sm'>Extras</Text>
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
        // backgroundColor: COLORS.transparentBlack,
        // borderTopRightRadius: 10,
        // borderTopLeftRadius: 10,
        // padding: 10,
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },

        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
});

export default StoreExtras