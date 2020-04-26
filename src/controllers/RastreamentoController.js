const axios = require('axios');
const Rastreamento = require('../models/ItemRastreamento');

const { rastro } = require('rastrojs');



module.exports = {

    async salvarItemRastreamento(request, response) {
    
        const { codigoItemRastreado, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;    
            
        let itemRastreamento = await Rastreamento.findOne({ codigoItemRastreado });
        if (!itemRastreamento) {
        
            const dadosRastreamento = await rastro.track(codigoItemRastreado);

            if (!dadosRastreamento) {
                // TODO response 400 
            }
            else {
                // TODO destructuring e salvar base
                // const {  } = dadosRastreamento;                
                                    
                itemRastreamento = await Rastreamento.create({
                    codigoItemRastreado,
                    nomeDestinatario,
                    emailDestinatario,
                    dataEnvio,
                    emailRemetente
                });
            }
        }
    
        return response.json(itemRastreamento);
    },

    
    async listagem(request, response) {
        // TODO read from DB
        const listaRastreamento = Rastreamento.find();
        return response.json(listaRastreamento);
    },

    async obterStatusAtualizado(request, response) {
        
        // TODO percorrer todos itens do usuario e atualizar os status
        // disparado por cron

        // http://localhost:3333/obterStatusAtualizado?codigoRastreamento=JT124720455BR
        var codigo = request.query.codigoRastreamento;
        console.log(`chamando rastro para codigo ${codigo}...`);
        
        const dadosRastreamento = await rastro.track(codigo);
        console.log(dadosRastreamento);
                
        return response.json(dadosRastreamento);
    }
    
};