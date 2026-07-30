import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import { COLORS } from '../../../constants/constants';
import useApi from '../../../hook/useApi';
import LocationComponent from '../../../services/LocationComponent';
import socket from '../../../socket-io/socket';
import AssignmentModal from './AssignmentModal';
import BuyTripsModal from './BuyErrandsModal';
import { useRunnerDashboard } from './hook/useRunnerDashboard';
import NotRunnerView from './NotRunnerView';
import RunnerActions from './RunnerActions';
import RunnerHeaderss from './RunnerHeaderss';
import StatsCards from './StatsCards';

const Index = () => {
    const { user_id, is_runner } = useSelector((s) => s.auth);
    const router = useRouter();
    const [buyerrands, setBuyErrands] = useState(false);
    const [settings, setSettings] = useState(false);
    const [liveOrder, setLiveOrder] = useState(null);
    const soundRef = useRef(null);

    const {data, isLoading, error, get} = useApi();

    useEffect(() => {
        if (user_id) {
            get(`/runner/user/dashboard`);   
        }
    }, [user_id]);

    const runnerData = data?.data?.runner;
    const runnerStats = data?.data?.stats;
    const purchasedTrips = data?.data?.purchasedTrips;

    console.log("RUNNER DASHBOARD", purchasedTrips?.count);

    const startLoopSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../../assets/sounds/order.mp3'),
                { shouldPlay: true, isLooping: true }
            );

            soundRef.current = sound;
        } catch (e) {
            console.log("Sound error:", e);
        }
    };

    const stopLoopSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        } catch (e) {
            console.log("Stop sound error:", e);
        }
    };
    
    const {
        toggleAvailability
    } = useRunnerDashboard();

    useEffect(() => {
        if (!liveOrder) return;

        const run = async () => {
            await startLoopSound();
            Vibration.vibrate(500);
        };

        run();
    }, [liveOrder]);

    useEffect(() => {
        const handleNewOrder = (order) => {
            console.log("New order:", order);
            setLiveOrder(order);
        };

        socket.on("new_order", handleNewOrder);

        return () => {
            socket.off("new_order", handleNewOrder);
        };
    }, []);

    return (
        <SafeAreaView className='flex-1 px-4 bg-white relative'>
            {/* Pass refresh function to modal */}
            <AssignmentModal
                runner_id={runnerStats?.runner_id}
                onClose={() => setLiveOrder(null)}
                stopLoopSound={stopLoopSound}
            />
            <View className="">
                <MainHeader header_name="Runner" fontFamily='ubuntu-medium' textStyles="text-2xl text-black" />
            </View>

            <LocationComponent role="runner" userId={runnerStats?.runner_id} />

            {isLoading ? (
                <View className='flex-1 w-full justify-center items-center'>
                    <ActivityIndicator size={40} color={COLORS.primary} />
                    <Text className='text-lg text-black' style={{fontFamily: 'roboto-medium'}}>Loading data, please wait...</Text>
                </View>
            ) : runnerData?.length === 0 ? (
                <View className='flex-1 w-full justify-center items-center'>
                    <FontAwesome name='search' size={30} color={COLORS.slate}/>
                    <Text className='text-slate mt-2' style={{fontFamily: 'roboto-medium'}}>
                        Runner data did not load, try reloaing the app.
                    </Text>
                    <TouchableOpacity
                        style={{width: '40%'}}
                        className='bg-primary py-3 justify-center items-center rounded elevation mt-6'
                        onPress={() => get()}
                    >
                        <Text
                            className='text-white tetx-lg'
                            style={{fontFamily: 'roboto-medium'}}
                        >Reload</Text>
                    </TouchableOpacity>
                </View>
            ) : runnerData ? (
                <FlatList
                    data={[]}
                    renderItem={null}
                    ListHeaderComponent={ 
                        <View className=''>
                            <RunnerHeaderss runner={runnerData} setSettings={setSettings}/>
                            <StatsCards stats={runnerStats} purchasedTrips={purchasedTrips} runner={runnerData} />
                            <RunnerActions
                                isActive={runnerStats?.is_available}
                                toggleAvailability={toggleAvailability}
                                setBuyErrands={setBuyErrands}
                                router={router}
                                runner_id={runnerStats?.runner_id}
                            />
                            <BuyTripsModal
                                visible={buyerrands}
                                setBuyErrands={setBuyErrands}
                                runner_id={runnerStats?.runner_id}
                            />
                        </View>
                    }
                />
            ) : !is_runner ? (
                <View className='flex-1 w-full justify-center items-center'>
                    {/* <MaterialIcons name="directions-run" size={40} color={COLORS.green1} /> */}
                    {/* <Text className='text-lg text-black' style={{fontFamily: 'roboto-medium', textAlign: 'center', height: 90, marginTop: 5 }}>You dont have a runner account yet.</Text> */}
                    <NotRunnerView router={router}/>
                </View>
            ) : (
                <View className='flex-1 w-full justify-center items-center'>
                    <FontAwesome name='search' size={35} color={COLORS.slate} />
                    <Text className='text-lg text-black' style={{fontFamily: 'roboto-medium'}}>No data found</Text>
                    <Text className='text-sm text-slate' style={{fontFamily: 'roboto-medium', textAlign: 'center'}}>This may be due to slow connection or you dont have a runner account. You can restart the app.</Text>
                    <TouchableOpacity
                        style={{ width: '40%' }}
                        className="flex-row bg-primary py-3 rounded-md justify-center items-center mt-4"
                        
                    >
                        <MaterialCommunityIcons name="reload" size={23} color="white" />
                        <Text className="text-white text-lg ml-1" style={{ fontFamily: 'roboto-medium' }}>
                            Reload
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

export default Index