import { Entypo } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../../constants/constants'
import ProductModal from './ProductModal'

const SingleOrderCard = (item) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <View className='flex-1 items-center'>
                <ProductModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    item_name={item.item.name}
                    estimatedPrice={item.item.estimatedPrice}
                    qty={item.item.qty}
                    productNotes={item.item.productNotes}
                />
                <TouchableOpacity className='' onPress={() => setOpenModal(true)}>
                    <View className='w-full flex-row justify-between items-center'>
                        <View className='border border-lavender bg-grey_bg rounded justify-center items-center' style={{width: '22%', height: 60}}>
                            <Entypo name='box' size={35} color={COLORS.slate}/>
                        </View>
                        <View className='' style={{width: '70%'}}>
                            <Text numberOfLines={1} className='text-base font-semibold' style={{fontFamily: 'roboto-medium'}}>{item.item.name}</Text>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-sm text-slate'>Est. Price: K{Number(item.item.estimatedPrice || 0).toLocaleString()}</Text>
                                <Text className='text-sm text-slate'>Qty: {item.item.qty}</Text>
                                <Text className='text-sm text-primary font-semibold'>Total: K{Number(item.item.estimatedPrice * item.item.qty || 0).toLocaleString()}</Text>
                            </View>
                        </View>
                        <View className='justify-center items-center' style={{width: '5%'}}>
                            <Entypo name="dots-three-vertical" size={20} color={COLORS.slate} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View className='w-full bg-grey_bg my-4' style={{height: 1}}/>
        </>
    )
}

export default SingleOrderCard