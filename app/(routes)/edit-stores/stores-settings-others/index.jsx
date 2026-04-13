import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../../components/MainHeader';
import { COLORS } from '../../../../constants/constants';
import { STORES_IMAGE_URI } from '../../../../RequestMethods';
import StoreSettingsCard from './StoreSettingsCard';

const index = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // const { displayCurrentLocation, locationServicesEnabled } = useLocation();
    // Use useSelector to get location data from Redux store
    const { latitude, longitude, displayCurrentLocation, locationServicesEnabled } = useSelector(state => state.location);
    return (
        <SafeAreaView className='flex-1 bg-white items-center'>
            <View className='px-4'>
                <MainHeader fontFamily='ubuntu-medium' textStyles='text-2xl' header_name='Dashboard' />
            </View>
            <MotiView className='px-4 mt-5 w-full items-center'
                from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                transition={{ duration: 1000 }}
            >
                <View className='w-full justify-center items-center'>
                    <View style={{height: 80, width: 80}} className='rounded-full border-2 border-lavender'>
                        <Image className='h-full w-full rounded-full border-2 border-white'
                            source={{uri: `${STORES_IMAGE_URI}${params.store_profileimage}`}}/>
                    </View>
                    <Text className='text-xl mb-2' style={{fontFamily: 'roboto-medium'}}>{params.store_name}</Text>
                    <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium'}}>{params.store_description}</Text>
                    <View className='items-center justify-center mt-10 w-full'>
                        <View className='justify-center items-center w-full'>
                            <Text className='text-lg '>Store Current Location:</Text>
                        </View>
                        <View className='flex-row justify-center items-center'>
                            <Ionicons name='location-sharp' size={14} color={COLORS.red } />
                            <Text className='text-sm text-black ml-1' style={{fontFamily: 'roboto'}}>Commonwealth road</Text>
                        </View>
                    </View>
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
            </MotiView>
            <StoreSettingsCard router={router} params={params} />
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

export default index;