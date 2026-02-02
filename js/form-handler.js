// Form Handler untuk Contact Form
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  // Floating label effect
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
  
  // Form submission
  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get form elements
    const submitBtn = this.querySelector('.submit-btn');
    const submitText = submitBtn.querySelector('span');
    const submitIcon = submitBtn.querySelector('i');
    const formMessage = document.getElementById('formMessage');
    
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
      
      // Determine API endpoint
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';
      
      const API_URL = isLocalhost
        ? 'http://localhost:3000/api/telegram'
        : '/api/telegram';
      
      console.log('Sending to:', API_URL);
      console.log('Data:', formData);
      
      // Send to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      // SUCCESS - Show message
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
      if (formMessage) {
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 8000);
      }
      
    } catch (error) {
      // ERROR
      console.error('Form Error:', error);
      
      // Show error message
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