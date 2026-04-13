import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRunnerLocation } from '../app/services/firebaseRunner';
import {
    setDisplayCurrentLocation,
    setLocation,
    setLocationServicesEnabled
} from '../redux/store/slices/locationSlice';
import { toast } from '../utils/toast';

const LocationComponent = ({ role, userId }) => {
    const dispatch = useDispatch();
    const { latitude, longitude, locationServicesEnabled, displayCurrentLocation } = useSelector(
        (state) => state.location
    );
    const [loading, setLoading] = useState(true);
    const locationSubscription = useRef(null);

    useEffect(() => {
        const initializeLocationTracking = async () => {
            await checkIfLocationEnabled();
            locationSubscription.current = await startWatchingLocation();
        };

        initializeLocationTracking();

        return () => {
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }
        };
    }, []);

    const checkIfLocationEnabled = async () => {
        try {
            const enabled = await Location.hasServicesEnabledAsync();
            dispatch(setLocationServicesEnabled(enabled));

            if (!enabled) {
                Alert.alert(
                    'Location services not enabled',
                    'Please enable your location services to continue.'
                );
            }
        } catch (error) {
            toast.info('Failed to check location services.');
        }
    };

    const startWatchingLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.error('Permission Denied', 'Please allow the app to access your location.');
                return null;
            }

            return Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // Update every 10 seconds
                    distanceInterval: 5,  // Update every 5 meters
                },
                async ({ coords }) => {
                    const { latitude, longitude } = coords;

                    // Update Redux/global state
                    const formattedAddress = await getFormattedAddress(latitude, longitude);
                    dispatch(setLocation({ latitude, longitude }));
                    dispatch(setDisplayCurrentLocation(formattedAddress));
                    setLoading(false);

                    // --- Firestore update only for roles that need it ---
                    if ((role === 'runner' || role === 'transporter') && userId) {
                        try {
                            await updateRunnerLocation(userId, latitude, longitude);
                        } catch (error) {
                            console.log('Failed to update location in Firestore:', error);
                        }
                    }
                }
            );
        } catch (error) {
            toast.error('Tracking Error', 'Error starting location watch.');
        }
    };

    const getFormattedAddress = async (latitude, longitude) => {
        try {
            const response = await Promise.race([
                Location.reverseGeocodeAsync({ latitude, longitude }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout exceeded')), 7000))
            ]);

            if (response.length > 0) {
                const address = response[0];
                return address.name
                ? `${address.name}, ${address.street || ''}, ${address.city || ''}`.trim()
                : `${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${
                    address.country || ''
                    }`.trim();
            }

            return 'Location not found';
        } catch (error) {
            // toast.error('Failed to fetch location details.');
            return 'Still fetching location';
        }
    };

    // return (
    //     <View style={{ alignItems: 'center', marginTop: 20 }}>
    //         <Text>📍 {displayCurrentLocation || 'Location unavailable'}</Text>
    //         <Text>🌍 {latitude}, {longitude}</Text>
    //         <Text>⚙️ Location services: {locationServicesEnabled ? 'Enabled' : 'Disabled'}</Text>
    //         <Toast /> {/* Toast messages */}
    //     </View>
    // );
};

export default LocationComponent;