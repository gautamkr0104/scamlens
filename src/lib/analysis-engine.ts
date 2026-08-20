import {
  Finding,
  AnalysisResult,
  RiskLevel,
  URLAnalysis,
  Severity,
  RiskCategory,
} from "./types";

interface PatternRule {
  id: string;
  category: RiskCategory;
  severity: Severity;
  weight: number;
  title: string;
  explanation: string;
  recommendation: string;
  icon: string;
  patterns: RegExp[];
  matchMode?: "any" | "all" | "count";
  minCount?: number;
}

const URL_REGEX =
  /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const URL_SHORTENER_DOMAINS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "adf.ly",
  "bl.ink",
  "lnkd.in",
  "rb.gy",
  "cutt.ly",
  "shorturl.at",
  "v.gd",
  "tiny.cc",
  "clk.sh",
  "surl.li",
  "t.ly",
  "bc.vc",
  "adfoc.us",
  "jmp.sh",
  "cut.ly",
  "rb.gy",
];

const KNOWN_BRANDS = [
  "paypal",
  "apple",
  "microsoft",
  "google",
  "amazon",
  "netflix",
  "facebook",
  "instagram",
  "whatsapp",
  "telegram",
  "bank",
  "chase",
  "wellsfargo",
  "wells fargo",
  "citibank",
  "citi",
  "bofa",
  "bank of america",
  "usaa",
  "capital one",
  "walmart",
  "costco",
  "fedex",
  "ups",
  "dhl",
  "usps",
  "irs",
  "ssa",
  "social security",
  "coinbase",
  "binance",
  "crypto",
  "bitcoin",
  "ethereum",
  "roblox",
  "steam",
  "epic games",
  "dhl express",
  "royal mail",
  "dpd",
  "hermes",
];

const SUSPICIOUS_TLDS = [
  ".xyz",
  ".top",
  ".buzz",
  ".icu",
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".work",
  ".click",
  ".download",
  ".racing",
  ".review",
  ".stream",
  ".date",
  ".racing",
  ".win",
  ".bid",
  ".loan",
];

const PAYMENT_METHODS = [
  "gift card",
  "giftcard",
  "itunes card",
  "google play card",
  "amazon card",
  "steam card",
  "google play voucher",
  "apple itunes",
  "western union",
  "moneygram",
  "wire transfer",
  "bank transfer",
  "crypto",
  "bitcoin",
  "ethereum",
  "usdt",
  "usdc",
  "litecoin",
  "dogecoin",
  "venmo",
  "cashapp",
  "cash app",
  "zelle",
  "paypal friend",
  "paypal goods",
  "paypal family",
  "prepaid card",
  "prepaid visa",
  "prepaid mastercard",
  "green dot",
  "money pak",
  "remitly",
  "wise",
  "revolut",
];

