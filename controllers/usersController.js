const { body, validationResult, matchedData } = require('express-validator');
const usersStorage = require('../storages/usersStorage');

const alphaErr = 'Must only contain letters.';
const lengthErr = 'Must be between 1 and 10 characters.';

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body('lastName').trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid')
        .normalizeEmail(),
    body('age').optional()
        .isInt({ min: 18, max: 120})
        .withMessage('Must be between 18 and 120'),
    body('bio').optional()
        .isLength({ max: 200 }),
];

exports.usersListGet = (req, res) => {
    res.render('index', {
        title: 'User List',
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req, res) => {
    res.render('createUser', {
        title: 'Create user',
    });
};

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser', {
        title: 'Update user',
        user: user,
    });
};

exports.usersSearchGet = (req, res) => {
    const userFound = req.query.firstName;

    // If not found, show all users or empty array
    const users = userFound ? usersStorage.getSearch(userFound) : [];

    res.render('search', {
        title: 'Search user',
        user: users,
    });
}

exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: 'Create user',
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = matchedData(req);
        usersStorage.addUser({ firstName, lastName, email, age, bio });
        res.redirect('/');
    }
];

exports.usersUpdatePost = [
    validateUser, 
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: 'Update user',
                user: user,
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = matchedData(req);
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect('/');
    }
];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
};