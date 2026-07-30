import { MotiView } from 'moti';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import CreateProductBtn from './cards/CreateProductBtn';
import DeleteAllProductsModal from './cards/DeleteAllProductsModal';
import DeleteStoreModal from './cards/DeleteStoreModal';
import EditStoresOthers from './cards/EditStoresOthers';
import OpenCloseStore from './cards/OpenCloseStore';
import PublishStoreBtn from './cards/PublishStoreBtn';
import SearchAdmin from './cards/SearchAdmin';
import StoreExtras from './cards/StoreExtras';
import StoreHours from './cards/StoreHours';
import StoreVariants from './cards/StoreVariants';
import UpdateStoreLocationBtn from './cards/UpdateStoreLocationBtn';
import UpdateStoreProfileImageOthers from './cards/UpdateStoreProfileImageOthers';
import ViewAdmins from './cards/ViewAdmins';

const StoreSettingsCard = ({ params, router }) => {
    const [publishStoremodalVisible, setPublishStoreModalVisible] = useState(false);
    const [updateStoreLocationModalVisible, setUpdateStoreLocationModalVisible] = useState(false);
    const [deleteAllProductsModalVisible, setDeleteAllProductsModalVisible] = useState(false);
    const [deleteStoreModalVisible, setDeleteStoreModalVisible] = useState(false);
    const [openStoreModalVisible, setOpenStoreModalVisible] = useState(false);
    const [editstorelistmodalvisible, setEditStoreListModalVisible] = useState(false)
    const [stroeextrastmodalvisible, setStoreExtrasModalVisible] = useState(false)
    const [storeVariantstmodalvisible, setStoreVariantsModalVisible] = useState(false)

    const settingsCards = [
        { Component: CreateProductBtn, props: { router, params } },
        { Component: SearchAdmin, props: { router, params } },
        { Component: ViewAdmins, props: { router, params } },
        { Component: OpenCloseStore, props: { router, params, openStoreModalVisible, setOpenStoreModalVisible } },
        { Component: EditStoresOthers, props: { router, params, editstorelistmodalvisible, setEditStoreListModalVisible } },
        { Component: PublishStoreBtn, props: { router, params, publishStoremodalVisible, setPublishStoreModalVisible } },
        { Component: UpdateStoreProfileImageOthers, props: { router, params } },
        { Component: StoreHours, props: { router, params } },
        { Component: UpdateStoreLocationBtn, props: { router, params, updateStoreLocationModalVisible, setUpdateStoreLocationModalVisible } },
        { Component: DeleteAllProductsModal, props: { router, params, deleteAllProductsModalVisible, setDeleteAllProductsModalVisible } },
        { Component: DeleteStoreModal, props: { router, params, deleteStoreModalVisible, setDeleteStoreModalVisible } },
    ];

    // Only add this if condition is met
    if (params.store_category === 'restaurant' || params.store_category === 'liquor' || params.store_category === 'fast_foods') {
        settingsCards.splice(1, 0, {
            Component: StoreExtras,
            props: {
                router,
                params,
                stroeextrastmodalvisible,
                setStoreExtrasModalVisible
            }
        });
    }

    // Only add this if condition is met
    if (params.store_category !== 'local_market') {
        settingsCards.splice(1, 0, {
            Component: StoreVariants,
            props: {
                router,
                params,
                storeVariantstmodalvisible,
                setStoreVariantsModalVisible
            }
        });
    }

    return (
        <ScrollView showsHorizontalScrollIndicator={false}>
            <MotiView
                from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                transition={{ duration: 1000 }}
                className='flex-1 justify-end'
            >
                <View className='flex-row flex-wrap items-center justify-between rounded mb-2'>
                    {settingsCards.map(({ Component, props }, index) => (
                        <View
                            key={index}
                            style={{width: '31%', height: 75 }}
                            className='mb-3 items-center justify-center'>
                            <Component {...props} />
                        </View>
                    ))}
                </View>
            </MotiView>
        </ScrollView>
    )
}

export default StoreSettingsCard;