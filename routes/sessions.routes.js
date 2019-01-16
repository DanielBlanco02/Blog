var passport = require('passport');
var passwordHash = require('password-hash');

var User = require('../models/user.model');

exports.loginForm = function(req, res) {
    res.render('admin/login', { captcha:res.recaptcha });
};


exports.login = function(req, res, next) {

    req.body.username = req.body.username.toLowerCase();

    // if (req.recaptcha.error) {
    //     req.flash('danger', 'A validação recaptcha falhou.');
    //     return res.redirect('/login');
    // }

    passport.authenticate('local', function(err, user, info) {
        if (err) {next(err)};

        if (!user) {
            req.flash('danger', 'Usuário e/ou senha inválidos.');
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }


            req.flash('success', 'Você foi logado com sucesso!');
            return res.redirect('/');
        });

    })(req, res, next);
};

exports.new_pass = async function(req, res, next) {

    if (req.body.password != req.body.password_confirmation) {
        req.flash('danger', 'As duas senhas devem ser iguais.');
        return res.redirect('back');
    }

    await User.findOneAndUpdate({_id: req.user._id}, {$set: {must_change_password: false, password: passwordHash.generate(req.body.password)}});

    req.flash('success', 'Sua nova senha foi salva com sucesso!');
    return res.redirect('/');

};

exports.logout = function(req, res) {
    req.logout();
    req.flash('success', 'Você foi deslogado com sucesso!');
    return res.redirect('/login');
};
