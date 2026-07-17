export const validateTradeField = (val, fieldName) => {
    if (typeof val !== 'string') return null;

    // Emoji Regex
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
    // Non-ASCII Regex
    const nonAsciiRegex = /[^\x00-\x7F]/;

    if (emojiRegex.test(val)) {
        return 'Emojis are not allowed';
    }
    if (nonAsciiRegex.test(val)) {
        return 'Only English characters are allowed';
    }
    
    return null;
};

export const validateTradeData = (data, requiredFields = []) => {
    const errors = {};

    // 1. Trim and Check Global Text Rules
    const trimmedData = {};
    Object.keys(data).forEach(key => {
        trimmedData[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
        const error = validateTradeField(trimmedData[key], key);
        if (error) {
            errors[key] = error;
        }
    });

    // 2. Position ID Validation
    if (!errors.position) {
        if (!trimmedData.position) {
            if (requiredFields.includes('position')) errors.position = 'Position ID is required';
        } else if (trimmedData.position.length > 20) {
            errors.position = 'Position ID cannot exceed 20 characters';
        } else if (!/^#[0-9]+$/.test(trimmedData.position)) {
            errors.position = 'Position ID is invaild';
        }
    }

    // 3. Symbol Validation
 if (!errors.symbol) {
    if (!trimmedData.symbol) {
        if (requiredFields.includes('symbol')) {
            errors.symbol = 'Symbol is required';
        }
    } else if (trimmedData.symbol.length > 30) {
        errors.symbol = 'Symbol cannot exceed 30 characters';
    } else if (!/^[a-zA-Z0-9.]+$/.test(trimmedData.symbol)) {
        errors.symbol =
            'Invalid symbol. Only English letters, numbers, and periods (.) are allowed.';
    }
}

    // 4. Volume Validation
    if (!errors.volume) {
        if (!trimmedData.volume) {
            if (requiredFields.includes('volume')) errors.volume = 'Volume is required';
        } else {
            if (isNaN(trimmedData.volume) || parseFloat(trimmedData.volume) <= 0) {
                errors.volume = 'Volume must be a valid positive number';
            } else if (!/^\d{1,10}(\.\d{1,3})?$/.test(trimmedData.volume)) {
                errors.volume = 'Max 10 digits before decimal, max 3 after';
            }
        }
    }

    // 5. Numeric Fields Validation
    const numberFields = ['commission', 'swap', 'profit_percent', 'entry_price', 'exit_price', 'stop_loss', 'take_profit', 'profit'];
    numberFields.forEach(field => {
        if (!errors[field] && trimmedData[field] !== undefined && trimmedData[field] !== '') {
            if (isNaN(trimmedData[field])) {
                errors[field] = 'Must be a valid number';
            }
        }
    });

    // 6. Basic Required Fields
    requiredFields.forEach(field => {
        if (!errors[field] && !trimmedData[field]) {
            const label = field.replace('_', ' ');
            errors[field] = `${label.charAt(0).toUpperCase() + label.slice(1)} is required`;
        }
    });

    return { errors, trimmedData };
};
