import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
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
                visible={publishStoremodalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setPublishStoreModalVisible(false)}
            >
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-transparentBlack justify-end"
                    // onPress={() => setPublishStoreModalVisible(false)}
                >
                    {/* Inner content wrapper (prevents closing when tapped) */}
                    <View
                        // onStartShouldSetResponder={() => true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 80 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60}}
                            className="bg-white px-4 pt-3"
                        >
                            {/* Header */}
                            <View className='p-1 flex-row justify-between items-center'>
                                <View className='flex-row justify-center items-center'>
                                    <FontAwesome6 name="edit" size={22} />
                                    <Text className='text-2xl ml-1' style={{ fontFamily: 'outfit-medium' }}>
                                        {isPublished ? 'Unpublish' : 'Publish'}
                                    </Text>
                                </View>
                            </View>
    
                            <View className='w-full bg-lavender my-3' style={{height: 1}} />
                            {/* Start Content */}
                            <PublishStoreOthers
                                router={router}
                                params={params}
                                setPublishStoreModalVisible={setPublishStoreModalVisible}
                            />
                            {/* End Content */}
                        </MotiView>
                    </View>
                </Pressable>
            </Modal>

            {/* Trigger button */}
            <TouchableOpacity
                onPress={() => setPublishStoreModalVisible(true)}
                style={{ borderRadius: SIZES.border }}
                className='h-full items-center justify-center border-1 border-lavender bg-white w-full'
                accessible={true}
                accessibilityLabel={isPublished ? 'Unpublish store' : 'Publish store'}
            >
                <View className='bg-[#fff] border border-[#54C571] elevation-sm justify-center items-center rounded-full' style={{width: 45, height: 45}}>
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