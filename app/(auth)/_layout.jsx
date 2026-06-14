import { Stack } from 'expo-router';

const RoutesLayout = () => {
    
    // Protected routes goes here
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='index'/>
            <Stack.Screen name='login'/>
            <Stack.Screen name='register'/>
            <Stack.Screen name='otherinputs'/>
            <Stack.Screen name='otpauth'/>
            <Stack.Screen name='personaldetails'/>
            <Stack.Screen name='onboardscreen2'/>
        </Stack>
    )
}

export default RoutesLayout