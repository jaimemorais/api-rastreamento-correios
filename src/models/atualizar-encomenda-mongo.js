const EncomendaModel = require('./encomenda-model');
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
exports.atualizarEncomendaMongo = atualizarEncomendaMongo;
