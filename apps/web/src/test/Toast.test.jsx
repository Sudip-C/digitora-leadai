import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from "../components/ui/index.js";

function ToastTestPage({ duration = 0 }) {
  const { showToast } = useToast();

  function handleShowToast() {
    showToast({
      title: "Lead saved",
      description: "The lead was saved successfully.",
      variant: "success",
      duration,
    });
  }

  return (
    <button type="button" onClick={handleShowToast}>
      Show notification
    </button>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("shows and manually dismisses a notification", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTestPage />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Show notification",
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("Lead saved");
    expect(screen.getByRole("status")).toHaveTextContent("The lead was saved successfully.");

    await user.click(
      screen.getByRole("button", {
        name: "Dismiss Lead saved",
      }),
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("automatically dismisses a notification", () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTestPage duration={1000} />
      </ToastProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show notification",
      }),
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
