
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { redemptionOptions, processRedemption, getRedemptionHistory } from "@/lib/redemption";

const Redeem = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedOption, setSelectedOption] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const minimumPoints = 500;
  const canRedeem = user?.points && user.points >= minimumPoints;

  // Get valid redemption options based on user's points
  const validOptions = redemptionOptions.filter(option => user?.points && user.points >= option.points);

  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      if (!isAuthenticated) return;
      
      setIsLoadingHistory(true);
      try {
        const history = await getRedemptionHistory();
        setRedemptionHistory(history);
      } catch (error) {
        console.error("Failed to fetch redemption history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchRedemptionHistory();
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || !paymentEmail) return;
    
    const option = redemptionOptions.find(opt => opt.value === selectedOption);
    if (!option) return;
    
    setIsSubmitting(true);
    try {
      await processRedemption(selectedOption, option.points, paymentEmail);
      
      // Refresh redemption history
      const history = await getRedemptionHistory();
      setRedemptionHistory(history);
      
      // Clear form
      setSelectedOption("");
      setPaymentEmail("");
    } catch (error) {
      console.error("Failed to process redemption:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Redeem Points</h1>
      <p className="text-muted-foreground mb-8">Convert your earned points into real rewards</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bbr-card">
            <CardHeader>
              <CardTitle className="text-2xl">Available Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="text-4xl font-bold bbr-gradient bg-clip-text text-transparent">
                  {user?.points}
                </div>
                <div className="text-muted-foreground ml-2">points</div>
              </div>
              
              {canRedeem ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="redeem-option">Select Redemption Option</Label>
                    <Select
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                    >
                      <SelectTrigger id="redeem-option" className="bbr-input">
                        <SelectValue placeholder="Select a redemption option" />
                      </SelectTrigger>
                      <SelectContent>
                        {validOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-email">Payment Email</Label>
                    <Input
                      id="payment-email"
                      type="email"
                      placeholder="Enter your payment email"
                      className="bbr-input"
                      value={paymentEmail}
                      onChange={(e) => setPaymentEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This is the email where you'll receive your payment
                    </p>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={!selectedOption || !paymentEmail || isSubmitting}
                    className="w-full bbr-gradient text-white"
                  >
                    {isSubmitting ? "Processing..." : "Redeem Now"}
                  </Button>
                </form>
              ) : (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-lg font-medium mb-2">Not enough points yet</p>
                  <p className="text-muted-foreground mb-4">
                    You need at least {minimumPoints} points to redeem. Keep sharing and reposting to earn more!
                  </p>
                  <p className="text-sm">
                    <strong>Current balance:</strong> {user?.points} / {minimumPoints} points
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {redemptionHistory.length > 0 && (
            <Card className="bbr-card mt-6">
              <CardHeader>
                <CardTitle className="text-2xl">Redemption History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <p>Loading history...</p>
                  ) : (
                    redemptionHistory.map((item) => (
                      <div key={item.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">
                            {item.points_amount} Points → ${item.money_amount}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            item.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : item.status === 'processed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Via: {item.payment_method === 'paypal' ? 'PayPal' : 
                                item.payment_method === 'bankTransfer' ? 'Bank Transfer' : 'Gift Card'} 
                          to {item.payment_email}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Requested on {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="bbr-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Redemption Options</h3>
              <div className="space-y-4">
                {redemptionOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className={`border rounded-md p-4 transition-colors ${
                      user?.points && user.points >= option.points 
                        ? 'border-bbr-purple bg-bbr-purple/5 cursor-pointer hover:bg-bbr-purple/10'
                        : 'border-border opacity-50'
                    }`}
                    onClick={() => {
                      if (user?.points && user.points >= option.points) {
                        setSelectedOption(option.value);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{option.value === 'paypal' ? 'PayPal' : option.value === 'bankTransfer' ? 'Bank Transfer' : 'Gift Card'}</p>
                        <p className="text-xs text-muted-foreground">{option.points} points = ${option.amount}</p>
                      </div>
                      {user?.points && user.points >= option.points ? (
                        <div className="text-xs bg-bbr-purple/20 text-bbr-purple px-2 py-1 rounded">
                          Available
                        </div>
                      ) : (
                        <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Need {option.points - (user?.points || 0)} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bbr-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How to Earn More Points</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <span>Repost other users' content (+1 point per repost)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <span>Share your own posts (earn when others repost)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <span>Participate in special events and promotions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Redeem;
