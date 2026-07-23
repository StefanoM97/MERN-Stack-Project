import { jest } from "@jest/globals";

const sendMail = jest.fn();
const createTransport = jest.fn();

const mockEnv = {
  isProduction: false,
  isTest: false,
  appUrl: "https://reusehub.example",
  smtp: {
    host: "",
    port: 2525,
    secure: false,
    user: "",
    pass: "",
    from: "ReuseHub <sender@example.com>"
  }
};

await jest.unstable_mockModule("nodemailer", () => ({
  default: { createTransport }
}));

await jest.unstable_mockModule("../src/config/env.js", () => ({
  env: mockEnv
}));

const {
  sendVerificationEmail,
  sendPasswordResetEmail
} = await import("../src/services/emailService.js");

describe("email service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockEnv.isProduction = false;
    mockEnv.isTest = false;
    mockEnv.appUrl = "https://reusehub.example";
    mockEnv.smtp = {
      host: "",
      port: 2525,
      secure: false,
      user: "",
      pass: "",
      from: "ReuseHub <sender@example.com>"
    };

    createTransport.mockReturnValue({ sendMail });
    sendMail.mockResolvedValue({ accepted: ["recipient@example.com"] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("provides a token preview only outside production", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    const result = await sendVerificationEmail(
      { email: "recipient@example.com" },
      "verification-token"
    );

    expect(result).toEqual({
      developmentPreview: true,
      previewUrl:
        "https://reusehub.example/verify-email#token=verification-token"
    });
    expect(log.mock.calls.flat().join(" ")).toContain(
      "verification-token"
    );
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("does not expose token-bearing content when SMTP is absent in production", async () => {
    mockEnv.isProduction = true;

    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    const error = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendVerificationEmail(
      { email: "recipient@example.com" },
      "production-secret-token"
    );

    expect(result).toEqual({ developmentPreview: false });
    expect(log).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      "[EMAIL] SMTP is not configured; message was not sent"
    );
    expect(error.mock.calls.flat().join(" ")).not.toContain(
      "production-secret-token"
    );
    expect(createTransport).not.toHaveBeenCalled();
  });

  it("sends through configured SMTP using fragment-based reset links", async () => {
    mockEnv.isProduction = true;
    mockEnv.smtp = {
      host: "smtp-relay.example",
      port: 2525,
      secure: false,
      user: "smtp-user",
      pass: "smtp-password",
      from: "ReuseHub <sender@example.com>"
    };

    const result = await sendPasswordResetEmail(
      { email: "recipient@example.com" },
      "reset-token"
    );

    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp-relay.example",
      port: 2525,
      secure: false,
      auth: {
        user: "smtp-user",
        pass: "smtp-password"
      }
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "ReuseHub <sender@example.com>",
        to: "recipient@example.com",
        subject: "Reset your ReuseHub password",
        text: expect.stringContaining(
          "/reset-password#token=reset-token"
        ),
        html: expect.stringContaining(
          "/reset-password#token=reset-token"
        )
      })
    );

    expect(result).toEqual({ developmentPreview: false });
  });
});
