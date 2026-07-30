import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS, SIZES } from '../../../../../constants/constants';
import StoreVariantsModal from './StoreVariantsModal';

const StoreVariants = ({router, params, storeVariantstmodalvisible, setStoreVariantsModalVisible}) => {

    // Get the window dimensions for responsiveness
    const { width } = useWindowDimensions();
    return (
        <>
            {/* Start edit store list modal */}
            <Modal
                animationType="slide"
                transparent
                visible={storeVariantstmodalvisible}
                onRequestClose={() => setStoreVariantsModalVisible(false)}
            >
                <View style={{ flex: 1 }}>
                    {/* Overlay */}
                    <Pressable
                        style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: COLORS.transparentBlack }
                        ]}
                        onPress={() => setStoreVariantsModalVisible(false)}
                    />

                    {/* Bottom Sheet */}
                    <MotiView
                        from={{ translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 1000 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <View
                            style={[
                                styles.modalView,
                                { maxWidth: width }
                            ]}
                        >
                            <StoreVariantsModal
                                router={router}
                                params={params}
                                setStoreVariantsModalVisible={setStoreVariantsModalVisible}
                            />
                        </View>
                    </MotiView>
                </View>
            </Modal>
            {/* End edit store list modal */}

            <TouchableOpacity
                onPress={() => setStoreVariantsModalVisible(true)}
                style={{borderRadius: SIZES.border, width: '100%'}}
                className='h-full items-center justify-center border-1 bg-white border-lavender w-full'
            >
                <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <MaterialCommunityIcons name="tune" size={22} color="#2563EB" />
                </View>
                <Text className='text-sm'>Variants</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: COLORS.white,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
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

export default StoreVariants