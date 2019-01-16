var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var artigoSchema = new Schema({
    titulo: {type: String, required:true},
    subtitulo: String,
    conteudo_do_artigo: String,
    autor: [{type: Schema.ObjectId, ref: "User", required: true}],
    comentarios: [{type: Schema.ObjectId, ref: "Comentario", required: true}],
    permalink: {type: String, unique: true, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});


artigoSchema.pre('save', function(next) {
    next();
});


var Artigo = mongoose.model('Artigo', artigoSchema);

module.exports = Artigo;
