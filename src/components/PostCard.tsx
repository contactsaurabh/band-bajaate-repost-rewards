
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { usePosts } from "@/context/PostContext";
import { useAuth } from "@/context/AuthContext";
import { Share, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { repostTweet } = usePosts();
  const { isAuthenticated } = useAuth();

  const handleRepost = async () => {
    await repostTweet(post.id);
  };

  return (
    <Card className="bbr-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={post.userProfileImage || "/placeholder.svg"}
            alt={post.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold">@{post.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
            <p className="text-sm mb-3">{post.content}</p>
            
            <div className="bg-muted p-4 rounded-md border border-border">
              <p className="text-sm text-muted-foreground mb-1">View original on X:</p>
              <a 
                href={post.tweetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs break-all text-bbr-purple hover:underline"
              >
                {post.tweetUrl}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between items-center border-t">
        <p className="text-sm text-muted-foreground">
          {post.repostCount} {post.repostCount === 1 ? "repost" : "reposts"}
        </p>
        <Button
          onClick={handleRepost}
          disabled={!isAuthenticated || post.reposted}
          variant={post.reposted ? "outline" : "default"}
          className={post.reposted ? "border-bbr-purple text-bbr-purple" : "bbr-gradient text-white"}
        >
          {post.reposted ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Reposted
            </>
          ) : (
            <>
              <Share className="mr-2 h-4 w-4" /> Repost & Earn
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
