
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { Navigate } from "react-router-dom";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { posts } = usePosts();

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const userPosts = posts.filter(post => post.userId === user?.id);
  const userReposts = posts.filter(post => post.reposted);

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center sm:items-start">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user?.profileImage} alt={user?.username} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-1">@{user?.username}</h1>
          <p className="text-muted-foreground mb-4">Member since May 2023</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bbr-card p-4 text-center">
              <p className="text-2xl font-bold bbr-gradient bg-clip-text text-transparent">{user?.points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="bbr-card p-4 text-center">
              <p className="text-2xl font-bold">{user?.postsShared}</p>
              <p className="text-xs text-muted-foreground">Posts Shared</p>
            </div>
            <div className="bbr-card p-4 text-center">
              <p className="text-2xl font-bold">{user?.repostsReceived}</p>
              <p className="text-xs text-muted-foreground">Reposts Received</p>
            </div>
            <div className="bbr-card p-4 text-center">
              <p className="text-2xl font-bold">{user?.repostsMade}</p>
              <p className="text-xs text-muted-foreground">Reposts Made</p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posts">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="reposts">My Reposts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-0">
          {userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              You haven't shared any posts yet.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reposts" className="mt-0">
          {userReposts.length > 0 ? (
            <div className="space-y-6">
              {userReposts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              You haven't reposted anything yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
