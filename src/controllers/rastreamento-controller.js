const { rastro } = require('rastrojs');
const EncomendaModel = require('../models/encomenda-model');
const enviarEmail = require('../mail/mail-sender');

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

            encomenda = await salvarEncomendaMongo(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio);
        
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

            var infoUpdate = await atualizarEncomendaMongo(encomendaAtualizar, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreioAtualizados);

            return (!infoUpdate) ? 
                res.send(500, 'Erro ao atualizar. infoUpdate null') : 
                (infoUpdate.nModified === 0 ? res.send('Documento nao atualizado pois nao houveram modificacoes.') : res.send('Documento atualizado no banco de dados.'));

        } catch (err) {
            res.status(500);
            return res.send('Erro geral : ' + err );
        }
        
    },

    
    async obterEncomenda(req, res) {
        var query = { 'codigoEncomenda': req.params.codigoEncomenda };
        
        EncomendaModel.findOne(query, function (err, encomenda) {
            if (err) 
                return res.send(500, {error: err});

            return res.json(encomenda);
        }); 
    },

    
    async listarEncomendas(req, res) {
        EncomendaModel.find().lean().exec(function (err, encomendas) {
            if (err) 
                return res.send(500, {error: err});

            return res.json(encomendas);
        }); 
    },


    async atualizarStatusTodasEncomendas(req, res) {
        EncomendaModel.find().lean().exec(function (err, encomendas) {
            
            if (err) {
                return res.send(500, {error: err});
            }                
            
            encomendas.forEach(async encomenda => {

                try {
                    console.log(`Verificando ${encomenda.codigoEncomenda} ...`);

                    var dadosCorreio = await rastro.track(encomenda.codigoEncomenda)
                    
                    if (Date.parse(encomenda.dataHoraUltimoStatus) !== Date.parse(dadosCorreio[0].updatedAt)) {
                        console.log(`${encomenda.codigoEncomenda} possui atualizacao, salvando banco de dados...`);
                        
                        var infoUpdate = await atualizarEncomendaMongo(encomenda, encomenda.nomeDestinatario, encomenda.emailDestinatario, encomenda.emailRemetente, dadosCorreio);

                        if (!infoUpdate) {
                            res.send(500, `Erro ao atualizar ${encomenda.codigoEncomenda}. infoUpdate : ${infoUpdate}`);
                        } else {
                            console.log(`${encomenda.codigoEncomenda} atualizado.`);
                        }

                        enviarEmail(
                            encomenda.emailRemetente, 
                            `Atualizacao status encomenda ${encomenda.codigoEncomenda}`,
                            `A encomenda ${encomenda.codigoEncomenda} para ${encomenda.nomeDestinatario} mudou o status para ${encomenda.ultimoStatus}`);
                    }    
                    else {
                        console.log(`${encomenda.codigoEncomenda} sem atualizacoes.`);
                    }
                    

                } catch (err) {
                    res.status(500);
                    return res.send('Erro geral : ' + err );
                }  
            });

            return res.send('Atualizacao finalizada.');
        }); 
    }
    
};


async function salvarEncomendaMongo(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio) {    
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
    
async function atualizarEncomendaMongo(encomendaAtualizar, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreioAtualizados) {
    encomendaAtualizar.nomeDestinatario = nomeDestinatario;
    encomendaAtualizar.emailDestinatario = emailDestinatario;
    encomendaAtualizar.emailRemetente = emailRemetente;
    encomendaAtualizar.tipoEncomenda = dadosCorreioAtualizados[0].type;
    encomendaAtualizar.dataEnvio = dadosCorreioAtualizados[0].postedAt;
    encomendaAtualizar.dataHoraUltimoStatus = dadosCorreioAtualizados[0].updatedAt;
    encomendaAtualizar.local = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].locale;
    encomendaAtualizar.observacao = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].observation;
    encomendaAtualizar.ultimoStatus = dadosCorreioAtualizados[0].tracks[dadosCorreioAtualizados[0].tracks.length - 1].status;
    var query = { 'codigoEncomenda': encomendaAtualizar.codigoEncomenda };
    
    return await EncomendaModel.updateOne(query, encomendaAtualizar);    
}


