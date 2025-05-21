
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePosts } from "@/context/PostContext";

const SharePostForm = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const { sharePost, isLoading } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetUrl) return;
    
    try {
      await sharePost(tweetUrl);
      setTweetUrl("");
    } catch (error) {
      console.error("Failed to share post:", error);
    }
  };

  const isValidUrl = () => {
    if (!tweetUrl) return true;
    try {
      const url = new URL(tweetUrl);
      return url.hostname.includes("twitter.com") || url.hostname.includes("x.com");
    } catch {
      return false;
    }
  };

  return (
    <Card className="bbr-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">Share a post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tweet-url">X Post URL</Label>
            <Input
              id="tweet-url"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="Enter an X (Twitter) post URL"
              className="bbr-input"
              required
            />
            {tweetUrl && !isValidUrl() && (
              <p className="text-sm text-destructive">
                Please enter a valid X (Twitter) URL
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Paste the full URL of an X post about consumer issues you want to share
            </p>
          </div>
          <Button 
            type="submit"
            disabled={isLoading || !tweetUrl || !isValidUrl()}
            className="bbr-gradient text-white w-full"
          >
            {isLoading ? "Sharing..." : "Share Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SharePostForm;
