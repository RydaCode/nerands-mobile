import axiosInstance from "../axiosInstance";
const api = axiosInstance;

export const fetchBaseFee = () =>
    api.get("/admin/charges/base_fee/");

export const fetchRatePerKm = () =>
    api.get("/admin/charges/rate_per_km/");

export const fetchFootDistance = () =>
    api.get("/admin/charges/foot_distance/");

export const fetchBikeDistance = () =>
    api.get("/admin/charges/bike_distance/");

export const fetchMotorBikeDistance = () =>
    api.get("/admin/charges/motor_bike_distance/");

export const fetchMotorCarDistance = () =>
    api.get("/admin/charges/motor_car_distance/");

export const fetchServiceCharge = () =>
    api.get("/admin/charges/service_charge/");