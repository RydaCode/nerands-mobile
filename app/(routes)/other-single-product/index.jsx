import { useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import OtherProductsSingleCard from '../../screens/other-single-product/OtherProductsSingleCard';

const ProductScreen = () => {
    const params = useLocalSearchParams();

    
    // Create a "data" array with a single item just to use FlatList
    const data = [1];
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-2">
                <MainHeader
                    header_name={params.store_name}
                    fontFamily="maven-medium"
                    textStyles="text-2xl"
                />
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View className="mt-4 w-full justify-center items-center">
                            <OtherProductsSingleCard
                                product_id={params.product_id}
                                product_image={params.product_image}
                                product_name={params.product_name}
                                product_description={params.product_description}
                                product_price={params.product_price}
                                product_status={params.product_status}
                                store_name={params.store_name}
                                store_id={params.store_id}
                                business_id={params.business_id}
                                store_phone_num={params.store_phone_num}
                                store_category={params.store_category}
                                product_category={params.product_category}
                                store_profileImage={params.store_profileImage}
                                store_location={params.store_location}
                                variant_groups={JSON.parse(decodeURIComponent(params.variant_groups))}
                                markup_percent={params.markup_percent}
                                final_price={params.final_price}
                            
                            />
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    );
};

export default ProductScreen;