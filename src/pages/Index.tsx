
import { useState } from "react";
import PostCard from "@/components/PostCard";
import PointsCard from "@/components/PointsCard";
import SharePostForm from "@/components/SharePostForm";
import { usePosts } from "@/context/PostContext";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { posts, isLoading } = usePosts();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");

  // Sort posts based on active tab
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.repostCount - a.repostCount;
    }
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Band Bajaate Raho</h1>
      <p className="text-muted-foreground mb-8">Share consumer issues, repost to support others, and earn points</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {!isAuthenticated && (
            <div className="bbr-card bg-muted/50 border-dashed">
              <div className="text-center p-6">
                <h2 className="text-xl font-semibold mb-2">Join Band Bajaate Raho</h2>
                <p className="text-muted-foreground mb-4">
                  Sign in to share posts about consumer issues and earn points for reposting others' content
                </p>
                <Button className="bbr-gradient text-white">Login to Get Started</Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              {isAuthenticated && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/share">+ Share Post</Link>
                </Button>
              )}
            </div>
            
            <TabsContent value="recent" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-60 bg-muted rounded-lg animate-pulse-light" />
                  ))}
                </div>
              ) : sortedPosts.length > 0 ? (
                <div className="space-y-6">
                  {sortedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No posts yet. Be the first to share!
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-60 bg-muted rounded-lg animate-pulse-light" />
                  ))}
                </div>
              ) : sortedPosts.length > 0 ? (
                <div className="space-y-6">
                  {sortedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No posts yet. Be the first to share!
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          {isAuthenticated && <PointsCard />}
          
          <Card className="bbr-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How it works</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <span>Share posts about consumer issues from X</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <span>Repost others' shared posts to earn points</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-bbr-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <span>Redeem your points for real money</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bbr-card">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Top Contributors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center">1</div>
                  <img src="https://picsum.photos/id/1005/30" alt="User" className="w-6 h-6 rounded-full" />
                  <span className="text-sm">@food_safety_now</span>
                  <span className="ml-auto text-xs">147 pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center">2</div>
                  <img src="https://picsum.photos/id/1012/30" alt="User" className="w-6 h-6 rounded-full" />
                  <span className="text-sm">@consumer_advocate</span>
                  <span className="ml-auto text-xs">124 pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-bbr-orange text-white rounded-full w-5 h-5 flex items-center justify-center">3</div>
                  <img src="https://picsum.photos/id/1011/30" alt="User" className="w-6 h-6 rounded-full" />
                  <span className="text-sm">@retail_watchdog</span>
                  <span className="ml-auto text-xs">98 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

