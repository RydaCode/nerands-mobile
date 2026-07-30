import { registerDevice } from "../../services/notificationService";
import { toast } from "../../utils/toast";

const ValidateOTP = ({ purpose, otp_type, contact, otp, user_id }) => {
    if (!user_id) {
        toast.error('User does not exist');
        return false;
    }

    if (!purpose) {
        toast.error('Purpose of this action not known');
        return false;
    }

    if (!otp_type) {
        toast.error('Contact type not known');
        return false;
    }

    if (!contact && purpose !== 'register') {
        toast.error(
            otp_type === 'email'
                ? 'Email address unavailable'
                : 'Phone number unavailable'
        );
        return false;
    }

    if (!otp || !Array.isArray(otp)) {
        toast.error(
            `Please enter the code that was sent to your ${
                otp_type === 'email' ? 'email address' : 'phone number'
            }`
        );
        return false;
    }

    const otpCode = otp.join('');

    if (!/^\d{6}$/.test(otpCode)) {
        toast.error('Please enter a valid 6-digit code');
        return false;
    }

    return true;
};

// OTP Login verification
export const handleVerifyOTPLogin = async ({ purpose, otp_type, contact, otp, user_id, post }) => {
    if (!ValidateOTP({ purpose, otp_type, contact, otp, user_id })) {
        return { success: false };
    }

    try {
        const res = await post({ contact, otp_type, purpose, user_id, otp: otp.join('') });

        if (!res?.data?.data?.success) {
            toast.error(res?.data?.data?.message || 'Verification failed');
            return {
                success: false,
                message: res?.data?.data?.message,
            };
        }

        // Register device AFTER login is confirmed
        await registerDevice();
        toast.success(res?.data?.data?.message || 'OTP verified successfully');

        return {
            success: true,
            data: res?.data?.data
        };
    } catch (error) {
        toast.error('An error occurred, please try again');

        return {
            success: false,
            error,
        };
    }
};

// OTP registration verication
export const handleVerifyOTPRegister = async ({ contact, purpose, otp_type, otp, user_id, post }) => {
    if (!ValidateOTP({ contact, purpose, otp_type, otp, user_id })) {
        return { success: false };
    }

    try {
        const res = await post({ contact, otp_type, purpose, user_id, otp: otp.join('') });

        if (!res?.data?.data?.success) {
            toast.error(res?.data?.data?.message || 'Verification failed');
            return {
                success: false,
                message: res?.data?.data?.message,
            };
        }

        toast.success(res?.data?.data?.message || 'OTP verified successfully');
        // Register device AFTER login is confirmed
        await registerDevice();
        return {
            success: true,
            data: res?.data?.data
        };
    } catch (error) {
        toast.error('An error occurred, please try again');

        return {
            success: false,
            error,
        };
    }
}

// OTP reset password verication
export const handleVerifyOTPResetPassword = async ({purpose, otp_type, contact, otp, user_id, post}) => {
    if (!ValidateOTP({ purpose, otp_type, contact, otp, user_id })) {
        return { success: false };
    }

    try {
        const res = await post({ contact, otp_type, purpose, user_id, otp: otp.join('') });

        if (!res?.success) {
            toast.error(res?.message || 'Verification failed');
            return {
                success: false,
                message: res?.message,
            };
        }

        toast.success(res.message || 'OTP verified successfully');
        // Register device AFTER login is confirmed
        await registerDevice();
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        toast.error('An error occurred, please try again');

        return {
            success: false,
            error,
        };
    }
}