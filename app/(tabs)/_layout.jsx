import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/constants';

const TabsLayout = () => {

    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.black,
            headerShown: false,
            tabBarLabelStyle: {fontFamily: 'roboto-medium', fontSize: 12},
            tabBarStyle: {
                // elevation: 6, // Removes elevation (Android)
                // backgroundColor: COLORS.grey_bg,


                // 👇 Rounded container
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderTopColor: COLORS.lavender,
                borderLeftColor: COLORS.lavender,
                borderRightColor: COLORS.lavender,

                // 👇 Shadow (iOS)
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                height: 55,
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={23} name="home" color={color} />
                }}
            />
            <Tabs.Screen
                name="foods"
                options={{
                    title: 'Foods',
                    tabBarIcon: ({ color }) => <Ionicons name="restaurant" color={color} size={20} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color }) => <Entypo size={20} name="box" color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color }) => <Entypo size={23} name="heart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="dots-grid" size={23} color={color} />,
                    // tabBarIcon: ({ color }) => <Entypo size={23} name="menu" color={color} />,
                }}
            />
        </Tabs>
    );
}
export default TabsLayout;