import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../../components/MainHeader'
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../../constants/constants'

const index = () => {
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-2'>
                <MainHeader header_name='Saved Locations' />
            </View>
            <ScrollView contentContainerStyle={{paddingHorizontal: 8}} showsVerticalScrollIndicator={false}>
                <View className='w-full justify-center items-center'>
                    <Text className='text-slate text-lg mt-3'>You have 16 saved locations</Text>
                    <View className='w-full mt-4'>

                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>

                        

                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                        <View className='w-full'>
                            <View className='flex-row justify-between items-center w-full'>
                                <TouchableOpacity style={{width: '69%'}} className='flex-row justify-start items-center'>
                                    <View style={{width: 45, height: 45, borderColor: COLORS.slate}} className='rounded-full border-2 p-3 justify-center items-center'>
                                        <Ionicons name='location-sharp' size={16} color={COLORS.green } />
                                    </View>
                                    <View className='ml-2'>
                                        <Text className='text-lg text-slate'>Home</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '26%'}} className='flex-row justify-between items-center'>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 justify-center items-center p-1'>
                                        <FontAwesome6 name="pencil" color={COLORS.green1} size={16}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{height: 35, width: 35, borderColor: COLORS.lavender}} className='rounded-full border-2 p-1 justify-center items-center '>
                                        <FontAwesome5 name='trash' color={COLORS.red} size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 1}} className='bg-lavender my-4 w-full rounded-full' />
                        </View>


                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default index