const { Router } = require('express');

const RastreamentoController = require('./controllers/rastreamento-controller')

const routes = Router();

routes.get('/encomenda/:codigoEncomenda', RastreamentoController.obterEncomenda);
routes.post('/criarEncomenda', RastreamentoController.criarEncomenda);
routes.put('/atualizarEncomenda', RastreamentoController.atualizarEncomenda);
routes.get('/listarEncomendas', RastreamentoController.listarEncomendas);
routes.get('/atualizarStatusTodasEncomendas', RastreamentoController.atualizarStatusTodasEncomendas);

module.exports = routes