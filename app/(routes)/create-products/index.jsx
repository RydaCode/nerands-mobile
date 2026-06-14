import { useLocalSearchParams } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Headers from '../../../components/Headers'
import CreateProductCard from './cards/CreateProductCard'

const index = () => {
    const params = useLocalSearchParams();
        
    return (
        <SafeAreaView className='flex-1 bg-white items-center px-4'>
            <Headers fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Create Product' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <CreateProductCard params={params}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default index