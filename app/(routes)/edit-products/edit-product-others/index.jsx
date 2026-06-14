import { useLocalSearchParams } from 'expo-router';
import EditProductForm from '../../../../components/edit-content/edit-products-forms/EditProductForm';

const index = () => {
    const params = useLocalSearchParams();
    return (
        <EditProductForm
            store_id={params.store_id}
            product_id={params.product_id}
            product_image={params.product_image}
            product_name={params.product_name}
            product_description={params.product_description}
            product_price={params.product_price}
            product_status={params.product_status}
            store_name={params.store_name}
            store_category={params.store_category}
            product_category={params.product_category}
            product_extras_status={params.product_extras_status}
            store_profileimage={params.store_profileimage}
            router={params.router}
        />
    )
}

export default index