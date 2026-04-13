import { useRouter } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Carticons } from '../../constants/icons';


const category_items = [
    {
        category_id: '1',
        category_image: Carticons.stores,
        category_text: 'Stores',
        link: '../(routes)/stores-menu-items/'
    },
    {
        category_id: '3',
        category_image: Carticons.groceries,
        category_text: 'Custom Order',
        link: '../(routes)/custom-order-menu-items/'
    },
    {
        category_id: '5',
        category_image: Carticons.veg,
        category_text: 'Local Market',
        link: '../(routes)/local-market/'
    },
    {
        category_id: '4',
        category_image: Carticons.parcels,
        category_text: 'Parcels',
        link: '../(routes)/parcels-menu-items/'
    },
    {
        category_id: '8',
        category_image: Carticons.rea_estate,
        category_text: 'Real Estate',
        link: '../(routes)/stores-menu-items/'
    },
    {
        category_id: '7',
        category_image: Carticons.hotels,
        category_text: 'Hotels & Lodges',
        link: '../(routes)/stores-menu-items/'
    },
];

const Categories = () => {
    const { user_id, first_name  } = useSelector((state) => state.auth);
    const { width, height } = useWindowDimensions(); // Get the screen dimensions
    const isLandscape = width > height; // Determine orientation
    const isTablet = width >= 768; // Define a breakpoint for tablets
    const router = useRouter();

    // Set image dimensions based on orientation and device type
    const imageDimensions = isLandscape
        ? { width: 80, height: 60 } // Larger dimensions for landscape
        : { width: 65, height: 50 }; // Requested dimensions for portrait

    return (
        <View>
            <View className="mt-6">
                <Text className='text-base text-slate mb-4' style={{fontFamily: 'roboto-medium'}}>
                    Hi <Text className='text-primary'>{!first_name ? 'Guest' : first_name}</Text>, What's on your mind...?
                </Text>
                <Text className='text-2xl' style={{fontFamily: 'roboto-medium'}}>Categories</Text>
                <FlatList
                    data={category_items}
                    keyExtractor={(item) => item.category_id}
                    renderItem={({ item }) => (
                        <TouchableOpacity className="items-center mt-2 mr-4"
                            onPress={() => router.push(item.link)}
                        >
                            <Image
                                source={item.category_image}
                                style={[imageDimensions]}
                                className="rounded-md border border-[#E2E8F0]"
                            />
                            <Text style={{fontFamily: 'roboto-medium'}} className={`font-medium mt-1 ${isTablet ? 'text-lg' : 'text-sm'}`}>
                                {item.category_text}
                            </Text>
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default Categories;