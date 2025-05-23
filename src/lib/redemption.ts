
import { supabase, getCurrentUser } from "./supabase";
import { toast } from "sonner";
import { Database } from './database.types';

// Define redemption options for the app
export const redemptionOptions = [
  { value: "paypal", label: "PayPal - 500 points = $5", points: 500, amount: 5 },
  { value: "bankTransfer", label: "Bank Transfer - 1000 points = $10", points: 1000, amount: 10 },
  { value: "giftCard", label: "Gift Card - 2000 points = $20", points: 2000, amount: 20 },
];

// Process a redemption request
export const processRedemption = async (
  paymentMethod: string,
  pointsAmount: number,
  paymentEmail: string
) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error("You must be logged in to redeem points");
    throw new Error("Not authenticated");
  }
  
  // Find the redemption option
  const option = redemptionOptions.find(opt => opt.value === paymentMethod && opt.points === pointsAmount);
  
  if (!option) {
    toast.error("Invalid redemption option");
    throw new Error("Invalid redemption option");
  }
  
  try {
    // Check if user has enough points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();
      
    if (profileError) throw profileError;
    if (!profile || profile.points < pointsAmount) {
      toast.error("Insufficient points for redemption");
      throw new Error("Insufficient points");
    }
    
    // Create the redemption record
    const { data: redemptionData, error: redemptionError } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        points_amount: pointsAmount,
        money_amount: option.amount,
        payment_method: paymentMethod,
        payment_email: paymentEmail,
        status: 'pending'
      } as any)
      .select();
      
    if (redemptionError) throw redemptionError;
    
    // Update user points
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        points: profile.points - pointsAmount,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', user.id);
      
    if (updateError) throw updateError;
      
    // Record transaction
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        user_id: user.id,
        amount: -pointsAmount,
        description: `Redemption via ${paymentMethod}`,
        transaction_type: 'REDEMPTION',
        reference_id: redemptionData?.[0]?.id
      } as any);
    
    if (transactionError) throw transactionError;
    
    toast.success("Redemption request submitted successfully");
    return redemptionData?.[0];
  } catch (error: any) {
    toast.error(`Redemption failed: ${error.message}`);
    throw error;
  }
};

// Get user's redemption history
export const getRedemptionHistory = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const { data, error } = await supabase
    .from('redemptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data;
};
