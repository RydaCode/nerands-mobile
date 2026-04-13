import { FontAwesome5 } from '@expo/vector-icons';
import haversine from 'haversine-distance';
import { Linking, Platform } from 'react-native';

const ICON_SIZE = 12;

/** -------------------------
 * Ensure coordinates are valid numbers
 * Converts strings → numbers
 * ------------------------- */
export const normalizeCoords = (point) => {
  if (!point) return null;

  const latitude = Number(point.latitude);
  const longitude = Number(point.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

/** -------------------------
 *  Normalize courier types
 *  Converts to uppercase and replaces spaces/dashes with underscores
 * ------------------------- */
export const normalizeCourierType = (type) => {
  if (!type) return null;
  return type.toString().trim().toUpperCase().replace(/[-\s]/g, '_');
};

/** -------------------------
 *  Courier type → speed in km/h
 * ------------------------- */
export const DELIVERY_MODE_SPEED = {
  FOOT: 5,
  BIKE: 20,
  MOTOR_BIKE: 30,
  MOTOR_CAR: 40,
};

/** -------------------------
 *  Courier type → FontAwesome5 icon
 * ------------------------- */
export const getCourierIcon = (courierType, color) => {
  const normalizedType = normalizeCourierType(courierType);

  const ICON_MAP = {
    FOOT: 'walking',
    BIKE: 'bicycle',
    MOTOR_BIKE: 'motorcycle',
    MOTOR_CAR: 'car',
  };

  const iconName = ICON_MAP[normalizedType];
  if (!iconName) return null;

  return <FontAwesome5 name={iconName} size={ICON_SIZE} color={color} />;
};

/** -------------------------
 *  Calculate distance between two points
 *  Returns in meters if < 1km, otherwise in km
 * ------------------------- */
export const calculateDistance = (pointA, pointB) => {
  const a = normalizeCoords(pointA);
  const b = normalizeCoords(pointB);

  if (!a || !b) return 'Calculating';

  const distanceKm = haversine(a, b) / 1000;

  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)}m`
    : `${distanceKm.toFixed(2)}km`;
};

/** -------------------------
 *  Estimate delivery time based on distance and courier type
 * ------------------------- */
export const estimateTime = (pointA, pointB, courierType) => {
  const a = normalizeCoords(pointA);
  const b = normalizeCoords(pointB);

  if (!a || !b) return 'Calculating';

  const normalizedType = normalizeCourierType(courierType);
  const speedKmh = DELIVERY_MODE_SPEED[normalizedType];

  if (!speedKmh) return 'Calculating';

  const distanceKm = haversine(a, b) / 1000;
  const totalMinutes = Math.max(1, Math.ceil((distanceKm / speedKmh) * 60));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`
    : `${minutes} min`;
};

/** -------------------------
 *  Make a phone call
 * ------------------------- */
export const makeCall = (phone) => {
  const cleanPhone = phone.replace(/^0/, '');
  const url =
    Platform.OS === 'android'
      ? `tel:+260${cleanPhone}`
      : `telprompt:+260${cleanPhone}`;

  Linking.openURL(url);
};

/** Courier type → max distance for UI display (km) */
export const DISPLAY_MAX_DISTANCE = {
  FOOT: 2,
  BIKE: 3,
  MOTOR_BIKE: 40,
  MOTOR_CAR: 50,
};

/** Calculate distance with optional UI cap */
export const calculateDisplayDistance = (pointA, pointB, courierType) => {
  const a = normalizeCoords(pointA);
  const b = normalizeCoords(pointB);

  if (!a || !b) return 'Calculating';

  const normalizedType = normalizeCourierType(courierType);
  const maxDistance = DISPLAY_MAX_DISTANCE[normalizedType];

  let distanceKm = haversine(a, b) / 1000;

  if (maxDistance) {
    distanceKm = Math.min(distanceKm, maxDistance);
  }

  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} M`
    : `${distanceKm.toFixed(2)} km`;
};