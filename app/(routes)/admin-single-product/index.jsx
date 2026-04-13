import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/MainHeader';
import useApi from '../../../hook/useApi';
import { toast } from '../../../utils/toast';
import ProductsSingleCard from './ProductsSingleCard';

const index = () => {
    const params = useLocalSearchParams();

    const [opendeleteproduct, setOpenDeleteProduct] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const itemWidth = screenWidth * 0.2;
    const productImages = Array.isArray(params.product_images) ? params.product_images : [];
    const productSizes = Array.isArray(params.product_sizes) ? params.product_sizes : [];
    const productColors = Array.isArray(params.product_colors) ? params.product_colors : [];

    const isStorePublished = params.active_status === true || params.active_status === 1 || params.active_status === 'true';

    const productData = [
        { label: 'Product name', value: params.product_name },
        { label: 'Product category', value: params.product_category },
        { label: 'Product price', value: `K${params.product_actual_price}` },
        { label: 'Product description', value: params.product_description },
    ];

    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const isPublished = params.product_status === true || params.product_status === 1 || params.product_status === 'true';
    const isAvailable = params.is_available === true || params.is_available === 1 || params.is_available === 'true';
    const [activeStatus, setActiveStatus] = useState(isPublished);
    const [availableStatus, setAvailableStatus] = useState(isAvailable);
    const [lastToggledStatus, setLastToggledStatus] = useState(null);


    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState('');

    const {
        data: publishResponse,
        isLoading,
        error,
        patch: publishProduct
    } = useApi(`/products/update/`);

    const {
        data: deleteResponse,
        isLoading: delLoading,
        error: delError,
        post: deleteProduct
    } = useApi(`/products/delete/`);

    const handlePublishProduct = () => {
        if (!isStorePublished) return;
        const toggledStatus = !activeStatus;

        publishProduct({
            product_id,
            product_status: toggledStatus,
            unpublish: !toggledStatus,
        });

        setLastToggledStatus(toggledStatus);
        setActiveStatus(toggledStatus);
    };

    const setMarkProductAvailable = () => {
        if (!isStorePublished) return;
        const toggledStatus = !availableStatus;

        publishProduct({
            product_id,
            is_available: toggledStatus,
            mark_unavailable: !toggledStatus,
        });

        setLastToggledStatus(toggledStatus);
        setAvailableStatus(toggledStatus);
    };

    const handleDeleteProduct = () => {
        if (!store_id || !product_id || !store_category) {
            toast.error('Delete Failed, Missing data');
            return;
        }
        deleteProduct({ product_id, store_id, store_category });
    };

    useEffect(() => {
        if (publishResponse?.message) {
            const isSuccess = publishResponse.success;
            const message =
                lastToggledStatus === true
                    ? 'Product published successfully.'
                    : 'Product unpublished successfully.';

            if (!isSuccess) {
                toast.error(`Update Failed, ${publishResponse.message}`);
            } else {
                toast.success(message);
                setIsRedirecting(true);
                // setTimeout(() => onClose(), 5000);
            }
        }
    }, [publishResponse]);

    useEffect(() => {
        if (!deleteResponse) return;

        if (deleteResponse?.json?.success) {
            toast.success(deleteResponse.json.message);
            setTimeout(() => onClose(), 3000);
        } else if (deleteResponse?.json?.message) {
            toast.error(deleteResponse.json.message);
        } else if (deleteResponse?.Response) {
            toast.error(deleteResponse.Response);
        } else {
            toast.error('Delete Failed, Unknown error');
        }
    }, [deleteResponse]);

    const openModal = (type) => {
        setActionType(type);
        setModalVisible(true);
    };
    
    const closeModal = () => {
        setModalVisible(false);
        setActionType('');  //Reset the action type
    };

    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <MainHeader textStyles='text-2xl' header_name='Dashboard' fontFamily='outfit-medium'/>
            <ProductsSingleCard
                product_id={params.product_id}
                product_image={params.product_image}
                product_images={params.product_images}
                product_name={params.product_name}
                product_description={params.product_description}
                product_actual_price={params.product_actual_price}
                product_status={params.product_status}
                store_name={params.store_name}
                store_id={params.store_id}
                store_category={params.store_category}
                product_category={params.product_category}
                product_colors={params.product_colors}
                product_sizes={params.product_sizes}
                chili_option={params.chili_option}
                product_extras_status={params.product_extras_status}
                store_profileimage={params.store_profileimage}
                handleCheckboxChange={params.handleCheckboxChange}
                selectedItems={params.selectedItems}
                active_status={params.active_status}
                is_available={params.is_available}
                group_id={params.group_id}
                group_name={params.group_name}
                variant_is_required={params.variant_is_required}
                variant_multi_select={params.variant_multi_select}
                variant_options={params.variant_options}
                visible={modalVisible}
                onClose={closeModal}
                actionType={actionType}
            />
        </SafeAreaView>
    );
};

export default index;