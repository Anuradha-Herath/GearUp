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

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Value("${sendgrid.api.key:YOUR_SENDGRID_API_KEY}")
    private String apiKey;

    @Value("${sendgrid.from.email:no.replyautoserve@gmail.com}")
    private String fromEmail;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    /**
     * Send HTML email using SendGrid
     */
    public void sendVerificationEmail(String toEmail, String subject, String htmlBody) throws IOException {
        // Skip actual email sending in dev mode
        if ("dev".equals(activeProfile) && "dev-api-key".equals(apiKey)) {
            logger.info("📧 [DEV MODE] Email simulation - Would send email:");
            logger.info("   To: {}", toEmail);
            logger.info("   Subject: {}", subject);
            logger.info("   Body preview: {}", htmlBody.substring(0, Math.min(100, htmlBody.length())) + "...");
            logger.info("   ✅ Email 'sent' successfully (simulated in dev mode)");
            return;
        }

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
