"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { getWishlist, removeFromWishlistBulk, updateWishlistNote, shareWishlist, markNotificationAsRead } from "@/app/actions/wishlist";
import HeartButton from "@/app/components/wishlist/HeartButton";

// ==================== TYPES ====================
interface PluginData {
    name: string;
    price: number;
    image_url?: string;
    added_at: string;
    currency?: string;
    discount_percent?: number;
    is_free?: boolean;
}

interface WishlistItemType {
    id: string;
    plugin_id: string;
    plugin_data: PluginData | null;
    plugin: PluginData | null;
    notes: string | null;
    created_at: string;
}

interface NotificationType {
    id: string;
    plugin_id: string;
    notification_type: string;
    old_price: number | null;
    new_price: number | null;
    discount_percent: number | null;
    created_at: string;
}

interface WishlistDataType {
    items: WishlistItemType[];
    count: number;
    notifications: NotificationType[];
}

// ==================== MAIN COMPONENT ====================
export default function WishlistPage() {
    const { language } = useApp();
    const router = useRouter();
    const supabase = createClient();

    // ==================== STATES ====================
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [wishlistData, setWishlistData] = useState<WishlistDataType | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [noteText, setNoteText] = useState<string>("");
    const [shareEmail, setShareEmail] = useState<string>("");
    const [shareLoading, setShareLoading] = useState<boolean>(false);
    const [shareResult, setShareResult] = useState<{ success: boolean; message: string; shareUrl?: string } | null>(null);

    // ==================== EFFECTS ====================
    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
            if (user) {
                await loadWishlist();
            } else {
                setLoading(false);
            }
        }
        checkAuth();
    }, [supabase.auth]);

    // ==================== FUNCTIONS ====================
    async function loadWishlist() {
        setLoading(true);
        const result = await getWishlist();
        if (result.success && result.data) {
            setWishlistData(result.data);
        }
        setLoading(false);
    }

    async function handleRemoveSelected() {
        if (selectedItems.length === 0) return;

        const confirmMessage = language === "th"
            ? `ต้องการลบ ${selectedItems.length} รายการออกจากรายการโปรด?`
            : `Remove ${selectedItems.length} items from wishlist?`;

        if (confirm(confirmMessage)) {
            const result = await removeFromWishlistBulk(selectedItems);
            if (result.success) {
                setSelectedItems([]);
                await loadWishlist();
                alert(result.message);
            } else if (result.error) {
                alert(result.error);
            }
        }
    }

    async function handleShareWishlist() {
        if (!shareEmail || !shareEmail.includes('@')) {
            const alertMessage = language === "th"
                ? "กรุณากรอกอีเมลที่ถูกต้อง"
                : "Please enter a valid email";
            alert(alertMessage);
            return;
        }

        setShareLoading(true);
        const result = await shareWishlist(shareEmail, false, 30);
        setShareLoading(false);
        // แค่แก้บรรทัดเดียวแบบนี้:
        async function loadWishlist() {
            setLoading(true);
            const result: any = await getWishlist(); // ✅ ใช้ any เพื่อข้าม type checking ชั่วคราว

            if (result?.success && result?.data) {
                setWishlistData(result.data);
            }

            setLoading(false);
        }

        if (result.success) {
            setShareEmail("");
            setTimeout(() => setShareResult(null), 5000);
        }
    }

    async function handleMarkNotificationAsRead(notificationId: string) {
        await markNotificationAsRead(notificationId);
        await loadWishlist();
    }

    async function handleUpdateNote(itemId: string) {
        if (!editingNote || editingNote !== itemId) return;

        const result = await updateWishlistNote(itemId, noteText);
        if (result.success) {
            setEditingNote(null);
            setNoteText("");
            await loadWishlist();
        } else if (result.error) {
            alert(result.error);
        }
    }

    function startEditingNote(item: WishlistItemType) {
        setEditingNote(item.id);
        setNoteText(item.notes || "");
    }

    function cancelEditingNote() {
        setEditingNote(null);
        setNoteText("");
    }

    function toggleSelectItem(itemId: string) {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    }

    function selectAllItems() {
        if (!wishlistData) return;

        if (selectedItems.length === wishlistData.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlistData.items.map(item => item.id));
        }
    }

    function getCurrencySymbol(currency?: string): string {
        return currency === "THB" ? "฿" : "$";
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString(
            language === "th" ? "th-TH" : "en-US",
            { day: 'numeric', month: 'short', year: 'numeric' }
        );
    }

    // ==================== RENDER - NOT LOGGED IN ====================
    if (!isLoggedIn && !loading) {
        return (
            <main className="min-h-screen bg-black text-white p-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6">
                        {language === "th" ? "รายการโปรดของฉัน" : "My Wishlist"}
                    </h1>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
                        <div className="text-6xl mb-6">❤️</div>
                        <h2 className="text-2xl font-bold mb-4">
                            {language === "th" ? "เข้าสู่ระบบเพื่อดูรายการโปรด" : "Sign in to view your wishlist"}
                        </h2>
                        <p className="text-gray-400 mb-8">
                            {language === "th"
                                ? "บันทึกปลั๊กอินที่คุณชอบและกลับมาดูทีหลังได้"
                                : "Save plugins you love and view them later"}
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
                        >
                            {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // ==================== RENDER - LOADING ====================
    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                        <p className="mt-4 text-gray-400">
                            {language === "th" ? "กำลังโหลดรายการโปรด..." : "Loading wishlist..."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const symbol = language === "th" ? "฿" : "$";

    // ==================== RENDER - MAIN CONTENT ====================
    return (
        <main className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        {language === "th" ? "รายการโปรดของฉัน" : "My Wishlist"}
                    </h1>
                    <p className="text-gray-400">
                        {language === "th"
                            ? "ปลั๊กอินทั้งหมดที่คุณบันทึกไว้"
                            : "All plugins you've saved"}
                    </p>
                </div>

                {/* NOTIFICATIONS */}
                {wishlistData?.notifications && wishlistData.notifications.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-800 rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span>🔔</span>
                                {language === "th" ? "การแจ้งเตือนล่าสุด" : "Recent Notifications"}
                            </h3>
                            <button
                                onClick={() => wishlistData.notifications.forEach(n => handleMarkNotificationAsRead(n.id))}
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                {language === "th" ? "ทำเครื่องหมายว่าอ่านแล้วทั้งหมด" : "Mark all as read"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {wishlistData.notifications.map((notification) => (
                                <div key={notification.id} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleMarkNotificationAsRead(notification.id)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            ✓
                                        </button>
                                        <div>
                                            <div className="font-medium">
                                                {notification.notification_type === 'price_drop'
                                                    ? (language === "th" ? "ราคาลด!" : "Price Drop!")
                                                    : notification.notification_type === 'discount'
                                                        ? (language === "th" ? "ส่วนลดใหม่!" : "New Discount!")
                                                        : (language === "th" ? "อัปเดต!" : "Update!")
                                                }
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {notification.plugin_id}
                                                {notification.discount_percent && ` - ${notification.discount_percent}% OFF`}
                                            </div>
                                        </div>
                                    </div>
                                    {notification.old_price && notification.new_price && (
                                        <div className="text-right">
                                            <div className="text-gray-400 line-through text-sm">
                                                {symbol}{notification.old_price.toFixed(2)}
                                            </div>
                                            <div className="text-green-400 font-bold">
                                                {symbol}{notification.new_price.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BULK ACTIONS & SHARE */}
                <div className="mb-6 grid md:grid-cols-2 gap-6">
                    {/* BULK ACTIONS */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">
                                {language === "th" ? "จัดการหลายรายการ" : "Bulk Actions"}
                            </h3>
                            <button
                                onClick={selectAllItems}
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                            >
                                {selectedItems.length === wishlistData?.items.length
                                    ? (language === "th" ? "ยกเลิกเลือกทั้งหมด" : "Deselect All")
                                    : (language === "th" ? "เลือกทั้งหมด" : "Select All")
                                }
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-400">
                                {language === "th" ? "เลือกแล้ว:" : "Selected:"} {selectedItems.length}
                            </div>
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedItems.length === 0}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {language === "th" ? "ลบที่เลือก" : "Remove Selected"}
                            </button>
                        </div>
                    </div>

                    {/* SHARE WISHLIST */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                        <h3 className="font-bold mb-4">
                            {language === "th" ? "แชร์รายการโปรด" : "Share Wishlist"}
                        </h3>

                        {shareResult && (
                            <div className={`mb-3 p-3 rounded-lg ${shareResult.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                {shareResult.message}
                                {shareResult.shareUrl && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={shareResult.shareUrl}
                                            readOnly
                                            className="w-full bg-gray-800 text-sm p-2 rounded"
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder={language === "th" ? "อีเมลเพื่อน..." : "Friend's email..."}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            />
                            <button
                                onClick={handleShareWishlist}
                                disabled={shareLoading}
                                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {shareLoading
                                    ? (language === "th" ? "กำลังแชร์..." : "Sharing...")
                                    : (language === "th" ? "แชร์" : "Share")
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* WISHLIST ITEMS */}
                {wishlistData?.items && wishlistData.items.length > 0 ? (
                    <div className="space-y-4">
                        {wishlistData.items.map((item) => {
                            const plugin = item.plugin || item.plugin_data;
                            if (!plugin) return null;

                            const isEditing = editingNote === item.id;
                            const addedDate = new Date(item.created_at);
                            const isSelected = selectedItems.includes(item.id);
                            const currencySymbol = getCurrencySymbol(plugin.currency);
                            const pluginPrice = plugin.price || 0;
                            const isFree = plugin.is_free || false;
                            const discountPercent = plugin.discount_percent || 0;

                            return (
                                <div
                                    key={item.id}
                                    className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${isSelected ? 'border-cyan-500' : 'border-gray-800 hover:border-gray-700'}`}
                                >
                                    <div className="p-5">
                                        <div className="flex flex-col md:flex-row gap-5">
                                            {/* SELECTION CHECKBOX & IMAGE */}
                                            <div className="flex items-start gap-4">
                                                <button
                                                    onClick={() => toggleSelectItem(item.id)}
                                                    className={`mt-1 w-5 h-5 border rounded flex items-center justify-center ${isSelected ? 'bg-cyan-400 border-cyan-400' : 'border-gray-600'}`}
                                                >
                                                    {isSelected && (
                                                        <span className="text-black text-sm">✓</span>
                                                    )}
                                                </button>

                                                <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {plugin.image_url ? (
                                                        <Image
                                                            src={plugin.image_url}
                                                            alt={plugin.name}
                                                            width={96}
                                                            height={96}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-3xl">🎧</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* PLUGIN INFO */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3
                                                            onClick={() => router.push(`/plugins/${item.plugin_id}`)}
                                                            className="text-xl font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                                                        >
                                                            {plugin.name}
                                                        </h3>
                                                        <div className="text-gray-400 text-sm mt-1">
                                                            {language === "th" ? "เพิ่มเมื่อ" : "Added on"} {formatDate(item.created_at)}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-cyan-400">
                                                            {isFree
                                                                ? (language === "th" ? "ฟรี" : "FREE")
                                                                : `${currencySymbol}${pluginPrice.toFixed(2)}`
                                                            }
                                                        </div>
                                                        {discountPercent > 0 && (
                                                            <div className="text-sm text-green-400">
                                                                -{discountPercent}% OFF
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* NOTES SECTION */}
                                                <div className="mt-4">
                                                    {isEditing ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={noteText}
                                                                onChange={(e) => setNoteText(e.target.value)}
                                                                placeholder={language === "th" ? "เพิ่มโน๊ตส่วนตัว..." : "Add personal note..."}
                                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                                rows={2}
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleUpdateNote(item.id)}
                                                                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-3 py-1 rounded text-sm"
                                                                >
                                                                    {language === "th" ? "บันทึก" : "Save"}
                                                                </button>
                                                                <button
                                                                    onClick={cancelEditingNote}
                                                                    className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-3 py-1 rounded text-sm"
                                                                >
                                                                    {language === "th" ? "ยกเลิก" : "Cancel"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                {item.notes ? (
                                                                    <div className="text-gray-300 bg-gray-800/50 rounded-lg p-3">
                                                                        <div className="text-sm text-gray-400 mb-1">
                                                                            {language === "th" ? "โน๊ตของคุณ:" : "Your note:"}
                                                                        </div>
                                                                        {item.notes}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-gray-500 text-sm">
                                                                        {language === "th" ? "ยังไม่มีโน๊ต" : "No notes added"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => startEditingNote(item)}
                                                                className="text-gray-400 hover:text-white text-sm"
                                                            >
                                                                {language === "th" ? "แก้ไขโน๊ต" : "Edit Note"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ACTIONS */}
                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    <button
                                                        onClick={() => router.push(`/plugins/${item.plugin_id}`)}
                                                        className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                                                    >
                                                        {language === "th" ? "ดูรายละเอียด" : "View Details"}
                                                    </button>
                                                    <button className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors text-sm">
                                                        {language === "th" ? "ทดลองใช้ฟรี" : "Try Demo"}
                                                    </button>
                                                    <button className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors text-sm">
                                                        {language === "th" ? "เพิ่มในตะกร้า" : "Add to Cart"}
                                                    </button>
                                                    <div className="ml-auto">
                                                        <HeartButton
                                                            pluginSlug={item.plugin_id}
                                                            pluginName={plugin.name}
                                                            pluginPrice={pluginPrice}
                                                            pluginImage={plugin.image_url}
                                                            size="sm"
                                                            language={language}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-6">❤️</div>
                        <h2 className="text-2xl font-bold mb-4">
                            {language === "th" ? "รายการโปรดว่างเปล่า" : "Your wishlist is empty"}
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {language === "th"
                                ? "เริ่มสำรวจปลั๊กอินและกดไอคอนหัวใจเพื่อบันทึกลงรายการโปรดของคุณ"
                                : "Start browsing plugins and click the heart icon to save them to your wishlist"}
                        </p>
                        <button
                            onClick={() => router.push("/plugins")}
                            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
                        >
                            {language === "th" ? "สำรวจปลั๊กอิน" : "Browse Plugins"}
                        </button>
                    </div>
                )}

                {/* STATS & TIPS */}
                {wishlistData && wishlistData.count > 0 && (
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h3 className="font-bold mb-4">
                                {language === "th" ? "สถิติรายการโปรด" : "Wishlist Stats"}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-3xl font-bold text-cyan-400">
                                        {wishlistData.count}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {language === "th" ? "รายการทั้งหมด" : "Total Items"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold">
                                        {symbol}
                                        {wishlistData.items.reduce((sum, item) => {
                                            const plugin = item.plugin || item.plugin_data;
                                            if (plugin && !plugin.is_free && plugin.price) {
                                                return sum + plugin.price;
                                            }
                                            return sum;
                                        }, 0).toFixed(2)}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {language === "th" ? "มูลค่ารวม" : "Total Value"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h3 className="font-bold mb-4">
                                {language === "th" ? "เคล็ดลับการใช้รายการโปรด" : "Wishlist Tips"}
                            </h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>
                                        {language === "th"
                                            ? "รับการแจ้งเตือนเมื่อปลั๊กอินลดราคา"
                                            : "Get notified when plugins go on sale"}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>
                                        {language === "th"
                                            ? "แชร์กับเพื่อนเพื่อขอคำแนะนำ"
                                            : "Share with friends for recommendations"}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>
                                        {language === "th"
                                            ? "เพิ่มโน๊ตส่วนตัวสำหรับแต่ละรายการ"
                                            : "Add personal notes to each item"}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h3 className="font-bold mb-4">
                                {language === "th" ? "ขั้นตอนถัดไป" : "Next Steps"}
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/plugins")}
                                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span>🔍</span>
                                    <span>{language === "th" ? "ค้นหาปลั๊กอินเพิ่มเติม" : "Discover more plugins"}</span>
                                </button>
                                <button
                                    onClick={() => router.push("/profile/balance")}
                                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span>💰</span>
                                    <span>{language === "th" ? "เช็คเครดิตของฉัน" : "Check my credits"}</span>
                                </button>
                                <button
                                    onClick={() => router.push("/refer")}
                                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span>👥</span>
                                    <span>{language === "th" ? "ชวนเพื่อนรับเครดิต" : "Refer friends for credits"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}