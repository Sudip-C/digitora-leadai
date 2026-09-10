import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../auth/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import { useToast } from "../ui/Toast.jsx";

function getDisplayName(user) {
  const fullName = user?.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  return user?.email?.split("@")[0] || "Account";
}

export default function AccountMenu() {
  const { signOut, user } = useAuth();
  const { showToast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = getDisplayName(user);
  const initial = displayName.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();

      showToast({
        title: "Signed out",
        description: "Your local session has ended securely.",
        variant: "success",
      });
    } catch (error) {
      setIsSigningOut(false);

      showToast({
        title: "Unable to sign out",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "danger",
      });
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <div className="hidden min-w-0 text-right md:block">
        <p className="max-w-40 truncate text-sm font-semibold text-ink">{displayName}</p>
        <p className="max-w-40 truncate text-xs text-muted">{user?.email}</p>
      </div>

      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
      >
        {initial}
      </span>

      <Button
        aria-label={isSigningOut ? "Signing out" : "Sign out"}
        disabled={isSigningOut}
        size="sm"
        variant="secondary"
        onClick={handleSignOut}
      >
        {isSigningOut ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <LogOut aria-hidden="true" className="size-4" />
        )}

        <span className="hidden xl:inline">{isSigningOut ? "Signing out..." : "Sign out"}</span>
      </Button>
    </div>
  );
}
