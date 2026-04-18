export default async function handler(req, res) {
    // 🔴 HARDCODE - GANTI PUNYA KAMU 🔴
    const BOT_TOKEN = '8540960289:AAF9wqF3oCcQaDTS9nEapUByFIn-3RGELe8';
    const CHAT_ID = '-1003909252288';
    
    // Hanya terima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const { name, email, subject, message } = req.body;
    
    // Validasi
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields required' });
    }
    
    const pesan = `
📬 *PESAN DARI PORTFOLIO*
━━━━━━━━━━━━━━━━━━━━━
👤 Nama: ${name}
📧 Email: ${email}
📌 Subjek: ${subject}
━━━━━━━━━━━━━━━━━━━━━
💬 Pesan:
${message}
━━━━━━━━━━━━━━━━━━━━━
    `;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: pesan,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: result.description });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}