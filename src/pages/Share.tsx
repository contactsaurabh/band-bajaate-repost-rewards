
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SharePostForm from "@/components/SharePostForm";
import PointsCard from "@/components/PointsCard";

const Share = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Share a Post</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SharePostForm />
          
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Sharing Guidelines</h2>
            <div className="space-y-2">
              <div className="bbr-card p-4 bg-muted/50">
                <h3 className="font-medium mb-1">Share Consumer Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on posts about consumer problems, complaints, or issues with products, services, or companies.
                </p>
              </div>
              <div className="bbr-card p-4 bg-muted/50">
                <h3 className="font-medium mb-1">Use Valid X Posts</h3>
                <p className="text-sm text-muted-foreground">
                  Only share posts from X (Twitter) with the format: https://twitter.com/username/status/tweetid or https://x.com/username/status/tweetid
                </p>
              </div>
              <div className="bbr-card p-4 bg-muted/50">
                <h3 className="font-medium mb-1">Avoid Spamming</h3>
                <p className="text-sm text-muted-foreground">
                  Don't repeatedly share the same or similar posts. Quality matters over quantity.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <PointsCard />
          
          <div className="bbr-card">
            <div className="p-6">
              <h3 className="font-semibold mb-2">Why Share?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                  <span>Amplify consumer voices and concerns</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                  <span>Help others facing similar issues</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                  <span>Hold companies accountable</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                  <span>Earn points when others repost your content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
