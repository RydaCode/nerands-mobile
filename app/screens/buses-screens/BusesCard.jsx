// import { View, Text, Image, FlatList } from 'react-native'
// import { TouchableOpacity } from 'react-native'
// import { COLORS, SIZES } from '../../../constants/constants'
// import { FontAwesome } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import buses from '../../../constants/buses'

// const OrdersData = ({ buses, router }) => (
//     <TouchableOpacity
//         onPress={() => router.push({pathname: '../(routes)/user-orders/single-user-order/'})}
//         className='flex-row justify-between items-center'
//     >
//         <View className='flex-row justify-start items-center'>
//             <Image
//                 source={buses.image}
//                 style={{borderRadius: SIZES.radius}} className='h-[65px] w-[26%]'
//             />
//             <View className='w-[71.7%] flex-row ml-2 justify-between items-center'>
//                 <View className='w-full'>
//                     <View className=''>
//                         <Text className='text-md' style={{fontFamily: 'maven-bold'}}>{buses.bus_company}</Text>
//                         <View>
//                             <Text className='text-sm text-slate' style={{fontFamily: 'maven-medium'}}>{buses.desc}</Text>
//                         </View>
//                     </View>
//                     <View className='flex-row justify-between items-center'>
//                         <View>
//                             <Text className='text-md text-primary' style={{fontFamily: 'maven-bold'}}>23 Routes</Text>
//                         </View>
//                         <View className='flex-row px-2 py-0.5 items-center bg-green2 justify-center'>
//                             <Text className='text-white text-sm' style={{fontFamily: 'maven-medium'}}>Active</Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     </TouchableOpacity>
// )

// const BusesCard = () => {
//     const router = useRouter();
//     return (
//         <View className='pb-20'>
//             <FlatList
//                 data={buses}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({item}) => (
//                     <>
//                         <OrdersData buses={item} router={router}/>
//                         <View className='w-full my-5 rounded-full bg-slate opacity-10 h-[1px]'/>
//                     </>
//                 )}

//                 ListHeaderComponent={() => (
//                     <View className='w-full items-center justify-center mb-8'>
//                         <Text className='text-md text-slate' style={{fontFamily: 'maven-medium'}}>There are 7 buses in this category</Text>
//                     </View>


//                 )}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     )
// }

// export default BusesCard