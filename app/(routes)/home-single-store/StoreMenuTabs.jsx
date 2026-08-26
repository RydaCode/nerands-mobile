import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import ProductstabStyles from '../../../constants/ProductstabStyles';

const TabButton = ({ tab, activeTab, onHandleSearchType }) => {

    const isActive = activeTab?.id === tab.id;

    return (
        <TouchableOpacity
            style={ProductstabStyles.btn(isActive)}
            className="py-2 px-6 border border-lavender items-center"
            onPress={onHandleSearchType}
        >
            <Text style={ProductstabStyles.btnText(isActive)}>
                {tab.name}
            </Text>
        </TouchableOpacity>
    );
};

const StoreMenuTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <View style={ProductstabStyles.container}>
            <FlatList
                data={tabs}
                renderItem={({ item }) => (
                    <TabButton
                        tab={item}
                        activeTab={activeTab}
                        onHandleSearchType={() => setActiveTab(item)}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ columnGap: 5 }}
            />
        </View>
    );
};

export default StoreMenuTabs