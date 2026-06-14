import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from '../../../../../../constants/constants';
import { Carticons } from '../../../../../../constants/icons';
import {
    addOthersItem
} from '../../../../../../redux/store/slices/OthersCartSlice';
import { PRODUCTS_IMAGE_URI } from '../../../../../../RequestMethods';
import { calculateDistance } from '../../../../../../utils/getDistance';
import { toast } from "../../../../../../utils/toast";

const AllProductsCard = (props) => {
    const { latitude, longitude, displayCurrentLocation } = useSelector(state => state.location);
    const router = useRouter();
    const dispatch = useDispatch();
    const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);
    const [selectedVariants, setSelectedVariants] = useState({});

    // Auto select variants
    useEffect(() => {
        if (!props.variant_groups?.length) return;

        setSelectedVariants((prev) => {
            const updated = { ...prev };

            props.variant_groups.forEach((group) => {
                const key = group.id;

                if (updated[key]?.options?.length > 0) return;

                const options = group.options || [];
                if (!options.length) return;

                updated[key] = {
                    group_id: group.id,
                    group_name: group.name,
                    is_required: group.is_required,
                    multi_select: group.multi_select,
                    options: [
                        {
                            id: options[0].id,
                            name: options[0].name,
                            price: options[0].price,
                        }
                    ]
                };
            });
            return updated;
        });
    }, [props.variant_groups]);


    const getVariantPrice = () => {
        let extra = 0;

        props.variant_groups.forEach(group => {
            const selectedGroup = selectedVariants[group.id];

            const options = selectedGroup?.options || [];

            options.forEach(opt => {
                extra += Number(opt?.price || 0);
            });
        });

        return extra;
    };

    const finalPrice = Number(props.final_price) + getVariantPrice();

    // ✅ Add item to Other Cart
    const handleAddItem = () => {
        const getVariantPrice = () => {
            let extra = 0;

            props.variant_groups.forEach(group => {
                const selectedGroup = selectedVariants[group.id];

                const options = selectedGroup?.options || [];

                options.forEach(opt => {
                    extra += Number(opt?.price || 0);
                });
            });

            return extra;
        };

        const finalPrice = Number(props.final_price) + getVariantPrice();

        dispatch(addOthersItem({ 
            product_id: props.product_id,
            product_image: props.product_image,
            product_name: props.product_name,
            product_description: props.product_description,
            product_price: Number(props.product_price),
            product_qty: 1,
            total_price: finalPrice,
            product_status: props.product_status,
            store_name: props.store_name,
            store_id: props.store_id,
            available_variants: props.variant_groups,
            store_phone_num: props.store_phone_num,
            store_category: props.store_category,
            product_category: props.product_category,
            selected_variants: selectedVariants,
            store_profileImage: props.store_profileImage,
            store_location: props.store_location,
            store_latitude: props.store_latitude,
            store_longitude: props.store_longitude,
            markup_percent: props.markup_percent,
            final_price: props.final_price
        }));

        toast.success('Product added to cart');
    };

    const isSelected = (group, item) => {
        const selectedGroup = selectedVariants[group.id];
        return selectedGroup?.options?.some(opt => opt.id === item.id);
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
                product_price: props.product_price,
                product_qty: props.quantity,
                total_price: props.totalprice,
                product_status: props.product_status,
                store_name: props.store_name,
                store_id: props.store_id,
                store_phone_num: props.store_phone_num,
                store_category: props.store_category,
                product_category: props.product_category,
                store_profileImage: props.store_profileImage,
                store_location: props.store_location,
                variant_groups: encodeURIComponent(JSON.stringify(props.variant_groups)),
                markup_percent: props.markup_percent,
                final_price: props.final_price,
                open_time: props.open_time,
                closing_time: props.closing_time,
                open_close: props.open_close
            }})}
            activeOpacity={0.7}
            style={{width: '48%'}}
            className='rounded-lg border border-grey_bg items-center justify-center relative'
        >
            <View className='relative w-full' style={{height: 170}}>
                <Image
                    resizeMode="cover"
                    className="relative h-full w-full rounded-lg"
                    source={
                        props.product_image
                            ? { uri: `${PRODUCTS_IMAGE_URI}${props.product_image}` }
                            : Carticons.placeholder
                    }
                />
                <TouchableOpacity className='absolute h-7 w-7 top-2 right-2 items-center justify-center bg-[#fff] rounded-full'>
                    <MaterialCommunityIcons color={COLORS.primary} name='heart-outline' size={17} />
                </TouchableOpacity>
                <TouchableOpacity className='flex-row px-2 absolute h-7 w-15 bottom-2 left-2 items-center justify-center bg-[#fff] rounded-full'>
                    <Ionicons name='location-outline' color={COLORS.red} size={12} />
                    <Text numberOfLines={1} className='text-sm text-red'>{calculateDistance(pointA, pointB)}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className='flex-row px-2 absolute h-7 w-17 top-2 left-2 items-center justify-center bg-[#fff] rounded-full'>
                    <FontAwesome5 name="eye" size={13} color={COLORS.primary} />
                    <Text className='text-sm text-lavender'> |</Text>
                    <Text numberOfLines={1} className='ml-1 text-sm text-red'>25</Text>
                </TouchableOpacity> */}
            </View>
            <View className='w-full px-1 justify-center items-center'>
                <Text numberOfLines={1} style={{fontFamily: 'roboto-medium'}} className='text-base'>{props.product_name}</Text>
            </View>
            <View className='w-full px-1 justify-center items-center'>
                <Text className='text-lg text-primary' style={{fontFamily: 'roboto-medium'}}>K{props.final_price}</Text>
            </View>
            <TouchableOpacity className='p-1 flex-row justify-center items-center mb-1'
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
                    favorited: props.favorited,
                    markup_percent: props.markup_percent,
                    final_price: props.final_price
                }})}
            >
                <View className='flex-row items-center justify-center mr-1 px-1'>
                    <FontAwesome5 name='store-alt' color={COLORS.green1} size={11} />
                    <Text numberOfLines={1} style={{ fontFamily: 'roboto' }} className='ml-[2px] text-sm text-slate'>{props.store_name}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                className='flex-row w-full mx-1 rounded-lg bg-primary elevation-lg bottom-0 items-center justify-center'
                style={{
                    width: '98%',
                    height: 30,
                    opacity: othersCartItems.some(item => item.product_id === props.product_id) ? 0.5 : 0.9
                }}
                disabled={othersCartItems.some(item => item.product_id === props.product_id)}
                onPress={handleAddItem}
            >
                <FontAwesome color={COLORS.white} name='shopping-cart' size={17} />
                <Text style={{fontFamily: 'roboto-medium'}} className='ml-2 text-white'>
                    {othersCartItems.some(item => item.product_id === props.product_id) ? "Already In Cart" : "Add To Cart"}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default AllProductsCard