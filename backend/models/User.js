const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        index: true,
        validate: {
            validator: function(str){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
            },
            message: (props) => `${props.value} is not a valid email`
        }
    },

    password: {
        type: String,
        required: [true, 'password is required']
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    cart: {
        type: Object,
        default: {
            total: 0,
            count: 0
        }
    },

    notifications: {
        type: Array,
        default: []
    },

    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]

}, {minimize: false});


UserSchema.statics.findUserByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if (!user) throw new Error('Invalid credentials');
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if(isSamePassword) return user;
    throw new Error('Invalid credentials');
}

// define a method called toJSON on UserSchema to remove sensitive info
// in this case is a password from user obj before converting it Json rep
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// before saving encrypt(hash) the password
UserSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        })
    })
})

UserSchema.pre('remove', function(next) {
    this.model('Order').remove({owner: this._id}, next);
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
