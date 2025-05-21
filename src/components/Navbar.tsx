
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { User, Plus, Home } from "lucide-react";
import LoginModal from "./LoginModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bbr-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">BBR</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">Band Bajaate Raho</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" aria-label="Home">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/share">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                  <Plus className="h-4 w-4" /> Share Post
                </Button>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.username} />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">@{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.points} points
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/redeem">
                      Redeem Points
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bbr-gradient text-white"
            >
              <User className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