const PATTERN_RULES: PatternRule[] = [
  {
    id: "otp-request",
    category: "credential-request",
    severity: "critical",
    weight: 25,
    title: "OTP / Verification Code Request",
    explanation:
      "This message asks for a one-time password or verification code. Legitimate companies never ask for these.",
    recommendation:
      "Never share OTPs or verification codes with anyone, even if they claim to be from your bank or a service provider.",
    icon: "key-round",
    patterns: [
      /\b(otp|one.?time.?password|verification.?code|verify.?code|auth.?code|security.?code)\b/gi,
      /\b(share|send|give|enter|provide|confirm).{0,30}(otp|code|pin|verification)/gi,
      /\b(otp|code|pin|verification).{0,30}(share|send|give|enter|provide|confirm)/gi,
    ],
  },
  {
    id: "password-request",
    category: "credential-request",
    severity: "critical",
    weight: 25,
    title: "Password Request",
    explanation:
      "This message is requesting your password or login credentials.",
    recommendation:
      "Never share your passwords. Legitimate services will never ask for them via message.",
    icon: "lock",
    patterns: [
      /\b(password|passwd|pass.?word|login.?credential|account.?detail)\b/gi,
      /\b(share|send|give|provide|enter|tell).{0,30}(password|credential)/gi,
    ],
  },
  {
    id: "pin-request",
    category: "credential-request",
    severity: "critical",
    weight: 22,
    title: "PIN Request",
    explanation:
      "This message asks for your PIN number. PINs are highly sensitive and should never be shared.",
    recommendation:
      "Never share your PIN with anyone. Banks and services will never request it.",
    icon: "hash",
    patterns: [
      /\b(pin.?number|atm.?pin|card.?pin|enter.?your.?pin|share.?your.?pin|send.?your.?pin|tell.?your.?pin)\b/gi,
    ],
  },
  {
    id: "bank-details-request",
    category: "credential-request",
    severity: "critical",
    weight: 22,
    title: "Bank Details Request",
    explanation:
      "This message requests sensitive banking information such as account numbers or routing numbers.",
    recommendation:
      "Never share bank account details over message. Verify requests directly with your bank.",
    icon: "landmark",
    patterns: [
      /\b(account.?number|routing.?number|sort.?code|iban|swift.?code|bank.?detail|account.?detail)\b/gi,
      /\b(share|send|give|provide|enter).{0,30}(account|routing|iban|bank)/gi,
    ],
  },
  {
    id: "card-number-request",
    category: "credential-request",
    severity: "critical",
    weight: 24,
    title: "Card Number Request",
    explanation:
      "This message is asking for your credit or debit card number.",
    recommendation:
      "Never share card numbers via message. Contact your bank directly if you have concerns.",
    icon: "credit-card",
    patterns: [
      /\b(card.?number|credit.?card|debit.?card|card.?detail|card.?info|pan.?number)\b/gi,
      /\b(share|send|give|provide|enter|verify).{0,30}(card|visa|mastercard|amex)/gi,
    ],
  },
  {
    id: "cvv-request",
    category: "credential-request",
    severity: "critical",
    weight: 24,
    title: "CVV / Security Code Request",
    explanation:
      "This message asks for your card's CVV or security code.",
    recommendation:
      "CVV codes should never be shared. This is a strong indicator of fraud.",
    icon: "shield-alert",
    patterns: [
      /\b(cvv|cvv2|security.?code|card.?verification|3.?digit.?code|back.?of.?the.?card)\b/gi,
    ],
  },
  {
    id: "money-request",
    category: "payment-request",
    severity: "high",
    weight: 18,
    title: "Money Request",
    explanation:
      "This message requests that you send money or make a payment.",
    recommendation:
      "Verify the legitimacy of any payment request by contacting the organization through official channels.",
    icon: "banknote",
    patterns: [
      /\b(send|transfer|pay|remit|deposit).{0,30}(\$\d|money|funds|amount|payment)/gi,
      /\b(wire|payment|transfer|deposit).{0,30}(send|complete|make)/gi,
    ],
  },
  {
    id: "crypto-payment",
    category: "payment-request",
    severity: "high",
    weight: 20,
    title: "Cryptocurrency Payment Request",
    explanation:
      "This message asks for payment via cryptocurrency, which is difficult to trace and recover.",
    recommendation:
      "Cryptocurrency payments are nearly impossible to recover. Be extremely cautious of anyone requesting crypto payments.",
    icon: "bitcoin",
    patterns: [
      /\b(pay|send|transfer|payment|buy).{0,30}(bitcoin|btc|ethereum|eth|usdt|usdc|crypto|litecoin|dogecoin)/gi,
      /\b(bitcoin|btc|ethereum|eth|usdt|usdc|crypto|litecoin|dogecoin).{0,30}(wallet|address|address|send|pay)/gi,
    ],
  },
  {
    id: "gift-card-payment",
    category: "payment-request",
    severity: "high",
    weight: 22,
    title: "Gift Card Payment Request",
    explanation:
      "This message asks for payment via gift cards. This is a common scam tactic.",
    recommendation:
      "No legitimate business or government agency requests gift card payments. This is almost certainly a scam.",
    icon: "gift",
    patterns: [
      /\b(buy|get|purchase|send|provide|share|pay).{0,30}(gift.?card|itunes.?card|google.?play|amazon.?card|steam.?card)/gi,
      /\b(gift.?card|itunes.?card|google.?play|amazon.?card|steam.?card).{0,30}(code|number|photo|picture|scratch)/gi,
    ],
  },
  {
    id: "unusual-payment",
    category: "payment-request",
    severity: "high",
    weight: 16,
    title: "Unusual Payment Method",
    explanation:
      "This message suggests an unusual or hard-to-trace payment method.",
    recommendation:
      "Be wary of anyone requesting payment through unusual channels. Use standard payment methods with buyer protection.",
    icon: "wallet",
    patterns: [],
    matchMode: "any",
    minCount: 1,
  },
  {
    id: "extreme-urgency",
    category: "urgency-tactic",
    severity: "high",
    weight: 14,
    title: "Extreme Urgency",
    explanation:
      "This message creates artificial urgency to pressure you into acting quickly without thinking.",
    recommendation:
      "Legitimate organizations give you time to verify. Take a moment to step back and assess the situation.",
    icon: "clock",
    patterns: [
      /\b(act.?now|urgent|immediately|within.?24.?hours?|right.?away|don'?t.?delay|hurry|expire|expiring|last.?chance|final.?notice|time.?sensitive|do.?it.?now|before.?.?.?.?(late|gone|close|blocked|suspended))/gi,
      /\b(only|just).{0,10}(have|got|left|remaining|available).{0,10}(hours?|minutes?|days?)/gi,
    ],
  },
  {
    id: "threat",
    category: "threat",
    severity: "high",
    weight: 18,
    title: "Threatening Language",
    explanation:
      "This message uses threats or intimidation to manipulate you.",
    recommendation:
      "Legitimate organizations do not threaten customers. Report threatening messages to authorities.",
    icon: "alert-triangle",
    patterns: [
      /\b(arrest|sue|prosecute|legal.?action|police|fbi|cia|interpol|warrant|criminal.?charg|prison|jail|penalty|fine|punishment)/gi,
      /\b(you.?will|you.?will.?be|failure.?to|if.?you.?don'?t)/gi,
    ],
  },
  {
    id: "account-suspension",
    category: "threat",
    severity: "high",
    weight: 16,
    title: "Account Suspension Threat",
    explanation:
      "This message threatens to suspend or close your account to create panic.",
    recommendation:
      "Contact the company directly using the official website or phone number to verify any account issues.",
    icon: "ban",
    patterns: [
      /\b(account).{0,30}(suspend|close|close|deactivate|terminate|block|lock|restrict|limited)/gi,
      /\b(suspend|close|deactivate|terminate|block|lock|restrict).{0,30}(account|access|service)/gi,
    ],
  },
  {
    id: "fake-reward",
    category: "fake-reward",
    severity: "high",
    weight: 17,
    title: "Fake Reward or Prize",
    explanation:
      "This message claims you've won a prize, reward, or lottery you didn't enter.",
    recommendation:
      "If you didn't enter a competition, you can't win. Legitimate prizes don't require upfront payment.",
    icon: "trophy",
    patterns: [
      /\b(congratulations|you.?won|you.?have.?won|winner|lucky.?winner|selected.?winner|prize|reward|lottery|raffle|draw)/gi,
      /\b(won.?.?.?.?\$|prize.?of|reward.?of|claim.?your|collect.?your|redeem)/gi,
    ],
  },
  {
    id: "fake-authority",
    category: "fake-authority",
    severity: "high",
    weight: 16,
    title: "Fake Government or Authority Message",
    explanation:
      "This message appears to impersonate a government agency or authority.",
    recommendation:
      "Government agencies typically contact you by mail, not text or email. Verify through official .gov websites.",
    icon: "building",
    patterns: [
      /\b(irs|ssa|social.?security|fbi|cia|dea|homeland.?security|immigration|uscis|tax.?refund|government.?notice|federal.?reserve|treasury|attorney.?general)/gi,
      /\b(department|agency|bureau|office).{0,30}(of|from).{0,30}(the.?.?.?)?(united.?states|government|federal|state)/gi,
    ],
  },
  {
    id: "fake-bank",
    category: "fake-authority",
    severity: "high",
    weight: 15,
    title: "Fake Bank Message",
    explanation:
      "This message appears to be from a bank but has suspicious characteristics.",
    recommendation:
      "Contact your bank using the number on the back of your card or their official website.",
    icon: "landmark",
    patterns: [
      /\b(your.?bank|your.?account.?has.?been|unauthorized.?transaction|unusual.?activity|verify.?your.?identity|confirm.?your.?account)/gi,
    ],
  },
  {
    id: "fake-delivery",
    category: "fake-delivery",
    severity: "medium",
    weight: 12,
    title: "Fake Delivery Notification",
    explanation:
      "This message claims to be about a delivery but may be attempting to steal information.",
    recommendation:
      "Track packages directly through the carrier's official website using your tracking number.",
    icon: "package",
    patterns: [
      /\b(your.?package|your.?parcel|delivery.?failed|missed.?delivery|cannot.?deliver|customs|shipping.?update|tracking.?update|reschedule.?delivery)/gi,
      /\b(dhl|fedex|ups|usps|royal.?mail|dpd|hermes|amazon.?delivery|usps|auspost|canada.?post)/gi,
    ],
  },
  {
    id: "fake-employment",
    category: "fake-employment",
    severity: "high",
    weight: 16,
    title: "Fake Employment Offer",
    explanation:
      "This message contains a suspicious job offer, possibly a work-from-home scam.",
    recommendation:
      "Research any job offer independently. Legitimate employers don't ask for upfront payments or personal info before interviews.",
    icon: "briefcase",
    patterns: [
      /\b(work.?from.?home|remote.?job|easy.?money|earn.\$?\d|make.\$?\d|part.?time|full.?time|flexible.?hours|no.?experience.?needed|no.?interview|immediate.?start)/gi,
      /\b(job.?offer|hiring|position.?available|role.?available|we.?are.?hiring)/gi,
    ],
  },
  {
    id: "fake-investment",
    category: "fake-investment",
    severity: "high",
    weight: 18,
    title: "Fake Investment Opportunity",
    explanation:
      "This message promotes a too-good-to-be-true investment opportunity.",
    recommendation:
      "Be extremely skeptical of unsolicited investment opportunities. Consult a financial advisor.",
    icon: "trending-up",
    patterns: [
      /\b guaranteed.?.?.?.?(return|income|profit|earn|money|yield)/gi,
      /\b(100|200|300|500|1000).?%.??.?.?.?(return|profit|gain|growth)/gi,
      /\b(double|triple|quadruple).{0,15}(your.?money|your.?investment)/gi,
      /\b(passive.?income|financial.?freedom|get.?rich|become.?millionaire)/gi,
      /\b(invest).{0,30}(now|today|limited|exclusive|opportunity)/gi,
      /\b(crypto.?invest|forex.?trading|binary.?option|ponzi|pyramid)/gi,
    ],
  },
  {
    id: "impersonation",
    category: "impersonation",
    severity: "high",
    weight: 15,
    title: "Possible Impersonation",
    explanation:
      "This message may be impersonating a known company, person, or organization.",
    recommendation:
      "Verify the sender through official channels. Don't trust messages that appear to be from known brands.",
    icon: "user-x",
    patterns: [
      /\b(this.?is).{0,20}(customer.?support|tech.?support|help.?desk|service.?team|security.?team)/gi,
      /\b(we.?are).{0,20}(from|with|the).{0,20}(google|apple|microsoft|amazon|paypal|netflix|facebook)/gi,
      /\b(official|authorized|certified|verified).{0,15}(agent|representative|support|team)/gi,
    ],
  },
  {
    id: "platform-switch",
    category: "platform-switch",
    severity: "medium",
    weight: 10,
    title: "Platform Switch Request",
    explanation:
      "This message asks you to move to a different communication platform.",
    recommendation:
      "Be cautious of requests to switch platforms, as scammers often do this to avoid detection.",
    icon: "arrow-right-left",
    patterns: [
      /\b(message|chat|contact|talk|write|reach).{0,20}(on|via|through|over|to).{0,15}(whatsapp|telegram|signal|viber|wechat|line|discord)/gi,
      /\b(move|switch|continue|go).{0,15}(to|on|over).{0,15}(whatsapp|telegram|signal|viber|wechat|line|discord)/gi,
    ],
  },
  {
    id: "suspicious-url",
    category: "suspicious-url",
    severity: "high",
    weight: 14,
    title: "Suspicious URL Detected",
    explanation:
      "This message contains one or more suspicious-looking URLs.",
    recommendation:
      "Don't click on suspicious links. Navigate to websites directly by typing the URL in your browser.",
    icon: "link",
    patterns: [],
  },
  {
    id: "social-engineering",
    category: "social-engineering",
    severity: "high",
    weight: 14,
    title: "Social Engineering Tactics",
    explanation:
      "This message uses psychological manipulation techniques.",
    recommendation:
      "Take time to think before responding to emotionally manipulative messages.",
    icon: "brain",
    patterns: [
      /\b(trust.?me|i.?swear|believe.?me|honest|promise|real.?deal|no.?scam|not.?a.?scam|legit|100.?%)/gi,
      /\b(dear.?friend|beloved|dear.?customer|valued.?customer|esteemed)/gi,
      /\b(please.?help|urgent.?help|need.?your.?help|god.?bless|blessed)/gi,
    ],
  },
  {
    id: "secrecy",
    category: "secrecy",
    severity: "medium",
    weight: 12,
    title: "Secrecy Request",
    explanation:
      "This message asks you to keep something secret or not tell others.",
    recommendation:
      "Legitimate businesses don't ask you to keep transactions secret. Discuss suspicious messages with trusted people.",
    icon: "eye-off",
    patterns: [
      /\b(keep.?this.?secret|don'?t.?tell|confidential|between.?us|private|don'?t.?share|do.?not.?disclose|keep.?quiet|between.?you.?and.?me)/gi,
      /\b(don'?t.?.?.?.?(tell|inform|share|notify|mention|disclose|contact)).{0,15}(anyone|anybody|others|bank|police|family|friends)/gi,
    ],
  },
  {
    id: "software-install",
    category: "software-install",
    severity: "high",
    weight: 16,
    title: "Software Installation Request",
    explanation:
      "This message asks you to install software, which could be malware.",
    recommendation:
      "Only install software from official sources. Never install software from links in messages.",
    icon: "download",
    patterns: [
      /\b(install|download|update).{0,20}(app|software|program|tool|extension|plugin|security.?update|latest.?version)/gi,
      /\b(click.?here.?to.?install|click.?to.?download|download.?now)/gi,
    ],
  },
  {
    id: "unknown-number",
    category: "unknown-number",
    severity: "medium",
    weight: 8,
    title: "Unknown Number / Contact Request",
    explanation:
      "This message asks you to call an unfamiliar number or contact an unknown person.",
    recommendation:
      "Verify phone numbers independently before calling. Scammers often use premium-rate numbers.",
    icon: "phone",
    patterns: [
      /\b(call|dial|text|contact|reach).{0,20}(\+\d{7,15}|\d{10,15})/g,
      /\b(call|contact).{0,20}(this.?number|the.?number|my.?agent|my.?representative|my.?supervisor)/gi,
    ],
  },
  {
    id: "pressure-bypass",
    category: "pressure-to-bypass",
    severity: "high",
    weight: 15,
    title: "Pressure to Bypass Normal Procedures",
    explanation:
      "This message pressures you to skip normal verification or security procedures.",
    recommendation:
      "Always follow official procedures. Don't let anyone rush you into bypassing security.",
    icon: "shield-off",
    patterns: [
      /\b(skip|bypass|ignore|override|override).{0,20}(security|verification|process|procedure|protocol|step)/gi,
      /\b(no.?need.?to.?verify|don'?t.?need.?to.?verify|skip.?verification|without.?verification)/gi,
    ],
  },
  {
    id: "excessive-punctuation",
    category: "excessive-punctuation",
    severity: "low",
    weight: 3,
    title: "Excessive Punctuation",
    explanation:
      "This message uses excessive punctuation marks, which is common in spam messages.",
    recommendation:
      "Excessive punctuation is a common spam indicator, though not conclusive on its own.",
    icon: "type",
    patterns: [
      /[!?]{3,}/g,
      /[!?][!? ][!?]{2,}/g,
    ],
  },
  {
    id: "suspicious-grammar",
    category: "suspicious-grammar",
    severity: "low",
    weight: 4,
    title: "Unusual Language Patterns",
    explanation:
      "This message contains unusual grammar or spelling patterns common in scam messages.",
    recommendation:
      "Poor grammar doesn't guarantee a scam, but it's a common indicator of fraudulent messages.",
    icon: "spell-check",
    patterns: [
      /\b(dear.?sir|dear.?madam|dear.?friend|respected.?sir|good.?day|kind.?regards|best.?regards).{0,5}$/gim,
      /\b(Kindly|Pls|Plz|Urgent|ATTENTION|IMPORTANT|NOTICE|NOTIFICATION|WARNING|ALERT)[\s!]{2,}/gi,
    ],
  },
  {
    id: "financial-promise",
    category: "financial-promise",
    severity: "high",
    weight: 16,
    title: "Unrealistic Financial Promise",
    explanation:
      "This message promises unrealistic financial returns or opportunities.",
    recommendation:
      "If it sounds too good to be true, it probably is. Consult a financial professional.",
    icon: "sparkles",
    patterns: [
      /\b(earn|make|receive).{0,30}\$\d[\d,]*(\.\d+)?/gi,
      /\$\d[\d,]*(\.\d+)?.{0,30}(per|every|daily|weekly|monthly|annually|a.?day|a.?week|a.?month)/gi,
      /\b(no.?risk|risk.?free|zero.?risk|guaranteed|risk.?free)/gi,
    ],
  },
];

function findUnusualPaymentMethods(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const method of PAYMENT_METHODS) {
    if (lower.includes(method)) {
      found.push(method);
    }
  }
  return found;
}

function analyzeURLs(text: string): URLAnalysis[] {
  const urlMatches = text.match(URL_REGEX) || [];
  const emailMatches = text.match(EMAIL_REGEX) || [];
  const results: URLAnalysis[] = [];

  for (const rawUrl of urlMatches) {
    const url = rawUrl.replace(/[.,;:!?)\]]+$/, "");
    const issues: string[] = [];
    let severity: Severity = "low";

    try {
      let hostname = "";
      try {
        const parsed = new URL(
          url.startsWith("http") ? url : `http://${url}`
        );
        hostname = parsed.hostname.toLowerCase();
      } catch {
        hostname = url.toLowerCase();
      }

      const isShortener = URL_SHORTENER_DOMAINS.some(
        (d) => hostname === d || hostname.endsWith("." + d)
      );
      if (isShortener) {
        issues.push("URL shortener detected — actual destination is hidden");
        severity = "high";
      }

      const ipMatch = hostname.match(
        /^(\d{1,3}\.){3}\d{1,3}$/
      );
      if (ipMatch) {
        issues.push("URL uses an IP address instead of a domain name");
        severity = "high";
      }

      const dotCount = (hostname.match(/\./g) || []).length;
      if (dotCount > 3) {
        issues.push("Excessive subdomains may indicate a misleading URL");
        if (severity !== "high") severity = "medium";
      }

      for (const brand of KNOWN_BRANDS) {
        const brandNoSpace = brand.replace(/\s+/g, "");
        const hostNoSpace = hostname.replace(/\./g, "").replace(/-/g, "");

        if (
          hostname.includes(brand) &&
          !hostname.endsWith(brand + ".com") &&
          !hostname.endsWith(brand + ".org") &&
          !hostname.endsWith(brand + ".net") &&
          !hostname.endsWith("." + brand + ".com") &&
          !hostname.endsWith("." + brand + ".org")
        ) {
          issues.push(
            `Domain "${hostname}" references brand "${brand}" but is not an official domain`
          );
          severity = "critical";
          break;
        }

        if (
          hostNoSpace.includes(brandNoSpace) &&
          !hostNoSpace.endsWith(brandNoSpace)
        ) {
          const levenshteinLike =
            Math.abs(hostNoSpace.length - brandNoSpace.length) <= 3;
          if (levenshteinLike) {
            issues.push(
              `Domain "${hostname}" may be impersonating "${brand}"`
            );
            severity = "critical";
            break;
          }
        }
      }

      for (const tld of SUSPICIOUS_TLDS) {
        if (hostname.endsWith(tld)) {
          issues.push(`Suspicious top-level domain (${tld})`);
          if (severity !== "critical") severity = "medium";
          break;
        }
      }

      if (url.length > 100) {
        issues.push("Unusually long URL");
        if (severity === "low") severity = "low";
      }
    } catch {
      issues.push("URL could not be properly parsed");
    }

    if (issues.length > 0) {
      results.push({ url, issues, severity });
    }
  }

  for (const email of emailMatches) {
    const issues: string[] = [];
    let severity: Severity = "low";
    const lower = email.toLowerCase();

    const domain = email.split("@")[1] || "";
    const freeProviders = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
    ];
    const isFreeProvider = freeProviders.some((p) => domain === p);

    if (isFreeProvider) {
      issues.push(
        "Email uses a free provider — legitimate businesses typically use corporate domains"
      );
      severity = "medium";
    }

    if (lower.includes("support") || lower.includes("security")) {
      issues.push(
        "Email address uses common scam pretext words (support/security)"
      );
      severity = "medium";
    }

    if (issues.length > 0) {
      results.push({
        url: email,
        issues,
        severity,
      });
    }
  }

  return results;
}

