// import { View, Text, TouchableOpacity, Image } from 'react-native'
// import React from 'react'
// import { SIZES, COLORS } from '../../../../constants/constants'
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

// const MotelsCard = ({hotel_name, description, hotel_image, latitude, longitude, router}) => {
//     return (
//         <TouchableOpacity
//             // onPress={() => router.push(route_name)}
//             activeOpacity={0.7}
//             className='h-[180px] w-[48.5%] mb-16 items-center justify-center relative'
//         >
//             <View className='h-[100%] w-[100%] '>
//                 <Image resizeMode='cover' className='h-[100%] w-[100%]' source={hotel_image}/>
//             </View>
//             <View className='w-[100%] '>
//                 <Text className='font-bold' style={{fontFamily: 'maven-medium', fontSize: SIZES.medium, color: COLORS.black}}>{hotel_name}</Text>
//             </View>
//             <View className='w-full flex-row items-center mt-2' >
//                 <View className='flex-row items-center justify-start'>
//                     <View className='flex-row gap-1' style={{flexDirection: 'row',}}>
//                         <Ionicons name="star" size={12} style={{color: COLORS.grey }} />
//                         <Ionicons name="star" size={12} style={{color: COLORS.slate }} />
//                         <Ionicons name="star" size={12} style={{color: COLORS.green1 }} />
//                         <Ionicons name="star" size={12} style={{color: COLORS.green2 }} />
//                         <Ionicons name="star" size={12} style={{color: COLORS.red}} />
//                     </View>
//                 </View>
//                 <View className='h-[5px] w-[5px] justify-center mx-3'  style={{backgroundColor: COLORS.slate, borderRadius: SIZES.round}} />
//                 <View className='flex-row items-center justify-center mr-1' >
//                     <Ionicons name='location-outline' color={COLORS.slate} size={11} />
//                     <Text style={{ fontFamily: 'maven-medium', fontSize: SIZES.small, color: COLORS.slate }} >1.5km</Text>
//                 </View>
//             </View>
//             <TouchableOpacity className='absolute h-[30px] w-[30px] -top-2 right-2 items-center justify-center' style={{backgroundColor: COLORS.white, borderRadius: SIZES.round}}>
//                 <MaterialCommunityIcons color={COLORS.primary} name='heart-outline' size={20} />
//             </TouchableOpacity>
//         </TouchableOpacity>
//     )
// }

// export default MotelsCard