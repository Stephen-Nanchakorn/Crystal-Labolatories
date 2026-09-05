export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-extrabold mb-3">
            CRYSTAL
          </h3>
          <p className="text-sm leading-relaxed">
            ปลั๊กอินคุณภาพสตูดิโอ สำหรับโปรดิวเซอร์และนักดนตรียุคใหม่
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">เมนู</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">หน้าแรก</a></li>
            <li><a href="#plugins" className="hover:text-white transition">ปลั๊กอิน</a></li>
            <li><a href="#" className="hover:text-white transition">เกี่ยวกับเรา</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">ช่วยเหลือ</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">วิธีติดตั้ง</a></li>
            <li><a href="#" className="hover:text-white transition">คำถามที่พบบ่อย</a></li>
            <li><a href="#" className="hover:text-white transition">ติดต่อฝ่ายสนับสนุน</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-semibold mb-4">ติดตามเรา</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-400 transition">Facebook</a>
            <a href="#" className="hover:text-cyan-400 transition">Instagram</a>
            <a href="#" className="hover:text-cyan-400 transition">YouTube</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-10 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Crystal Plugins. All rights reserved.
      </div>
    </footer>
  );
}