// import { useState } from 'react';
// import { View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MainHeader from '../../../../components/MainHeader';
// import ProductsTabs from './ProductsTabs';
// import AllProducts from './tabs/all-products/AllProducts';

// const Products = () => {
//     const tabs = ['All', 'Fashion', 'Cosmetics', 'Electronics'];
//     const [activeTab, setActiveTab] = useState(tabs[0]);

//     const DisplayTabContent = () => {
//         switch (activeTab) {
//             case 'All': return <AllProducts title='All Products'/>
//             default:
//             break;
//         }
//     }
//     return (
//         <SafeAreaView className='flex-1 bg-white'>
//             <View className='w-full px-2'>
//                 <MainHeader header_name='Products' />
//             </View>
//             <View className='w-full'>
//                 <ProductsTabs
//                     tabs={tabs}
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                 />
//             </View>
//             <View className='flex-1 w-full'>
//                 {DisplayTabContent()}
//             </View>
//         </SafeAreaView>
//     )
// }

// export default Products