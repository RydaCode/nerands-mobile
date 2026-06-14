import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
        category_id: '2',
        category_image: Carticons.groceries,
        category_text: 'Custom Order',
        link: '../(routes)/custom-order-menu-items/'
    },
    {
        category_id: '3',
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
        category_id: '5',
        category_image: Carticons.rea_estate,
        category_text: 'Real Estate',
        link: '../(routes)/real-estate/'
    },
    {
        category_id: '6',
        category_image: Carticons.hotels,
        category_text: 'Hotels & Lodges',
        link: '../(routes)/hotels-menu-items/'
    },
    {
        category_id: '7',
        category_image: Carticons.buses,
        category_text: 'Buses',
        link: '../(routes)/buses/'
    },
];

const Categories = () => {
    const { user_id, first_name  } = useSelector((state) => state.auth);
    const { width, height } = useWindowDimensions(); // Get the screen dimensions
    const isLandscape = width > height; // Determine orientation
    const isTablet = width >= 768; // Define a breakpoint for tablets
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    const getTimeOfDay = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "morning";
        if (hour < 18) return "afternoon";
        return "evening";
    };

    const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

    // Set image dimensions based on orientation and device type
    const imageDimensions = isLandscape
        ? { width: 80, height: 60 } // Larger dimensions for landscape
        : { width: 65, height: 50 }; // Requested dimensions for portrait

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeOfDay(getTimeOfDay());
        }, 60000); // every 1 min

        return () => clearInterval(interval);
    }, []);

    const greeting = `Good ${timeOfDay}`;
    const name = first_name || "Guest";

    const getPersonalizedGreeting = () => {
        const name = first_name || "Guest";

        if (timeOfDay === "morning") {
            return {
                text: "Good morning",
                sub: "What would you like to explore today?"
            };
        }

        if (timeOfDay === "afternoon") {
            return {
                text: "Good afternoon",
                sub: "What are you in the mood for this afternoon?"
            };
        }

        return {
            text: "Good evening",
            sub: "Relax and explore something new on Nerands"
        };
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const { text, sub } = getPersonalizedGreeting();

    return (
        <View>
            <View className="mt-6">
                <Animated.View className='rounded mb-8'>
                    <Animated.Text
                        style={{ opacity: fadeAnim, fontFamily: 'roboto-medium' }}
                        className="text-base text-slate mb-1"
                    >
                        {text},{' '}
                        <Text className="text-primary">{first_name || "Guest"}</Text>
                    </Animated.Text>
                    <Text className="text-sm text-green1"
                        style={{fontFamily: 'roboto-medium'}}
                    >
                        {sub}
                    </Text>
                </Animated.View>

                <Text className='text-2xl' style={{fontFamily: 'roboto-medium'}}>Explore</Text>
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