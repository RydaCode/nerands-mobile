import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../../constants/constants';
import { packageSizes } from '../../../../constants/packageSizes';

const SelectPackageSize = ({
    openSelctSize,
    setOpenSelctSize,
    selectedSize,
    setSelectedSize,
    errorMessage,
    setErrorMessage,
    setHandlingFee
}) => {
    const stores = useSelector((state) => state.customcart.custom_stores);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const storesCount = stores?.length || 0;
    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={openSelctSize}
            animationType="none"
            onRequestClose={() => setOpenSelctSize(false)}
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
                    onPress={() => setOpenSelctSize(false)}
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
                    <View className='flex-row justify-between items-center w-full mt-2'>
                        <View className='rounded py-1' style={{width: '75%'}}>
                            <Text
                                className='text-2xl text-black'
                                style={{fontFamily: 'ubuntu-medium'}}
                            >Select Size</Text>
                        </View>
                        <TouchableOpacity className='p-3 justify-center items-center rounded-full bg-grey_bg'
                            style={{width: 35, height: 35}}
                            onPress={() => setOpenSelctSize(false)}
                        >
                            <FontAwesome name="times" size={15} color='red'/>
                        </TouchableOpacity>
                    </View>

                    <View className='w-full bg-lavender my-2' style={{height: 1}}/>

                    <ScrollView
                        className='flex-1'
                        contentContainerStyle={{
                            paddingBottom: 40,
                            alignItems: 'center',
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='w-full'>
                            <Text
                                className='text-slate my-4'
                                style={{fontFamily: 'roboto-medium'}}
                            >
                                Select the size that best describe your order. This determines the runner fees.
                            </Text>

                            {packageSizes
                                .filter(item => {
                                    // hide Small if more than 1 store
                                    if (item.id === 1 && storesCount > 1) return false;
                                    return true;
                                }).map((item) => {
                                const isSelected = selectedSize?.id === item.id;

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        className='p-2 my-3 elevation-sm rounded w-full items-center'
                                        style={{
                                            borderWidth: 1,
                                            backgroundColor: isSelected
                                                ? item.backgroundColor
                                                : "#FFFFFF",
                                            borderColor: isSelected
                                                ? item.borderColor
                                                : "#E2E8F0",
                                        }}
                                        onPress={() => {
                                            setSelectedSize({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                description: item.description,
                                                backgroundColor: item.backgroundColor,
                                                borderColor: item.borderColor,
                                                badgeColor: item.badgeColor,
                                                icon: item.icon,
                                                iconColor: item.iconColor,
                                            });
                                            setHandlingFee({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                description: item.description
                                            });
                                            setErrorMessage(`Selecetd Size: ${item.name}`);
                                        }}
                                    >
                                        <View className='flex-row justify-between items-center w-full'>
                                            <View className='flex-row' style={{ width: '85%' }}>
                                                <Ionicons
                                                    name={item.icon}
                                                    size={27}
                                                    color={item.iconColor}
                                                />

                                                <Text
                                                    className='text-lg ml-1 text-black'
                                                    style={{ fontFamily: 'roboto-medium' }}
                                                >
                                                    Size - {item.name}
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    borderRadius: 100,
                                                    borderWidth: 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderColor: isSelected
                                                        ? item.borderColor
                                                        : "#CBD5E1",
                                                }}
                                            >
                                                {isSelected && <FontAwesome name='check' color={item.iconColor} />}
                                            </View>
                                        </View>

                                        <View className='w-full'>
                                            <Text
                                                className='text-sm text-slate'
                                                style={{
                                                    textAlign: 'justify',
                                                    fontFamily: 'roboto-medium'
                                                }}
                                            >
                                                {item.description}
                                            </Text>
                                        </View>

                                        <View className='w-full flex-row justify-end mt-2'>
                                            <View
                                                style={{
                                                    width: '50%',
                                                    paddingVertical: 4,
                                                    borderRadius: 999,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: item.badgeColor,
                                                }}
                                            >
                                                <Text className='text-white text-lg'>
                                                    K{item.price}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {errorMessage &&
                            <Animated.View style={{ opacity: fadeAnim, marginVertical: 6 }}>
                                {errorMessage ? (
                                    <Text style={{ color: COLORS.green1, fontFamily: 'roboto-medium' }}>{errorMessage}</Text>
                                ) : null}
                            </Animated.View>
                        }           
                    </ScrollView>

                    {selectedSize?.borderColor && (
                        <TouchableOpacity
                            className='w-full elevation-sm mb-2 justify-center px-2 items-center rounded py-2'
                            style={{backgroundColor: selectedSize?.borderColor}}
                            onPress={() => setOpenSelctSize(false)}
                        >
                            <View className='flex-row items-center'>
                                <Text
                                    className='text-2xl text-white'
                                    style={{fontFamily: 'ubuntu-medium'}}
                                >Continue</Text>
                            </View>
                        </TouchableOpacity>
                    )}
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
        height: '95%',
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

export default SelectPackageSize