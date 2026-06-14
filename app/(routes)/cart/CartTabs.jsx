import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/constants';
import styles from '../../../constants/styles.tabs';

const TabButton = ({ tab, activeTab, onHandleSearchType }) => (
    <TouchableOpacity
        style={styles.btn(tab.id, activeTab)}
        className='py-2 border border-lavender px-6 items-center'
        onPress={onHandleSearchType}
    >
        <Text style={styles.btnText(tab.id, activeTab)}>
            {tab.title}{' '}

            {tab.count !== undefined && (
                <Text
                    style={{
                        color:
                            activeTab === tab.id
                                ? COLORS.white
                                : COLORS.primary,
                    }}
                >
                    ({tab.count})
                </Text>
            )}
        </Text>
    </TouchableOpacity>
);

const CartTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <View className='items-center justify-center' style={styles.container}>
            <FlatList
                data={tabs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TabButton
                        tab={item}
                        activeTab={activeTab}
                        onHandleSearchType={() => setActiveTab(item.id)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ columnGap: 5 }}
            />
        </View>
    );
};

export default CartTabs;