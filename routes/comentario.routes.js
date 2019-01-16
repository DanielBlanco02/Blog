let Model = require('../models/comentario.model');
let Artigo = require('../models/artigo.model');

exports.index = async function(req, res) {

    let query = {};
    let page = req.query.page || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = limit * (page - 1);

    let all = await Model.find(query).skip(skip).limit(limit).sort({nome: 1});

    return res.send({result: all})
};

exports.getById = async function(req, res) {

    let id = req.params.id;

    let comentario = await Model.findOne({_id: id}).sort({nome: 1});

    return res.send({result: comentario})
};


exports.store = async function(req, res, next) {

    try {
        let data = req.body;

        console.log("data", data);

        let artigo = await Artigo.findOne({_id: data.artigo});

        if(!artigo){
            return res.send({result: 'Artigo nao encontrado'});
        }

        let comentario = new Model(data);

        await comentario.save();

        await Artigo.update({_id: data.artigo},{$addToSet: {comentarios: comentario._id}});

        return res.send({result: comentario})
    } catch(e) {
        next(e);
    }

};


exports.update = async function(req, res, next) {

    try {
        let id = req.params.id;

        let data = req.body;

        await Model.findOneAndUpdate({_id: id}, {$set: data});

        let updatedComentario = await Model.findOne({_id: id});

        return res.send({result: updatedComentario})
    } catch(e) {
        next(e);
    }

};


exports.delete = async function(req, res, next) {

    let id = req.params.id;

    await Model.findOneAndRemove({_id: id});

    return res.send({result: 'deleted'});
};
