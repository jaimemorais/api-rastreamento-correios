const axios = require('axios');
const EncomendaSchema = require('../models/EncomendaSchema');

const { rastro } = require('rastrojs');



module.exports = {

    async salvarItemRastreamento(request, response) {
    
        const { codigoItemRastreado, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;    
            
        let encomenda = await EncomendaSchema.findOne({ codigoItemRastreado });
        if (!encomenda) {
        
            const dadosRastreamento = await rastro.track(codigoItemRastreado);

            if (!dadosRastreamento) {
                // TODO response 400 
            }
            else {
                // TODO destructuring e salvar base
                // const {  } = dadosRastreamento;                
                                    
                encomenda = await EncomendaSchema.create({
                    codigoItemRastreado,
                    nomeDestinatario,
                    emailDestinatario,
                    dataEnvio,
                    emailRemetente
                });
            }
        }
    
        return response.json(encomenda);
    },

    
    async listagem(request, response) {
        // TODO read from DB
        const listaRastreamento = Rastreamento.find();
        return response.json(listaRastreamento);
    },

    async obterStatusAtualizado(request, response) {
        
        // TODO percorrer todos itens do usuario e atualizar os status
        // disparado por cron
        
        var codigo = request.query.codigoRastreamento;
        console.log(`chamando rastro para codigo ${codigo}...`);
        
        const dadosRastreamento = await rastro.track(codigo);
        console.log(dadosRastreamento);
                
        return response.json(dadosRastreamento);
    }
    
};