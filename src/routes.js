const { Router } = require('express');

const RastreamentoController = require('./controllers/RastreamentoController')

const routes = Router();

routes.post('/rastreamento', RastreamentoController.salvarItemRastreamento);

routes.get('/listagem', RastreamentoController.listagem);

routes.get('/obterStatusAtualizado', RastreamentoController.obterStatusAtualizado);

module.exports = routes