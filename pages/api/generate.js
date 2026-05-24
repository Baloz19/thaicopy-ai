import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business, target, tone, detail, tab } = req.body;
  if (!business) return res.status(400).json({ error: "missing business" });

  const tabHints = {
    facebook: "โพสต์ Facebook/Instagram ที่มี engagement สูง ใส่ emoji และ hashtag ที่เหมาะสม",
    line: "ข้อความ LINE broadcast สั้นกระชับ อ่านง่าย เหมาะกับ LINE OA",
    product: "คำบรรยายสินค้า อธิบายจุดเด่น กระตุ้นความต้องการซื้อ",
    promo: "โพสต์โปรโมชั่น เน้น urgency มี call-to-action ชัดเจน",
  };

  const prompt = `คุณเป็น copywriter มืออาชีพภาษาไทย เชี่ยวชาญการเขียนคอนเทนต์สำหรับ SME ไทย

งาน: เขียน${tabHints[tab] || tabHints.facebook}
ธุรกิจ: ${business}
กลุ่มเป้าหมาย: ${target}
โทน: ${tone}
${detail ? "รายละเอียดเพิ่มเติม: " + detail : ""}

เขียนคอนเทนต์ที่พร้อมใช้งานทันที ห้ามมีคำนำหรือคำอธิบาย ตอบเฉพาะเนื้อหาคอนเทนต์เท่านั้น`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.status(200).json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generation failed" });
  }
}
