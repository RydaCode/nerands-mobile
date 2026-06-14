import { useLocalSearchParams, useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import { COLORS } from '../../../constants/constants'
import HistoryCustomTransporters from './HistoryCustomTransporters'
import NewCustomTransporter from './NewCustomTransporter'

const index = () => {
    const { width, height } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState('new');
    const params = useLocalSearchParams();
    const router = useRouter();

    const isRunner = (params.is_runner ?? "false") === "true";

    return (
        <SafeAreaView className='flex-1 bg-white px-4'>
            <MainHeader fontFamily='maven-medium' textStyles='text-2xl' header_name='Custom'/>

            <View className='w-full mt-2'>
                <View className='flex-row justify-between mt-4 mb-2 relative'>
                    {/* Sliding Indicator */}
                    <MotiView
                        animate={{
                            translateX: activeTab === 'new' ? 0 : width * 0.49,
                        }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '46%',
                            height: 3,
                            backgroundColor: COLORS.primary,
                            borderRadius: 2,
                        }}
                    />

                    {/* Location Tab */}
                    <TouchableOpacity
                        style={{ width: '49%' }}
                        className='justify-center items-center pt-2 pb-1'
                        onPress={() => setActiveTab('new')}
                    >
                        <Text className='text-lg' style={{
                            fontFamily: "roboto-medium",
                            color: activeTab === 'new' ? COLORS.primary : COLORS.slate
                        }}>
                            New
                        </Text>
                    </TouchableOpacity>

                    {/* Description Tab */}
                    <TouchableOpacity
                        style={{ width: '49%' }}
                        className='justify-center items-center pt-2 pb-1'
                        onPress={() => setActiveTab('history')}
                    >
                        <Text className='text-lg' style={{
                            fontFamily: "roboto-medium",
                            color: activeTab === 'history' ? COLORS.primary : COLORS.slate
                        }}>
                            History
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* New custom transporter screen */}
                {activeTab === 'new' &&
                    <NewCustomTransporter
                        created_by={params.created_by}
                        custom_order_id={params.custom_order_id}
                        store_order_id={params.store_order_id}
                        order_type={params.order_type}
                        is_runner={isRunner}
                    />
                }

                {/* history Transporter Screen */}
                {activeTab === 'history' &&
                    <HistoryCustomTransporters
                        created_by={params.created_by}
                        custom_order_id={params.custom_order_id}
                        store_order_id={params.store_order_id}
                        order_type={params.order_type}
                        is_runner={isRunner}
                    />
                }
            </View>
        </SafeAreaView>
    )
}

export default index