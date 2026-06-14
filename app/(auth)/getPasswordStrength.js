export const getPasswordStrength = (password) => {
    const hasLength8 = password.length >= 8;
    const hasLength12 = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (hasLength8) score++;
    if (hasLength12) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Strong requires everything
    if (
        password.length >= 12 &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial
    ) {
        return {
            label: 'Strong',
            color: '#22C55E',
            width: '100%',
        };
    }

    if (score >= 4) {
        return {
            label: 'Medium',
            color: '#F59E0B',
            width: '60%',
        };
    }

    return {
        label: 'Weak',
        color: '#EF4444',
        width: '25%',
    };
};