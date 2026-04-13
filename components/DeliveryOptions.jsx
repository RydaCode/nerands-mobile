import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import haversine from 'haversine';
import { AnimatePresence, MotiView } from 'moti';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { toast } from '../utils/toast';

/* ---------------- CONFIG ---------------- */
const DELIVERY_MODES = [
    { id: 'Foot', label: 'Foot', discount: 0.6, key: 'foot', speed: 4, minKm: 0, maxKm: 2 },
    { id: 'Bike', label: 'Bike', discount: 0.5, key: 'bike', speed: 12, minKm: 0.2, maxKm: 4 },
    { id: 'Motor-Bike', label: 'Motor Bike', discount: 0.4, key: 'motorBike', speed: 30, minKm: 0.5, maxKm: 6 },
    { id: 'Motor-Car', label: 'Motor', discount: 0.2, key: 'motorCar', speed: 45, minKm: 1, maxKm: 13 }
];

const getIcon = (id, color) => {
    switch (id) {
        case "Foot":
            return <FontAwesome5 name="walking" size={30} color={color} />;
        case "Bike":
            return <MaterialCommunityIcons name="bike-fast" size={30} color={color} />;
        case "Motor-Bike":
            return <FontAwesome6 name="motorcycle" size={30} color={color} />;
        default:
            return <MaterialCommunityIcons name="car" size={30} color={color} />;
    }
};

const MIN_DISTANCE_KM = 0.1; // minimum distance for calculation (~100m)
const MOVEMENT_THRESHOLD_KM = 0.05; // recalc threshold (~50m)

