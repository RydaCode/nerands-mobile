import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from '../../../constants/constants';
import { DELIVERY_ZONES } from '../../../constants/deliveryZones';

const DeliveryZones = ({ visible, onClose, onSelect }) => {

    const [step, setStep] = useState('province');
    const [selectedProvince, setSelectedProvince] = useState(null);

    // ONE SOURCE OF TRUTH
    const [selection, setSelection] = useState({
        cityId: null,
        size: null,
        price: null,
        city: null,
        province: null
    });

    // reset when modal closes
    useEffect(() => {
        if (!visible) {
            setStep('province');
            setSelectedProvince(null);
            setSelection({
                cityId: null,
                size: null,
                price: null,
                city: null,
                province: null
            });
        }
    }, [visible]);

    const provinces = useMemo(() => {
        return [...new Set(DELIVERY_ZONES.map(z => z.province))];
    }, []);

    const cities = useMemo(() => {
        if (!selectedProvince) return [];
        return DELIVERY_ZONES.filter(z => z.province === selectedProvince);
    }, [selectedProvince]);

    const handleSelect = (item, size, price) => {
        const payload = {
            id: item.id,
            city: item.city,
            province: item.province,
            size,
            price
        };

        setSelection({
            cityId: item.id,
            size,
            price,
            city: item.city,
            province: item.province
        });

        onSelect(payload);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="none" transparent statusBarTranslucent>

            {/* BACKDROP */}
            <Pressable style={styles.backdrop} onPress={onClose} />

            {/* SHEET */}
            <MotiView
                from={{ translateY: 500, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ type: 'timing', duration: 250 }}
                style={styles.sheet}
            >
                {/* HEADER */}
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold">
                        {step === 'province' ? 'Select Province' : 'Select City'}
                    </Text>

                    <TouchableOpacity onPress={onClose}>
                        <FontAwesome name="close" size={22} color="red" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 10 }} />

                {/* PROVINCES */}
                {step === 'province' && (
                    <>
                        <FlatList
                            data={provinces}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedProvince(item);
                                        setStep('city');
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.title}>{item}</Text>
                                    <FontAwesome name="caret-right" size={18} color={COLORS.black} />
                                </TouchableOpacity>
                            )}
                        />
                        <View style={{marginBottom: 80}}/>
                    </>
                )}

                {/* CITIES + SIZES */}
                {step === 'city' && (
                    <>
                        <TouchableOpacity
                            onPress={() => setStep('province')}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                        >
                            <AntDesign name="arrow-left" size={14} />
                            <Text style={{ marginLeft: 6, color: COLORS.primary }}>
                                Back to provinces
                            </Text>
                        </TouchableOpacity>

                        <FlatList
                            data={cities}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {

                                const isOpen = selection.cityId === item.id;

                                return (
                                    <View style={styles.card}>

                                        {/* CITY HEADER */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelection(prev => ({
                                                    ...prev,
                                                    cityId: prev.cityId === item.id ? null : item.id
                                                }));
                                            }}
                                            style={styles.cityHeader}
                                        >
                                            <View>
                                                <Text style={styles.cityText}>{item.city}</Text>
                                                <Text style={{ color: '#666' }}>{item.province}</Text>
                                            </View>

                                            <FontAwesome
                                                name={isOpen ? "caret-up" : "caret-down"}
                                                size={18}
                                            />
                                        </TouchableOpacity>

                                        {/* SIZES */}
                                        {isOpen && (
                                            <View style={{ borderTopWidth: 1, marginTop: 10, borderColor: '#eee', paddingTop: 10 }}>
                                                <View className='bg-grey_bg py-1 px-2 justify-center items-center rounded-lg'>
                                                    <Text className='text-base text-green2' style={{fontFamily: 'roboto-medium'}}>
                                                        Selectet Estimated Parcel Size & Price
                                                    </Text>
                                                </View>
                                                {['small', 'medium', 'large'].map((size) => (
                                                    <TouchableOpacity
                                                        key={size}
                                                        onPress={() => handleSelect(item, size, item[size])}
                                                        style={styles.sizeRow}
                                                    >
                                                        <View className='' style={{width: '30%'}}>
                                                            <Text style={{ textTransform: 'capitalize', fontFamily: 'roboto-medium' }}>
                                                                {size}
                                                            </Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 10, color: COLORS.primary, fontFamily: 'roboto-medium' }}>
                                                                K{item[size]}
                                                            </Text>

                                                            <View style={styles.radio}>
                                                                {selection.cityId === item.id &&
                                                                    selection.size === size && (
                                                                        <View style={styles.radioInner} />
                                                                    )}
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={{marginBottom: 80}}/>
                    </>
                )}
            </MotiView>
        </Modal>
    );
};

export default DeliveryZones;

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '90%',
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6
    },
    title: {
        fontSize: 16,
        fontWeight: '600'
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 7,
        marginBottom: 15
    },
    cityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cityText: {
        fontSize: 16,
        fontWeight: '600'
    },
    sizeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary
    }
});