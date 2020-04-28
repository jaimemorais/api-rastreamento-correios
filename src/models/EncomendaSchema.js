const mongoose = require('mongoose')

const EncomendaSchema = new mongoose.Schema({
    codigoItemRastreado: String,
    nomeDestinatario: String,
    emailDestinatario: String,
    dataEnvio: String,
    emailRemetente: String
})

module.exports = mongoose.model('Encomenda', EncomendaSchema)
 