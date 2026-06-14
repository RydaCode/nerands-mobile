import { Entypo } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import {
    Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import { COLORS } from "../../../constants/constants";

const ProductModal = ({
    openModal,
    setOpenModal,
    item_name,
    estimatedPrice,
    qty,
    productNotes
}) => {
    const { width, height } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState('description');

    const isLandscape = width > height;
    
    const imageDimensions = useMemo(() =>
        isLandscape
            ? { width: "35%", height: 170, marginRight: 10 }
            : { width: width * 0.21, height: height * 0.08 },
        [isLandscape, width, height],
    );

    const tabWidth = width;
    
    return (
        <Modal
            animationType="slide"
            transparent
            statusBarTranslucent
            visible={openModal}
            // onRequestClose={setOpenModal(false)}
        >
            {/* Overlay */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
            >
                <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0"
                    onPress={() => setOpenModal(false)}
                />
            </MotiView>
            <MotiView
                from={{ translateY: 300 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 300 }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.sheet}
            >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <View
                    className="w-full pb-12 relative"
                    style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                >
                    <TouchableOpacity
                        className='w-full justify-cente items-center'
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                        onPress={() => setOpenModal(false)}
                    >
                        <View className='h-1 rounded-full my-2 bg-[#ccc] w-[30%]'/>
                    </TouchableOpacity>
                    {/* Header */}
                    <View className='w-full px-4'>
                        <Text className="text-black text-2xl mt-1 font-semibold" style={{ fontFamily: "maven-medium" }}
                        >Product Details</Text>
                    </View>
                    <View className='w-full px-4 mt-1'>
                        <View className='bg-lavender' style={{height: 0.5,}}/>
                    </View>
                    <ScrollView
                        style={{ maxHeight: height * 0.8, paddingHorizontal: 16, marginBottom: 60, backgroundColor: 'transparent' }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Product Info */}
                        <View className="flex-row pt-2">
                            <View className="relative rounded" style={imageDimensions}>
                                {/* <Image
                                    className="w-full h-full"
                                    source={{ uri: `${PRODUCTS_IMAGE_URI}${product_iamges}` }}
                                    style={{ borderRadius: SIZES.radius, resizeMode: "cover" }}
                                /> */}

                                <View className='border border-lavender bg-grey_bg rounded justify-center items-center w-full h-full'>
                                    <Entypo name='box' size={30} color={COLORS.slate}/>
                                </View>
                            </View>
                            <View className="justify-center ml-3">
                                <Text className="text-base" style={{ fontFamily: "roboto-medium" }}>
                                    {item_name}
                                </Text>
                                <Text className="text-primary text-sm" style={{ fontFamily: "roboto-medium" }}>
                                    Qty: {qty}
                                </Text>
                                <Text className="text-primary text-base" style={{ fontFamily: "roboto-medium" }}>
                                    Est. Price: K{Number(estimatedPrice || 0).toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <View className='flex-row justify-between mt-4 mb-2 relative'>
                            {/* Sliding Indicator */}
                            <MotiView
                                animate={{
                                    translateX: activeTab === 'description' ? 0 : width * 0.49,
                                }}
                                transition={{ type: 'timing', duration: 250 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '49%',
                                    height: 3,
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 2,
                                }}
                            />

                            {/* Description Tab */}
                            <TouchableOpacity
                                style={{ width: '49%' }}
                                className='justify-center items-center pt-2 pb-1'
                                onPress={() => setActiveTab('description')}
                            >
                                <Text className='text-lg' style={{
                                    fontFamily: "roboto-medium",
                                    color: activeTab === 'description' ? COLORS.primary : COLORS.slate
                                }}>
                                    Description
                                </Text>
                            </TouchableOpacity>

                            {/* Location Tab */}
                            <TouchableOpacity
                                style={{ width: '49%' }}
                                className='justify-center items-center pt-2 pb-1'
                                onPress={() => setActiveTab('location')}
                            >
                                <Text className='text-lg' style={{
                                    fontFamily: "roboto-medium",
                                    color: activeTab === 'location' ? COLORS.primary : COLORS.slate
                                }}>
                                    Location
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <MotiView
                            animate={{
                                translateX: activeTab === 'description' ? 0 : -tabWidth,
                            }}
                            transition={{ type: 'timing', duration: 300 }}
                            style={{
                                flexDirection: 'row',
                                width: tabWidth * 2, // 2 tabs
                            }}
                        >
                            {/* Description Screen */}
                            <View style={{ width: tabWidth }}>
                                <Text className="text-base text-slate mb-4" style={{ fontFamily: "roboto-medium", textAlign: 'justify' }}>
                                    {productNotes ? productNotes : 'No Description'}
                                </Text>
                            </View>

                            {/* Map Screen */}
                            <View style={{ width: tabWidth }}>
                                <Text className="text-base text-slate mb-4" style={{ fontFamily: "roboto-regular", textAlign: 'justify' }}>
                                    No Map
                                </Text>
                            </View>
                        </MotiView>
                    </ScrollView>

                    {/* Add to Cart */}
                    <View className='w-full px-4 mb-10 bg-transparent justify-center items-center'>
                        {/* Total */}
                        <View className='w-full mb-2 bg-white'>
                            <Text className="text-2xl text-red" style={{ fontFamily: "ubuntu-medium" }}>
                                Total: K{Number(estimatedPrice * qty || 0).toLocaleString()}
                            </Text>
                        </View>
                        {/* <View className='flex-row w-full justify-between items-center'>
                            <TouchableOpacity
                                className="w-full bg-primary py-3 flex-row justify-center items-center rounded elevation-md"
                            >
                                <Text
                                    className="ml-2 text-white text-2xl font-semibold"
                                    style={{ fontFamily: "maven-medium" }}
                                >
                                    Collect
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
                {/* <TouchableWithoutFeedback/> */}
            </MotiView>
        </Modal>
    );
};

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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default ProductModal;