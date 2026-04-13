import { Redirect, Stack } from 'expo-router';
import { useSelector } from 'react-redux';

const RoutesLayout = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    console.log(isAuthenticated)

    // 🔐 AUTH GATE
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Protected routes goes here
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='home-single-store'/>
            <Stack.Screen name='cart'/>
            <Stack.Screen name='preparing-order'/>
            <Stack.Screen name='stores-menu-items'/>
            <Stack.Screen name='products-menu-items'/>
            <Stack.Screen name='hotels-menu-items'/>
            <Stack.Screen name='create-store'/>
            <Stack.Screen name='other-stores-single'/>
            <Stack.Screen name='parcels-menu-items'/>
            <Stack.Screen name='hotels-single'/>
            <Stack.Screen name='book-hotel-room'/>
            <Stack.Screen name='user-account'/>
            <Stack.Screen name='admin-stores'/>
            <Stack.Screen name='admin-store-single'/>
            <Stack.Screen name='edit-stores/edit-stores-others'/>
            <Stack.Screen name='edit-product/edit-product-others'/>
        </Stack>
    )
}

export default RoutesLayout