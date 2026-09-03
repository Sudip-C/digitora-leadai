import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Input from "../components/ui/Input.jsx";

describe("Input", () => {
  it("connects its label and hint to the input", () => {
    render(<Input label="Company name" hint="Enter the registered company name." />);

    const input = screen.getByRole("textbox", {
      name: "Company name",
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription("Enter the registered company name.");
  });

  it("exposes validation errors accessibly", () => {
    render(<Input label="Contact number" error="Contact number is required." />);

    const input = screen.getByRole("textbox", {
      name: "Contact number",
    });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Contact number is required.");
  });
});
