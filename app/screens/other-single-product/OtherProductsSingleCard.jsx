import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionInput from '../../../components/FormFields/DescriptionInput';
import { COLORS, SIZES } from '../../../constants/constants';
import { Carticons } from '../../../constants/icons';
import useApi from '../../../hook/useApi';
import {
    addOthersItem
} from '../../../redux/store/slices/OthersCartSlice';
import { toast } from '../../../utils/toast';
import MenSizeChartCard from './MenSizeChartCard';
import ProductImagesGallery from './ProductImagesGallery';
import WomenSizeChartCard from './WomenSizeChartCard';

const OtherProductsSingleCard = ({
    product_id,
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
    chili_option,
    store_profileImage,
    store_location,
    variant_groups
}) => {
        // Get the window dimensions for responsiveness
        // const { width, height } = useWindowDimensions();
        const { width, height } = Dimensions.get('window');

        // Make the image height and width responsive based on the screen size
        const imageWidth = width * 0.25;
        const imageHeight = height * 0.10;
        const {data, isLoading, error, get} = useApi(`/products/product-images?product_id=${product_id}`);
        const dispatch = useDispatch();
        const othersCartItems = useSelector((state) => state.otherscart.othersCartItems);
        const [selectedcolors, setSelectedColors] = useState([]);
        const [selectedsizes, setSelectedSizes] = useState([]);
        const [productnotes, setProductNotes] = useState('');
        const [quantity, setQuantity] = useState(1);
        const [totalprice, setTotalPrice] = useState(product_price);
        
        useEffect(() => {
            get();
        }, []);
        
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
                product_qty: quantity,
                total_price: totalprice,
                product_status: product_status,
                store_name: store_name,
                product_notes: productnotes,
                available_colors: product_colors,
                available_sizes: product_sizes,
                store_id: store_id,
                store_phone_num: store_phone_num,
                store_category: store_category,
                product_category: product_category,
                product_colors: selectedcolors,  // ✅ Store selected colors
                product_sizes: selectedsizes,    // ✅ Store selected sizes
                selected_colors: selectedcolors,
                selected_sizes: selectedsizes,
                store_profileImage: store_profileImage,
                store_location: store_location
            }));
            toast.success('Product aaded to cart')
        };
    
        // Increase quantity
        const handleIncreaseQty = () => {
            setQuantity((prevQty) => {
                const newQty = Math.min(prevQty + 1, 10);
                setTotalPrice(newQty * product_price);
                return newQty;
            });
        };

        // Decrease quantity (ensure it doesn't go below 1)
        const handleDecreaseQty = () => {
            setQuantity((prevQty) => {
                const newQty = Math.max(prevQty - 1, 1);
                setTotalPrice(newQty * product_price);
                return newQty;
            });
        };

    // Auto-select the only color if there's just one and it's not already selected
    useEffect(() => {
        if (Colors.length === 1 && selectedcolors.length === 0) {
            setSelectedColors([Colors[0]]);
        }
        
        if (Sizes.length === 1 && selectedsizes.length === 0) {
            setSelectedSizes([Sizes[0]]);
        }
    }, [Colors, Sizes]); // Only run when Colors change

    const handleChangeText = (value) => {
        setProductNotes(value);
    };

    const hasColors = product_colors?.length > 0;    // Product has color options
    const hasSizes = product_colors?.length > 0;      // Product has size options

    const missingColor = hasColors && selectedcolors?.length === 0;
    const missingSize = hasSizes && selectedsizes?.length === 0;

    const alreadyInCart = othersCartItems.some(
        item => item.product_id === product_id
    );

    const isDisabled = alreadyInCart || missingColor || missingSize;

    return (
        <View className='bg-white w-full justify-center items-center pb-20'>
            <View className='w-full'>
                <ProductImagesGallery
                    mainImage={product_image}
                    images={Array.isArray(data?.data) ? data?.data : []}
                />
            </View>
            <View className='w-full px-2'>   
                <View className='w-full mt-5'>
                    <Text style={{fontSize: 20, fontFamily: 'roboto-medium'}} className='font-semibold text-xl'>{product_name}</Text>
                    <Text style={{fontSize: 20}} className='font-semibold text-lg mt-2 text-primary'>K{product_price}</Text>
                </View>
                <View className='mt-2 w-full'>
                    <Text className='mt-3 text-sm' style={{fontFamily: 'roboto-medium'}}>{product_description}
                    </Text>
                </View>
                <View className='w-full flex-row justify-between items-center my-5'>
                    <View className='w-[48%] bg-grey_bg rounded-full p-1 justify-center items-center'>
                        <Text className='text-red'>In Stock: 4 items</Text>
                    </View>
                    <View className='w-[48%] p-1 flex-row justify-center items-center bg-grey_bg rounded-full'>
                        <FontAwesome5 name='eye' />
                        <View className='ml-2'>
                            <Text className='text-red'>16 View</Text>
                        </View>
                    </View>
                </View>
                {variant_groups.map((group) => (
                    <View key={group.id} className='w-full my-4'>
                        <Text className='text-lg mb-2' style={{fontFamily: 'roboto-medium'}}>{group.name}</Text>
                        <FlatList
                            data={group.options || []}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isSelected = selectedcolors.includes(item.name);
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedColors(prev =>
                                                isSelected ? prev.filter(c => c !== item.name) : [...prev, item.name]
                                            );
                                        }}
                                        className="bg-grey_bg px-3 py-2 mr-2 relative rounded-sm"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: isSelected ? COLORS.grey_bg : COLORS.lavender,
                                            backgroundColor: isSelected ? COLORS.primary : COLORS.grey_bg,
                                        }}
                                    >
                                        {isSelected && (
                                            <View className="absolute -right-2 -top-1 border-2 border-white rounded">
                                                {/* <View className='h-4 w-4 bg-green2 rounded-full' /> */}
                                            </View>
                                        )}
                                        <Text style={{fontFamily: 'roboto-medium'}} className={`text-base text-${isSelected ? 'white' : 'slate'}`}>{`${item.name}${item.price === 0 ? '' : ` | K${item.price}`}`}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                            ListEmptyComponent={<Text className="text-gray-500">No variants available.</Text>}
                        />
                    </View>
                ))}
                <View className="w-full mt-4">
                    <DescriptionInput
                        title="Special Notes"
                        handleChangeText={handleChangeText}
                        desc="Add any notes before adding to cart (e.g., size, customization, delivery)."
                        otherStyles="text-lg mt-4"
                        borderStyle="border border-gray-300 rounded-md"
                        lines={4}
                    />
                </View>

                <View style={{width: '38%', alignSelf: 'center'}} className='justify-center items-center'>
                    <View className='w-full justify-center items-center'>
                        <Text className='text-base text-slate' style={{fontFamily: 'roboto-medium'}}>Qty</Text>
                    </View>
                    <View className='flex-row justify-center items-center w-full'>
                        <TouchableOpacity
                            disabled={quantity <= 1 ? true : false}
                            onPress={handleDecreaseQty}
                            style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
                            className='bg-slate p-2 w-[25px] h-[25px] rounded-full justify-center items-center'
                        >
                            <FontAwesome name="minus" style={{ color: COLORS.white }} />
                        </TouchableOpacity>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={10}
                            editable={false}
                            style={{ textAlign: 'center', fontSize: SIZES.main, color: COLORS.slate, width: '30%' }}
                            value={quantity.toString()}
                        />
                        <TouchableOpacity
                            disabled={quantity >= 10 ? true : false}
                            onPress={handleIncreaseQty}
                            style={{ opacity: quantity >= 10 ? 0.5 : 1 }}
                            className='bg-slate p-2  w-[25px] h-[25px] rounded-full justify-center items-center'
                        >
                                <FontAwesome name="plus" style={{ color: COLORS.white }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='flex-row w-full justify-center items-center'>
                    <View className='flex-row justify-center items-center'>
                        <Text className='text-xl text-green1' style={{fontFamily: 'roboto-medium'}}>Price: {`K${product_price.toLocaleString()}`}</Text>
                    </View> 
                    <Text className='mx-4 text-2xl text-slate'>|</Text>
                    <View className='flex-row justify-center items-center'>
                        <Text className='text-xl text-red' style={{fontFamily: 'roboto-medium'}}>Total: {`K${totalprice.toLocaleString()}`}</Text>
                    </View>
                </View>
                <View className='mt-2 justify-center items-center w-full'>
                    
                    <View className='flex-row w-full mt-4 justify-between items-center'>
                        <TouchableOpacity
                            // disabled={isDisabled}
                            style={{
                                width: '79%',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.5,
                                shadowRadius: 5,
                                elevation: 5,
                                opacity: isDisabled && 0.9 ,
                            }}
                            className='flex-row bg-primary justify-center items-center py-3 rounded-sm'
                            onPress={() => {
                                if (missingColor) return toast.error("Please select a color(s)");
                                if (missingSize) return toast.error("Please select a size(s)");
                                if (alreadyInCart) return toast.info("This product is already in your cart");
                                handleAddItem();
                            }}
                        >
                            <FontAwesome name='shopping-cart' color={COLORS.white} size={19} />
                            <Text className='ml-2 text-white' style={{ fontSize: 18, fontFamily: 'roboto-medium', fontWeight: SIZES.h1 }}>
                                {othersCartItems.some(item => item.product_id === product_id) ? "ALREADY IN CART" : "ADD TO CART"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: '20%',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.5,
                                shadowRadius: 5,
                                elevation: 5,
                                backgroundColor: COLORS.green1,
                            }}
                            className='justify-center items-center rounded-sm py-1'
                        >
                            <FontAwesome name='heart' color={COLORS.white} size={20} />
                            <Text className='text-sm text-white' style={{fontFamily: 'roboto'}}>Wishlist</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='flex-row justify-center items-center mt-5'>
                    <View className='flex-row justify-center items-center mr-4'>
                        <FontAwesome5 name='whatsapp' color='#075E54' size={20} />
                        <Text className='ml-1 text-[#075E54] text-sm'>Whatapp</Text>
                    </View>
                    <View className='flex-row justify-center items-center mr-4'>
                        <FontAwesome5 name='facebook' color='#316FF6' size={20} />
                        <Text className='ml-1 text-[#316FF6] text-sm'>Share</Text>
                    </View>
                    <View className='flex-row justify-center items-center mr-4'>
                        <FontAwesome5 name='twitter' color='#008AD8' size={20} />
                        <Text className='ml-1 text-[#008AD8] text-sm'>Tweet</Text>
                    </View>
                    <View className='flex-row justify-center items-center'>
                        <FontAwesome5 name='instagram' color='#4f5bd5' size={20} />
                        <Text className='ml-1 text-[#4f5bd5] text-sm'>Instagram</Text>
                    </View>
                </View>
                <View className='flex-row w-full mt-10 justify-center items-center'>
                    <TextInput
                        className='border-[1px] items-center text-slate text-lg border-emerald-400'
                        editable={false}
                        style={{ width: '69%' }}
                        value='nerands.com/product/app/'
                    />
                    <TouchableOpacity
                        style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                        className='flex-row bg-emerald-400 h-[45px] justify-center items-center w-[30%]'
                    >
                        <FontAwesome5 name='copy' size={18} color={COLORS.white} />
                        <Text className='ml-1 text-white font-semibold text-lg'>Copy Link</Text>
                    </TouchableOpacity>
                </View>

                <View className='mt-10 w-full flex-row justify-start items-center'>
                    <TouchableOpacity className='w-[30%] justify-center items-center' style={{borderBottomWidth: 1}}>
                        <Text>SIZE GUIDE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-[68%] ml-4 justify-center items-center' style={{borderBottomWidth: 1}}>
                        <Text>ASK ABOUT THIS PRODUCT</Text>
                    </TouchableOpacity>
                </View>

                <View className='w-full'>
                    <WomenSizeChartCard />
                    <MenSizeChartCard />
                    <View className='mt-10'>
                        <Image
                            resizeMode='contain'
                            className='w-full'
                            source={Carticons.size_chart}
                        />
                    </View>
                </View>
                {/* Next container */}
            </View>
        </View>
    )
}

export default OtherProductsSingleCard