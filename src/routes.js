const { Router } = require('express');

const RastreamentoController = require('./controllers/RastreamentoController')

const routes = Router();

routes.post('/criarEncomenda', RastreamentoController.criarEncomenda);

routes.get('/listagem', RastreamentoController.listagem);

routes.get('/obterStatusAtualizados', RastreamentoController.obterStatusAtualizados);

module.exports = routes