// ============================================================
// API TELEGRAM - Serverless Function untuk Vercel
// File ini akan berjalan di server Vercel, BUKAN di browser
// ============================================================

// Ambil token dari Environment Variables Vercel
const BOT_TOKEN = process.env.8540960289:AAF9wqF3oCcQaDTS9nEapUByFIn-3RGELe8;
const CHAT_ID = process.env.-1003909252288;

export default async function handler(req, res) {
  // 1. CEK METHOD - Hanya boleh POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method tidak diizinkan. Gunakan POST.' 
    });
  }

  // 2. AMBIL DATA dari request body
  const { name, email, subject, message } = req.body;

  // 3. VALIDASI - Semua field harus diisi
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Semua field wajib diisi!' 
    });
  }

  // 4. VALIDASI FORMAT EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Format email tidak valid!' 
    });
  }

  // 5. CEK KONFIGURASI TELEGRAM
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Telegram not configured:', { BOT_TOKEN: !!BOT_TOKEN, CHAT_ID: !!CHAT_ID });
    return res.status(500).json({ 
      success: false, 
      error: 'Server belum dikonfigurasi. Hubungi administrator.' 
    });
  }

  // 6. BUAT PESAN TELEGRAM
  const telegramMessage = `
📬 *PESAN BARU DARI PORTFOLIO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Nama:* ${name}
📧 *Email:* ${email}
📌 *Subjek:* ${subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Pesan:*
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 *Waktu:* ${new Date().toLocaleString('id-ID')}
🌐 *Website:* ${req.headers.referer || 'Portfolio'}
  `;

  // 7. KIRIM KE TELEGRAM API
  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();

    // 8. CEK RESPONSE DARI TELEGRAM
    if (!result.ok) {
      throw new Error(result.description || 'Gagal mengirim ke Telegram');
    }

    // 9. BERHASIL
    return res.status(200).json({ 
      success: true, 
      message: 'Pesan berhasil dikirim!' 
    });

  } catch (error) {
    // 10. ERROR
    console.error('Telegram API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Gagal mengirim pesan. Silakan coba lagi.' 
    });
  }
}