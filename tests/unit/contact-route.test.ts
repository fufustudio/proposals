import { beforeEach, describe, expect, it, vi } from "vitest";

const { ResendMock, sendMock } = vi.hoisted(() => {
  const sendMock = vi.fn();
  const ResendMock = vi.fn(function Resend(this: {
    emails: { send: typeof sendMock };
  }) {
    this.emails = {
      send: sendMock,
    };
  });

  return { ResendMock, sendMock };
});

vi.mock("resend", () => ({
  Resend: ResendMock,
}));

import { POST } from "@/app/api/contact/route";

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  interest: "Strategy",
  message: "Please tell me more about the project.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    ResendMock.mockClear();
    sendMock.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.RESEND_TO_EMAIL;
  });

  it("returns a configuration error when Resend env vars are missing", async () => {
    const res = await POST(jsonRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({
      success: false,
      message:
        "The form provider is not configured yet. Missing environment variables: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL.",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("accepts honeypot submissions without sending email", async () => {
    const res = await POST(
      jsonRequest({
        ...validPayload,
        company: "Spam Co.",
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects invalid and oversized submissions", async () => {
    const invalid = await POST(jsonRequest({ ...validPayload, email: "nope" }));
    const invalidBody = await invalid.json();

    expect(invalid.status).toBe(400);
    expect(invalidBody).toEqual({
      success: false,
      message: "Please enter a valid email address.",
    });

    const oversized = await POST(
      jsonRequest({ ...validPayload, message: "x".repeat(3001) }),
    );
    const oversizedBody = await oversized.json();

    expect(oversized.status).toBe(400);
    expect(oversizedBody).toEqual({
      success: false,
      message: "Please shorten your message and try again.",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends valid inquiries through Resend", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "Website <hello@starter.test>";
    process.env.RESEND_TO_EMAIL = "inquiries@starter.test";
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });

    const res = await POST(jsonRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(ResendMock).toHaveBeenCalledWith("re_test");
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Website <hello@starter.test>",
        to: "inquiries@starter.test",
        subject: "New website contact",
        replyTo: "ada@example.com",
        text: expect.stringContaining("Interest: Strategy"),
        html: expect.stringContaining("New website contact."),
      }),
    );
  });

  it("returns a safe error when Resend fails", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "Website <hello@starter.test>";
    process.env.RESEND_TO_EMAIL = "inquiries@starter.test";
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Provider details" },
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(jsonRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body).toEqual({
      success: false,
      message:
        "Something went wrong sending your message. Please try again after the provider is configured.",
    });
  });
});

function jsonRequest(payload: unknown) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
