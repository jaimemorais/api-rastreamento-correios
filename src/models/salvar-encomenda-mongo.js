const EncomendaModel = require('./encomenda-model');
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
exports.salvarEncomendaMongo = salvarEncomendaMongo;
