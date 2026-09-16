"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting user profile:", error);
    return null;
  }

  return data;
}

export async function updateUserBalance(
  userId: string, 
  amount: number, 
  type: 'add' | 'subtract'
) {
  const supabase = await createClient();
  
  const { data: user } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  if (!user) {
    return { error: "User not found" };
  }

  const newBalance = type === 'add' 
    ? user.balance + amount 
    : user.balance - amount;

  const { error } = await supabase
    .from("users")
    .update({ balance: newBalance })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user balance:", error);
    return { error: "Failed to update balance" };
  }

  return { success: true, newBalance };
}