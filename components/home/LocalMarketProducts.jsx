import { Text, View } from 'react-native'

const LocalMarketProducts = () => {

    // /* ------------------ INITIAL FETCH / REFRESH ------------------ */
//     const fetchInitialProducts = async (user_id) => {
//         setIsRefreshing(true);
//         loadingMoreRef.current = false;
//         setPage(1);
    
//         try {
//             // Optional parameters
//             const catParam = category ? `&store_category=${encodeURIComponent(category)}` : '';
//             const userParam = user_id ? `&user_id=${encodeURIComponent(user_id)}` : '';
    
//             // Construct URL dynamically
//             const url = `/products/local?page=1&limit=10${catParam}${userParam}`;
    
//             const res = await get(url);
//             const newData = Array.isArray(res?.data?.products) ? res.data.products : [];
    
//             setProductsList(newData);
//             setPage(1);
//             setHasMore(res?.data?.pagination?.page < res?.data?.pagination?.pages);
//         } catch (err) {
//             console.warn('Failed to fetch initial products:', err);
//         } finally {
//             setIsRefreshing(false);
//         }
//     };
    
//     useEffect(() => {
//         fetchInitialProducts(user_id);
//     }, [refreshKey, category, user_id]);
    
//     const onRefresh = async () => {
//         await fetchInitialProducts(user_id);
//     };
    
//     /* ------------------ FETCH MORE PRODUCTS / PAGINATION ------------------ */
//     const fetchMoreProducts = async () => {
//         if (loadingMoreRef.current || !hasMore || isRefreshing) return;
    
//         loadingMoreRef.current = true;
//         setIsLoadingMore(true);
    
//         try {
//             const nextPage = page + 1;
//             // Exclude already fetched products
//             const excludeIds = productsList.map((p) => p.product_id);
//             const excludeParam = excludeIds.length > 0 ? `&excludeIds=${excludeIds.join(',')}` : '';
    
//             // Optional parameters
//             const catParam = category ? `&store_category=${encodeURIComponent(category)}` : '';
//             const userParam = user_id ? `&user_id=${encodeURIComponent(user_id)}` : '';
    
//             // Build URL dynamically
//             const url = `/products/local?page=${nextPage}&limit=10${catParam}${excludeParam}${userParam}`;
    
//             const res = await get(url);
//             const newData = Array.isArray(res?.data?.products) ? res.data.products : [];
    
//             // Append new products to the list
//             setProductsList((prev) => [...prev, ...newData]);
//             setPage(nextPage);
//             setHasMore(res?.data?.pagination?.page < res?.data?.pagination?.pages);
    
//         } catch (err) {
//             console.warn('Failed to fetch more products:', err);
//         } finally {
//             setIsLoadingMore(false);
//             loadingMoreRef.current = false;
//         }
//     };

    return (
        <View>
            <Text>LocalMarketProducts</Text>
        </View>
    )
}

export default LocalMarketProducts