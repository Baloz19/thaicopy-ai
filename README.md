# ThaiCopy AI 🇹🇭

AI ช่วยเขียนคอนเทนต์ภาษาไทยสำหรับธุรกิจ — สร้างด้วย Next.js + Anthropic Claude

---

## วิธี Deploy ขึ้น Vercel (ทำตามขั้นตอน)

### 1. สมัคร Anthropic API Key
ไปที่ https://console.anthropic.com → สร้าง API Key ฟรี

### 2. Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thaicopy-ai.git
git push -u origin main
```

### 3. Deploy บน Vercel
1. ไปที่ https://vercel.com → New Project
2. Import repo จาก GitHub
3. ไปที่ Settings → Environment Variables
4. เพิ่ม: `ANTHROPIC_API_KEY` = sk-ant-xxxxx
5. กด Deploy

---

## Run บนเครื่องตัวเอง

```bash
npm install
cp .env.example .env.local
# แก้ไข .env.local ใส่ ANTHROPIC_API_KEY จริง
npm run dev
```

เปิด http://localhost:3000

---

## Tech Stack
- **Next.js 14** — React framework
- **Anthropic Claude** — AI engine
- **Vercel** — Hosting (ฟรี)
