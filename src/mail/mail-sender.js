var nodemailer = require('nodemailer');

module.exports = function enviarEmail(remetente, destinatario, assunto, mensagem) {
        
    var transportOptions = {
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        auth: {
            user: process.env.MAIL_SERVICE_USER_MAIL,
            pass: process.env.MAIL_SERVICE_USER_PWD        
        }
    };

    var transporter = nodemailer.createTransport(transportOptions);

    var mailOptions = {
        from: remetente,
        to: destinatario,
        subject: assunto,
        text: mensagem
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Erro envio email : ' + error);
        } else {
            console.log(`Email enviado para ${destinatario} : ${info.response}`);
        }
    });

};