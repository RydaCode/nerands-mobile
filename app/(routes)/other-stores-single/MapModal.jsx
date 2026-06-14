import { MaterialIcons } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Linking, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

const MapModal = ({ store_latitude, store_longitude, openMapsModal, setOpenMapsModal }) => {
    const { latitude, longitude } = useSelector(state => state.location) || {};
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef(null);
    // Parse strings to numbers
    const pointA = useMemo(() => ({
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
    }), [latitude, longitude]); // User

    const pointB = useMemo(() => ({
        latitude: Number(store_latitude) || 0,
        longitude: Number(store_longitude) || 0,
    }), [store_latitude, store_longitude]); //Store

    // Center map between points
    const initialRegion = useMemo(() => ({
        latitude: (pointA.latitude + pointB.latitude) / 2,
        longitude: (pointA.longitude + pointB.longitude) / 2,
        latitudeDelta: Math.abs(pointA.latitude - pointB.latitude) * 2 || 0.05,
        longitudeDelta: Math.abs(pointA.longitude - pointB.longitude) * 2 || 0.05,
    }), [pointA, pointB]);

    // Fit to both points when map is ready and layout measured
    useEffect(() => {
        if (mapRef.current && mapReady) {
        mapRef.current.fitToCoordinates([pointA, pointB], {
            edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
            animated: true,
        });
        }
    }, [pointA, pointB, mapReady]);

    // Function to open selected maps app
    const openMapsChooser = async (pointA, pointB) => {
        const { latitude: latA, longitude: lngA } = pointA;
        const { latitude: latB, longitude: lngB } = pointB;

        const options = [];

        if (Platform.OS === "ios") {
            options.push({ name: "Apple Maps", url: `http://maps.apple.com/?saddr=${latA},${lngA}&daddr=${latB},${lngB}` });
            options.push({ name: "Google Maps", url: `comgooglemaps://?saddr=${latA},${lngA}&daddr=${latB},${lngB}&directionsmode=driving` });
            options.push({ name: "Waze", url: `waze://?ll=${latB},${lngB}&navigate=yes` });
        } else {
            // Android
            options.push({ name: "Google Maps", url: `https://www.google.com/maps/dir/?api=1&origin=${latA},${lngA}&destination=${latB},${lngB}&travelmode=driving` });
            options.push({ name: "Waze", url: `waze://?ll=${latB},${lngB}&navigate=yes` });
        }

        // Filter apps that can actually be opened
        const availableApps = [];
        for (let opt of options) {
            try {
                const supported = await Linking.canOpenURL(opt.url);
                if (supported) availableApps.push(opt);
            } catch (err) {
                console.log("Error checking URL:", err);
            }
        }

        if (availableApps.length === 0) {
            Alert.alert("No maps apps available", "Please install Google Maps or Waze to navigate.");
            return;
        }

        // If only one app, open it directly
        if (availableApps.length === 1) {
            Linking.openURL(availableApps[0].url);
            return;
        }

        // Let user choose from available apps
        Alert.alert(
            "Open with", "Choose an app to open directions",
            availableApps.map((app) => ({
                text: app.name,
                onPress: () => Linking.openURL(app.url),
            })),
            { cancelable: true }
        );
    };

    return (
        <View>
        {/* Start location maps */}
            <Modal
                transparent
                statusBarTranslucent
                visible={openMapsModal}
                animationType="none"
            >
                {/* Overlay */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.overlay}
                >
                    <Pressable className="flex-1 inset-0 top-0 bottom-0 left-0 right-0 bg-transparentBlack" onPress={() => setOpenMapsModal(false)} />
                </MotiView>

                {/* Bottom Sheet */}
                <MotiView
                    from={{ translateY: 400 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 400 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={styles.mapsheet}
                > 
                    <View className='w-full relative flex-1 justify-center items-center'>
                        <View className='w-full justify-center items-center rounded-md'>
                        <TouchableOpacity
                            className='w-full justify-center items-center'
                            style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                            onPress={() => setOpenMapsModal(false)}
                        >
                            <View className='h-1.5 rounded-full my-1 bg-[#ccc] w-[30%]'/>
                        </TouchableOpacity>
                    </View> 
                        {/* <MapView
                            ref={mapRef}
                            style={styles.map}
                            onMapReady={() => setMapReady(true)}
                            initialRegion={{
                                latitude: (pointA.latitude + pointB.latitude) / 2,
                                longitude: (pointA.longitude + pointB.longitude) / 2,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker
                                coordinate={pointA}
                                title="You"
                                description="Start location"
                                pinColor="green"
                            />
                            <Marker
                                coordinate={pointB}
                                title={store_name}
                                pinColor="blue"
                            />
                            <Polyline
                                coordinates={[pointA, pointB]}
                                strokeColor="red"
                                strokeWidth={3}
                            />
                        </MapView> */}
                        <View className='w-full px-2 pb-2 mt-8 justify-center items-center rounded-md'>
                            <TouchableOpacity
                                className='w-full justify-center flex-row items-center py-4 rounded bg-primary elevation-lg'
                                onPress={() => openMapsChooser(pointA, pointB)}
                            >
                                <MaterialIcons name="my-location" size={24} color="white" />
                                <Text className='text-2xl text-white ml-2'
                                    style={{fontFamily: 'maven-medium'}}
                                >Open In Maps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>
            </Modal>
            {/* End of locations map modal */}
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    mapsheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '95%',
        backgroundColor: 'white',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80
    },

    button: {
        backgroundColor: '#6200ee',
        padding: 12,
        borderRadius: 10,
    },

    closeBtn: {
        marginTop: 15,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
    },

    // map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },

    map: { flex: 1, height: '100%', width: '100%' }
});

export default MapModal