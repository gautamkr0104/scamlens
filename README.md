# ScamLens

**Spot the red flags before you click.**

ScamLens is a client-side web application that helps you analyze suspicious SMS messages, WhatsApp messages, emails, social media messages, and job offers to determine whether they are likely scams. Your messages are analyzed entirely in your browser — nothing is ever sent to a server.

## Why ScamLens?

Every day, millions of people receive suspicious messages — fake bank alerts, phishing links, bogus delivery notifications, and fraudulent job offers. Many of these scams succeed because people aren't sure what to look for. ScamLens helps you spot the red flags by analyzing message patterns, language tactics, and URL characteristics to give you an informed risk assessment.

## Features

- **Instant Analysis** — Paste any suspicious message and get results in under a second
- **Risk Scoring** — Clear 0–100 risk score with color-coded severity
- **Pattern Detection** — Identifies credential requests, payment scams, urgency tactics, impersonation, fake rewards, and 25+ other scam indicators
- **URL Analysis** — Flags suspicious URLs, domain impersonation, URL shorteners, and suspicious TLDs
- **Actionable Advice** — Specific recommendations for each detected issue
- **Example Messages** — Built-in examples to try, from fake bank alerts to legitimate notifications
- **100% Private** — All analysis happens in your browser; no data is ever uploaded
- **No API Keys Required** — Works completely offline with no external dependencies
- **Responsive Design** — Beautiful on desktop, tablet, and mobile
- **Accessible** — Semantic HTML, keyboard navigation, screen-reader support, and proper ARIA attributes

## How It Works

ScamLens uses a weighted pattern-matching engine that runs entirely client-side:

1. **Pattern Matching** — The engine scans the message against 30+ regex-based pattern rules covering different scam categories
2. **Weighted Scoring** — Each detected pattern contributes a weighted score based on its category and severity
3. **URL Analysis** — Detected URLs are checked for shorteners, suspicious TLDs, brand impersonation, and other red flags
4. **Risk Classification** — The total score maps to a risk level: Low, Suspicious, High, or Very High
5. **Recommendation Generation** — Based on the categories of findings, specific actionable advice is provided

The analysis engine is completely separate from the UI and can be used independently or tested in isolation.

## Privacy

Your message is analyzed entirely in your browser using JavaScript. ScamLens does not need to upload your message to a server. No message content is stored, transmitted, or logged. If browser storage is used, it is only for UI preferences — never message contents.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React 19)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Icons:** [Lucide React](https://lucide.dev/)
- **Testing:** [Jest](https://jestjs.io/) with ts-jest

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/gautamkr0104/scamlens.git
cd scamlens

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
scamlens/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles and Tailwind config
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── page.tsx           # Main application page
│   ├── components/
│   │   ├── Header.tsx         # Landing section with hero
│   │   ├── Analyzer.tsx       # Message input and analysis trigger
│   │   ├── Results.tsx        # Results dashboard with findings
│   │   └── Footer.tsx         # Footer with privacy/disclaimer
│   └── lib/
│       ├── types.ts           # TypeScript type definitions
│       ├── analysis-engine.ts # Core scam analysis engine
│       ├── examples.ts        # Built-in example messages
│       └── utils.ts           # Utility functions
├── __tests__/
│   └── analysis-engine.test.ts # Unit tests for analysis engine
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── jest.config.js
├── .gitignore
├── LICENSE                    # MIT License
├── CONTRIBUTING.md            # Contribution guidelines
└── README.md                  # This file
```

## Testing

Run the unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite covers:

- OTP/phishing scam detection
- Bank impersonation detection
- Fake delivery notifications
- Employment scams
- Prize/lottery scams
- Cryptocurrency scams
- Suspicious URL detection
- Urgency language detection
- Credential harvesting attempts
- Legitimate message recognition
- Edge cases (empty input, long messages, score boundaries)

## Limitations

ScamLens uses pattern-based analysis, which has inherent limitations:

- **Cannot guarantee detection** — Sophisticated scams may not trigger known patterns
- **May produce false positives** — Legitimate messages could be flagged if they contain scam-like language
- **Language dependent** — Currently optimized for English messages
- **No real-time updates** — Pattern database is static (no threat intelligence feeds)
- **Cannot analyze images** — Only text content is analyzed

Always use your judgment and verify suspicious messages through official channels.

## Future Improvements

- Multilingual analysis support
- Browser extension for real-time message scanning
- Email client integration
- Optional local LLM-powered analysis (no API keys required)
- Community threat intelligence and pattern sharing
- Additional scam categories (romance scams, tech support scams, etc.)
- Message history with local storage (opt-in)
- Custom pattern definitions for advanced users

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