function getSeverityWeight(severity: Severity): number {
  switch (severity) {
    case "critical":
      return 1.0;
    case "high":
      return 0.75;
    case "medium":
      return 0.5;
    case "low":
      return 0.25;
  }
}

function determineRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "very-high";
  if (score >= 50) return "high";
  if (score >= 25) return "suspicious";
  return "low";
}

function getVerdict(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "very-high":
      return "Very high-risk message";
    case "high":
      return "High-risk message";
    case "suspicious":
      return "Likely suspicious message";
    case "low":
      return "Likely low-risk message";
  }
}

function generateRecommendations(
  findings: Finding[],
  riskLevel: RiskLevel
): string[] {
  const recommendations: Set<string> = new Set();

  if (riskLevel !== "low") {
    recommendations.add(
      "Do not share any personal, financial, or account information with the sender."
    );
  }

  const categories = new Set(findings.map((f) => f.category));

  if (
    categories.has("credential-request") ||
    categories.has("payment-request")
  ) {
    recommendations.add(
      "If you already shared sensitive information, change your passwords immediately and contact your bank."
    );
  }

  if (categories.has("suspicious-url")) {
    recommendations.add(
      "Do not click any links in this message. Navigate to websites directly by typing the URL."
    );
  }

  if (categories.has("fake-authority") || categories.has("fake-delivery")) {
    recommendations.add(
      "Contact the organization directly using an official phone number or website to verify."
    );
  }

  if (categories.has("urgency-tactic") || categories.has("threat")) {
    recommendations.add(
      "Take your time. Scammers use urgency and threats to prevent you from thinking clearly."
    );
  }

  if (categories.has("fake-employment")) {
    recommendations.add(
      "Research the company independently. Legitimate employers never ask for upfront payments."
    );
  }

  if (categories.has("fake-investment") || categories.has("financial-promise")) {
    recommendations.add(
      "Consult a licensed financial advisor before making any investment decisions."
    );
  }

  if (categories.has("platform-switch")) {
    recommendations.add(
      "Be cautious of requests to move to a different platform where there's less oversight."
    );
  }

  if (categories.has("software-install")) {
    recommendations.add(
      "Never install software from links in messages. Only use official app stores and websites."
    );
  }

  recommendations.add("Report this message to your local authorities or relevant fraud hotline.");

  return Array.from(recommendations);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function analyzeMessage(text: string): AnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      riskScore: 0,
      riskLevel: "low",
      verdict: "No message to analyze",
      findings: [],
      detectedURLs: [],
      recommendations: ["Please enter a message to analyze."],
      analyzedAt: new Date(),
    };
    }

  const truncatedText = text.slice(0, 10000);
  const findings: Finding[] = [];
  let totalScore = 0;

  for (const rule of PATTERN_RULES) {
    if (rule.id === "unusual-payment") {
      const methods = findUnusualPaymentMethods(truncatedText);
      if (methods.length > 0) {
        const weightedScore =
          rule.weight * getSeverityWeight(rule.severity);
        totalScore += weightedScore;
        findings.push({
          id: generateId(),
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          explanation:
            rule.explanation +
            ` Detected: ${methods.slice(0, 3).join(", ")}.`,
          matchedText: methods.slice(0, 3).join(", "),
          recommendation: rule.recommendation,
          icon: rule.icon,
        });
      }
      continue;
    }

    let matched = false;
    let matchCount = 0;
    let matchedSnippet = "";

    for (const pattern of rule.patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      const matches = truncatedText.match(regex);
      if (matches && matches.length > 0) {
        matchCount += matches.length;
        if (!matchedSnippet && matches[0]) {
          matchedSnippet =
            matches[0].length > 80
              ? matches[0].slice(0, 80) + "..."
              : matches[0];
        }
        matched = true;
      }
    }

    if (matched) {
      const meetsThreshold =
        rule.matchMode === "all"
          ? matchCount >= (rule.patterns?.length || 1)
          : matchCount >= (rule.minCount || 1);

      if (meetsThreshold) {
        const weightedScore =
          rule.weight * getSeverityWeight(rule.severity);
        totalScore += weightedScore;
        findings.push({
          id: generateId(),
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          explanation: rule.explanation,
          matchedText:
            matchedSnippet || undefined,
          recommendation: rule.recommendation,
          icon: rule.icon,
        });
      }
    }
  }

  const detectedURLs = analyzeURLs(truncatedText);
  for (const urlResult of detectedURLs) {
    const hasURLFinding = findings.some(
      (f) => f.category === "suspicious-url"
    );
    if (!hasURLFinding) {
      const weightedScore = 14 * getSeverityWeight(urlResult.severity);
      totalScore += weightedScore;
      findings.push({
        id: generateId(),
        category: "suspicious-url",
        severity: urlResult.severity,
        title: "Suspicious URL Detected",
        explanation: `URL "${urlResult.url}" has issues: ${urlResult.issues.join("; ")}.`,
        matchedText: urlResult.url,
        recommendation:
          "Don't click on suspicious links. Navigate to websites directly by typing the URL in your browser.",
        icon: "link",
      });
    } else {
      const weightedScore = 5 * getSeverityWeight(urlResult.severity);
      totalScore += weightedScore;
    }
  }

  const cappedScore = Math.min(100, Math.round(totalScore));
  const riskLevel = determineRiskLevel(cappedScore);
  const verdict = getVerdict(riskLevel);
  const recommendations = generateRecommendations(findings, riskLevel);

  findings.sort((a, b) => {
    const severityOrder: Record<Severity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return {
    riskScore: cappedScore,
    riskLevel,
    verdict,
    findings,
    detectedURLs,
    recommendations,
    analyzedAt: new Date(),
  };
}
