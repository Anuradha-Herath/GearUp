package com.autoserve.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Value("${sendgrid.api.key:YOUR_SENDGRID_API_KEY}")
    private String apiKey;

    @Value("${sendgrid.from.email:no.replyautoserve@gmail.com}")
    private String fromEmail;

    /**
     * Send HTML email using SendGrid
     */
    public void sendVerificationEmail(String toEmail, String subject, String htmlBody) throws IOException {
        Email from = new Email(fromEmail, "AutoServe Team");
        Email to = new Email(toEmail);

        // Only HTML content — no plain text (so link will be clickable)
        Content htmlContent = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, subject, to, htmlContent);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            int status = response.getStatusCode();

            logger.info("SendGrid status={}, to={}, subject={}", status, toEmail, subject);
            if (status >= 400) {
                logger.error("SendGrid failed to send email to {}. Status: {}, Body: {}", 
                             toEmail, status, response.getBody());
                throw new IOException("Failed to send email. Status: " + status);
            }
        } catch (Exception ex) {
            logger.error("Error sending email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new IOException("Error sending email: " + ex.getMessage(), ex);
        }
    }
}
