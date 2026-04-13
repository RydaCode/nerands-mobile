import { View, Text } from 'react-native'
import React from 'react'

const MenSizeChartCard = () => {
    return (
        <View className='mt-10 w-full'>
            <Text className='font-bold' style={{fontFamily: 'maven-medium'}}>MEN'S BODY SIZING CHART</Text>
            <View className='flex-row w-full justify-between mt-3 items-center bg-black p-2'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>SIZE</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>XS</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>S</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>M</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>L</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>XL</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Chest</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33"-36"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>36"-39"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>39"-41"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>41"-43"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>43"-46"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Waist</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>27"-30"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>30"-33"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33"-35"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>36"-38"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>38"-42"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Hip</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33" - 36"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>36" - 39"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>39" - 41"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>41" - 43"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>43" - 46"</Text>
                </View>
            </View>

            <Text className='font-bold mt-10' style={{fontFamily: 'maven-medium'}}>MEN'S XXL BODY SIZING CHART</Text>
            <View className='flex-row justify-between mt-3 items-center bg-black p-2'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>SIZE</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-white'>XXL</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Chest</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>46"-49"</Text>
                </View>
            </View>
            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Waist</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>42"-45"</Text>
                </View>
            </View>
            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Hip</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>46"-49"</Text>
                </View>
            </View>
        </View>
    )
}

export default MenSizeChartCard