import { useLocalSearchParams } from 'expo-router';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

const ForceUpdateAPP = () => {
    // optional: if you stored version in redux or pass via params
    const params = useLocalSearchParams();

    const handleUpdate = () => {
        const url = params?.play_store_url;

        if (url) {
            Linking.openURL(url);
        } else {
            console.log("Store link not available yet");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: '#fff',
            }}
        >
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center',
                }}
            >
                Update Required
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    textAlign: 'center',
                    marginBottom: 20,
                    color: '#555',
                }}
            >
                You are using an older version of Nerands.
                Please update to continue using the app.
            </Text>

            {params?.latest_version && (
                <Text
                    style={{
                        marginBottom: 20,
                        color: '#888',
                    }}
                >
                    Latest version: v{params.latest_version}
                </Text>
            )}

            <TouchableOpacity
                onPress={handleUpdate}
                className='py-3 justify-center items-center rounded elevation-md bg-primary'
                style={{
                    width: '65%'
                }}
            >
                <Text
                    className='text-lg'
                    style={{
                        color: '#fff',
                        fontFamily: 'roboto-medium'
                    }}
                >
                    Update Now
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForceUpdateAPP;