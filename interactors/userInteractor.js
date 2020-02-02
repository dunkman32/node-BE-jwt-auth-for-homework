const User = require('../db/user');
const security = require('../utils/security');
const ValidationError = require('../errors/validationError');
const httpStatus = require('http-status');
const AppError = require('../errors/appError');

async function createUser(user) {
    const {email, password} = user;
    const check = User.findOne({email}).exec();
    if (!check.length) {
        const newUser = new User({
            email,
            password: security.hashPassword(password),
            active: true,
        });
        const savedUser = await newUser.save();
        return savedUser;
    }

    throw new AppError('User already exists', httpStatus.BAD_REQUEST);
}

async function registerClient(body) {
    const resultUser = await User.findOne({email: body.email}).lean().exec();

    if (resultUser) throw new ValidationError('users with same email are not allowed');

    const object = {
        email: body.email,
        ID: body.ID,
        telephone: body.telephone,
        username: body.username,
        password: security.hashPassword(body.password),
    };
    let user = new User(object);

    await user.save();
}

module.exports = {
    registerClient,
    createUser
};
