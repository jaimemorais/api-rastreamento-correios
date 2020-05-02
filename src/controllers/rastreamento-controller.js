const { rastro } = require('rastrojs');
const encomendaDao = require("../models/encomenda-dao");
const mailSender = require('../mail/mail-sender');


module.exports = {

    async criarEncomenda(req, res) {        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente } = req.body;
            let encomenda = await encomendaDao.obterEncomendaPorCodigo(codigoEncomenda);
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

            encomenda = await encomendaDao.salvarEncomendaMongo(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio);
        
            return res.json(encomenda);
            
        } catch (err) {
            return res.status(500).send(err.message);
        }        
    },


    async atualizarEncomenda(req, res) {        
        try {
            const { codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente } = req.body;
            let encomendaAtualizar = await encomendaDao.obterEncomendaPorCodigo(codigoEncomenda);
            if (!encomendaAtualizar) {
                res.status(404);
                return res.send(`Nao encontrada encomenda cadastrada com o codigo ${codigoEncomenda} informado.`);
            }

            const dadosCorreioAtualizados = await rastro.track(codigoEncomenda);

            var infoUpdate = await encomendaDao.atualizarEncomendaMongo(encomendaAtualizar, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreioAtualizados);

            return (!infoUpdate) ? 
                res.send(500, 'Erro ao atualizar. infoUpdate null') : 
                (infoUpdate.nModified === 0 ? res.send('Documento nao atualizado pois nao houveram modificacoes.') : res.send('Documento atualizado no banco de dados.'));

        } catch (err) {
            return res.status(500).send(err.message);
        }        
    },

    
    async obterEncomenda(req, res) {
        try {
            let encomenda = await encomendaDao.obterEncomendaPorCodigo(req.params.codigoEncomenda);
            return res.json(encomenda);
        } catch (err) {
            return res.status(500).send(err.message);
        }        
    },

    
    async listarEncomendas(req, res) {
        try {
            let encomendas = await encomendaDao3.obterTodas();
            return res.json(encomendas);
        } catch (err) {            
            return res.status(500).send(err.message);
        }   
    },


    async atualizarStatusTodasEncomendas(req, res) {
        try {
            let encomendas = await encomendaDao.obterTodas();

            encomendas.forEach(async encomenda => {
            
                console.log(`Verificando ${encomenda.codigoEncomenda} ...`);

                var dadosCorreio = await rastro.track(encomenda.codigoEncomenda)
                
                if (Date.parse(encomenda.dataHoraUltimoStatus) !== Date.parse(dadosCorreio[0].updatedAt)) {
                    console.log(`${encomenda.codigoEncomenda} possui atualizacao, salvando banco de dados...`);
                    
                    var infoUpdate = await encomendaDao.atualizarEncomendaMongo(encomenda, encomenda.nomeDestinatario, encomenda.emailDestinatario, encomenda.emailRemetente, dadosCorreio);

                    if (!infoUpdate) {
                        res.send(500, `Erro ao atualizar ${encomenda.codigoEncomenda}. infoUpdate : ${infoUpdate}`);
                    } else {
                        console.log(`${encomenda.codigoEncomenda} atualizado.`);
                    }

                    // Envia email para o proprio remetente para saber que o status mudou
                    mailSender.enviarEmail(
                        encomenda.emailRemetente,
                        encomenda.emailRemetente, 
                        `Atualizacao status encomenda ${encomenda.codigoEncomenda} para ${encomenda.nomeDestinatario}`,
                        `A encomenda ${encomenda.codigoEncomenda} para ${encomenda.nomeDestinatario} teve o status alterado para : ${encomenda.ultimoStatus} - Local : ${encomenda.local}`);
                }    
                else {
                    console.log(`${encomenda.codigoEncomenda} sem atualizacoes.`);
                }                

            });

            return res.send('Atualizacao finalizada.');
        
        } catch (err) {
            return res.status(500).send(err.message);
        }  

    }
    
};





