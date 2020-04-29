const { Router } = require('express');

const RastreamentoController = require('./controllers/RastreamentoController')

const routes = Router();

routes.post('/criarEncomenda', RastreamentoController.criarEncomenda);
routes.put('/atualizarEncomenda', RastreamentoController.atualizarEncomenda);

routes.get('/listarEncomendas', RastreamentoController.listarEncomendas);

routes.get('/atualizarStatus', RastreamentoController.atualizarStatus);

module.exports = routes