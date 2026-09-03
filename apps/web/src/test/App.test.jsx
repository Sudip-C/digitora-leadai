import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import App from "../App.jsx";
import { ToastProvider } from "../components/ui/index.js";

function renderApp(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe("Digitora LeadAI application", () => {
  it("navigates between workspace routes", async () => {
    const user = userEvent.setup();

    renderApp();

    expect(
      within(screen.getByRole("main")).getByRole("heading", {
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

    const menuButton = screen.getByRole("button", {
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
});
