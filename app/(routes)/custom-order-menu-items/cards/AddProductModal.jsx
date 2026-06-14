import { Entypo, FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import { addProduct } from "../../../../redux/store/slices/CustomOrdersCartSlice";
import { toast } from '../../../../utils/toast';

const AddProductModal = ({
    setOpenAddProduct,
    openAddProduct,
    setViewCart,
    errorMessage,
    setErrorMessage
}) => {
    const [form, setForm] = useState({
        name: "",
        estimatedPrice: "",
        qty: "1",
        productNotes: "",
    });
    const dispatch = useDispatch();
    const products = useSelector((state) => state.customcart.products);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (errorMessage) {
            fadeAnim.setValue(1);

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setErrorMessage("");
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const qtyRef = useRef(null);
    const notesRef = useRef(null);

    const grandTotals = products.reduce(
        (total, item) => total + item.estimatedPrice * item.qty, 0
    );

    const totalQuantity = products.reduce(
        (total, item) => total + item.qty, 0
    );

    const isFormValid =
        form.name.trim().length > 0 &&
        form.qty.trim().length > 0 &&
        form.estimatedPrice.trim().length > 0;

    const handleAddProduct = () => {
        if (!isFormValid) return;

        setErrorMessage("");

    if (!form.name) {
        setErrorMessage("Enter product name");
        toast.error("Enter product name");
        return;
    }

    if (!form.qty) {
        setErrorMessage("Enter quantity");
        toast.error("Enter quantity");
        return;
    }

    if (!form.estimatedPrice) {
        setErrorMessage("Enter estimated price");
        toast.error("Enter estimated price");
        return;
    }

    dispatch(addProduct({
        name: form.name,
        estimatedPrice: Number(form.estimatedPrice),
        qty: Number(form.qty),
        productNotes: form.productNotes,
    }));

    // ✅ SUCCESS MESSAGE
    toast.success("Product added successfully");
    setErrorMessage("Product added successfully");

        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 120,
                useNativeDriver: true,
            }),
        ]).start();

        setForm({
            name: "",
            estimatedPrice: "",
            qty: "1",
            productNotes: "",
        });

        // wait for UI to update, then focus
        setTimeout(() => {
            nameRef.current?.focus();
        }, 100);
    };

    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={openAddProduct}
            animationType="none"
            onRequestClose={() => setOpenAddProduct(false)}
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
                    onPress={() => setOpenAddProduct(false)}
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
                        onPress={() => setOpenAddProduct(false)}
                    >
                        <View className='h-1 rounded-full my-1 bg-[#ccc] w-[30%]'/>
                    </TouchableOpacity>  
                    <View className='flex-row justify-between items-center w-full'>
                        <View className='rounded py-1' style={{width: '75%'}}>
                            <Text
                                className='text-2xl text-black'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >New Product</Text>
                        </View>
                        <TouchableOpacity className='p-3 justify-center items-center rounded-full bg-grey_bg'
                            style={{width: 33, height: 33}}
                            onPress={() => setOpenAddProduct(false)}
                        >
                            <FontAwesome name="times" size={14} color='red'/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender mb-6 mt-1' style={{height: 1}}/>

                    <ScrollView
                        className='mb-6 flex-1'
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='w-full'>
                        <View className="w-full mb-6  rounded-md">
                            <Text
                                style={{fontFamily: 'roboto-medium'}}
                                className='text-base mb-1'
                            >Product Name</Text>
                            <TextInput
                                style={{ fontFamily: "roboto-medium" }}
                                className="border px-4 rounded h-14 border-[#E2E8F0] font-semibold text-base text-slate"
                                editable
                                value={form.name}
                                onChangeText={(text) =>
                                    setForm(prev => ({ ...prev, name: text }))
                                }
                                placeholder="Enter product name"
                                autoCorrect={false}
                                returnKeyType="next"
                                ref={nameRef}
                                onSubmitEditing={() => priceRef.current?.focus()}
                            />
                        </View>
                        <View className='flex-row justify-between items-center w-full mb-6'>
                            <View className="w-full  rounded-md"
                                style={{width: '49%'}}
                            >
                                <Text
                                    style={{fontFamily: 'roboto-medium'}}
                                    className='text-base mb-1'
                                >Est. Price</Text>
                                <TextInput
                                    style={{ fontFamily: "roboto-medium" }}
                                    className="border px-4 rounded h-14 border-[#E2E8F0] font-semibold text-base text-slate"
                                    editable
                                    value={form.estimatedPrice}
                                    onChangeText={(text) =>
                                        setForm(prev => ({ ...prev, estimatedPrice: text }))
                                    }
                                    placeholder="Enter estimated price"
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                    ref={priceRef}
                                    onSubmitEditing={() => qtyRef.current?.focus()}
                                />
                            </View>
                            <View className=""
                                style={{width: '49%'}}
                            >
                                <Text
                                    style={{fontFamily: 'roboto-medium'}}
                                    className='text-base mb-1'
                                >Quantity</Text>
                                <TextInput
                                    style={{ fontFamily: "roboto-medium" }}
                                    className="border px-4 rounded h-14 border-[#E2E8F0] font-semibold text-base text-slate"
                                    editable
                                    value={form.qty}
                                    onChangeText={(text) =>
                                        setForm(prev => ({ ...prev, qty: text }))
                                    }
                                    placeholder="Add Quantity"
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                    ref={qtyRef}
                                    onSubmitEditing={() => notesRef.current?.focus()}
                                />
                            </View>
                        </View>
                        <View className="w-full  rounded-md">
                            <Text
                                style={{ fontFamily: 'roboto-medium' }}
                                className='text-base mb-1'
                            >
                                Product Notes (Optional)
                            </Text>

                            <TextInput
                                ref={notesRef}
                                value={form.productNotes}
                                onChangeText={(text) =>
                                    setForm(prev => ({ ...prev, productNotes: text }))
                                }
                                style={{
                                    fontFamily: "roboto-medium",
                                    height: 100,
                                    textAlignVertical: 'top', // Android
                                }}
                                className="border px-4 py-3 rounded border-[#E2E8F0] text-base text-slate"
                                editable
                                multiline
                                placeholder="Add product notes"
                                placeholderTextColor="#94A3B8"
                                autoCorrect={false}
                                maxLength={200}
                            />

                            <Text className="text-right mt-1 text-xs text-gray-500">
                                {form.productNotes.length}/200
                            </Text>
                        </View>
                        </View>

                        {errorMessage &&
                            <Animated.View style={{ opacity: fadeAnim }}>
                                {errorMessage ? (
                                    <Text style={{ color: COLORS.green1, fontFamily: 'roboto-medium' }}>{errorMessage}</Text>
                                ) : null}
                            </Animated.View>
                        }
                        <TouchableOpacity
                            disabled={!isFormValid}
                            style={{
                                opacity: isFormValid ? 1 : 0.5,
                                backgroundColor: COLORS.extra_blue,
                            }}
                            className="py-3 mt-8 elevation-sm rounded w-full flex-row justify-center items-center"
                            onPress={handleAddProduct}
                        >
                            <Entypo name="plus" size={24} color="white" />
                            <Text className='text-2xl text-white ml-1'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >Add</Text>
                        </TouchableOpacity>                            
                    </ScrollView>

                    {/* <View className='w-full absolute bottom-0 mb-2 justify-center items-center rounded-md'>
                        {products?.length > 0 &&
                            <TouchableOpacity
                                className='flex-row w-full elevation-sm mb-2 justify-between px-2 items-center rounded py-2'
                                style={{backgroundColor: COLORS.extra_blue}}
                                onPress={() => setViewCart(true)}
                            >
                                <View
                                    className='bg-white ml-2 rounded-full justify-center items-center'
                                    style={{width: 30, height: 30}}
                                >
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-primary'>{totalQuantity}</Text>
                                </View>
                                <View className='flex-row items-center'>
                                    <Ionicons name="basket" size={27} color="white" />
                                    <Text
                                        className='text-2xl text-white'
                                        style={{fontFamily: 'ubuntu-medium'}}
                                    >View Cart</Text>
                                </View>
                                <View
                                    className='bg-white rounded justify-center items-center px-2'
                                    style={{height: 35}}
                                >
                                    <Text
                                        style={{fontFamily: 'roboto-medium'}}
                                        className='text-primary'>K{Number(grandTotals).toLocaleString()}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View> */}
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

export default AddProductModal