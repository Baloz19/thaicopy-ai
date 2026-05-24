import { useState } from "react";
import Head from "next/head";

const TABS = [
  { id: "facebook", label: "Facebook / IG", icon: "📱" },
  { id: "line", label: "LINE Broadcast", icon: "💬" },
  { id: "product", label: "บรรยายสินค้า", icon: "🛍️" },
  { id: "promo", label: "โปรโมชั่น", icon: "🔥" },
];

const TARGETS = [
  "วัยรุ่น 18–25 ปี",
  "คนทำงาน 25–35 ปี",
  "แม่บ้าน",
  "นักเรียนนักศึกษา",
  "ทุกกลุ่ม",
];

const TONES = [
  "สดใส น่ารัก",
  "เป็นกันเอง ตลก",
  "มืออาชีพ น่าเชื่อถือ",
  "กระตุ้นการซื้อ",
  "อบอุ่น ใกล้ชิด",
];

const MAX_FREE = 5;

export default function Home() {
  const [tab, setTab] = useState("facebook");
  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState(TARGETS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [used, setUsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function generate() {
    if (!business.trim()) return;
    if (used >= MAX_FREE) { setShowUpgrade(true); return; }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, target, tone, detail, tab }),
      });
      const data = await res.json();
      setResult(data.result || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      const newUsed = used + 1;
      setUsed(newUsed);
      if (newUsed >= MAX_FREE) setShowUpgrade(true);
    } catch {
      setResult("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Head>
        <title>ThaiCopy AI — เขียนคอนเทนต์ภาษาไทยด้วย AI</title>
        <meta name="description" content="AI ช่วยเขียนโพสต์ Facebook, LINE broadcast, คำบรรยายสินค้า สำหรับธุรกิจไทย" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600&family=Prompt:wght@500;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="page">
        <header className="header">
          <div className="logo">Thai<span>Copy</span></div>
          <p className="tagline">AI เขียนคอนเทนต์ภาษาไทย สำหรับธุรกิจทุกขนาด</p>
          <div className="credits">
            {Array.from({ length: MAX_FREE }, (_, i) => (
              <div key={i} className={`dot ${i < used ? "used" : ""}`} />
            ))}
            <span className="credits-label">เหลือ {MAX_FREE - used} ครั้งฟรี</span>
          </div>
        </header>

        <main className="main">
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="card">
            <label className="label">ธุรกิจ / สินค้าของคุณ <span className="required">*</span></label>
            <textarea
              className="input"
              rows={2}
              placeholder="เช่น: ขายชานมไข่มุก ย่านลาดพร้าว เน้นวัตถุดิบธรรมชาติ ไม่มีสีสังเคราะห์"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />

            <div className="row2">
              <div>
                <label className="label">กลุ่มเป้าหมาย</label>
                <select className="select" value={target} onChange={(e) => setTarget(e.target.value)}>
                  {TARGETS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">โทนเสียง</label>
                <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <label className="label">รายละเอียดเพิ่มเติม</label>
            <textarea
              className="input"
              rows={2}
              placeholder="เช่น: มีโปรลด 20% ถึงวันอาทิตย์, เปิดใหม่สาขาที่ 2"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />

            <button
              className={`btn-generate ${loading ? "loading" : ""}`}
              onClick={generate}
              disabled={loading || !business.trim()}
            >
              {loading ? "กำลังสร้าง..." : "✨ สร้างคอนเทนต์เลย"}
            </button>
          </div>

          {result && (
            <div className="result-card">
              <div className="result-header">
                <span className="result-label">คอนเทนต์ที่สร้างขึ้น</span>
                <button className="btn-copy" onClick={copy}>
                  {copied ? "✓ คัดลอกแล้ว" : "คัดลอก"}
                </button>
              </div>
              <p className="result-text">{result}</p>
            </div>
          )}

          {showUpgrade && (
            <div className="upgrade-banner">
              <div>
                <p className="upgrade-title">ใช้ครบ 5 ครั้งฟรีแล้ว</p>
                <p className="upgrade-sub">อัปเกรดเพื่อใช้ไม่จำกัด เพียง 99 บาท/เดือน</p>
              </div>
              <button className="btn-upgrade">สมัครเลย →</button>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>ThaiCopy AI · ทำด้วยใจสำหรับธุรกิจไทย 🇹🇭</p>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body {
          font-family: 'Sarabun', sans-serif;
          background: #f5f4f0;
          color: #1a1a18;
          min-height: 100vh;
        }

        .page {
          max-width: 640px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo {
          font-family: 'Prompt', sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #1a1a18;
          letter-spacing: -1px;
        }
        .logo span { color: #1D9E75; }
        .tagline {
          font-size: 15px;
          color: #666660;
          margin-top: 4px;
        }
        .credits {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
        }
        .dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #1D9E75;
          transition: background 0.3s;
        }
        .dot.used { background: #d0cfc8; }
        .credits-label { font-size: 13px; color: #888880; margin-left: 4px; }

        .main { display: flex; flex-direction: column; gap: 16px; }

        .tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tab {
          font-family: 'Sarabun', sans-serif;
          font-size: 13px;
          padding: 7px 16px;
          border-radius: 24px;
          border: 1.5px solid #d0cfc8;
          background: white;
          color: #666660;
          cursor: pointer;
          transition: all 0.15s;
        }
        .tab:hover { border-color: #1D9E75; color: #1D9E75; }
        .tab.active {
          background: #1D9E75;
          border-color: #1D9E75;
          color: white;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e8e7e2;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #555550;
          margin-bottom: 6px;
        }
        .required { color: #E24B4A; }

        .input {
          width: 100%;
          font-family: 'Sarabun', sans-serif;
          font-size: 14px;
          color: #1a1a18;
          background: #f8f7f3;
          border: 1.5px solid #e8e7e2;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          resize: vertical;
          line-height: 1.6;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #1D9E75; background: white; }

        .row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .select {
          width: 100%;
          font-family: 'Sarabun', sans-serif;
          font-size: 14px;
          color: #1a1a18;
          background: #f8f7f3;
          border: 1.5px solid #e8e7e2;
          border-radius: 10px;
          padding: 9px 12px;
          outline: none;
          cursor: pointer;
          margin-top: 0;
          transition: border-color 0.15s;
        }
        .select:focus { border-color: #1D9E75; }

        .btn-generate {
          width: 100%;
          font-family: 'Prompt', sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 13px;
          background: #1D9E75;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.2px;
        }
        .btn-generate:hover:not(:disabled) { background: #0F6E56; }
        .btn-generate:active:not(:disabled) { transform: scale(0.98); }
        .btn-generate:disabled {
          background: #d0cfc8;
          color: #888880;
          cursor: not-allowed;
        }
        .btn-generate.loading { opacity: 0.8; }

        .result-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid #e8e7e2;
        }
        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .result-label {
          font-size: 12px;
          font-weight: 500;
          color: #888880;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-copy {
          font-family: 'Sarabun', sans-serif;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 8px;
          border: 1px solid #d0cfc8;
          background: white;
          color: #555550;
          cursor: pointer;
        }
        .btn-copy:hover { background: #f8f7f3; }
        .result-text {
          font-size: 15px;
          line-height: 1.8;
          color: #1a1a18;
          white-space: pre-wrap;
        }

        .upgrade-banner {
          background: #E1F5EE;
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #9FE1CB;
        }
        .upgrade-title {
          font-family: 'Prompt', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #0F6E56;
        }
        .upgrade-sub { font-size: 13px; color: #1D9E75; margin-top: 2px; }
        .btn-upgrade {
          font-family: 'Prompt', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          background: #1D9E75;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-upgrade:hover { background: #0F6E56; }

        .footer {
          text-align: center;
          margin-top: 3rem;
          font-size: 13px;
          color: #aaa9a4;
        }

        @media (max-width: 480px) {
          .row2 { grid-template-columns: 1fr; }
          .logo { font-size: 2rem; }
        }
      `}</style>
    </>
  );
}
