import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "../auth/AuthContext.jsx";

function createMockClient(initialSession = null) {
  let authStateListener;
  const unsubscribe = vi.fn();

  const auth = {
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: initialSession,
      },
      error: null,
    }),

    onAuthStateChange: vi.fn((listener) => {
      authStateListener = listener;

      return {
        data: {
          subscription: {
            unsubscribe,
          },
        },
      };
    }),

    signUp: vi.fn().mockResolvedValue({
      data: {
        session: null,
        user: {
          id: "user-1",
        },
      },
      error: null,
    }),

    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: "access-token",
          user: {
            id: "user-1",
            email: "sudip@example.com",
          },
        },
      },
      error: null,
    }),

    signOut: vi.fn().mockResolvedValue({
      error: null,
    }),
  };

  return {
    auth,
    client: {
      auth,
    },

    emitAuthChange(event, session) {
      authStateListener(event, session);
    },

    unsubscribe,
  };
}

function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <p>Loading session</p>;
  }

  return <p>{isAuthenticated ? user.email : "Signed out"}</p>;
}

function AuthActions() {
  const { signIn, signOut, signUp } = useAuth();
  const [status, setStatus] = useState("Idle");

  return (
    <div>
      <p>{status}</p>

      <button
        type="button"
        onClick={async () => {
          await signUp({
            email: " sudip@example.com ",
            fullName: " Sudip Chowdhury ",
            password: "secure-password",
          });

          setStatus("Signed up");
        }}
      >
        Sign up
      </button>

      <button
        type="button"
        onClick={async () => {
          await signIn({
            email: " sudip@example.com ",
            password: "secure-password",
          });

          setStatus("Signed in");
        }}
      >
        Sign in
      </button>

      <button
        type="button"
        onClick={async () => {
          await signOut();
          setStatus("Signed out");
        }}
      >
        Sign out
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("restores the session, handles auth changes, and removes its listener", async () => {
    const session = {
      access_token: "access-token",
      user: {
        id: "user-1",
        email: "sudip@example.com",
      },
    };

    const mockClient = createMockClient(session);

    const { unmount } = render(
      <AuthProvider client={mockClient.client}>
        <AuthStatus />
      </AuthProvider>,
    );

    expect(await screen.findByText("sudip@example.com")).toBeInTheDocument();
    expect(mockClient.auth.getSession).toHaveBeenCalledOnce();

    act(() => {
      mockClient.emitAuthChange("SIGNED_OUT", null);
    });

    expect(screen.getByText("Signed out")).toBeInTheDocument();

    unmount();

    expect(mockClient.unsubscribe).toHaveBeenCalledOnce();
  });

  it("uses Supabase for signup, login, and logout", async () => {
    const user = userEvent.setup();
    const mockClient = createMockClient();

    render(
      <AuthProvider client={mockClient.client}>
        <AuthActions />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(mockClient.auth.signUp).toHaveBeenCalledWith({
      email: "sudip@example.com",
      password: "secure-password",
      options: {
        data: {
          full_name: "Sudip Chowdhury",
        },
      },
    });
    expect(screen.getByText("Signed up")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "sudip@example.com",
      password: "secure-password",
    });
    expect(screen.getByText("Signed in")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => {
      expect(mockClient.auth.signOut).toHaveBeenCalledOnce();
      expect(mockClient.auth.signOut).toHaveBeenCalledWith({
        scope: "local",
      });
    });

    expect(screen.getByText("Signed out")).toBeInTheDocument();
  });
});
