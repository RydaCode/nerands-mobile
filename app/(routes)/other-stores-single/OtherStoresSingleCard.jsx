import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from '../../../constants/constants';
import { addOthersItem } from '../../../redux/store/slices/OthersCartSlice';
import { PRODUCTS_IMAGE_URI } from '../../../RequestMethods';
import { toast } from '../../../utils/toast';

const OtherStoresSingleCard = ({
    params,
    product_id,
    product_images,
    product_image,
    product_name,
    product_description,
    product_actual_price,
    product_price,
    product_status,
    store_name,
    store_id,
    store_phone_num,
    store_category,
    product_category,
    product_colors,
    product_sizes,
    store_profileimage,
    store_location,
    store_latitude,
    store_longitude,
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedcolors, setSelectedColors] = useState([]);
    const [selectedsizes, setSelectedSizes] = useState([]);
    const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);

    // const string = product_colors;
    const Colors = typeof product_colors === "string" ? product_colors
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "")
        .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()) // Capitalize first letter
    : [];

    // const string = product_sizes;
    const Sizes = typeof product_sizes === "string" ? product_sizes
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "")
        .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()) // Capitalize first letter
    : [];

    // ✅ Add item to Other Cart
    const handleAddItem = () => {
        dispatch(addOthersItem({ 
            product_id: product_id,
            product_image: product_image,
            product_name: product_name,
            product_description: product_description,
            product_actual_price: product_actual_price,
            product_price: product_price,
            product_qty: 1,
            total_price: total_price,
            product_status: product_status,
            store_name: params.store_name,
            available_colors: product_colors,
            available_sizes: product_sizes,
            store_id: params.store_id,
            store_phone_num: params.store_phone_num,
            store_category: params.store_category,
            product_category: product_category,
            product_colors: selectedcolors,
            product_sizes: selectedsizes,
            store_profileImage: params.store_profileImage,
            store_location: params.store_location,
            store_latitude: params.store_latitude,
            store_longitude: params.store_longitude
        }));

        toast.success('Product added to cart');
    };

    useEffect(() => {
        if (Colors?.length > 0 && selectedcolors.length === 0) {
            setSelectedColors([Colors[0]]); // Select the first available color
        }
        if (Sizes?.length > 0 && selectedsizes.length === 0) {
            setSelectedSizes([Sizes[0]]); // Select the first available size
        }
    }, [Colors, Sizes]); // Runs when Colors or Sizes change

    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '../(routes)/other-single-product/', params: {
                product_id: product_id,
                product_image: product_image,
                product_name: product_name,
                product_description: product_description,
                product_actual_price: product_actual_price,
                product_price: product_price,
                // product_qty: quantity,
                // total_price: totalprice,
                product_status: product_status,
                store_name: params.store_name,
                store_id: params.store_id,
                store_phone_num: params.store_phone_num,
                store_category: params.store_category,
                product_category: product_category,
                product_colors: product_colors,
                product_sizes: product_sizes,
                store_profileImage: params.store_profileImage,
                store_location: params.store_location,
                store_latitude: params.store_latitude,
                store_longitude: params.store_longitude
            }})}
            activeOpacity={0.7}
            className='w-[49%] rounded-md items-center justify-center relative'
        >
            {/* <View className='w-full flex-row items-center mb-1' >
                <View className='flex-row items-center justify-center mr-1' >
                    <Ionicons name='location-outline' color={COLORS.green2} size={13} />
                    <Text numberOfLines={1} style={{ fontFamily: 'roboto-medium' }} className='text-sm text-green2 ml-[2px]'>
                        {params.store_location}
                        {calculateDistance(pointA, pointB)}
                    </Text>
                </View>
            </View> */}
            <View className='relative w-full' style={{height: 170}}>
                <Image resizeMode='cover' className='relative h-full w-full rounded-[3px]'
                    source={{uri: `${PRODUCTS_IMAGE_URI}${product_image}`}}
                />
                <TouchableOpacity className='absolute h-7 w-7 top-2 right-2 items-center justify-center bg-[#fff] rounded-full'>
                    <MaterialCommunityIcons color={COLORS.primary} name='heart-outline' size={17} />
                </TouchableOpacity>
                {/* <TouchableOpacity className='flex-row px-2 absolute h-7 w-17 top-2 left-2 items-center justify-center bg-[#fff] rounded-full'>
                    <FontAwesome5 name="eye" size={13} color={COLORS.primary} />
                    <Text className='text-sm text-lavender'> |</Text>
                    <Text numberOfLines={1} className='ml-[2px] text-sm text-red'>25</Text>
                </TouchableOpacity> */}
            </View>
            <View className='w-full justify-center items-center p-1'>
                <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className='text-lg'>{product_name}</Text>
            </View>
            <View className='w-full justify-center items-center p-1'>
                <Text className='text-lg text-primary' style={{fontFamily: 'roboto-medium'}}>K{product_price}</Text>
            </View>
            <TouchableOpacity
                disabled={othersCartItems.some(item => product_id === item.product_id)}
                onPress={handleAddItem}
                className='flex-row rounded-full h-[30px] w-[100%] bottom-0 items-center justify-center border border-1 border-red'
            >
                <FontAwesome color={COLORS.primary} name='shopping-cart' size={20} />
                <Text style={{fontFamily: 'roboto-medium'}} className='ml-2 text-primary'>
                    {othersCartItems.some(item => product_id === item.product_id) ? "Already In Cart" : "Add To cart"}
                </Text>
            </TouchableOpacity>
            <View className='w-full mt-1 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default OtherStoresSingleCard