
import { toast } from "sonner";
import { Redemption } from "@/types";

// Define redemption options for the app
export const redemptionOptions = [
  { value: "paypal", label: "PayPal - 500 points = $5", points: 500, amount: 5 },
  { value: "bankTransfer", label: "Bank Transfer - 1000 points = $10", points: 1000, amount: 10 },
  { value: "giftCard", label: "Gift Card - 2000 points = $20", points: 2000, amount: 20 },
];

// Mock redemption history
const mockRedemptionHistory: Redemption[] = [
  {
    id: "redemption-1",
    userId: "demo-user-123",
    pointsAmount: 500,
    moneyAmount: 5,
    paymentEmail: "demo@example.com",
    status: 'processed',
    paymentMethod: 'paypal',
    createdAt: "2023-04-15T10:30:00Z",
    processedAt: "2023-04-16T14:20:00Z"
  },
  {
    id: "redemption-2",
    userId: "demo-user-123",
    pointsAmount: 1000,
    moneyAmount: 10,
    paymentEmail: "demo@example.com",
    status: 'pending',
    paymentMethod: 'bankTransfer',
    createdAt: "2023-05-20T09:15:00Z"
  }
];

// Process a redemption request
export const processRedemption = async (
  paymentMethod: string,
  pointsAmount: number,
  paymentEmail: string
) => {
  // Demo user from AuthContext has 75 points
  if (pointsAmount > 75) {
    toast.error("Insufficient points for redemption");
    throw new Error("Insufficient points");
  }
  
  // Find the redemption option
  const option = redemptionOptions.find(opt => opt.value === paymentMethod && opt.points === pointsAmount);
  
  if (!option) {
    toast.error("Invalid redemption option");
    throw new Error("Invalid redemption option");
  }
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Redemption request submitted successfully");
    
    return {
      id: `redemption-${Date.now()}`,
      userId: "demo-user-123",
      pointsAmount,
      moneyAmount: option.amount,
      paymentEmail,
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    toast.error(`Redemption failed: ${error.message}`);
    throw error;
  }
};

// Get user's redemption history
export const getRedemptionHistory = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockRedemptionHistory;
};
