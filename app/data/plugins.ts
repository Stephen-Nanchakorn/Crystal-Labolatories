export type PluginFormat = "VST3" | "AU" | "AAX";

export interface Plugin {
  slug: string;
  name: string;
  desc: string;
  detail: string;
  formats: PluginFormat[];
  isFree: boolean;
  type: "standalone-download" | "perpetual" | "included-in-subscription";
  priceTHB?: number;
  priceUSD?: number;
  updateYears?: number; // จำนวนปีที่อัพเดตฟรี (สำหรับแบบซื้อขาด)
  downloadUrl?: string | null; // null = ยังไม่พร้อม (Coming Soon)
  payhipUrl?: string | null; // สำหรับจ่าย USD
}

export const plugins: Plugin[] = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    desc: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
    detail:
      "Drop-Tune คือปลั๊กอินปรับ Pitch สำหรับเครื่องดนตรี Guitar, Bass Guitar และ Keyboard โดยเฉพาะ ออกแบบมาให้ใช้งานง่ายในขั้นตอนมิกซ์ ช่วยแก้ไขโน้ตที่เพี้ยนหรือปรับจูนให้เข้ากับคีย์เพลงได้อย่างแม่นยำ พร้อมทั้งมีการเลียนแบบ Character เสียงจาก Analog Gear เพื่อเพิ่มมิติและความอบอุ่นให้กับเสียง เหมาะสำหรับโปรดิวเซอร์และซาวด์เอนจิเนียร์ทุกระดับ",
    formats: ["VST3", "AU", "AAX"],
    isFree: true,
    type: "standalone-download",
    downloadUrl: null, // 🚧 ยังไม่มีไฟล์ -> เว็บโชว์ "Coming Soon"
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    desc: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
    detail:
      "Stem Splitter คือปลั๊กอินแยกเสียง (Stem Separation) ด้วยเทคโนโลยี AI ที่พัฒนาต่อยอดจากโมเดล Open-source และฝึกฝนเพิ่มเติมด้วยชุดข้อมูลเพลงและ Stem File จำนวนมากโดยทีมงานเอง แยกเสียงได้ 10 ประเภท: Lead Vocal, Background Vocal, Bass Guitar, Lead Guitar, Rhythm Guitar, Piano, Synth, Synth Bass, String และ Other รองรับไฟล์เสียงทุกรูปแบบ เหมาะสำหรับงาน Remix, Sampling, การเรียนดนตรีจากเพลงจริง หรือการทำ Karaoke Track",
    formats: ["VST3", "AU", "AAX"],
    isFree: false,
    type: "perpetual",
    priceTHB: 2990,
    priceUSD: 99.99,
    updateYears: 1,
    payhipUrl: "https://payhip.com/b/0lQZE",
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    desc: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
    detail:
      "Analog EQ เป็น Graphic EQ ที่ควบคุมผ่าน Knob หมุนซ้าย-ขวา ให้ความรู้สึกเหมือนใช้ Hardware EQ จริง ปรับได้ทั้งความถี่ (Frequency), ระดับเสียง (Volume) และความกว้างของย่าน (Q) รวมทั้งหมด 7 Band (รวม HPF และ LPF) มาพร้อม Gate และ Compressor ในตัวที่ได้รับแรงบันดาลใจจากภาคเสียง Waves SSL G-Channel ออกแบบมาเพื่อย่าน Low และ Mid-Low โดยเฉพาะสำหรับ Guitar และ Bass Guitar แต่ใช้กับเครื่องดนตรีอื่นได้เช่นกัน",
    formats: ["VST3", "AU", "AAX"],
    isFree: false,
    type: "perpetual",
    priceTHB: 1790,
    priceUSD: 59.99,
    updateYears: 1,
    payhipUrl: "https://payhip.com/b/DrsQa",
  },
];

// 🎁 Subscription Bundle (รวมทุกปลั๊กอิน + ปลดล็อกผ่าน Standalone App)
export interface SubscriptionPlan {
  id: string;
  name: string;
  billing: "monthly" | "yearly";
  audience: "general" | "student";
  priceTHB: number;
  priceUSD: number;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  { id: "general-monthly", name: "Bundle รายเดือน", billing: "monthly", audience: "general", priceTHB: 259, priceUSD: 7.99 },
  { id: "general-yearly", name: "Bundle รายปี", billing: "yearly", audience: "general", priceTHB: 2590, priceUSD: 79.99 },
  { id: "student-monthly", name: "Bundle รายเดือน (นักศึกษา)", billing: "monthly", audience: "student", priceTHB: 149, priceUSD: 4.49 },
  { id: "student-yearly", name: "Bundle รายปี (นักศึกษา)", billing: "yearly", audience: "student", priceTHB: 1290, priceUSD: 39.99 },
];

export const promptPayPhoneNumber = "0956909544";

// 🎓 Auto-approve student email patterns
export const studentEmailPatterns = [
  ".ac.th", ".edu", ".edu.au", ".ac.uk", ".ac.jp", ".edu.sg",
  ".ac.kr", ".edu.cn", ".ac.in", ".edu.my",
];