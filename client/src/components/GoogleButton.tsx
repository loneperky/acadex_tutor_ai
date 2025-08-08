import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    // Trigger Google OAuth flow here
    console.log("Google Sign In clicked");
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border border-input shadow-sm hover:bg-muted/50"
    >
      <FcGoogle className="h-5 w-5" />
      <span className="text-sm font-medium">Sign in with Google</span>
    </Button>
  );
};

export default GoogleSignInButton;
