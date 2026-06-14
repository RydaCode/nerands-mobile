import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import haversine from 'haversine';
import { MotiView } from 'moti';
import { useCallback, useMemo } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

/* ---------------- CONFIG ---------------- */
const DELIVERY_MODES = [
    { id: 'Foot', label: 'Foot', discount: 0.6, key: 'foot', speed: 4, minKm: 0, maxKm: 2 },
    { id: 'Bike', label: 'Bike', discount: 0.5, key: 'bike', speed: 12, minKm: 0.2, maxKm: 4 },
    { id: 'Motor-Bike', label: 'Motor Bike', discount: 0.4, key: 'motorBike', speed: 30, minKm: 0.5, maxKm: 6 },
    { id: 'Motor-Car', label: 'Motor', discount: 0.2, key: 'motorCar', speed: 45, minKm: 1, maxKm: 13 }
];

const MIN_DISTANCE_KM = 0.1;

/* ---------------- ICON ---------------- */
const getIcon = (id, color) => {
    switch (id) {
        case 'Foot':
            return <FontAwesome5 name="walking" size={28} color={color} />;
        case 'Bike':
            return <MaterialCommunityIcons name="bike-fast" size={28} color={color} />;
        case 'Motor-Bike':
            return <FontAwesome6 name="motorcycle" size={28} color={color} />;
        default:
            return <MaterialCommunityIcons name="car" size={28} color={color} />;
    }
};

/* ---------------- CARD ---------------- */
const DeliveryCard = ({ item, selected, disabled, width, onPress }) => {
    return (
        <MotiView
            animate={{ scale: selected ? 1.05 : 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ marginRight: 12 }}
        >
            <TouchableOpacity disabled={disabled} onPress={onPress}>
                <View
                    style={{
                        width,
                        paddingVertical: 14,
                        paddingHorizontal: 18,
                        borderRadius: 8,
                        backgroundColor: selected ? '#007BFF' : '#EEF0FF',
                        opacity: disabled ? 0.5 : 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {getIcon(item.id, selected ? '#fff' : '#333')}

                        <View style={{ marginLeft: 8 }}>
                            <Text style={{ color: selected ? '#fff' : '#333', fontWeight: 'bold' }}>
                                {item.label}
                            </Text>
                            <Text style={{ color: selected ? '#fff' : '#333' }}>
                                K{item.fee}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        width: '80%',
                        height: 5,
                        backgroundColor: '#ccc',
                        borderRadius: 3,
                        marginTop: 6
                    }}>
                        <View
                            style={{
                                width: `${Math.min(item.distancePercentage * 100, 100)}%`,
                                height: 5,
                                backgroundColor: selected ? '#fff' : '#007BFF',
                                borderRadius: 3
                            }}
                        />
                    </View>

                    <Text style={{
                        fontSize: 12,
                        marginTop: 4,
                        color: selected ? '#fff' : '#555'
                    }}>
                        ETA {item.eta}
                    </Text>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
};

/* ---------------- MAIN COMPONENT ---------------- */
const DeliveryOptions1 = ({ origin, destination, selectedId, onSelectMode }) => {
    const charges = useSelector(state => state.delivery.charges);

    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth * 0.5;

    // const [selectedId, setSelectedId] = useState(null);

    /* ---------------- DISTANCE ---------------- */
    const distanceKm = useMemo(() => {
        if (!origin || !destination) return 0;
        return Math.max(
            haversine(origin, destination, { unit: 'km' }) || 0,
            MIN_DISTANCE_KM
        );
    }, [origin, destination]);

    const formattedDistance = useMemo(() => {
        if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
        return `${distanceKm.toFixed(1)} km`;
    }, [distanceKm]);

    /* ---------------- OPTIONS ---------------- */
    const options = useMemo(() => {
        if (!charges || !charges.maxDistance) return [];

        return DELIVERY_MODES.map(mode => {
            const max = charges.maxDistance?.[mode.key];
            if (!max) return null;

            const base = charges.baseFee * (1 - mode.discount);
            const rate = charges.ratePerKm * (1 - mode.discount);

            const fee = Math.round(base + rate * distanceKm);
            const etaMin = Math.ceil((distanceKm / mode.speed) * 60);

            return {
                ...mode,
                fee,
                eta: `${etaMin} min`,
                distancePercentage: distanceKm / max,
                isDisabled: distanceKm > max
            };
        }).filter(Boolean);
    }, [charges, distanceKm]);

    /* ---------------- SELECT ---------------- */
    const handleSelect = useCallback((item) => {

        onSelectMode?.({
            mode: item.id,
            fee: item.fee,
            eta: item.eta,
            distanceKm
        });
    }, [distanceKm, onSelectMode]);

    /* ---------------- EMPTY ---------------- */
    if (!charges) {
        return (
            <ScrollView horizontal style={{ padding: 10 }}>
                {[1, 2, 3, 4].map(i => (
                    <View
                        key={i}
                        style={{
                            width: 140,
                            height: 80,
                            backgroundColor: '#eee',
                            borderRadius: 10,
                            marginRight: 10
                        }}
                    />
                ))}
            </ScrollView>
        );
    }

    if (!options.length) {
        return (
            <View style={{ padding: 10 }}>
                <Text>No delivery options for {formattedDistance}</Text>
            </View>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <View>
            <Text style={{ marginLeft: 8, marginBottom: 6, color: '#555' }}>
                Distance: {formattedDistance}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
                {options.map(item => (
                    <DeliveryCard
                        key={item.id}
                        item={item}
                        width={itemWidth}
                        selected={selectedId === item.id}
                        disabled={item.isDisabled}
                        onPress={() => handleSelect(item)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default DeliveryOptions1;