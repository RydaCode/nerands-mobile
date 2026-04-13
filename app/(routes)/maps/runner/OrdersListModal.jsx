// OrdersListModal.js
import { Ionicons } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import EmptyState from '../../../../components/EmptyState';
import { COLORS, SIZES } from '../../../../constants/constants';
import OrdersData from './OrdersData';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const OrdersListModal = ({ orders, onClose, router }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const [markready, setMarkReady] = useState(false);

    const maxHeight = SCREEN_HEIGHT * 0.7;
    const finalHeight = Math.min(contentHeight, maxHeight);

    const ordersWithKeys = orders.map((item, index) => ({
        key: `${item}-${index}`,
        name: item,
    }));

    return (
        <AnimatePresence>
            <Pressable onPress={onClose} style={styles.overlay} />
            <View pointerEvents="box-none" style={styles.absoluteBottom} key="modal-wrapper">
                <MotiView
                    key="modal"
                    from={{ opacity: 0, translateY: 40 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: 40 }}
                    transition={{ duration: 500 }}
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <MotiView
                        style={styles.modalBox}
                        from={{ height: 0 }}
                        animate={{ height: finalHeight }}
                        transition={{ type: "timing", duration: 500 }}
                    >
                        <TouchableOpacity
                            style={styles.dragHandleWrapper}
                            onPress={onClose}
                        >
                            <View style={styles.dragHandle} />
                        </TouchableOpacity>
                        <FlatList
                            data={ordersWithKeys}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <OrdersData
                                    order={item.name} router={router}
                                    markready={markready} setMarkReady={setMarkReady}
                                />
                            )}
                            contentContainerStyle={{ padding: 12 }}
                            ListEmptyComponent={
                                <EmptyState
                                    icon={<Ionicons name="bag-outline" size={80} color={COLORS.slate} />}
                                    description="You have no custom orders"
                                />
                            }
                            onContentSizeChange={(w, h) => setContentHeight(h)}
                            showsVerticalScrollIndicator={true}
                        />
                    </MotiView>
                </MotiView>
            </View>
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.55)",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    absoluteBottom: {
        flex: 1,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalBox: {
        bottom: 0,
        width: SCREEN_WIDTH * 0.95,
        backgroundColor: "white",
        borderRadius: SIZES.border,
        marginBottom: 10,
        alignSelf: 'center',
        overflow: "hidden",
    },
    dragHandleWrapper: {
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 4,
        paddingTop: 2
    },
    dragHandle: {
        height: 5,
        width: "30%",
        backgroundColor: COLORS.lavender,
        borderRadius: 20
    },
});

export default OrdersListModal;