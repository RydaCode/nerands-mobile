import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, View } from 'react-native'
// import FashionCosmeticsProducts from '../../../components/create-product-components/FashionCosmeticsProducts'
// import RestaurantProducts from '../../../components/create-product-components/RestaurantProducts'
// import LiquorProducts from '../../../components/create-product-components/LiquorProducts'
// import GroceriesProducts from '../../../components/create-product-components/GroceriesProducts'
import { COLORS } from '../../../constants/constants'
import CreateProductCard from './cards/CreateProductCard'

const index = () => {
    const params = useLocalSearchParams();
        
    return (
        <>
            <View className='flex-1 bg-white items-center'>
                <CreateProductCard params={params}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
    },
    pickerItem: {
        color: COLORS.slate,
        fontSize: 13,
        fontFamily: 'robotot-medium',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'robotot-medium'
    },
});

export default index