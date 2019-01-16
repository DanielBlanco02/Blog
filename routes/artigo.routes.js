let Model = require('../models/artigo.model');


exports.index = async function(req, res) {

    let query = {};
    let page = req.query.page || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = limit * (page - 1);

    let all = await Model.find(query).skip(skip).limit(limit).sort({nome: 1}).populate(['comentarios', 'autor']);

    return res.send({result: all})
};

exports.getById = async function(req, res) {

    let id = req.params.id;

    let artigo = await Model.findOne({_id: id}).sort({nome: 1});

    return res.send({result: artigo})
};

exports.getByPermalink = async function(req, res) {

    let permalink = req.params.permalink;

    let artigo = await Model.findOne({permalink: permalink});

    return res.send({result: artigo ? artigo : []})
};


exports.store = async function(req, res, next) {

    try {
        let data = req.body;

        if(!data.autor){
            throw Error('Obrigatório definir autor')
        }

        let artigo = new Model(data);

        await artigo.save();


        return res.send({result: artigo})
    } catch(e) {
        next(e);
    }

};


exports.update = async function(req, res, next) {

    try {
        let id = req.params.id;

        let data = req.body;

        await Model.findOneAndUpdate({_id: id}, {$set: data});

        let updatedArtigo = await Model.findOne({_id: id});


        return res.send({result: updatedArtigo})
    } catch(e) {
        next(e);
    }

};


exports.delete = async function(req, res, next) {

    let id = req.params.id;

    await Model.findOneAndRemove({_id: id});

    return res.send({result: 'deleted'});
};
