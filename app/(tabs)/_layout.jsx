import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from '../../constants/constants';

const TabsLayout = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.black,
                headerShown: false,
                tabBarLabelStyle: {
                    fontFamily: 'roboto-medium',
                    fontSize: 12
                },

                contentStyle: {
                    paddingBottom: 55 + insets.bottom,
                },

                tabBarStyle: {
                    position: "absolute",
                    height: 55 + insets.bottom,
                    paddingBottom: insets.bottom,

                    backgroundColor: "transparent", // IMPORTANT

                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,

                    borderWidth: 0,
                    elevation: 0,
                },

                tabBarBackground: () => (
                    <View
        style={{
            flex: 1,
            backgroundColor: "white",

            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,

            borderWidth: 1,
            borderColor: COLORS.lavender,

            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -4 },

            elevation: 12,
        }}
    />
                ),
            }}
        >
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