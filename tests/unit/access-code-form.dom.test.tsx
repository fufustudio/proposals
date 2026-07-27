// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "../setup/dom";
import { AdminAccessForm } from "@/components/admin/admin-access-form";

describe("shared access-code form", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/admin/access");
  });

  it("announces invalid credentials, updates history, and restores focus", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: "That passcode did not unlock admin.",
        }),
      }),
    );
    const user = userEvent.setup();

    render(<AdminAccessForm nextPath="/admin" />);
    const input = screen.getByLabelText("Admin passcode");
    await user.type(input, "wrong");
    await user.click(screen.getByRole("button", { name: "Enter admin" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That passcode did not unlock admin.",
    );
    expect(window.location.pathname + window.location.search).toBe(
      "/admin/access?error=invalid&next=%2Fadmin",
    );
    await waitFor(() => expect(input).toHaveFocus());
  });

  it("reports network errors and clears the pending state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const user = userEvent.setup();

    render(<AdminAccessForm nextPath="/admin" />);
    const input = screen.getByLabelText("Admin passcode");
    await user.type(input, "secret");
    await user.click(screen.getByRole("button", { name: "Enter admin" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Access could not be checked. Please try again.",
    );
    expect(document.querySelector("form")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(screen.getByRole("button", { name: "Enter admin" })).toBeEnabled();
    await waitFor(() => expect(input).toHaveFocus());
  });
});
