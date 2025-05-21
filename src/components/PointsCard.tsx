
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PointsCard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card className="bbr-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4 bbr-gradient bg-clip-text text-transparent">
          {user.points}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts shared:</span>
            <span className="font-medium">{user.postsShared}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reposts received:</span>
            <span className="font-medium">{user.repostsReceived}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reposts made:</span>
            <span className="font-medium">{user.repostsMade}</span>
          </div>
        </div>

        <Button 
          asChild 
          className="w-full mt-4"
          variant="outline"
        >
          <Link to="/redeem">Redeem Points</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PointsCard;
