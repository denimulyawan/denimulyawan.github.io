// ==================== FORM HANDLER WITH TELEGRAM API ====================
// 🔴 WAJIB GANTI DENGAN TOKEN BOT DAN CHAT ID KAMU 🔴
const TELEGRAM_BOT_TOKEN = '8540960289:AAF9wqF3oCcQaDTS9nEapUByFIn-3RGELe8';  // Ganti dengan token bot Telegram kamu
const TELEGRAM_CHAT_ID = '-1003909252288';      // Ganti dengan chat ID Telegram kamu

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm) return;
    
    // ==================== FLOATING LABEL EFFECT ====================
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Initialize - check if input has value
        if (input.value.trim() !== '') {
            input.previousElementSibling?.classList.add('active');
        }
        
        // On focus
        input.addEventListener('focus', function() {
            this.previousElementSibling?.classList.add('active');
            this.parentElement?.classList.add('focused');
        });
        
        // On blur
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.previousElementSibling?.classList.remove('active');
            }
            this.parentElement?.classList.remove('focused');
        });
        
        // On input (for real-time validation)
        input.addEventListener('input', function() {
            this.parentElement?.classList.remove('error');
        });
    });
    
    // ==================== FORM SUBMISSION ====================
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Get form elements
        const submitBtn = this.querySelector('.submit-btn');
        const submitText = submitBtn.querySelector('span');
        const submitIcon = submitBtn.querySelector('i');
        
        // Save original state
        const originalBtnText = submitText.textContent;
        const originalBtnIcon = submitIcon.className;
        
        // Set loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        submitIcon.className = 'fas fa-spinner fa-spin';
        
        // Reset message
        if (formMessage) {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';
        }
        
        try {
            // Collect form data
            const formData = {
                name: this.querySelector('[name="name"]').value.trim(),
                email: this.querySelector('[name="email"]').value.trim(),
                subject: this.querySelector('[name="subject"]').value.trim(),
                message: this.querySelector('[name="message"]').value.trim()
            };
            
            // Validate required fields
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                throw new Error('Please fill all fields');
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                const emailField = this.querySelector('[name="email"]');
                emailField.parentElement.classList.add('error');
                throw new Error('Please enter a valid email address');
            }
            
            // Check if Telegram bot is configured
            if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID') {
                throw new Error('Telegram bot is not configured yet. Please contact the administrator.');
            }
            
            // Format message for Telegram
            const telegramMessage = `
📬 *NEW MESSAGE FROM PORTFOLIO WEBSITE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📌 *Subject:* ${formData.subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Message:*
${formData.message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 *Sent from:* ${window.location.href}
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}
            `;
            
            // Send to Telegram Bot API
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            });
            
            const result = await response.json();
            
            if (!result.ok) {
                throw new Error(result.description || 'Failed to send message');
            }
            
            // SUCCESS
            if (formMessage) {
                formMessage.textContent = '✅ Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                
                // Scroll to message
                setTimeout(() => {
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
            
            // Reset form
            this.reset();
            
            // Reset floating labels
            formInputs.forEach(input => {
                input.previousElementSibling?.classList.remove('active');
            });
            
            // Auto-hide success message after 8 seconds
            setTimeout(() => {
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 8000);
            
        } catch (error) {
            // ERROR
            console.error('Form Error:', error);
            
            if (formMessage) {
                formMessage.textContent = `❌ ${error.message}`;
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                
                // Scroll to error
                setTimeout(() => {
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
            
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitText.textContent = originalBtnText;
            submitIcon.className = originalBtnIcon;
        }
    });
});