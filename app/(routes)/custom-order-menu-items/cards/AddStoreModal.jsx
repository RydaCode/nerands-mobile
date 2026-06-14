import { Entypo, FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import { addStore, removeStore } from "../../../../redux/store/slices/CustomOrdersCartSlice";

const AddStoreModal = ({
    errorMessage,
    setErrorMessage,
    openAddStoreModal,
    setOpenAddStoreModal,
}) => {
    const stores = useSelector((state) => state.customcart.custom_stores);
    const [storeInput, setStoreInput] = useState("");
    const dispatch = useDispatch();

    const handleAddStore = () => {
        const trimmed = storeInput.trim();

        if (!trimmed) return;

        const exists = stores.some(
            item => item.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (exists) {
            setErrorMessage("Store already added!");
            return;
        }

        dispatch(addStore(trimmed));

        setStoreInput("");
        setErrorMessage("Store added successfully!");
    };

    const handleRemoveStore = (id) => {
        dispatch(removeStore(id));
        setErrorMessage('Store removed successfully!');
    };
    const fadeAnim = useRef(new Animated.Value(1)).current;
    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={openAddStoreModal}
            animationType="none"
            onRequestClose={() => setOpenAddStoreModal(false)}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable
                    className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack"
                    onPress={() => setOpenAddStoreModal(false)}
                />
            </MotiView>

            {/* Bottom Sheet */}
            <MotiView
                from={{ translateY: 400 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 400 }}
                transition={{ type: 'timing', duration: 400 }}
                style={styles.productsheet}
            >
                <View className='w-full relative flex-1 mb-14'>
                    <TouchableOpacity
                        className='w-full justify-center items-center my-1'
                        onPress={() => setOpenAddStoreModal(false)}
                    >
                        <View className='h-1.5 rounded-full my-1 bg-[#ccc] w-[30%]'/>
                    </TouchableOpacity>  
                    <View className='flex-row justify-between items-center w-full mt-2'>
                        <View className='rounded py-1' style={{width: '75%'}}>
                            <Text
                                className='text-2xl text-black'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >Add Store</Text>
                        </View>
                        <TouchableOpacity className='p-3 justify-center items-center rounded-full bg-grey_bg'
                            style={{width: 35, height: 35}}
                            onPress={() => setOpenAddStoreModal(false)}
                        >
                            <FontAwesome name="times" size={15} color='red'/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender my-6' style={{height: 1}}/>

                    <ScrollView
                        className='mb-14 flex-1'
                        contentContainerStyle={{
                            paddingBottom: 40,
                            alignItems: 'center',
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='w-full'>
                            <TextInput
                                placeholder="Enter store name"
                                value={storeInput}
                                onChangeText={setStoreInput}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    padding: 10,
                                    borderRadius: 4,
                                    marginBottom: 15,
                                    height: 50
                                }}
                            />

                            <TouchableOpacity
                                onPress={handleAddStore}
                                className='w-full elevation-sm flex-row justify-center items-center py-2 bg-primary rounded'
                            >
                                <Entypo name="plus" size={24} color="white" />
                                <Text
                                    style={{fontFamily: 'roboto-medium', color: 'white', fontSize: 18}}
                                >Add</Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: 20, gap: 10 }}>
                                {stores.length > 0 ? (
                                    stores.map((store) => (
                                        <View
                                            key={store.id}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: 10,
                                                borderWidth: 1,
                                                borderColor: "#ddd",
                                                borderRadius: 4,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'roboto-medium',
                                                    color: COLORS.black,
                                                    fontSize: 16
                                                }}
                                            >
                                                {store.name}
                                            </Text>

                                            <TouchableOpacity onPress={() => handleRemoveStore(store.id)}>
                                                <Text
                                                    style={{
                                                        fontFamily: 'roboto-medium',
                                                        color: "red",
                                                        fontSize: 14
                                                    }}
                                                >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text
                                        style={{
                                            fontFamily: 'roboto-medium',
                                            color: COLORS.black,
                                            fontSize: 16
                                        }}
                                    >
                                        No stores added
                                    </Text>
                                )}
                            </View>
                        </View>            
                    </ScrollView>
                     
                    <View className='w-full absolute bottom-0 mb-2 justify-center items-center rounded-md'>
                        {errorMessage &&
                            <Animated.View style={{ opacity: fadeAnim }} className='w-full justify-center items-center my-4'>
                                {errorMessage ? (
                                    <Text style={{ color: COLORS.green1, fontFamily: 'roboto-medium' }}>{errorMessage}</Text>
                                ) : null}
                            </Animated.View>
                        }  
                        
                        {stores?.length > 0 &&
                            <TouchableOpacity
                                className='flex-row w-full elevation-sm mb-2 justify-center px-2 items-center rounded py-2'
                                style={{backgroundColor: COLORS.extra_blue}}
                                onPress={() => setOpenAddStoreModal(false)}
                            >
                                <View className='flex-row items-center'>
                                    <Text
                                        className='text-2xl text-white'
                                        style={{fontFamily: 'ubuntu-medium'}}
                                    >Continue</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </MotiView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    productsheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '95%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12
    },

    button: {
        backgroundColor: '#6200ee',
        padding: 12,
        borderRadius: 10,
    },

    closeBtn: {
        marginTop: 15,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
    },
});

export default AddStoreModal