var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var comentarioSchema = new Schema({
    conteudo: {type: String, required:true},
    artigo: {type: Schema.ObjectId, ref: "Artigo", required: true},
    autor: {type: Schema.ObjectId, ref: "User", required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});


comentarioSchema.pre('save', function(next) {
    next();
});


var Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;
