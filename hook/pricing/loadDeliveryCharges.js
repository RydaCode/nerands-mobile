import { setCharges } from '../../redux/store/slices/DeliverySlice';
import { toast } from '../../utils/toast';
import {
    fetchBaseFee,
    fetchBikeDistance,
    fetchFootDistance,
    fetchMotorBikeDistance,
    fetchMotorCarDistance,
    fetchRatePerKm,
    fetchServiceCharge
} from './pricingApi';

export const loadDeliveryCharges = () => async (dispatch, getState) => {
    const { charges } = getState().delivery;

    if (charges) return;

    try {
        const [
            baseRes,
            rateRes,
            footRes,
            bikeRes,
            motorBikeRes,
            motorCarRes,
            serviceCharge
        ] = await Promise.all([
            fetchBaseFee(),
            fetchRatePerKm(),
            fetchFootDistance(),
            fetchBikeDistance(),
            fetchMotorBikeDistance(),
            fetchMotorCarDistance(),
            fetchServiceCharge()
        ]);

        dispatch(setCharges({
            baseFee: Number(baseRes?.data?.charges?.[0]?.charge_percent ?? 0),
            ratePerKm: Number(rateRes?.data?.charges?.[0]?.charge_percent ?? 0),
            serviceCharge: Number(serviceCharge?.data?.charges?.[0]?.charge_percent ?? 0),
            maxDistance: {
                foot: Number(footRes?.data?.charges?.[0]?.charge_percent ?? 100),
                bike: Number(bikeRes?.data?.charges?.[0]?.charge_percent ?? 100),
                motorBike: Number(motorBikeRes?.data?.charges?.[0]?.charge_percent ?? 100),
                motorCar: Number(motorCarRes?.data?.charges?.[0]?.charge_percent ?? 100)
            }
        }));
    } catch (err) {
        toast.info('Failed to load delivery charges');
        console.log("Failed to load delivery charges:", err);
    }
};