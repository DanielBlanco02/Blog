module.exports = function(req, res, next) {
    if (! req.user) {
        req.flash('danger', 'Você deve estar logado para acessar esta página');
        return res.redirect('/login');
    }

    if (req.user.status == 2) {
        req.logout();
        req.flash('danger', 'Atenção! Este usuário está INATIVO.');
        return res.redirect('/login');
    }

    if (req.user.must_change_password) {
        return res.render('nova_senha');
    }

    next();
};
