import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from '../../../constants/constants';
import { Carticons } from '../../../constants/icons';
import { addOthersItem } from '../../../redux/store/slices/OthersCartSlice';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';

const LocalMarketCard = (props) => {
    const { latitude, longitude, displayCurrentLocation } = useSelector(state => state.location);
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedcolors, setSelectedColors] = useState([]);
    const [selectedsizes, setSelectedSizes] = useState([]);
    const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);

    // ✅ Add item to Other Cart
    const handleAddItem = () => {
        dispatch(addOthersItem({ 
            product_id: props.product_id,
            product_image: props.product_image,
            product_name: props.product_name,
            product_description: props.product_description,
            product_actual_price: props.product_actual_price,
            product_price: props.product_price,
            product_qty: 1,
            total_price: props.total_price,
            product_status: props.product_status,
            store_name: props.store_name,
            available_colors: props.product_colors,
            available_sizes: props.product_sizes,
            store_id: props.store_id,
            store_phone_num: props.store_phone_num,
            store_category: props.store_category,
            product_category: props.product_category,
            product_colors: selectedcolors,
            product_sizes: selectedsizes,
            store_profileImage: props.store_profileImage,
            store_location: props.store_location,
            store_latitude: props.store_latitude,
            store_longitude: props.store_longitude
        }));

        toast.success('Product added to cart');
    };
    
    const pointA = { latitude: latitude, longitude: longitude }; // User
    const pointB = { latitude: props.store_latitude, longitude: props.store_longitude }; //Store

    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '../(routes)/other-single-product/', params: {
                product_id: props.product_id,
                product_image: props.product_image,
                product_name: props.product_name,
                product_description: props.product_description,
                product_actual_price: props.product_actual_price,
                product_price: props.product_price,
                product_qty: props.quantity,
                total_price: props.totalprice,
                product_status: props.product_status,
                store_name: props.store_name,
                store_id: props.store_id,
                store_phone_num: props.store_phone_num,
                store_category: props.store_category,
                product_category: props.product_category,
                product_colors: props.product_colors,
                product_sizes: props.product_sizes,
                store_profileImage: props.store_profileImage,
                store_location: props.store_location
            }})}
            activeOpacity={0.7}
            className='rounded-lg bg-white border border-grey_bg items-center justify-center relative'
            style={{width: '48.5%'}}
        >
            <View className='relative w-full' style={{height: 150}}>
                <Image
                    resizeMode="contain"
                    className="relative h-full w-full rounded-lg border-grey_bg"
                    source={
                        props.product_image
                            ? { uri: `${PRODUCTS_IMAGE_URI}${props.product_image}` }
                            : Carticons.placeholder
                    }
                />
                <View className='flex-row px-2 absolute h-7 w-30 top-2 left-2 items-center justify-center bg-transparentBlack rounded-full'>
                    <Text numberOfLines={1} className='text-sm text-white'>Fresh</Text>
                </View>
            </View>
            <View className='w-full justify-center items-center px-1'>
                <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className='text-base'>{props.product_name}</Text>
            </View>
            <View className='w-full justify-center items-center px-1'>
                <Text className='text-lg text-primary' style={{fontFamily: 'roboto-medium'}}>K{props.product_price}</Text>
            </View>
            <TouchableOpacity
                style={{backgroundColor: '#fff'}} className='w-ful px-1 justify-center items-center mb-1 rounded-full'
                onPress={() => router.push({pathname: '../(routes)/other-stores-single/', params: {
                    store_id: props.store_id,
                    store_profileimage: props.store_profileimage,
                    store_coverimage: props.store_coverimage,
                    store_name: props.store_name,
                    store_description: props.store_description,
                    store_phone_num: props.store_phone_num,
                    open_close: props.open_close,
                    store_latitude: props.store_latitude,
                    store_longitude: props.store_longitude,
                    store_location: props.store_location,
                    store_category: props.store_category,
                    average_rating: props.average_rating,
                    total_ratings: props.total_ratings,
                    favorited: props.favorited
                }})}
            >
                <View className='items-center justify-center'>
                    <Text numberOfLines={1} style={{ fontFamily: 'roboto' }} className='text-sm text-slate'>{props.store_name}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={othersCartItems.some(item => item.product_id === props.product_id)}
                onPress={handleAddItem}
                className='flex-row rounded-lg bg-primary elevation-lg bottom-0 items-center justify-center'
                style={{
                    width: '97%', height: 30,
                    opacity: othersCartItems.some(item => item.product_id === props.product_id) ? 0.5 : 0.9
                }}
            >
                <FontAwesome color={COLORS.white} name='shopping-cart' size={17} />
                <Text style={{fontFamily: 'roboto-medium'}} className='ml-2 text-white'>
                    {othersCartItems.some(item => item.product_id === props.product_id) ? "Already In Cart" : "Add To cart"}
                </Text>
            </TouchableOpacity>
            <View className='w-full mt-1 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default LocalMarketCard