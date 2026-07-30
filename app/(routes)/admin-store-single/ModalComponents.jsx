import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DeleteProductOthers from '../../../components/delete-content/delete-product-others/DeleteProductOthers';
import PublishProductOthers from '../../../components/publish-content/publish-product/PublishProductOthers';
import ProductDashBoard from '../edit-products/ProductDashBoard';

const ModalComponents = ({ visible, onClose, actionType, productDetails }) => {
    
    const RenderActionContent = () => {
        switch (actionType) {
            case 'delete':
                return (
                    <View className='w-full justify-center items-center'>
                        <Text className='text-lg mt-4' style={{fontFamily: 'maven-bold'}}>{productDetails?.product_name}</Text>
                        <DeleteProductOthers
                            onClose={onClose}
                            product_id={productDetails.product_id}
                            store_id={productDetails.store_id}
                        />
                    </View>
                );
            case 'edit':
                return (
                    <ProductDashBoard
                        onClose={onClose}
                        product_id={productDetails.product_id}
                        product_image={productDetails.product_image}
                        product_images={productDetails.product_images}
                        product_name={productDetails.product_name}
                        product_description={productDetails.product_description}
                        product_actual_price={productDetails.product_actual_price}
                        product_status={productDetails.product_status}
                        store_name={productDetails.store_name}
                        store_id={productDetails.store_id}
                        product_category={productDetails.product_category}
                        actionType={actionType}
                        product_colors={productDetails.product_colors}
                        product_sizes={productDetails.product_sizes}
                        store_category={productDetails.store_category}
                        store_profileimage={productDetails.store_profileimage}
                        active_status={productDetails.active_status}
                        is_available={productDetails.is_available}
                    />
                )
            case 'publish':
                return (
                    <View className='w-full justify-center items-center'>
                        <Text className='text-lg mt-4' style={{fontFamily: 'maven-bold'}}>{productDetails?.product_name}</Text>
                        <PublishProductOthers
                            onClose={onClose}
                            product_id={productDetails.product_id}
                            product_image={productDetails.product_image}
                            product_name={productDetails.product_name}
                            product_description={productDetails.product_description}
                            product_actual_price={productDetails.product_actual_price}
                            product_status={productDetails.product_status}
                            store_name={productDetails.store_name}
                            store_id={productDetails.store_id}
                            actionType={actionType}
                        />
                    </View>
                );
            case 'markavailable':
                return (
                    <View className='w-full justify-center items-center'>
                        <Text className='text-lg mt-4' style={{fontFamily: 'maven-bold'}}>{productDetails?.product_name}</Text>
                        <MarkAsAvailable
                            onClose={onClose}
                            product_id={productDetails.product_id}
                            product_image={productDetails.product_image}
                            product_name={productDetails.product_name}
                            product_description={productDetails.product_description}
                            product_actual_price={productDetails.product_actual_price}
                            product_status={productDetails.product_status}
                            store_name={productDetails.store_name}
                            store_id={productDetails.store_id}
                            actionType={actionType}
                        />
                    </View>
                );
            default:
            return <Text>Invalid Action</Text>;
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={visible}
            onRequestClose={onClose} //Trigger `onClose` to close the modal
        >
            <Pressable
                style={styles.pressableOverlay}
                onPress={onClose} //Close modal on overlay press
            />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {RenderActionContent()}
                </View>
            </View>
        </Modal>
    );
};

//Styles for the Modal
const styles = StyleSheet.create({
    pressableOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '100%', //Keeping width as 100%
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden', //Ensures rounded corners work correctly
        shadowOpacity: 0.25,
        shadowRadius: 4,
    }
});

export default ModalComponents;