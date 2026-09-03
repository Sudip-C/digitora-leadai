import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "../components/ui/Button.jsx";

describe("Button", () => {
  it("renders and handles a user click", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Create lead</Button>);

    const button = screen.getByRole("button", {
      name: "Create lead",
    });

    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not handle clicks while disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Create lead
      </Button>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create lead",
      }),
    );

    expect(handleClick).not.toHaveBeenCalled();
  });
});
