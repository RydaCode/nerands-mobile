import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../../constants/styles.tabs';

const TabButton = ({ name, activeTab, onHandleSearchType }) => (
    <TouchableOpacity
        style={styles.btn(name, activeTab)} className='py-2 px-6 items-center border border-lavender'
        onPress={onHandleSearchType}
    >
        <Text style={styles.btnText(name, activeTab)}>{name}</Text>
    </TouchableOpacity>
);

const ProductsTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <View style={styles.container}>
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
                horizontal
                contentContainerStyle={{ columnGap: 5 }}
            />
        </View>
    )
}

export default ProductsTabs