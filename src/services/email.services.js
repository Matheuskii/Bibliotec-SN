import nodemailer from 'nodemailer';

// Configuração do Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function enviarEmailVerificacao(email, codigo) {
    const mailOptions = {
        from: `"BiblioTec" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🔐 BiblioTec - Seu Código de Verificação',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4a67df;">Bem-vindo à BiblioTec!</h2>
                <p>Use o código abaixo para completar seu cadastro:</p>
                <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #333;">${codigo}</h1>
                <p>Se você não solicitou este código, ignore este e-mail.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 E-mail enviado para ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return false;
    }
}