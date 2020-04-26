const mongoose = require('mongoose')

const ItemRastremanentoSchema = new mongoose.Schema({
    codigoItemRastreado: String,
    nomeDestinatario: String,
    emailDestinatario: String,
    dataEnvio: String,
    emailRemetente: String
})

module.exports = mongoose.model('ItemRastreamento', ItemRastremanentoSchema)
