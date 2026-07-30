import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Headers from '../../../../components/Headers';
import { COLORS } from '../../../../constants/constants';
import { STORES_IMAGE_URI } from '../../../../RequestMethods';
import StoreSettingsCard from './StoreSettingsCard';

const Index = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const storeName = params?.store_name ?? "Unknown Store";
    const storeImage = params?.store_profileimage ?? null;
    const storeLocation = params?.store_location ?? 'No location';

    const imageUri =
    storeImage && STORES_IMAGE_URI
        ? `${STORES_IMAGE_URI}${storeImage}`
        : null;
    
    // const { displayCurrentLocation, locationServicesEnabled } = useLocation();
    // Use useSelector to get location data from Redux store
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location) ?? {};
    return (
        <SafeAreaView className='flex-1 justify-between px-2 bg-white'>
            <View className=''>
                <Headers
                    header_name='Branch Dashboard'
                    fontFamily='outfit-medium'
                    textStyles='text-2xl'
                    icon={
                        <FontAwesome5 name="store-alt" size={15} color={'#54C571'} />
                    }
                />
            </View>
            <View className='w-full justify-center items-center'>
                <View style={{height: 70, width: 70}} className='rounded-full justify-center items-center bg-grey_bg border-2 border-lavender'>
                    {imageUri ? (
                        <Image
                            className='h-full w-full rounded-full border-2 border-white'
                            source={{ uri: imageUri }}
                        />
                    ) : (
                        <FontAwesome5 name='store-alt' size={20} color={COLORS.slate}/>
                    )}
                </View>
                <Text className='text-xl' style={{fontFamily: 'roboto-medium'}}>{storeName}</Text>
                <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>{storeLocation}</Text>
                
                <View className='items-center justify-center my-6 w-full'>
                    <View className='justify-center items-center w-full'>
                        <Text className='text-lg '>Your Current Location:</Text>
                    </View>
                    <View className='flex-row justify-center items-center'>
                        <Ionicons name='location-sharp' size={14} color={COLORS.red } />
                        <Text className='text-sm text-black ml-1' style={{fontFamily: 'roboto'}}>{displayCurrentLocation}</Text>
                    </View>
                </View>
            </View>
            <View
                className=''
            >
                <StoreSettingsCard router={router} params={params} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Index;