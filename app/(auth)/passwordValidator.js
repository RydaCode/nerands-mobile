const COMMON_PASSWORDS = new Set([
    'password',
    'password1',
    'admin',
    'admin123',
    'qwerty',
    'abc123',
    'letmein',
    'passw0rd',
    'welcome',
    'welcome1',
    'nerands',
    'nerands123',
]);

export const isValidPassword = (password) => {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
};

export const isCommonPassword = (password) => {
    return COMMON_PASSWORDS.has(password.toLowerCase());
};

export const hasRepeatedChars = (password) => {
    return /(.)\1{3,}/.test(password);
};

export const hasSimpleSequence = (password) => {
    const lower = password.toLowerCase();

    const sequences = [
        '123456',
        '234567',
        '345678',
        '456789',
        'abcdef',
        'qwerty',
        'asdfgh',
        'zxcvbn',
    ];

    return sequences.some(seq => lower.includes(seq));
};

export const getPasswordError = (password) => {
    if (!password) {
        return 'Password is required';
    }

    if (!isValidPassword(password)) {
        return 'Password must be at least 8 characters and include uppercase, lowercase and a number';
    }

    if (isCommonPassword(password)) {
        return 'This password is too common';
    }

    if (hasRepeatedChars(password)) {
        return 'Avoid repeated characters';
    }

    if (hasSimpleSequence(password)) {
        return 'Avoid predictable sequences';
    }

    return null;
};

// Detecting password containing users personal info
export const containsPersonalInfo = (
    password,
    email = '',
    phone = ''
) => {
    const pwd = password.toLowerCase();

    if (email) {
        const emailName = email.split('@')[0].toLowerCase();

        if (emailName.length >= 3 && pwd.includes(emailName)) {
            return true;
        }
    }

    if (phone) {
        const digits = phone.replace(/\D/g, '');

        if (digits.length >= 4 && pwd.includes(digits.slice(-4))) {
            return true;
        }
    }

    return false;
};