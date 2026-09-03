import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Modal from "../components/ui/Modal.jsx";

function ModalTestPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open setup status
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Setup status"
        description="Frontend foundation status"
        footer={<button type="button">Confirm</button>}
      >
        <p>The frontend is ready.</p>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("traps focus, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();

    render(<ModalTestPage />);

    const openButton = screen.getByRole("button", {
      name: "Open setup status",
    });

    await user.click(openButton);

    expect(
      screen.getByRole("dialog", {
        name: "Setup status",
      }),
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", {
      name: "Close dialog",
    });

    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });

    expect(
      screen.getByRole("button", {
        name: "Confirm",
      }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });
});
