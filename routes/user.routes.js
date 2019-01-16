let Model = require('../models/user.model');
var passwordHash = require('password-hash');


exports.registerForm = function(req, res) {
    res.render('admin/register');
};
exports.register = function(req, res, next) {

    var user = new Model;
    user.password = req.body.password;
    user.name = req.body.name;

    user.save(function(err, saveduser) {
        if (err) {next(err)};
        req.flash('success', 'Você foi registrado com sucesso!');
        res.redirect('/login');
    });

};


exports.index = async function(req, res) {

    let query = {};
    let page = req.query.page || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = limit * (page - 1);

    let all = await Model.find(query).skip(skip).limit(limit).sort({nome: 1});

    console.log('all', all);

    return res.send({result: all})
};

exports.getById = async function(req, res) {

    let id = req.params.id;

    let user = await Model.findOne({_id: id}).sort({nome: 1});

    console.log('all', user);


    return res.send({result: user})
};

// exports.create = async function(req, res) {
//     let one = new Model;
//
//     if (req.query.tipo) {
//         one.tipo = req.query.tipo;
//     }
//
//     // let locais = await Local.find({tipo: "UNIDADE"}).sort('nome');
//
//     return res.render('usuarios/form', {mode: 'create', one: one});
// };


exports.store = async function(req, res, next) {

    try {
        let data = req.body;


        console.log("data", data);

        data.password = Math.random().toString(36).substring(7);

        let user = new Model(data);

        await user.save();

        console.log('result', user);

        return res.send({result: user})
    } catch(e) {
        next(e);
    }



};

var passwordHash = require('password-hash');

exports.reset_pass_via_admin = async function(req, res, next) {

    try {

        const user = await Model.findOne({_id: req.params.id});

        const pass = Math.random().toString(36).substring(7);
        const hashed_pass = passwordHash.generate(pass);

        const data = {password: hashed_pass};

        await Model.findOneAndUpdate({_id: req.params.id}, {$set: data}, { runValidators: true, context: 'query' });

        req.flash('success', 'Nova senha foi disparada com sucesso!');

        //enviar email

        res.redirect('/usuarios');
    } catch(e) {
        next(e);
    }

};

exports.edit = async function(req, res, next) {

    let id = req.params.id;

    let one = await Model.findOne({_id: id});

    // let locais = await Local.find({tipo: "UNIDADE"}).sort('nome');

    return res.render("usuarios/form", {mode : "edit", one: one});

};

exports.update = async function(req, res, next) {

    try {
        let id = req.params.id;

        let data = req.body;

        console.log("data", data);


        if (req.body.new_password) {
            data.password = passwordHash.generate(req.body.new_password);
        }

        await Model.findOneAndUpdate({_id: id}, {$set: data}, { runValidators: true, context: 'query' });

        let updateduser = await Model.findOne({_id: id});

        console.log('atualizado', updateduser);

        return res.send({result: updateduser})
    } catch(e) {
        next(e);
    }



};

// exports.ativar = async function(req, res, next) {
//
//     try {
//         let id = req.params.id;
//
//         const data = {
//             status: 1
//         };
//
//         await Model.findOneAndUpdate({_id: id}, {$set: data}, { runValidators: true, context: 'query' });
//
//         req.flash('success', 'Registro atualizado com sucesso');
//         return res.redirect('/usuarios');
//     } catch(e) {
//         next(e);
//     }
//
// };
//
// exports.desativar = async function(req, res, next) {
//
//     try {
//         let id = req.params.id;
//
//         const data = {
//             status: 2
//         };
//
//         await Model.findOneAndUpdate({_id: id}, {$set: data}, { runValidators: true, context: 'query' });
//
//         req.flash('success', 'Registro atualizado com sucesso');
//         return res.redirect('/usuarios');
//     } catch(e) {
//         next(e);
//     }
//
// };


exports.delete = async function(req, res, next) {

    let id = req.params.id;

    await Model.findOneAndRemove({_id: id});

    req.flash('success', 'Registro removido com sucesso!');
    return res.redirect('/usuarios')

};
