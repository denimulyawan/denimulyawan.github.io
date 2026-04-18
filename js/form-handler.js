// ============================================================
// FORM HANDLER - Mengirim data ke API Vercel
// File ini berjalan di BROWSER pengunjung
// ============================================================

// Tunggu sampai halaman selesai loading
document.addEventListener('DOMContentLoaded', function() {
  
  // Ambil element form dan message container
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  // Jika form tidak ditemukan, hentikan
  if (!contactForm) return;

  // ========== 1. FLOATING LABEL EFFECT ==========
  // Membuat efek label yang naik saat input diketik
  const allInputs = contactForm.querySelectorAll('input, textarea');
  
  allInputs.forEach(input => {
    // Cek apakah input sudah terisi (misal setelah reset)
    if (input.value.trim() !== '') {
      const label = input.previousElementSibling;
      if (label) label.classList.add('active');
    }

    // Saat input mendapat fokus (diklik)
    input.addEventListener('focus', function() {
      const label = this.previousElementSibling;
      if (label) label.classList.add('active');
    });

    // Saat input kehilangan fokus
    input.addEventListener('blur', function() {
      if (this.value.trim() === '') {
        const label = this.previousElementSibling;
        if (label) label.classList.remove('active');
      }
    });
  });

  // ========== 2. HANDLE FORM SUBMIT ==========
  contactForm.addEventListener('submit', async function(event) {
    // Mencegah reload halaman
    event.preventDefault();

    // Ambil data dari form
    const formData = {
      name: this.querySelector('[name="name"]').value.trim(),
      email: this.querySelector('[name="email"]').value.trim(),
      subject: this.querySelector('[name="subject"]').value.trim(),
      message: this.querySelector('[name="message"]').value.trim()
    };

    // ========== 3. VALIDASI FORM ==========
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showMessage('❌ Semua field wajib diisi!', 'error');
      return;
    }

    // Validasi format email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      showMessage('❌ Masukkan alamat email yang valid!', 'error');
      return;
    }

    // ========== 4. TAMPILKAN LOADING ==========
    const submitBtn = this.querySelector('.submit-btn');
    const originalButtonHTML = submitBtn.innerHTML;
    
    // Ubah tombol jadi loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    // Sembunyikan pesan lama
    if (formMessage) {
      formMessage.style.display = 'none';
    }

    // ========== 5. KIRIM KE API VERCEL ==========
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   // ✅ SUDAH DIPERBAIKI
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // ========== 6. CEK HASIL ==========
      if (result.success) {
        // BERHASIL
        showMessage('✅ Pesan berhasil dikirim! Saya akan membalas segera.', 'success');
        
        // Reset form
        this.reset();
        
        // Reset floating label
        allInputs.forEach(input => {
          const label = input.previousElementSibling;
          if (label) label.classList.remove('active');
        });
        
        // Auto hide pesan sukses setelah 5 detik
        setTimeout(() => {
          if (formMessage) formMessage.style.display = 'none';
        }, 5000);
        
      } else {
        // GAGAL dari server
        throw new Error(result.error || 'Gagal mengirim pesan');
      }
      
    } catch (error) {
      // ERROR jaringan atau server
      console.error('Error:', error);
      showMessage(`❌ ${error.message}`, 'error');
      
    } finally {
      // Kembalikan tombol ke semula
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalButtonHTML;
    }
  });

  // ========== 7. FUNGSI BANTUAN ==========
  // Fungsi untuk menampilkan pesan sukses/error
  function showMessage(text, type) {
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll ke pesan
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});