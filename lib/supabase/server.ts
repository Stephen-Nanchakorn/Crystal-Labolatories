import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ละเว้น error จาก Server Component
          }
        },
      },
    }
  )
}

// ✅ ฟังก์ชัน helper สำหรับดึง invoices ของผู้ใช้
export async function getUserInvoices(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        plugins:plugin_id (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }

    return invoices || []
  } catch (error) {
    console.error('Error in getUserInvoices:', error)
    return []
  }
}

// ✅ ฟังก์ชัน helper สำหรับดึงสถิติ invoices
export async function getInvoiceStats(userId: string) {
  try {
    const supabase = await createClient()
    
    // ดึงจำนวนทั้งหมด
    const { count: totalCount, error: countError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Error counting invoices:', countError)
      return { totalCount: 0, paidCount: 0, totalAmount: 0 }
    }

    // ดึงเฉพาะที่ชำระแล้ว
    const { data: paidInvoices, error: paidError } = await supabase
      .from('invoices')
      .select('amount_total, currency')
      .eq('user_id', userId)
      .eq('status', 'paid')

    if (paidError) {
      console.error('Error fetching paid invoices:', paidError)
      return { 
        totalCount: totalCount || 0, 
        paidCount: 0, 
        totalAmount: 0 
      }
    }

    const paidCount = paidInvoices?.length || 0
    const totalAmount = paidInvoices?.reduce((sum, inv) => sum + inv.amount_total, 0) || 0

    return {
      totalCount: totalCount || 0,
      paidCount,
      totalAmount,
    }
  } catch (error) {
    console.error('Error in getInvoiceStats:', error)
    return { totalCount: 0, paidCount: 0, totalAmount: 0 }
  }
}

// ✅ ฟังก์ชันสำหรับดึง invoice เดี่ยว
export async function getInvoiceById(invoiceId: string, userId: string) {
  try {
    const supabase = await createClient()
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        plugins:plugin_id (name)
      `)
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching invoice:', error)
      return null
    }

    return invoice
  } catch (error) {
    console.error('Error in getInvoiceById:', error)
    return null
  }
}