/* ---------------- DELIVERY CARD ---------------- */
const DeliveryCard = ({ item, isSelected, isCheapest, isDisabled, width, onPress }) => (
    <MotiView
        from={{ opacity: 0, translateX: 20 }}
        animate={{ opacity: 1, translateX: 0 }}
        exit={{ opacity: 0, translateX: -20 }}
        transition={{ type: 'timing', duration: 250 }}
        style={{ marginRight: 12 }}
    >
        <TouchableOpacity activeOpacity={0.8} onPress={isDisabled ? null : onPress} disabled={isDisabled}>
            <MotiView
                animate={{ scale: isSelected ? 1.05 : 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 120 }}
                style={{
                    width,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 7,
                    backgroundColor: isSelected ? '#007BFF' : '#EEF0FF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: isDisabled ? 0.5 : 1
                }}
            >
                {isCheapest && !isDisabled && (
                    <MotiView
                        from={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            backgroundColor: '#FFD700',
                            paddingHorizontal: 6,
                            borderRadius: 6,
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>CHEAPEST</Text>
                    </MotiView>
                )}

                <View className='flex-row items-center justify-center mt-2'>
                    {getIcon(item.id, isSelected ? '#fff' : '#333')}
                    <View className='ml-2'>
                        <Text style={{ color: isSelected ? '#fff' : '#333', fontWeight: 'bold' }}>
                            {item.label}
                        </Text>
                        <Text style={{ color: isSelected ? '#fff' : '#333', fontSize: 20, marginBottom: 4 }}>K{item.fee}</Text>
                    </View>
                </View>
                <View style={{ width: '80%', height: 6, backgroundColor: '#ccc', borderRadius: 3, marginTop: 4 }}>
                    <View
                        style={{
                            width: `${Math.min(item.distancePercentage * 100, 100)}%`,
                            height: 6,
                            backgroundColor: isSelected ? '#fff' : '#007BFF',
                            borderRadius: 3
                        }}
                    />
                </View>
                <Text style={{ color: isSelected ? '#fff' : '#555', fontSize: 12, marginTop: 2 }}>
                    ETA {item.eta}
                </Text>
            </MotiView>
        </TouchableOpacity>
    </MotiView>
);

/* ---------------- DELIVERY OPTIONS ---------------- */
const DeliveryOptions = ({ origin, destination, onSelectMode }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth * 0.5;

    // const charges = loadDeliveryCharges(); // frozen charges from Redux
    const charges = useSelector(state => state.delivery.charges);
    const [selectedOption, setSelectedOption] = useState(null);
    const lastOriginRef = useRef(origin);
    const autoSelectedRef = useRef(false);

    // Stable origin - only updates if moved ≥50m
    const stableOrigin = useMemo(() => {
        if (!origin) return null;
            const movedKm = haversine(lastOriginRef.current || origin, origin, { unit: 'km' }) || 0;

        if (movedKm >= MOVEMENT_THRESHOLD_KM) {
            lastOriginRef.current = origin;
            toast.info('You moved slightly. Delivery fees updated.');
            return origin;
        }

        return lastOriginRef.current;
    }, [origin]);

    // Distance for display and fee calculations
    const rawDistanceKm = useMemo(() => {
        if (!stableOrigin || !destination) return 0;
        return Number(haversine(stableOrigin, destination, { unit: 'km' })) || 0;
    }, [stableOrigin, destination]);

    const distanceKm = useMemo(() => Math.max(rawDistanceKm, MIN_DISTANCE_KM), [rawDistanceKm]);

    const formattedDistance = useMemo(() => {
        if (rawDistanceKm < 1) return `${Math.round(rawDistanceKm * 1000)} Meters`;
        return `${rawDistanceKm.toFixed(1)} Km`;
    }, [rawDistanceKm]);

    // Build delivery options
    const options = useMemo(() => {
        if (!charges) return [];

        return DELIVERY_MODES
            .map(mode => {
                const max = charges.maxDistance[mode.key];

                const isTooFar = distanceKm > max;
                const isTooClose = distanceKm < mode.minKm;

                if (isTooFar || isTooClose) return null;

                const base = charges.baseFee * (1 - mode.discount);
                const rate = charges.ratePerKm * (1 - mode.discount);
                const fee = Math.round(base + rate * distanceKm);
                const etaMin = Math.ceil((distanceKm / mode.speed) * 60);

                return {
                    ...mode,
                    fee,
                    eta: `${etaMin} min`,
                    distancePercentage: Math.min(distanceKm / max, 1),
                    isDisabled: false
                };
            })
            .filter(Boolean);
    }, [charges, distanceKm]);

    // Cheapest option auto-selected
    const cheapestOption = useMemo(() => {
        const available = options.filter(o => !o.isDisabled);
        if (!available.length) return null;
        return available.reduce((a, b) => (b.fee < a.fee ? b : a));
    }, [options]);

    // Auto-select cheapest once
    // Auto-select cheapest option
    useEffect(() => {
        if (!selectedOption && !autoSelectedRef.current && cheapestOption) {
            autoSelectedRef.current = true;
            setSelectedOption(cheapestOption);
            onSelectMode?.({
                mode: cheapestOption.id,
                fee: cheapestOption.fee,
                eta: cheapestOption.eta,
                distanceKm
            });
        }
    }, [cheapestOption, selectedOption, onSelectMode, distanceKm]);

    // Handle selection
    const handleSelect = useCallback(
        (item) => {
            if (item.isDisabled) return;
            setSelectedOption(item);
            onSelectMode?.({
                mode: item.id,
                fee: item.fee,
                eta: item.eta,
                distanceKm
            });
        }, [distanceKm, onSelectMode]
    );

    if (!charges) {
        // Loading skeleton
        return (
            <ScrollView horizontal style={{ padding: 10 }}>
                {[1, 2, 3, 4].map(i => (
                    <View
                        key={i}
                        style={{ width: 140, height: 80, backgroundColor: '#eee', borderRadius: 10, marginRight: 12 }}
                    />
                ))}
            </ScrollView>
        );
    }

    return (
        <View>
            <Text style={{ marginBottom: 6, color: '#555', marginLeft: 8 }}>Distance: {formattedDistance}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
                <AnimatePresence>
                    {options.map(item => (
                        <DeliveryCard
                            key={item.id}
                            item={item}
                            width={itemWidth}
                            isSelected={selectedOption?.id === item.id}
                            isCheapest={item.id === cheapestOption?.id && !item.isDisabled}
                            isDisabled={item.isDisabled}
                            onPress={() => handleSelect(item)}
                        />
                    ))}
                </AnimatePresence>
            </ScrollView>
        </View>
    );
};

export default DeliveryOptions;