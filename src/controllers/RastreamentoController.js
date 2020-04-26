const axios = require('axios');
const Rastreamento = require('../models/ItemRastreamento');

module.exports = {

    async salvarItemRastreamento(request, response) {
    
        //console.log (request.body);    
        
        const { codigoItemRastreado, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;    
        
    
        let itemRastreamento = await Rastreamento.findOne({ codigoItemRastreado });
        if (!itemRastreamento) {
            

            const correiosResponse = await axios.get(`${process.env.URL_SERVICO_CORREIOS}${codigoItemRastreado}`); 
            //console.log(correiosResponse.data);
            
                        
            // TODO destructuring
            // const {  } = correiosResponse.data;    
            
                                
            itemRastreamento = await Rastreamento.create({
                codigoItemRastreado,
                nomeDestinatario,
                emailDestinatario,
                dataEnvio,
                emailRemetente
            });
        }
    
        return response.json(itemRastreamento);
    },

    
    async listagem(request, response) {
        const listaRastreamento = await Rastreamento.find();
        return response.json(listaRastreamento);
    }
    
};