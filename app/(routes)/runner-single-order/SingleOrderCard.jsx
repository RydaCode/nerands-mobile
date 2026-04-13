import { Entypo, FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import ProductModal from './ProductModal'

const SingleOrderCard = (params) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <View className='flex-1 items-center mt-8'>
            <ProductModal
                openModal={openModal}
                setOpenModal={setOpenModal}
            />

            <View
                className='elevation-sm w-full border border-lavender rounded mb-8 p-2 bg-white relative'
            >
                <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                    <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Client Details</Text>
                </View>
                <View className='flex-row justify-between items-center mt-3 mb-2'>
                    <View className='border-2 border-lavender rounded-full justify-center items-center' style={{width: 60, height: 60}}>
                        <FontAwesome name='user' size={35} color={COLORS.slate}/>
                    </View>
                    <View className='w-[65%]'>
                        <Text numberOfLines={1} className='text-lg font-semibold' style={{fontFamily: 'roboto-medium'}}>Sylvester Nyimbili</Text>
                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>0973304006</Text>
                    </View>
                    <TouchableOpacity className='bg-grey_bg rounded-full justify-center items-center border border-lavender' style={{width: 45, height: 45}}>
                        <FontAwesome name='phone' size={25} color={COLORS.green2}/>
                    </TouchableOpacity>
                </View>

                <View className='items-center'>
                    <View className='w-full flex-row justify-start items-center mb-0.5'>
                        <Entypo name='box' size={16} color={COLORS.primary}/>
                        <Text className='ml-2 text-lg text-black' style={{fontFamily: 'roboto-medium'}}>202315678</Text>
                    </View>
                    <View className='w-full flex-row justify-between items-center'>
                        <View className='flex-row justify-start items-center'>
                            <Entypo name='location' size={16} color={COLORS.primary}/>
                            <Text className='text-base ml-2 text-slate' style={{fontFamily: 'roboto-medium'}}>
                                Ndola
                            </Text>
                            <View className='bg-grey_bg ml-3 px-2 py-1 rounded-full'>
                                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>
                                    1170.85Km
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='flex-row mt-4 justify-between items-center'>
                    <View className='w-[48.5%] py-2 justify-center items-center bg-navBtnBgHome rounded'>
                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>
                            TYPE: <Text className='ml-1 text-green2 text-base' style={{fontFamily: 'roboto-medium'}}>CUSTOM</Text>
                        </Text>
                    </View>
                    <View className='w-[48.5%] py-2 justify-center items-center bg-red rounded'>
                        <Text className='ml-1 text-white text-base' style={{fontFamily: 'roboto-medium'}}>PENDING</Text>
                    </View>
                </View>
            </View>

            {/* Activity Indicator */}
            {/* <View className='w-full mt-50 bg-white justify-center items-center' style={{paddingVertical: 100}}>
                <ActivityIndicator size={50} color={COLORS.primary} />
                <Text className='text-base' style={{fontFamily: 'roboto-medium'}}>Loading Orders, please wait...</Text>
            </View> */}

            <View
                className='elevation-sm w-full border border-lavender rounded mb-8 p-2 pt-6 bg-white relative'
            >
                <View className='absolute px-1 bg-white' style={{top: -13, left: 4}}>
                    <Text className='text-xl font-semibold' style={{fontFamily: 'roboto-medium'}}>Order Items</Text>
                </View>
                <TouchableOpacity className='' onPress={() => setOpenModal(true)}>
                    <View className='w-full flex-row justify-between items-center'>
                        <View className='border border-lavender bg-grey_bg rounded justify-center items-center' style={{width: '22%', height: 60}}>
                            <Entypo name='box' size={35} color={COLORS.slate}/>
                        </View>
                        <View className='' style={{width: '70%'}}>
                            <Text numberOfLines={1} className='text-base font-semibold' style={{fontFamily: 'roboto-medium'}}>Hand Bags</Text>
                            <Text>Qty: 20</Text>
                        </View>
                        <View className='justify-center items-center' style={{width: '5%'}}>
                            <Entypo name="dots-three-vertical" size={20} color={COLORS.slate} />
                        </View>
                    </View>
                    <View className='w-full bg-grey_bg my-4' style={{height: 1}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SingleOrderCard