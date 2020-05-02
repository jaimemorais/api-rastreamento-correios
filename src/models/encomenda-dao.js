const encomendaModel = require('./encomenda-model');

module.exports = {
    
    async obterEncomendaPorCodigo(codigoEncomenda) {
        return await encomendaModel.findOne({ codigoEncomenda });
    },

    async obterTodas() {
        return await encomendaModel.find().lean().exec();
    },


    async atualizarEncomendaMongo(encomendaAtualizar, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreioAtualizados) {
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
        return await encomendaModel.updateOne(query, encomendaAtualizar);
    },


    async salvarEncomendaMongo(codigoEncomenda, nomeDestinatario, emailDestinatario, emailRemetente, dadosCorreio) {
        const tipoEncomenda = dadosCorreio[0].type;
        const dataEnvio = dadosCorreio[0].postedAt;
        const dataHoraUltimoStatus = dadosCorreio[0].updatedAt;
        const local = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].locale;
        const observacao = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].observation;
        const ultimoStatus = dadosCorreio[0].tracks[dadosCorreio[0].tracks.length - 1].status;
        return await encomendaModel.create({
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

    
};