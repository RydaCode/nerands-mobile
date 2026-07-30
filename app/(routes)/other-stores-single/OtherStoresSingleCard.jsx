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
    variant_groups,
    markup_percent,
    final_price,
    is_available
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedVariants, setSelectedVariants] = useState({});
    const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);

        // Auto select variants
    useEffect(() => {
        if (!variant_groups?.length) return;

        setSelectedVariants((prev) => {
            const updated = { ...prev };

            variant_groups.forEach((group) => {
                const key = group.id;

                // skip if already selected
                if (updated[key] && updated[key].length > 0) return;

                const options = group.options || [];

                if (!options.length) return;

                if (group.is_required) {
                    // ✅ Required groups must always have at least 1
                    updated[key] = [options[0].id];
                } else {
                    // ✅ Optional groups start empty
                    updated[key] = [];
                }
            });
            return updated;
        });
    }, [variant_groups]);

    // ✅ Add item to Other Cart
    const handleAddItem = () => {
        if (!is_available) {
            toast.info('Product unavailable');
            return;
        }

        const getVariantPrice = () => {
            let extra = 0;
            variant_groups.forEach(group => {
                const selected = selectedVariants[group.id] || [];

                selected.forEach(id => {
                    const opt = group.options?.find(o => o.id === id);
                    extra += Number(opt?.price || 0);
                });
            });
            return extra;
        };

        const finalPrice = Number(final_price) + getVariantPrice();

        dispatch(addOthersItem({ 
            product_id: product_id,
            product_image: product_image,
            product_name: product_name,
            product_description: product_description,
            product_actual_price: product_actual_price,
            product_price: Number(product_price),
            product_qty: 1,
            total_price: finalPrice,
            product_status: product_status,
            store_name: params.store_name,
            available_variants: variant_groups,
            store_id: params.store_id,
            business_id: params.business_id,
            store_phone_num: params.store_phone_num,
            store_category: params.store_category,
            product_category: product_category,
            selected_variants: selectedVariants,
            store_profileImage: params.store_profileImage,
            store_location: params.store_location,
            store_latitude: params.store_latitude,
            store_longitude: params.store_longitude,
            markup_percent: markup_percent,
            final_price: Number(final_price)
        }));
        toast.success('Product added to cart');
    };

    const isSelected = (group, item) => {
        return (selectedVariants[group.id] || []).includes(item.id);
    };

    return (
        <TouchableOpacity
            onPress={() => {
                if (!is_available) {
                    toast.info('Product unavailable');
                    return;
                }

                router.push({ pathname: '../(routes)/other-single-product/', params: {
                    product_id: product_id,
                    product_image: product_image,
                    product_name: product_name,
                    product_description: product_description,
                    product_actual_price: product_actual_price,
                    product_price: product_price,
                    final_price: Number(final_price),
                    // product_qty: quantity,
                    // total_price: totalprice,
                    product_status: product_status,
                    store_name: params.store_name,
                    store_id: params.store_id,
                    business_id: params.business_id,
                    store_phone_num: params.store_phone_num,
                    store_category: params.store_category,
                    product_category: product_category,
                    product_colors: product_colors,
                    product_sizes: product_sizes,
                    store_profileImage: params.store_profileImage,
                    store_location: params.store_location,
                    store_latitude: params.store_latitude,
                    store_longitude: params.store_longitude,
                    variant_groups: JSON.stringify(variant_groups),
                    is_available: params.is_available
                }})}
            }
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
                <View className='relative justify-center items-center h-full w-full rounded-[3px]'>
                    <Image resizeMode='cover' className='h-full w-full rounded-[3px]'
                        source={{uri: `${PRODUCTS_IMAGE_URI}${product_image}`}}
                    />
                    {!is_available && (
                        <View className='absolute rounded-[3px] bg-transparentBlack w-full h-full justify-center items-center'>
                            <MaterialCommunityIcons name="lock" size={15} style={{color: COLORS.lite}} />
                            <Text className='text-white text-sm'>Unavailable</Text>
                        </View>
                    )}
                </View>
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
                <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className='text-base'>{product_name}</Text>
            </View>
            <View className='w-full justify-center items-center p-1'>
                <Text className='text-base text-primary' style={{fontFamily: 'roboto-medium'}}>K{final_price}</Text>
            </View>
            <TouchableOpacity
                disabled={othersCartItems.some(item => product_id === item.product_id)}
                onPress={handleAddItem}
                className='flex-row rounded-full h-[30px] w-[100%] bottom-0 items-center justify-center border border-1 border-red'
            >
                <FontAwesome color={COLORS.primary} name='shopping-cart' size={20} />
                <Text style={{fontFamily: 'roboto-medium', opacity: is_available ? 1 : 0.5}} className='ml-2 text-primary'>
                    {othersCartItems.some(item => product_id === item.product_id) ? "Already In Cart" : "Add To cart"}
                </Text>
            </TouchableOpacity>
            <View className='w-full mt-1 h-[1px] rounded-full bg-slate opacity-10'/>
        </TouchableOpacity>
    )
}

export default OtherStoresSingleCard