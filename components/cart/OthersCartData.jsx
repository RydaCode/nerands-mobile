import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useReducer, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../constants/constants';
import {
    decreaseOthersQty,
    increaseOthersQty,
    removeOthersItem,
    updateOthersItem
} from '../../redux/store/slices/OthersCartSlice';
import { PRODUCTS_IMAGE_URI } from '../../RequestMethods';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for scaling
const { height: screenHeight } = Dimensions.get('window'); // Get screen height for scaling

const initialState = {
    modalVisible: false,
    quantity: 1,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'INCREASE_OTHERS_QTY':
    return state.map(item =>
        item.product_id === action.payload
            ? { ...item, product_qty: item.product_qty + 1 }
            : item
    );

    case 'DECREASE_OTHERS_QTY':
        return state.map(item =>
            item.product_id === action.payload && item.product_qty > 1
                ? { ...item, product_qty: item.product_qty - 1 }
                : item
        );

        default:
            return state;
    }
};

const OthersCartData = ({item}) => {
    const dispatch = useDispatch();
    const [state, localDispatch] = useReducer(reducer, initialState);
    const totalAmount = item.product_price * state.quantity;
    const toggleModal = () => localDispatch({ type: 'TOGGLE_MODAL' });

    const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);
    const othersCartItem = othersCartItems.find(otherscart => otherscart.product_id === item.product_id);
    const qtycounter = othersCartItem ? othersCartItem.product_qty : 1;
    const [selectedVariants, setSelectedVariants] = useState({});

    // Calculate total cart price
    const [totalZMK, setTotalZMK] = useState(0);

    useEffect(() => {
        setTotalZMK(othersCartItems.reduce((total, item) => total + item.total_price, 0));
    }, [othersCartItems]);

    const [OpenClose, setOpenClose] = useState(item.open_close);
    const [modalVisible, setModalVisible] = useState(false);

    const handleRemoveItem = () => {
        dispatch(removeOthersItem(item.product_id));
    }
    
    // Get the window dimensions for responsiveness
    const { width, height } = useWindowDimensions();

    // Make the image height and width responsive based on the screen size
    const imageWidth = width * 0.25;
    const imageHeight = height * 0.09;

    // Calculate dynamic sizes based on screen width/height
    const imageWidthModal = width * 0.29; // 29% of the screen width for the image
    const imageHeightModal = height * 0.12; // 12% of the screen height for the image
    const buttonWidth = width * 0.4; // 40% of the screen width for buttons

    const [selectedcolors, setSelectedColors] = useState([]);
    const [selectedsizes, setSelectedSizes] = useState([]);
    const [productnotes, setProductNotes] = useState('');
    const [quantity, setQuantity] = useState(item.product_qty);
    const [totalprice, setTotalPrice] = useState(item.final_price);

    // Extract available colors and sizes from item
    const Colors = typeof item.available_colors === "string"
    ? item.available_colors.split(",").map(color => color.trim()).filter(Boolean) : [];

    const Sizes = typeof item.available_sizes === "string"
    ? item.available_sizes.split(",").map(size => size.trim()).filter(Boolean) : [];

    const handleChangeText = (value) => {
        setProductNotes(value);
    };

    useEffect(() => {
        if (!othersCartItems[0].available_variants?.length) return;
        setSelectedVariants(prev => {
            const updated = { ...prev };
            othersCartItems[0].available_variants.forEach(group => {
                const key = group.id;

                // skip if already selected
                if (updated[key] && updated[key].length > 0) return;

                if (group.options?.length > 0) {
                    // ✅ required → must select something
                    if (group.is_required) {
                        updated[key] = [group.options[0].id];
                    }
                    // ✅ optional → leave empty (better UX)
                    else {
                        updated[key] = [];
                    }
                }
            });
            return updated;
        });
    }, [othersCartItems[0].available_variants]);

    const handleSelectVariant = (group, item) => {
        const key = group.id;
        setSelectedVariants((prev) => {
            const current = prev[key] || [];
            const exists = current.includes(item.id);

            return {
                ...prev,
                [key]: exists
                    ? current.filter(v => v !== item.id)
                    : [...current, item.id]
            };
        });
    };

    const isSelected = (group, item) => {
        return (selectedVariants[group.id] || []).includes(item.id);
    };

    const getVariantPrice = () => {
        let extra = 0;
        othersCartItems[0].available_variants.forEach((group) => {
            const selected = selectedVariants[group.id];

            if (!selected) return;

            const selectedArray = Array.isArray(selected)
                ? selected
                : [selected];

            selectedArray.forEach((value) => {
                const option = group.options?.find(
                    (o) => String(o.id) === String(value)
                );

                const price = parseFloat(option?.price ?? 0);

                if (!isNaN(price)) {
                    extra += price;
                }
            });
        });
        return extra;
    };

    const basePrice = Number(item.final_price || 0);
    const variantPrice = getVariantPrice();

    const totalPrice = (basePrice + variantPrice) * quantity;

    const validateVariants = () => {
        const missing = [];
        othersCartItems[0].available_variants.forEach((group) => {
            const key = group.id;

            if (!selectedVariants[key] || selectedVariants[key].length === 0) {
                missing.push(group.name);
            }
        });
        return missing;
    };

    useEffect(() => {
        // If item has selected colors, filter only available ones
        if (item.product_colors) {
            setSelectedColors(item.product_colors.filter(color => Colors.includes(color)));
        }
    
        // If item has selected sizes, filter only available ones
        if (item.product_sizes) {
            setSelectedSizes(item.product_sizes.filter(size => Sizes.includes(size)));
        }
    }, [item]);

    const handleIncreaseQty = () => {
        if (qtycounter < 10) {
            dispatch(increaseOthersQty(item.product_id));
        }
    };

    const handleDecreaseQty = () => {
        if (qtycounter > 1) {
            dispatch(decreaseOthersQty(item.product_id));
        }
    };
    
    //Add item to Other Cart
    const handleUpdateCartItem = () => {
        dispatch(updateOthersItem({ 
            product_id: item.product_id,
            product_image: item.product_image,
            product_name: item.product_name,
            product_description: item.product_description,
            product_actual_price: item.product_actual_price,
            product_price: item.product_price,
            product_qty: qtycounter,
            total_price: item.total_price,
            product_status: item.product_status,
            store_name: item.store_name,
            available_colors: Colors,
            available_sizes: Sizes,
            store_id: item.store_id,
            store_phone_num: item.store_phone_num,
            store_category: item.store_category,
            product_category: item.product_category,
            product_colors: selectedcolors,
            product_sizes: selectedsizes,
            selected_colors: selectedcolors,
            selected_sizes: selectedsizes,
            store_profileimage: item.store_profiieImage,
            store_location: item.store_location,
            product_notes: productnotes
        }));
    };

    return (
        <>
            {/* Start modal */}
            <TouchableOpacity style={styles.centeredView}
                onPress={() => setModalVisible(false)}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable
                                onPress={() => setModalVisible(!modalVisible)}
                                className='flex-row justify-between'
                            >
                                <Text className='text-2xl' style={{ fontFamily: 'ubuntu-medium' }} >Product Details</Text>
                                <View className='bg-red h-[27px] w-[27px] items-center justify-center rounded-full'>
                                    <Entypo name='cross' color={COLORS.white} />
                                </View>
                            </Pressable>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ marginTop: 10}}
                            >
                                <View className='flex-row items-center'>
                                    <Image
                                        source={{uri:`${PRODUCTS_IMAGE_URI}${item.product_image}`}}
                                        style={{ width: 90, height: 70, resizeMode: 'cover', borderRadius: SIZES.radius }}
                                    />
                                    <View className='ml-3'>
                                        <Text className='text-lg' style={{ fontFamily: 'roboto-medium' }} >{item.product_name}</Text>
                                        <Text className='text-sm text-slate' style={{ fontFamily: 'roboto-medium' }} >{item.store_name}</Text>
                                        <Text className='text-primary text-lg' style={{ fontFamily: 'roboto-medium' }}>K{item.final_price.toLocaleString()}</Text>
                                    </View>
                                </View>
                                {/* <View className='mt-4'>
                                    <Text className='text-slate text-sm' style={{ fontFamily: 'roboto-medium' }}>Desc</Text>
                                </View> */}
                                            
                                <View className='flex-row items-center justify-between mt-6' >
                                    <Text className='text-2xl' style={{fontFamily: 'ubuntu-medium'}}>Quantity</Text>
                                    <View className='flex-row items-center' >
                                        <TouchableOpacity
                                            disabled={qtycounter <= 1}
                                            onPress={handleDecreaseQty}
                                            activeOpacity={0.5}
                                            className='w-7 h-7 items-center bg-grey_bg justify-center rounded-full border border-slate'
                                            style={{ opacity: qtycounter <= 1 ? 0.4 : 0.9 }}
                                        >
                                            <FontAwesome5 name='minus' style={{ color: COLORS.black }} />
                                        </TouchableOpacity>
                                        <Text className='mx-4 text-lg'>{qtycounter.toString()}</Text>
                                        <TouchableOpacity
                                            onPress={handleIncreaseQty}
                                            disabled={qtycounter === 10}
                                            activeOpacity={0.5}
                                            className='w-7 h-7 items-center bg-grey_bg justify-center rounded-full border border-slate'
                                            style={{ opacity: qtycounter >= 1 ? 0.9 : 0.4 }}
                                        >
                                            <FontAwesome5 name='plus' style={{ color: COLORS.black }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginTop: 25 }} >
                                    {othersCartItems[0].available_variants.map((group) => (
                                        <View key={group.id} className='w-full my-4'>
                                            <Text className='text-lg mb-1' style={{fontFamily: 'roboto-medium'}}>{group.name}</Text>
                                            <FlatList
                                                data={group.options || []}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item }) => {
                                                    const selected = isSelected(group, item);

                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => handleSelectVariant(group, item)}
                                                            className="bg-grey_bg px-4 py-2 mr-2 relative rounded elevation-sm"
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: selected ? COLORS.primary : COLORS.lavender,
                                                                backgroundColor: selected ? COLORS.primary : COLORS.grey_bg,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{ fontFamily: 'roboto-medium' }}
                                                                className={`text-base ${selected ? 'text-white' : 'text-slate'}`}
                                                            >
                                                                {item.name} {item.price ? ` | K${item.price}` : ''}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                                ListEmptyComponent={<Text className="text-gray-500">No variants available.</Text>}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <View className='flex-row items-center justify-between mb-5'>
                                    <Text className='text-2xl' style={{ fontFamily: 'maven-bold' }}>Total:</Text>
                                    <View
                                        className='bg-red items-center justify-center'
                                        style={{ padding: 5, borderRadius: SIZES.radius, width: buttonWidth, height: height * 0.06  }}
                                    >
                                        <Text style={{fontFamily: 'ubuntu-medium'}} className='text-2xl text-white'>ZMK {item.total_price.toLocaleString()}</Text>
                                    </View>
                                </View>
                                {/* Next Container */}
                            </ScrollView>
                            <TouchableOpacity
                                className='flex-row rounded border-white elevation-sm items-center justify-center bg-primary mt-2 py-3'
                                onPress={() => {
                                    handleUpdateCartItem();
                                    setModalVisible(false); // Close modal after updating
                                }}
                                style={{ marginBottom: 45 }}
                            >
                                <FontAwesome name='shopping-cart' color='white' size={20}/>
                                <Text className='ml-1 text-white text-2xl' style={{ fontFamily: 'maven-medium' }}>
                                    Update Cart
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
            {/* End modal */}

            <View className='w-full flex-1'>
                <View className='flex-row justify-between items-center'>
                    <View className='flex-row justify-start items-center w-[89%]'>
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            className='w-[26%]'
                            style={{height: screenHeight * 0.09}}
                        >
                            <Image 
                                source={{uri:`${PRODUCTS_IMAGE_URI}${item.product_image}`}}
                                style={{borderRadius: SIZES.border, width: '100%', height: '100%'}}
                            />
                        </TouchableOpacity>
                        <View className='w-[70%] ml-2'>
                            <Text style={{fontFamily: 'roboto-medium'}} className='text-base'>{item.product_name}</Text>
                            <View className='flex-row items-center justify-between w-full'>
                                <View className='w-[25%]'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>Price</Text>
                                    <Text style={{fontFamily: 'roboto-medium'}} className='text-base'>K{item.final_price.toLocaleString()}</Text>
                                </View>
                                <View className='items-center justify-center w-[45%]'>
                                    <Text className='text-sm text-black' style={{fontFamily: 'roboto-medium'}}>Qty</Text>
                                    <View className='flex-row justify-center items-center'>
                                        <TouchableOpacity
                                            disabled={qtycounter <= 1}
                                            onPress={handleDecreaseQty}
                                            style={{ opacity: qtycounter <= 1 ? 0.4 : 0.9 }}
                                            className='p-2 w-7 h-7 bg-grey_bg border border-slate items-center rounded-full justify-center'
                                        >
                                            <FontAwesome name='minus' color={COLORS.black} />
                                        </TouchableOpacity>
                                        <View className='w-[35%] mx-1 items-center justify-center'>
                                            <Text style={{fontSize: SIZES.main}} className='mx-1 text-slate'>{item.product_qty}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={handleIncreaseQty}
                                            disabled={qtycounter >= 10}
                                            activeOpacity={0.5}
                                            style={{ opacity: qtycounter >= 10 ? 0.4 : 0.9 }}
                                            className='p-1 w-7 h-7 items-center justify-center rounded-full bg-grey_bg border border-slate'
                                        >
                                            <FontAwesome name='plus' color={COLORS.black} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className='justify-center items-center'>
                                    <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>Total</Text>
                                    <View>
                                        <Text style={{fontFamily: 'roboto-medium'}} className='text-case text-primary'>K{item.total_price.toLocaleString()}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleRemoveItem}
                        className='w-[8%] h-[70px] mr-1 items-center justify-center'
                    >
                        <FontAwesome name='times' color={COLORS.red} size={20} />
                    </TouchableOpacity>
                </View>
                <View className='w-full bg-gray-400 my-4' style={{height: 1, opacity: 0.2}} />
            </View>
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
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, }, 
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})

export default OthersCartData