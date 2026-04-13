import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COLORS, SIZES } from '../../../../../constants/constants';
import EditStoreData from './EditStoreData';

const EditStoresOthers = ({router, params, editstorelistmodalvisible, setEditStoreListModalVisible}) => {

    // Get the window dimensions for responsiveness
    const { width } = useWindowDimensions();
    return (
        <>
            {/* Start edit store list modal */}
            <View className='w-full'
                animation='slideInUp'
                iterationCount={1}
                duration={1000}  //1 second
                easing="ease-in-out"  //Easing for smoother animation
            >
                <TouchableOpacity className='flex-1 items-center'
                    onPress={() => setEditStoreListModalVisible(false)}
                >
                    <Modal
                        animationType="slide"
                        transparent={true}
                        statusBarTranslucent={true}
                        visible={editstorelistmodalvisible}
                        onRequestClose={() => setEditStoreListModalVisible(false)}
                    >
                        <Pressable style={styles.centeredView}
                            onPress={() => setEditStoreListModalVisible(false)}
                        />
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}   // start hidden + lower
                            animate={{ opacity: 1, translateY: 0 }} // end visible + normal pos
                            transition={{ duration: 1000 }}
                            style={styles.centeredView}>
                            <View className='w-full rounded-md' style={[styles.modalView, {maxWidth: width}]}>
                                {/* Container */}
                                <EditStoreData router={router} params={params} setEditStoreListModalVisible={setEditStoreListModalVisible}/>
                            </View>
                        </MotiView>
                    </Modal>
                </TouchableOpacity>
            </View>
            {/* End edit store list modal */}

            <TouchableOpacity
                onPress={() => setEditStoreListModalVisible(true)}
                // onPress={() => router.push({pathname: '../edit-stores/edit-stores-others/', params: {
                //     store_id:params.store_id, user_id:params.user_id, store_name:params.store_name, store_category:params.store_category, store_phone_num:params.store_phone_num, store_email:params.store_email, store_country:params.store_country, store_province:params.store_province, city_town:params.city_town, store_description:params.store_description, store_location:params.store_location, store_longitude:params.store_longitude, open_time:params.open_time, closing_time:params.closing_time, created_date:params.created_date, store_profileImage:params.store_profileImage, store_coverImage:params.store_coverImage, profile_image_status:params.profile_image_status, cover_image_status:params.cover_image_status, store_ratings:params.store_ratings, open_close:params.open_close, active_status:params.active_status, delivery_status:params.delivery_status
                // }})}
                style={{borderRadius: SIZES.border}}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <Ionicons name="create-outline" color={"#54C571"} size={22} />
                </View>
                <Text className='text-sm'>Edit Store</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparentBlack,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        // backgroundColor: COLORS.transparentBlack,
        // borderTopRightRadius: 10,
        // borderTopLeftRadius: 10,
        // padding: 10,
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },

        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
});

export default EditStoresOthers