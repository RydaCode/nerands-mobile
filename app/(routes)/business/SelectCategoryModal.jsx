import { FontAwesome6 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';

const SelectCategoryModal = ({
    selectCategory,
    setSelectCategory,
    openSelectCategory,
    setOpenSelectCategory,
    expandedCategory,
    setExpandedCategory,
    categories
}) => {

    const RadioItem = ({ item, selected, onPress }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-center py-3"
            >
                <View
                    style={{width: 23, height: 23}}
                    className={`rounded-full border-2 items-center justify-center ${
                        selected ? "border-primary" : "border-gray-400"
                    }`}
                >
                    {selected &&
                        <View style={{width: 16, height: 16}} className="rounded-full bg-primary" />
                    }
                </View>

                <Text
                    className="ml-3"
                    style={{ fontFamily: "roboto", fontSize: 15 }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={openSelectCategory}
            transparent
            animationType="none"
            onRequestClose={() => setOpenSelectCategory(false)}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-transparentBlack justify-end"
                onPress={() => setOpenSelectCategory(false)}
            >
                {/* Inner content wrapper (prevents closing when tapped) */}
                <View
                    // onStartShouldSetResponder={() => true}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 80 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '95%'}}
                        className="bg-white px-4 pt-3"
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-2xl"
                                style={{ fontFamily: "outfit-medium" }}
                            >
                                Select Category
                            </Text>
                        </View>

                        <View className='w-full bg-lavender my-3' style={{height: 1}} />
                        {/* Content */}
                        
                        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
                            {
                                categories?.data?.map((category) => (

                                    <View key={category.id} className=''>

                                        {/* Parent category */}
                                        <TouchableOpacity
                                            className="flex-row justify-between items-center py-3"
                                            onPress={() =>
                                                setExpandedCategory(
                                                    expandedCategory === category.id
                                                    ? null
                                                    : category.id
                                                )
                                            }
                                        >
                                            <Text
                                                className=""
                                                style={{ fontFamily: "roboto-medium", fontSize: 15 }}
                                            >
                                                {category.name}
                                            </Text>

                                            <FontAwesome6
                                                name={
                                                    expandedCategory === category.id
                                                    ? "angle-up"
                                                    : "angle-down"
                                                }
                                                size={16} color={COLORS.slate}
                                            />
                                        </TouchableOpacity>

                                        {/* Children */}
                                        {
                                            expandedCategory === category.id &&
                                            category.children?.map((child) => (

                                                <View
                                                    key={child.id}
                                                    className="ml-5"
                                                >
                                                    <RadioItem
                                                        item={child}
                                                        selected={
                                                            selectCategory?.id === child.id
                                                        }
                                                        onPress={() => {
                                                            setSelectCategory(child);
                                                            setOpenSelectCategory(false);
                                                        }}
                                                    />
                                                </View>

                                            ))
                                        }

                                        <View className='bg-grey_bg w-full my-2' style={{height: 1}}/>
                                    </View>
                                ))
                            }

                        </ScrollView>
                    </MotiView>
                </View>
            </Pressable>
        </Modal>
    )
}

export default SelectCategoryModal