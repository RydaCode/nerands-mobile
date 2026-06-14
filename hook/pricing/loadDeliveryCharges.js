import { setCharges } from '../../redux/store/slices/DeliverySlice';
import axiosInstance from '../axiosInstance';

const api = axiosInstance;

export const loadDeliveryCharges = () => async (dispatch) => {
    const api = axiosInstance;

    const tryFetch = async (attempt = 1) => {
        try {
            const res = await api.get("/admin/charges");

            const map = {};
            res.data.charges.forEach((item) => {
                map[item.charge_type] = Number(item.charge_percent);
            });

            dispatch(setCharges({
                baseFee: map.base_fee || 0,
                ratePerKm: map.rate_per_km || 0,
                serviceCharge: map.service_charge || 0,
                maxDistance: {
                    foot: map.foot_distance || 100,
                    bike: map.bike_distance || 100,
                    motorBike: map.motor_bike_distance || 100,
                    motorCar: map.motor_car_distance || 100
                }
            }));

        } catch (err) {
            console.log(`Pricing fetch failed (attempt ${attempt})`, err.message);

            // retry in background
            setTimeout(() => {
                tryFetch(attempt + 1);
            }, Math.min(10000, attempt * 2000));
        }
    };
    tryFetch();
};