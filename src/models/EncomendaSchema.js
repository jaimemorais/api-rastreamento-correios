const mongoose = require('mongoose')

const EncomendaSchema = new mongoose.Schema({
    // dados usuario
    codigoEncomenda : String,    
    nomeDestinatario: String,
    emailDestinatario: String,
    dataEnvio: Date,
    emailRemetente: String,
    
    // dados correio
    tipoEncomenda: String,
    ultimoStatus: String,
    dataHoraUltimoStatus: Date,
    local: String,
    observacao: String
})

module.exports = mongoose.model('Encomenda', EncomendaSchema)
 