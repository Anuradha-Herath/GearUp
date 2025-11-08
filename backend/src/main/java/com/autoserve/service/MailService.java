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
        // Validate API key is configured
        if (apiKey == null || apiKey.isBlank() || "YOUR_SENDGRID_API_KEY".equals(apiKey)) {
            logger.warn("⚠️  SendGrid API key is not properly configured. Email not sent to: {}", toEmail);
            logger.warn("   Subject: {}", subject);
            logger.warn("   Please set SENDGRID_API_KEY environment variable");
            throw new IOException("SendGrid API key is not configured. Cannot send email to " + toEmail);
        }

        logger.info("📧 Attempting to send email via SendGrid to: {} with subject: {}", toEmail, subject);
        
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

            logger.info("✅ SendGrid responded with status={} for email to {}", status, toEmail);
            if (status >= 400) {
                logger.error("❌ SendGrid failed to send email to {}. Status: {}, Response body: {}", 
                             toEmail, status, response.getBody());
                throw new IOException("Failed to send email. SendGrid returned status: " + status + ". Response: " + response.getBody());
            }
            logger.info("✅ Email successfully sent to: {}", toEmail);
        } catch (IOException ioEx) {
            logger.error("❌ IO Exception sending email to {}: {}", toEmail, ioEx.getMessage(), ioEx);
            throw ioEx;
        } catch (Exception ex) {
            logger.error("❌ Error sending email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new IOException("Error sending email: " + ex.getMessage(), ex);
        }
    }
}
