import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../../constants/styles.tabs';

const TabButton = ({ name, activeTab, onHandleSearchType }) => (
    <TouchableOpacity
        style={styles.btn(name, activeTab)} className='py-2 border border-lavender px-6 items-center'
        onPress={onHandleSearchType}
    >
        <Text style={styles.btnText(name, activeTab)}>{name}</Text>
    </TouchableOpacity>
);

const OrderTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <View className='px-2'>
            <FlatList
                data={tabs}
                renderItem={({ item }) => (
                    <TabButton
                        name={item}
                        activeTab={activeTab}
                        onHandleSearchType={() => setActiveTab(item)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ columnGap: 5 }}
                horizontal
            />
        </View>
    )
}

export default OrderTabs