const { rastro } = require('rastrojs');
const EncomendaSchema = require('../models/EncomendaSchema');


module.exports = {

    async criarEncomenda(request, response) {

        const { codigoEncomenda, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;    

        let encomenda = await EncomendaSchema.findOne({ codigoEncomenda });
        if (encomenda) {
            response.status(400);
            return response.send('Ja existe uma encomenda com o codigoEncomenda informado');
        }
        
        /*
        try {
            const jsonDadosCorreio = await rastro.track(codigoEncomenda);

            const dadosCorreio = JSON.parse(jsonDadosCorreio);
            const { code, isInvalid, error } = dadosCorreio;
            console.log(dadosCorreio);
    
            if (!jsonDadosCorreio || isInvalid) {                
                response.status(404);
                return res.send('Nao encontrada encomenda nos correios com o codigo informado. Retorno erro correios : ' + error );
            }

        } catch (err) {
            response.status(500);
            return res.send('Erro geral : ' + err );
        }

          */  
        // TODO destructuring nos dados do correio e setar os campos
        // const { } = dadosCorreio;
        
        encomenda = await EncomendaSchema.create({
            codigoEncomenda,
            nomeDestinatario,
            emailDestinatario,
            dataEnvio,
            emailRemetente
        })
        .catch(err => {
            console.log(err);
        });
    
        return response.json(encomenda);
    },

    
    async listagem(request, response) {
        // TODO read from DB
        const listaRastreamento = Rastreamento.find();
        return response.json(listaRastreamento);
    },

    async obterStatusAtualizados(request, response) {
        
        // TODO percorrer todos itens do usuario e atualizar os status
        // disparado por cron
        
        var codigo = request.query.codigoRastreamento;
        console.log(`chamando rastro para codigo ${codigo}...`);
        
        const dadosRastreamento = await rastro.track(codigo);
        console.log(dadosRastreamento);
                
        return response.json(dadosRastreamento);
    }
    
};