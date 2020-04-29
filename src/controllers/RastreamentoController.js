const { rastro } = require('rastrojs');
const EncomendaModel = require('../models/EncomendaModel');


module.exports = {

    async criarEncomenda(request, response) {
        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;
            let encomenda = await EncomendaModel.findOne({ codigoEncomenda });
            if (encomenda) {
                response.status(400);
                return response.send('Ja existe uma encomenda com o codigo informado');
            }

            // Busca via rastrojs
            const dadosCorreio = await rastro.track(codigoEncomenda);
            const { code, isInvalid, error } = dadosCorreio[0];
    
            if (!dadosCorreio || isInvalid) {                
                response.status(404);
                return response.send(`Nao encontrada encomenda nos correios com o codigo ${code} informado. Retorno erro correios : ${error}`);
            }

            encomenda = await incluirEncomenda(codigoEncomenda, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente, dadosCorreio);
        
            return response.json(encomenda);
            
        } catch (err) {
            response.status(500);
            return response.send('Erro geral : ' + err );
        }
        
    },

    async atualizarEncomenda(request, response) {
        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, dataEnvio, emailRemetente } = request.body;
            let encomenda = await EncomendaModel.findOne({ codigoEncomenda });
            if (!encomenda) {
                response.status(404);
                return response.send(`Nao encontrada encomenda cadastrada com o codigo ${codigoEncomenda} informado.`);
            }

            // Obtem os dados do correio atualizados
            const dadosCorreio = await rastro.track(codigoEncomenda);

            
            var query = {'codigoEncomenda': codigoEncomenda};
            let encomendaAtualizada;
            encomendaAtualizada.nomeDestinatario = nomeDestinatario;
            encomendaAtualizada.emailDestinatario = emailDestinatario;
            var dateParts = dataEnvio.split("/");            
            encomendaAtualizada.dataEnvio = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            encomendaAtualizada.emailRemetente = emailRemetente;
            encomendaAtualizada.tipoEncomenda = dadosCorreio[0].type;
            encomendaAtualizada.dataHoraUltimoStatus = dadosCorreio[0].updatedAt;
            encomendaAtualizada.local = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].locale;
            encomendaAtualizada.observacao = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].observation;
            encomendaAtualizada.ultimoStatus = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].status;
            
            EncomendaModel.findOneAndUpdate(query, encomendaAtualizada, {upsert: true}, function(err, doc) {
                if (err) return response.send(500, {error: err});
                return res.send('Dados atualizados com sucesso.');
            });
            
        } catch (err) {
            response.status(500);
            return response.send('Erro geral : ' + err );
        }
        
    },

    
    async listarEncomendas(request, response) {
        // TODO read from DB
        const listaRastreamento = Rastreamento.find();
        return response.json(listaRastreamento);
    },


    async atualizarStatus(request, response) {
        
        // TODO percorrer todos itens do usuario e atualizar os status
        // disparado por cron
        
        var codigo = request.query.codigoRastreamento;
        console.log(`chamando rastro para codigo ${codigo}...`);
        
        const dadosRastreamento = await rastro.track(codigo);
        console.log(dadosRastreamento);
                
        return response.json(dadosRastreamento);
    }
    
};

async function incluirEncomenda(codigoEncomenda, nomeDestinatario, emailDestinatario, dataEnvioJson, emailRemetente, dadosCorreio) {
    var dateParts = dataEnvioJson.split("/");
    let dataEnvio = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    const tipoEncomenda = dadosCorreio[0].type;
    let dataHoraUltimoStatus = dadosCorreio[0].updatedAt;
    const local = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].locale;
    const observacao = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].observation;
    const ultimoStatus = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].status;

    return await EncomendaModel.create({
        codigoEncomenda,
        nomeDestinatario,
        emailDestinatario,
        dataEnvio,
        emailRemetente,
        tipoEncomenda,
        ultimoStatus,
        dataHoraUltimoStatus,
        local,
        observacao
    });
}
