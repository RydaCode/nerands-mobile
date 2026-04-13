import { View, Text, Image, useWindowDimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { COLORS, SIZES } from '../../constants/constants';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HotelRoomSingleCard = ({ id, image, name, desc }) => {
        // Get the window dimensions for responsiveness
        const { width, height } = useWindowDimensions();

        // Make the image height and width responsive based on the screen size
        const imageWidth = width * 0.25;
        const imageHeight = height * 0.10;

        const router = useRouter();

    return (
        <View className='bg-white w-full justify-center items-center pb-10 pt-10'>
            <View className='w-full'>
                <View className='w-full h-96 justify-center items-center'>
                    <Image source={image} resizeMode='containe' className='h-full w-full' />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{width: '100%'}}>
                    <View className='w-full flex-row justify-center items-center mt-1'>
                        <View
                            className='mr-2'
                            style={{
                                borderWidth: 2, borderColor: COLORS.lavender, borderRadius: SIZES.border,
                                height: imageHeight, // Adjust image height dynamically
                                width: imageWidth, // Maintain aspect ratio
                            }}
                        >
                            <Image source={image} resizeMode='containe' className='h-full w-full' style={{borderRadius: SIZES.border, borderWidth: 2, borderColor: COLORS.white}} />
                        </View>
                        <View
                            className='mr-2'
                            style={{
                                borderWidth: 2, borderColor: COLORS.lavender, borderRadius: SIZES.border,
                                height: imageHeight, // Adjust image height dynamically
                                width: imageWidth, // Maintain aspect ratio
                            }}
                        >
                            <Image source={image} resizeMode='containe' className='h-full w-full' style={{borderRadius: SIZES.border, borderWidth: 2, borderColor: COLORS.white}} />
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View className='w-full mt-5'>
                <Text style={{fontSize: 28, fontFamily: 'maven-medium'}} className='font-semibold text-xl'>Room 6</Text>
                <View className='w-full flex-row justify-between items-center'>
                    <Text style={{fontSize: 25}} className='font-bold text-lg mt-2 text-primary'>K600</Text>
                    <View className='py-2 w-[50%] rounded-full bg-primary px-5 justify-center items-center'>
                        <Text style={{fontSize: 14}} className='font-semibold text-white'>Free Break Fast</Text>
                    </View>
                </View>
            </View>
            
            <View className='mt-5 w-full'>
                <Text style={{fontSize: 20, fontFamily: 'maven-medium'}} className='font-semibold text-xl'>Room Description</Text>
                <Text className='mt-1 text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>The item is of good quality, Its a long lasting product.
                You wont go wrong if you try this out.
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{width: '100%'}} >
                <View className='w-full flex-row justify-start items-center mt-10'>
                    <View className='flex-row justify-start items-center'>
                        <FontAwesome name='bed' size={20} />
                        <Text className='ml-[0.5] text-slate text-sm'> Double</Text>
                    </View>
                    <View className='flex-row justify-start items-center ml-4'>
                        <FontAwesome name='bath' size={16} />
                        <Text className='ml-[0.5] text-slate text-sm'> Bathtab</Text>
                    </View>
                    <View className='flex-row justify-start items-center ml-4'>
                        <FontAwesome name='shower' size={14} />
                        <Text className='ml-[0.5] text-slate text-sm'> Shower</Text>
                    </View>
                </View>
            </ScrollView>

            <View className='w-full mt-6'>
                <Text className='font-semibold' style={{fontFamily: 'maven-medium'}}>Available Meals:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                <View className='w-full flex-row justify-start items-center mt-2'>
                    <TouchableOpacity className='bg-grey_bg px-4 p-1 rounded-full'>
                        <Text className='text-slate'>Lunch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-grey_bg px-4 p-1 rounded-full ml-4'>
                        <Text className='text-slate'>Break Fast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-grey_bg px-4 p-1 rounded-full ml-4'>
                        <Text className='text-slate'>Lunch</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>

            <View className='w-full flex-row justify-between items-center mt-10'>
                <Text className='text font-semibold'>Number of beds: 3</Text>
                <Text className='text font-semibold'>Room type: High Class</Text>
            </View>

            <View className='w-full flex-row justify-between items-center mt-10'>
                <View className='w-[48%] bg-grey_bg rounded-full p-1 justify-center items-center'>
                    <Text className='text-slate text-sm'>Available</Text>
                </View>
                <View className='w-[48%] p-1 flex-row justify-center items-center bg-grey_bg rounded-full'>
                    <FontAwesome5 name='eye' />
                    <View className='ml-2'>
                        <Text className='text-slate text-sm'>Today: 300 Views</Text>
                    </View>
                </View>
            </View>

            <View className='w-full mt-8'>
                <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>
                    From the below buttons, you can book or reserve this room. Make sure to adjust the number of days you would love to stay in the room.
                </Text>
            </View>

            <View className='mt-4 flex-row justify-between items-center w-full'>
                <View style={{width: '33%'}} className='justify-center items-center'>
                    
                    <View className='flex-row justify-center items-center w-full'>
                        <TouchableOpacity
                            style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                            className='bg-grey_bg px-3 py-2 w-[30px] rounded-full h-[30px] justify-center items-center'
                        >
                            <FontAwesome name="minus" style={{ color: COLORS.black }} />
                        </TouchableOpacity>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={10}
                            editable={false}
                            style={{ textAlign: 'center', fontSize: SIZES.main, color: COLORS.slate, width: '30%' }}
                            value="1"
                        />
                        <TouchableOpacity
                            style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                            className='bg-grey_bg px-3 py-2  w-[30px] rounded-full h-[30px] justify-center items-center'
                        >
                            <FontAwesome name="plus" style={{ color: COLORS.black }} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                    <TouchableOpacity
                        style={{width: '68%', borderRadius: SIZES.radius, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                        className='bg-emerald-400 py-3 justify-center items-center'
                        onPress={() => router.push({pathname: '(routes)/book-hotel-room/', params: {

                        }})}
                    >
                        <Text className='text-white' style={{ fontSize: 16, fontFamily: 'maven-medium', fontWeight: SIZES.h1 }}>Reserve</Text>
                    </TouchableOpacity>
                {/* <View style={{width: '32.5%', borderRadius: SIZES.radius,shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 }} className='bg-primary h-[30px] justify-center items-center'>
                    <TouchableOpacity
                        style={{}}
                        className='h-full w-full justify-center items-center'
                    >
                        <Text className='text-white' style={{ fontSize: 16, fontFamily: 'maven-medium', fontWeight: SIZES.h1 }}>Reserve</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
            <TouchableOpacity
                style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                className='flex-row mt-8 bg-slate py-2 justify-center items-center w-full rounded-full'
            >
                <FontAwesome name='heart' color={COLORS.white} size={19} />
                <Text className='ml-2 text-white' style={{ fontSize: 18, fontFamily: 'maven-medium', fontWeight: SIZES.h1 }}>Add to favorites</Text>
            </TouchableOpacity>
            <View className='mt-5 w-full'>
                <Text className='text-slate text-sm' style={{fontFamily: 'roboto-medium'}}>Copy the link below share this hotel and room number you have booked / reserved with someone you are likely to share this room with. 
                    Please ensure that you are sharing this link with someone you trust.
                </Text>
            </View>

            <View className='mt-8 w-full'>
                <Text className='font-semibold'>Copy link and share:</Text>
            </View>
            <View className='flex-row w-full mt-2 justify-center items-center'>
                <TextInput
                className='border-[1px] border-emerald-400'
                    editable={false}
                    style={{ paddingLeft: 8, fontSize: SIZES.main, color: COLORS.slate, width: '69%' }}
                    value="nerands.com/product/app/"
                />
                <TouchableOpacity
                    style={{shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5}}
                    className='flex-row bg-emerald-400 h-[45px] justify-center items-center w-[30%]'
                >
                    <FontAwesome5 name='copy' size={18} color={COLORS.white} />
                    <Text className='ml-1 text-white font-semibold' style={{fontSize:SIZES.main}}>Copy Link</Text>
                </TouchableOpacity>
            </View>
            <View className='flex-row justify-center items-center mt-5'>
                <View className='flex-row justify-center items-center mr-4'>
                    <FontAwesome5 name='whatsapp' color='#075E54' size={20} />
                    <Text className='ml-1 text-[#075E54] text-sm'>Whatapp</Text>
                </View>
                <View className='flex-row justify-center items-center mr-4'>
                    <FontAwesome5 name='facebook' color='#316FF6' size={20} />
                    <Text className='ml-1 text-[#316FF6] text-sm'>Share</Text>
                </View>
                <View className='flex-row justify-center items-center mr-4'>
                    <FontAwesome5 name='twitter' color='#008AD8' size={20} />
                    <Text className='ml-1 text-[#008AD8] text-sm'>Tweet</Text>
                </View>
                <View className='flex-row justify-center items-center'>
                    <FontAwesome5 name='instagram' color='#4f5bd5' size={20} />
                    <Text className='ml-1 text-[#4f5bd5] text-sm'>Instagram</Text>
                </View>
            </View>
            {/* Next container */}
        </View>
    )
}

export default HotelRoomSingleCard