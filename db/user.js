const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const UserSchema = new Schema({
    _id: String,
    email: String,
    password: String,
    ID: String,
    telephone: String,
    username: String,
    status: {
        type: Boolean,
        default: true
    }
}, {collection: 'users'});

UserSchema.pre('save', function (next) {
    if (!this._id) {
        this._id = mongoose.Types.ObjectId().toString();
    }
    next();
});

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);
