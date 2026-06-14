import { Text, View } from 'react-native';

const StatsCards = ({ stats, runner }) => {
    return (
        <View className="bg-white">
            <View className="w-full flex-row justify-between items-center">
                <Card value={stats.available} label="Active Errands" text='Purchased errands to be used' />
                <Card value={stats.completed} label="Completed Errands" text='Errands completed for a particular month' />
            </View>

            <View className="mt-4 rounded border border-lavender elevation-sm bg-white p-2 justify-center items-center w-full" style={{ height: 90 }}>
                <Text className="text-xl text-indigo-600" style={{ fontFamily: 'roboto-bold' }}>
                    K{runner?.runner_actual_bonus || 0}
                </Text>
                <Text className="text-base text-indigo-600" style={{ fontFamily: 'roboto-medium' }}>
                    Total Earnings
                </Text>
                <Text className="text-sm text-slate" style={{ fontFamily: 'roboto' }}>
                    This is the total bonus that can only be withdrawen at the end of the month.
                </Text>
            </View>

            <View className="w-full flex-row justify-between items-center mt-4">
                <Card value={stats.daily} label="Daily Errands" text='Completed errands for a particular day' />
                <Card value={stats.cancelled} label="Cancelled Errands" text='Cancellled errands for a particular day' />
            </View>
        </View>
    );
}

const Card = ({ value, label, text }) => (
    <View className="bg-white border border-lavender rounded-md justify-center items-center elevation-sm p-1" style={{ width: '48%', height: 105 }}>
        <Text className="text-xl text-red" style={{ fontFamily: 'roboto-bold' }}>{value}</Text>
        <Text className="text-base text-red" style={{ fontFamily: 'roboto-medium' }}>{label}</Text>
        <View className='w-full bg-lavender my-1' style={{height: 1}}/>
        <Text className="text-sm text-black" style={{ fontFamily: 'roboto' }}>{text}</Text>
    </View>
);

export default StatsCards;