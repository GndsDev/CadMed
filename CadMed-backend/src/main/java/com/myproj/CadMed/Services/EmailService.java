package com.myproj.CadMed.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailConfirmacao(String emailDestino, String nomePaciente, String dataHora, String nomeMedico) {
        SimpleMailMessage email = new SimpleMailMessage();

        email.setFrom("agendamento@cadmed.com.br"); // O remetente
        email.setTo(emailDestino); // O e-mail do paciente
        email.setSubject("CadMed - Confirmação de Consulta"); // O Assunto

        // O corpo do e-mail
        String corpo = "Olá, " + nomePaciente + "!\n\n"
                + "Sua consulta médica foi agendada com sucesso.\n\n"
                + "👨‍⚕️ Médico: Dr(a). " + nomeMedico + "\n"
                + "📅 Data e Hora: " + dataHora + "\n\n"
                + "Por favor, chegue com 15 minutos de antecedência.\n"
                + "Equipe CadMed.";

        email.setText(corpo);

        mailSender.send(email);
        System.out.println("E-mail de confirmação enviado para " + emailDestino);
    }
}