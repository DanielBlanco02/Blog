
// Controllers
var user = require('./user.routes');
var artigo = require('./artigo.routes');
var comentario = require('./comentario.routes');

module.exports = function(app) {

    app.get('/usuarios', user.index);
    app.post('/usuarios', user.store);
    app.get('/usuarios/:id', user.getById);
    app.post('/usuarios/:id', user.update);
    app.delete('/usuarios/:id', user.delete);


    app.get('/artigos', artigo.index);
    app.post('/artigos', artigo.store);
    app.get('/artigos/:id', artigo.getById);
    app.post('/artigos/:id', artigo.update);
    app.delete('/artigos/:id/delete', artigo.delete);
    app.get('/artigos/permalink/:permalink', artigo.getByPermalink);


    app.get('/comentarios', comentario.index);
    app.post('/comentarios', comentario.store);
    app.get('/comentarios/:id', comentario.getById);
    app.post('/comentarios/:id', comentario.update);
    app.delete('/comentarios/:id/delete', comentario.delete);

};
