const mongoose = require('mongoose')

const EncomendaSchema = new mongoose.Schema({
    // dados usuario
    codigoEncomenda : String,    
    nomeDestinatario: String,
    emailDestinatario: String,
    dataEnvio: String,
    emailRemetente: String,
    
    // dados correio
    tipoEncomenda: String,
    ultimoStatus: String,
    dataHoraUltimoStatus: String,
    local: String,
    observacao: String
})

module.exports = mongoose.model('Encomenda', EncomendaSchema)
 