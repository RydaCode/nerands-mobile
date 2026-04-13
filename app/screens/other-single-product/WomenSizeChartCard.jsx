import { View, Text } from 'react-native'
import React from 'react'

const WomenSizeChartCard = () => {
    return (
        <View className='mt-10 w-full'>
            <Text className='font-bold' style={{fontFamily: 'maven-medium'}}>WOMEN'S BODY SIZING CHART</Text>
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
                    <Text className='text-black text-sm'>31"-33"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33"-35"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>35"-37"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>37"-39"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>39"-42"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Waist</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>24"-26"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>26"-28"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>28"-30"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>30"-32"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>32"-35"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Hip</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>34"-36"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>36"-38"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>38"-40"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>40"-42"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>42"-44"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>Regular inseam</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>30"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>30½"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>31"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>31½"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>32"</Text>
                </View>
            </View>

            <View className='flex-row w-full justify-between mt-3 items-center p-1'>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>{'Long (Tall) Inseam'}</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>31½"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>32"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>32½"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33"</Text>
                </View>
                <View className='w-[15.5%] justify-center items-center'>
                    <Text className='text-black text-sm'>33½"</Text>
                </View>
            </View>
        </View>
    )
}

export default WomenSizeChartCard