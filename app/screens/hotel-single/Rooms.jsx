// import { View, Text, FlatList } from 'react-native'
// import store_data from '../../../constants/store_data'
// import HotelsRoomsCard from '../../../components/hotels/HotelsRoomsCard'

// const Rooms = () => {
//     return (
//         <View className='mt-2'>
//             <FlatList
//                 data={store_data}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({item}) => (
//                     <HotelsRoomsCard
//                         id={item.id}
//                         image={item.image}
//                         name={item.name}
//                         desc={item.desc}
//                     />
//                 )}
//                 ListHeaderComponent={() => (
//                     <View>
//                         <View className='mb-4 mt-10 mx-2'>
//                             <Text style={{fontFamily: 'maven-bold'}} className='text-xl'>All Rooms</Text>
//                         </View>
//                     </View>
//                 )}

//                 ListEmptyComponent={() => (
//                     <EmptyState
//                         title='Items founds'
//                         subtitle='Create store'
//                     />
//                 )}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     )
// }

// export default Rooms