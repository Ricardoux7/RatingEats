import { body, validationResult } from 'express-validator';

const restaurantValidationRules = [ 
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({
            min: 2,
            max: 100,
        }).withMessage('Name must be between 2 and 100 characters'),
        
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({
            min: 10,
            max: 500
        }).withMessage('Description must be between 10 and 500 characters'),
        
    body('capacity')
        .notEmpty()
        .withMessage('Capacity is required')
        .isInt({
            min: 1,
            max: 150
        }).withMessage('Capacity must be a positive integer between 1 and 150'),
        
    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(), 
        
    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required.')
        .matches(/^(\+58[\s-]?)?(0?4(1[2-9]|2[0-9]|3[0-9]|4[0-8])[\s-]?[0-9]{3}[\s-]?[0-9]{4})$/)
        .withMessage('Invalid phone number format (e.g. 0412xxxxxxx).'),

    body('categories')
        .notEmpty().withMessage('Categories are required.')
        .isArray({ min: 1 }).withMessage('Categories must be an array with at least one item.'),

    body('geoLocation')
        .notEmpty().withMessage('GeoLocation is required.')
        .isArray({ min: 1, max: 1 }).withMessage('GeoLocation must be an array of one item in "latitude,longitude" format.'),

    body('schedule')
        .notEmpty().withMessage('Schedule is required.')
        .isString().withMessage('Schedule must be a string.')
        .isLength({ min: 3, max: 200 }).withMessage('Schedule must be between 3 and 200 characters.'),

    body('adress')
        .notEmpty().withMessage('Adress is required.')
        .trim()
        .isLength({
            min: 5,
            max: 200,
        }).withMessage('Adress must be between 5 and 200 characters'),
];

const updateRestaurantValidationRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 80 }).withMessage('Name must be between 3 and 80 characters.'),

    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),

    body('phoneNumber')
        .optional()
        .matches(/^(\+58[\s-]?)?(0?4(1[2-9]|2[0-9]|3[0-9]|4[0-8])[\s-]?[0-9]{3}[\s-]?[0-9]{4})$/)
        .withMessage('The phone number format is invalid (e.g. 0412xxxxxxx) and must have at least 11 characters.'),

    body('capacity')
        .optional()
        .isInt({ min: 1, max: 150 }).withMessage('Capacity must be an integer between 1 and 150.'),

    body('categories')
        .optional()
        .isArray({ min: 1 }).withMessage('Categories must be an array with at least one item.'),

    body('geoLocation')
        .optional()
        .isArray({ min: 2, max: 2 }).withMessage('GeoLocation must be an array of two coordinates (latitude, longitude).'),

    body('schedule')
        .optional()
        .isString().withMessage('Schedule must be a string.')
        .isLength({ min: 3, max: 200 }).withMessage('Schedule must be between 3 and 200 characters.'),

    body('adress')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters.'),

];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const errorsDetails = [];
    errors.array().map(err => errorsDetails.push({ field: err.param, message: err.msg }));
    return res.status(400).json({ message: 'Validation failed', errors: errorsDetails });
};

export { restaurantValidationRules, validate, updateRestaurantValidationRules };