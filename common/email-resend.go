package common

import (
	"fmt"
	"github.com/resend/resend-go/v2"
)

func SendEmailWithResend(subject string, receiver string, content string) error {
	if ResendAPIKey == "" {
		return fmt.Errorf("Resend API key not configured")
	}
	
	if ResendFrom == "" {
		return fmt.Errorf("Resend from address not configured")
	}

	client := resend.NewClient(ResendAPIKey)

	params := &resend.SendEmailRequest{
		From:    ResendFrom,
		To:      []string{receiver},
		Html:    content,
		Subject: subject,
	}

	sent, err := client.Emails.Send(params)
	if err != nil {
		return fmt.Errorf("failed to send email via Resend: %v", err)
	}

	// Log the email ID for debugging purposes
	SysLog(fmt.Sprintf("Email sent via Resend with ID: %s", sent.Id))
	
	return nil
}