
import { supabase } from './client';
import { getCurrentUser, getCurrentUserProfile } from './auth';

// Redemption related functions
export const redemptionUtils = {
  createRedemption: async (data: { 
    points_amount: number, 
    money_amount: number,
    payment_method: string,
    payment_email: string 
  }) => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    // First check if user has enough points
    const profile = await getCurrentUserProfile();
    
    if (!profile || profile.points < data.points_amount) {
      throw new Error('Insufficient points');
    }
    
    // Begin transaction to create redemption and reduce points
    const { data: redemption, error } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        points_amount: data.points_amount,
        money_amount: data.money_amount,
        payment_method: data.payment_method,
        payment_email: data.payment_email
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Reduce points from user's profile
    await supabase
      .from('profiles')
      .update({
        points: profile.points - data.points_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    // Record transaction
    await supabase
      .from('point_transactions')
      .insert({
        user_id: user.id,
        amount: -data.points_amount,
        description: `Points redeemed for ${data.payment_method}`,
        reference_id: redemption.id,
        transaction_type: 'REDEMPTION'
      });
      
    return redemption;
  },
  
  getUserRedemptions: async () => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    return await supabase
      .from('redemptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  }
};
