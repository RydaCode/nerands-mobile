import { Fontisto } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import AllProductsCard from './AllProductsCard';
import LoadingItems from './LoadingItems';

const AllProducts = ({ store_data, store_id, category }) => {
    const [productsList, setProductsList] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const loadingMoreRef = useRef(false);
    const { get, isLoading, error } = useApi(null);

    // Fetch products
    const fetchProducts = useCallback(async (reset = false) => {
        if (loadingMoreRef.current) return;

        loadingMoreRef.current = true;
        if (reset) setIsRefreshing(true);

        try {
            const nextPage = reset ? 1 : page + 1;
            const res = await get(`/products/category?cat_name=${category}&store_id=${store_id}&page=${nextPage}&limit=10`);
            const newData = Array.isArray(res?.data?.products) ? res.data.products : [];

            setProductsList(prev => reset ? newData : [...prev, ...newData]);
            setPage(nextPage);
            setHasMore(nextPage < (res?.data?.pagination?.pages || 0));
        } catch (err) {
            console.warn('Failed to fetch products:', err);
            toast.info('Failed to fetch products');
        } finally {
            loadingMoreRef.current = false;
            if (reset) setIsRefreshing(false);
        }
    }, [category, store_id, page, get]);

    useEffect(() => {
        fetchProducts(true);
    }, [category, store_id]);

    if (isLoading && productsList.length === 0) {
        return (
            <LoadingItems
                mainStyles='mt-24'
                textStyles='text-base text-slate'
                indicatorSize={50}
                indicatorTitle='Loading Products...'
            />
        );
    }

    return (
        <FlatList
            data={productsList}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={({ item }) => <AllProductsCard store_data={store_data}  item={item} />}
            onEndReached={() => {
                if (hasMore && !loadingMoreRef.current) {
                    fetchProducts(false);
                }
            }}
            onEndReachedThreshold={0.5}
            refreshing={isRefreshing}
            onRefresh={() => fetchProducts(true)}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
                isLoadingMore ? (
                <ActivityIndicator size={30} color={COLORS.primary} />
                ) : null
            }
            ListEmptyComponent={
                <View style={{ alignItems: 'center', marginTop: 100 }}>
                    <Fontisto name="shopping-bag-1" size={50} color={COLORS.green1} />
                    <Text className='text-base text-slate mt-2' style={{fontFamily: 'roboto-medium'}}>
                        <Text>No Products Found In This Store</Text>
                    </Text>
                </View>
            }
        />
    );
};

export default AllProducts;