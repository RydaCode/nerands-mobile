// import { View, Text, ScrollView } from 'react-native'
// import React from 'react'
// import { useRouter } from 'expo-router'
// import LodgesCard from './cards/LodgesCard'
// import store_data from '../../../constants/store_data'

// const Lodges = () => {
//     const router = useRouter();
//     return (
//         <ScrollView showsVerticalScrollIndicator={false}>
//             <View className='px-2 pb-10'>
//                 <Text className='mt-5' style={{fontFamily: 'maven-medium'}}>Lodges</Text>
//                 <View className='w-full flex-row flex-wrap items-center justify-between'>
//                     {store_data.map((hotel) => (
//                         <LodgesCard
//                             key={hotel.id}
//                             hotel_name={hotel.name}
//                             description={hotel.desc}
//                             hotel_image={hotel.image}
//                             latitude='15.21358'
//                             longitude='25.32658'
//                             router={router}
//                         />
//                     ))}
//                 </View>
//             </View>
//         </ScrollView>
//     )
// }

// export default Lodges