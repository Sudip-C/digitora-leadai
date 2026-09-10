import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import App from "../App.jsx";
import { AuthProvider } from "../auth/AuthContext.jsx";
import { ToastProvider } from "../components/ui/index.js";

const authenticatedSession = {
  access_token: "access-token",
  user: {
    id: "user-1",
    email: "sudip@example.com",
  },
};

function createAuthClient(initialSession) {
  let authStateListener;

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
            unsubscribe: vi.fn(),
          },
        },
      };
    }),

    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(async () => {
      authStateListener("SIGNED_OUT", null);
      return { error: null };
    }),
  };

  return {
    client: {
      auth,
    },

    emitAuthChange(event, session) {
      authStateListener(event, session);
    },
  };
}

function renderApp(path = "/", session = authenticatedSession) {
  const authClient = createAuthClient(session);

  const renderedApp = render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <AuthProvider client={authClient.client}>
          <App />
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>,
  );

  return {
    ...renderedApp,
    authClient,
  };
}

describe("Digitora LeadAI application", () => {
  it("navigates between workspace routes", async () => {
    const user = userEvent.setup();

    renderApp();

    const main = await screen.findByRole("main");

    expect(
      within(main).getByRole("heading", {
        name: "Overview",
      }),
    ).toBeInTheDocument();

    const leadsLink = screen.getByRole("link", {
      name: "Leads",
    });

    await user.click(leadsLink);

    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        name: "Leads",
      }),
    ).toBeInTheDocument();

    expect(leadsLink).toHaveAttribute("aria-current", "page");
  });

  it("renders the not-found page for an unknown route", () => {
    renderApp("/unknown-page");

    expect(
      screen.getByRole("heading", {
        name: /page not found/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();

    renderApp();

    const menuButton = await screen.findByRole("button", {
      name: "Open navigation",
    });

    await user.click(menuButton);

    expect(
      screen.getByRole("dialog", {
        name: "Digitora LeadAI",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });

  it("redirects unauthenticated users and returns them to their requested route", async () => {
    const { authClient } = renderApp("/leads", null);

    expect(
      await screen.findByRole("heading", {
        name: "Welcome back",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("navigation", {
        name: "Primary navigation",
      }),
    ).not.toBeInTheDocument();

    act(() => {
      authClient.emitAuthChange("SIGNED_IN", authenticatedSession);
    });

    expect(
      await screen.findByRole("heading", {
        name: "Leads",
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("redirects authenticated users away from the login page", async () => {
    renderApp("/login");

    expect(
      await screen.findByRole("heading", {
        name: "Overview",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
  it("signs out the current session and redirects to login", async () => {
    const user = userEvent.setup();
    const { authClient } = renderApp();

    const signOutButton = await screen.findByRole("button", {
      name: "Sign out",
    });

    await user.click(signOutButton);

    expect(authClient.client.auth.signOut).toHaveBeenCalledWith({
      scope: "local",
    });

    expect(
      await screen.findByRole("heading", {
        name: "Welcome back",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("navigation", {
        name: "Primary navigation",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Signed out")).toBeInTheDocument();
  });
});
