import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import PublishStoreOthers from '../../../../../components/publish-content/publish-store/PublishStoreOthers';
import { COLORS, SIZES } from '../../../../../constants/constants';

const PublishStoreBtn = ({ router, params, publishStoremodalVisible, setPublishStoreModalVisible }) => {
    const { width } = useWindowDimensions();

    const isPublished = params.active_status === true || params.active_status === 1 || params.active_status === 'true';

    return (
        <>
            {/* Modal for publish/unpublish confirmation */}
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={true}
                visible={publishStoremodalVisible}
                onRequestClose={() => setPublishStoreModalVisible(false)}
            >
                <Pressable style={styles.centeredView} onPress={() => setPublishStoreModalVisible(false)} />
                <View style={styles.centeredView}>
                    <View className='bg-white p-2 w-full rounded-md' style={[styles.modalView, { maxWidth: width }]}>
                        {/* Header */}
                        <View className='p-1 flex-row justify-between items-center'>
                            <View className='flex-row justify-center items-center'>
                                <FontAwesome6 name="edit" size={22} />
                                <Text className='text-2xl ml-1' style={{ fontFamily: 'maven-medium' }}>
                                    {isPublished ? 'Unpublish' : 'Publish'}
                                </Text>
                            </View>
                        </View>

                        <PublishStoreOthers
                            router={router}
                            params={params}
                            setPublishStoreModalVisible={setPublishStoreModalVisible}
                        />
                    </View>
                </View>
            </Modal>

            {/* Trigger button */}
            <TouchableOpacity
                onPress={() => setPublishStoreModalVisible(true)}
                style={{ borderRadius: SIZES.border }}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
                accessible={true}
                accessibilityLabel={isPublished ? 'Unpublish store' : 'Publish store'}
            >
                <View className='bg-[#DFF6E6] justify-center items-center rounded-full' style={{width: 45, height: 45}}>
                    <MaterialIcons
                        name={isPublished ? 'unpublished' : 'publish'}
                        size={22} color={"#54C571"}
                    />
                </View>
                {isPublished ?
                    <Text className='text-sm'>Unpublish</Text> :
                    <Text className='text-sm'>Publish</Text>
                }
            </TouchableOpacity>
        </>
    );
};

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
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default PublishStoreBtn;