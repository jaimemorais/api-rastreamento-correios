const { rastro } = require('rastrojs');
const EncomendaModel = require('../models/EncomendaModel');


module.exports = {

    async criarEncomenda(req, res) {
        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente } = req.body;
            let encomenda = await EncomendaModel.findOne({ codigoEncomenda });
            if (encomenda) {
                res.status(400);
                return res.send('Ja existe uma encomenda com o codigo informado');
            }

            // Busca via rastrojs
            const dadosCorreio = await rastro.track(codigoEncomenda);
            const { code, isInvalid, error } = dadosCorreio[0];
    
            if (!dadosCorreio || isInvalid) {                
                res.status(404);
                return res.send(`Nao encontrada encomenda nos correios com o codigo ${code} informado. Retorno erro correios : ${error}`);
            }

            encomenda = await incluirEncomenda(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio);
        
            return res.json(encomenda);
            
        } catch (err) {
            res.status(500);
            return res.send('Erro geral : ' + err );
        }
        
    },


    async atualizarEncomenda(req, res) {
        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente } = req.body;
            let encomendaAtualizar = await EncomendaModel.findOne({ codigoEncomenda });3
            if (!encomendaAtualizar) {
                res.status(404);
                return res.send(`Nao encontrada encomenda cadastrada com o codigo ${codigoEncomenda} informado.`);
            }

            const dadosCorreioAtualizados = await rastro.track(codigoEncomenda);

            encomendaAtualizar.nomeDestinatario = nomeDestinatario;
            encomendaAtualizar.emailDestinatario = emailDestinatario;            
            encomendaAtualizar.emailRemetente = emailRemetente;
            encomendaAtualizar.tipoEncomenda = dadosCorreioAtualizados[0].type;
            encomendaAtualizar.dataEnvio = dadosCorreioAtualizados[0].postedAt;
            encomendaAtualizar.dataHoraUltimoStatus = dadosCorreioAtualizados[0].updatedAt;
            encomendaAtualizar.local = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].locale;
            encomendaAtualizar.observacao = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].observation;
            encomendaAtualizar.ultimoStatus = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].status;

            var query = {'codigoEncomenda': codigoEncomenda};

            EncomendaModel.update(query, encomendaAtualizar, function(err, doc) {
                if (err) return res.send(500, {error: err});
                return res.send('Dados atualizados com sucesso.');
            });

        } catch (err) {
            res.status(500);
            return res.send('Erro geral : ' + err );
        }
        
    },

    
    async listarEncomendas(req, res) {
        EncomendaModel.find().lean().exec(function (err, encomendas) {
            if (err) return res.send(500, {error: err});
            return res.send(JSON.stringify(encomendas));
        });
    },


    async atualizarStatus(req, res) {
        
        // TODO percorrer todos itens do usuario e atualizar os status
        // disparado por cron
        // send sms for the changed statuses
        
        var codigo = req.query.codigoRastreamento;
        console.log(`chamando rastro para codigo ${codigo}...`);
        
        const dadosRastreamento = await rastro.track(codigo);
        console.log(dadosRastreamento);
                
        return res.json(dadosRastreamento);
    }
    
};

async function incluirEncomenda(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio) {    
    const tipoEncomenda = dadosCorreio[0].type;
    const dataEnvio = dadosCorreio[0].postedAt;
    const dataHoraUltimoStatus = dadosCorreio[0].updatedAt;
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
