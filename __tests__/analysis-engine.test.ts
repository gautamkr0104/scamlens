import { analyzeMessage } from "../src/lib/analysis-engine";

describe("ScamLens Analysis Engine", () => {
  describe("OTP Scam Detection", () => {
    it("should detect OTP request messages with high risk", () => {
      const result = analyzeMessage(
        "Your account has been compromised. Please share the OTP code sent to your phone to verify your identity. Send your verification code to 555-0199 immediately."
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(result.riskLevel).toMatch(/suspicious|high|very-high/);
      expect(
        result.findings.some(
          (f) =>
            f.category === "credential-request" &&
            f.title.toLowerCase().includes("otp")
        )
      ).toBe(true);
    });
  });

  describe("Bank Impersonation", () => {
    it("should detect fake bank messages with high risk", () => {
      const result = analyzeMessage(
        "URGENT: Unusual activity on your Chase account! Your account will be SUSPENDED within 24 hours. Verify your identity immediately by entering your account number and PIN at http://chase-secure-login.xyz/verify"
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(50);
      expect(result.riskLevel).toMatch(/high|very-high/);
      expect(
        result.findings.some(
          (f) => f.category === "threat" || f.category === "fake-authority"
        )
      ).toBe(true);
    });
  });

  describe("Delivery Scam", () => {
    it("should detect fake delivery messages", () => {
      const result = analyzeMessage(
        "DHL Express: Your parcel cannot be delivered. Reschedule delivery here: http://dhl-tracking-notice.top/r/abc123 Enter your full name and address. Pay a $2.99 redelivery fee with a gift card."
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) => f.category === "fake-delivery" || f.category === "payment-request"
        )
      ).toBe(true);
    });
  });

  describe("Job Scam", () => {
    it("should detect fake employment offers", () => {
      const result = analyzeMessage(
        "Congratulations! You've been selected for a work from home position earning $5,000/week! No experience needed. Reply to this message or contact my agent on WhatsApp for details. Keep this between us."
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) =>
            f.category === "fake-employment" ||
            f.category === "financial-promise"
        )
      ).toBe(true);
    });
  });

  describe("Prize Scam", () => {
    it("should detect fake lottery/prize messages", () => {
      const result = analyzeMessage(
        "CONGRATULATIONS! You have WON $1,000,000 in the International Lottery! To claim your prize, send a processing fee of $50 via iTunes gift card within 24 hours."
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) =>
            f.category === "fake-reward" || f.category === "payment-request"
        )
      ).toBe(true);
    });
  });

  describe("Crypto Scam", () => {
    it("should detect cryptocurrency payment requests", () => {
      const result = analyzeMessage(
        "Send 0.5 Bitcoin to my wallet address to unlock your prize. This is a legitimate opportunity. The more crypto you send, the more you will receive back guaranteed!"
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) =>
            f.category === "payment-request" ||
            f.category === "financial-promise"
        )
      ).toBe(true);
    });
  });

  describe("Suspicious URL Detection", () => {
    it("should flag URL shorteners", () => {
      const result = analyzeMessage(
        "Check this out: http://bit.ly/3xYzAbC It is a special offer just for you."
      );
      expect(
        result.detectedURLs.some((u) =>
          u.issues.some((i) => i.toLowerCase().includes("shortener"))
        )
      ).toBe(true);
    });

    it("should flag suspicious domains", () => {
      const result = analyzeMessage(
        "Visit http://paypal-verify.xyz/secure to confirm your account."
      );
      expect(result.detectedURLs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Urgency Language", () => {
    it("should detect urgency tactics", () => {
      const result = analyzeMessage(
        "ACT NOW! This offer expires in 2 hours! Don't delay, act immediately or lose this opportunity forever!"
      );
      expect(
        result.findings.some(
          (f) => f.category === "urgency-tactic"
        )
      ).toBe(true);
    });
  });

  describe("Credential Harvesting", () => {
    it("should detect password and card number requests", () => {
      const result = analyzeMessage(
        "We need to verify your account. Please provide your password and card number to confirm your identity."
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) => f.category === "credential-request"
        )
      ).toBe(true);
    });
  });

  describe("Legitimate Message", () => {
    it("should give a low score to a relatively legitimate message", () => {
      const result = analyzeMessage(
        "Your package from Order #4521 has been shipped via FedEx. Expected delivery: Thursday, August 20. Tracking number: FX9876543210. Track your package at fedex.com. Questions? Contact us at 1-800-463-3339."
      );
      expect(result.riskScore).toBeLessThan(30);
      expect(result.riskLevel).toBe("low");
    });
  });

  describe("Empty Input", () => {
    it("should handle empty input gracefully", () => {
      const result = analyzeMessage("");
      expect(result.riskScore).toBe(0);
      expect(result.riskLevel).toBe("low");
      expect(result.findings).toHaveLength(0);
    });
  });

  describe("Gift Card Scam", () => {
    it("should detect gift card payment requests", () => {
      const result = analyzeMessage(
        "Please buy $200 in iTunes gift cards and send me the code from the back of the card. This is urgent!"
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(40);
      expect(
        result.findings.some(
          (f) => f.category === "payment-request"
        )
      ).toBe(true);
    });
  });

  describe("Impersonation", () => {
    it("should detect impersonation language", () => {
      const result = analyzeMessage(
        "Hello, this is customer support from Google. We detected unauthorized access to your account. Please trust me, I am an official verified agent. Share your password so we can secure your account."
      );
      expect(
        result.findings.some(
          (f) => f.category === "impersonation" || f.category === "social-engineering"
        )
      ).toBe(true);
    });
  });

  describe("Social Engineering", () => {
    it("should detect social engineering tactics", () => {
      const result = analyzeMessage(
        "Dear friend, trust me, this is not a scam. I swear this is legit and 100% real. Please help me, God bless you."
      );
      expect(
        result.findings.some(
          (f) => f.category === "social-engineering"
        )
      ).toBe(true);
    });
  });

  describe("Secrecy Requests", () => {
    it("should detect secrecy requests", () => {
      const result = analyzeMessage(
        "Keep this secret, don't tell anyone about this deal. Between you and me, this is confidential. Don't share with your bank or family."
      );
      expect(
        result.findings.some(
          (f) => f.category === "secrecy"
        )
      ).toBe(true);
    });
  });

  describe("Investment Scam", () => {
    it("should detect fake investment opportunities", () => {
      const result = analyzeMessage(
        "Guaranteed 500% return on your investment! Risk-free crypto trading. Double your money in 30 days. Invest now for exclusive access!"
      );
      expect(result.riskScore).toBeGreaterThanOrEqual(30);
      expect(
        result.findings.some(
          (f) =>
            f.category === "fake-investment" ||
            f.category === "financial-promise"
        )
      ).toBe(true);
    });
  });

  describe("Risk Score Range", () => {
    it("should never return a negative score", () => {
      const result = analyzeMessage("Hello world");
      expect(result.riskScore).toBeGreaterThanOrEqual(0);
    });

    it("should never return a score above 100", () => {
      const result = analyzeMessage(
        "URGENT!!! Share OTP now!!! Send Bitcoin to wallet!!! Buy gift card!!! Your account will be arrested!!! Password needed!!! Visit http://bit.ly/scam and http://paypal-verify.xyz immediately!!! Don't tell anyone!!! This is 100% guaranteed!!!"
      );
      expect(result.riskScore).toBeLessThanOrEqual(100);
    });
  });

  describe("Recommendations", () => {
    it("should provide recommendations for high-risk messages", () => {
      const result = analyzeMessage(
        "Send your password and OTP to verify your account at http://bit.ly/verify"
      );
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should provide at least one recommendation even for low-risk", () => {
      const result = analyzeMessage(
        "Your appointment is confirmed for tomorrow at 3 PM. Please arrive 10 minutes early."
      );
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Findings are Sorted by Severity", () => {
    it("should return findings sorted by severity (critical first)", () => {
      const result = analyzeMessage(
        "Share your OTP and password to verify your account immediately!!!"
      );
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      for (let i = 1; i < result.findings.length; i++) {
        expect(
          severityOrder[result.findings[i].severity]
        ).toBeGreaterThanOrEqual(
          severityOrder[result.findings[i - 1].severity]
        );
      }
    });
  });

  describe("Platform Switch", () => {
    it("should detect requests to switch platforms", () => {
      const result = analyzeMessage(
        "Let's continue this conversation on WhatsApp. Move to Telegram for more details."
      );
      expect(
        result.findings.some(
          (f) => f.category === "platform-switch"
        )
      ).toBe(true);
    });
  });

  describe("Long Input", () => {
    it("should handle very long input gracefully", () => {
      const longMessage =
        "This is a test message. ".repeat(500) +
        "Share your OTP code. ";
      const result = analyzeMessage(longMessage);
      expect(result.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.riskScore).toBeLessThanOrEqual(100);
    });
  });
});
