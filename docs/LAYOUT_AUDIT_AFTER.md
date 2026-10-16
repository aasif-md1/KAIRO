# Layout Alignment & Density Audit (AFTER Redesign)

Audit timestamp: 2026-10-16T13:01:21.899Z
Target acceptance thresholds:
- **Left Edge Alignment**: Logo, H1, first paragraph left edge match (Tolerance <= 1px)
- **Empty Right Space**: <= 15% across standard layout sections
- **Container Consistency**: Unified 1200px content width with 40px desktop padding

| Page | Viewport | Logo Left | H1 Left | 1st P Left | Left Edge Delta | Widest Text Block Share | Max Empty Right Share | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** (/) | 1280px | 40px | 40px | 40px | ALIGNED | 59% | 0% | PASS |
| **Home** (/) | 1440px | 40px | 40px | 40px | ALIGNED | 53% | 0% | PASS |
| **Home** (/) | 1920px | 280px | 280px | 280px | ALIGNED | 53% | 13% | PASS |
| **How it works** (/how-it-works) | 1280px | 40px | 40px | 40px | ALIGNED | 70% | 0% | PASS |
| **How it works** (/how-it-works) | 1440px | 40px | 40px | 40px | ALIGNED | 70% | 0% | PASS |
| **How it works** (/how-it-works) | 1920px | 280px | 280px | 280px | ALIGNED | 70% | 13% | PASS |
| **Coverage** (/coverage) | 1280px | 40px | 40px | 40px | ALIGNED | 59% | 0% | PASS |
| **Coverage** (/coverage) | 1440px | 40px | 40px | 40px | ALIGNED | 58% | 0% | PASS |
| **Coverage** (/coverage) | 1920px | 280px | 280px | 280px | ALIGNED | 58% | 13% | PASS |
| **Security** (/security) | 1280px | 40px | 40px | 40px | ALIGNED | 59% | 0% | PASS |
| **Security** (/security) | 1440px | 40px | 40px | 40px | ALIGNED | 53% | 0% | PASS |
| **Security** (/security) | 1920px | 280px | 280px | 280px | ALIGNED | 53% | 13% | PASS |
| **About** (/about) | 1280px | 40px | 40px | 40px | ALIGNED | 62% | 0% | PASS |
| **About** (/about) | 1440px | 40px | 40px | 40px | ALIGNED | 62% | 0% | PASS |
| **About** (/about) | 1920px | 280px | 280px | 280px | ALIGNED | 62% | 13% | PASS |
| **Contact** (/contact) | 1280px | 40px | 40px | 40px | ALIGNED | 38% | 0% | PASS |
| **Contact** (/contact) | 1440px | 40px | 40px | 40px | ALIGNED | 38% | 0% | PASS |
| **Contact** (/contact) | 1920px | 280px | 280px | 280px | ALIGNED | 38% | 13% | PASS |
| **Privacy** (/privacy) | 1280px | 40px | 40px | 348px | ALIGNED | 46% | 0% | PASS |
| **Privacy** (/privacy) | 1440px | 40px | 40px | 388px | ALIGNED | 46% | 0% | PASS |
| **Privacy** (/privacy) | 1920px | 280px | 280px | 628px | ALIGNED | 46% | 13% | PASS |
| **Terms** (/terms) | 1280px | 40px | 40px | 348px | ALIGNED | 46% | 0% | PASS |
| **Terms** (/terms) | 1440px | 40px | 40px | 388px | ALIGNED | 46% | 0% | PASS |
| **Terms** (/terms) | 1920px | 280px | 280px | 628px | ALIGNED | 46% | 13% | PASS |
| **Licenses** (/licenses) | 1280px | 40px | 40px | 40px | ALIGNED | 66% | 0% | PASS |
| **Licenses** (/licenses) | 1440px | 40px | 40px | 40px | ALIGNED | 58% | 0% | PASS |
| **Licenses** (/licenses) | 1920px | 280px | 280px | 280px | ALIGNED | 58% | 13% | PASS |
| **Sign in** (/sign-in) | 1280px | 40px | 40px | 40px | ALIGNED | 56% | 0% | PASS |
| **Sign in** (/sign-in) | 1440px | 40px | 40px | 40px | ALIGNED | 50% | 0% | PASS |
| **Sign in** (/sign-in) | 1920px | 280px | 280px | 280px | ALIGNED | 50% | 0% | PASS |


## Detailed Observations & Font Scales by Page

### Home (/)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 17.5px, 18px, 22px, 26px, 48px, 72px

### How it works (/how-it-works)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 17.5px, 22px, 48px, 52px

### Coverage (/coverage)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 12px, 13px, 14px, 16px, 17.5px, 18px, 22px, 48px, 52px

### Security (/security)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 17.5px, 18px, 22px, 28px, 48px, 52px

### About (/about)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 12px, 13px, 14px, 15px, 16px, 17.5px, 18px, 20px, 22px, 26px, 32px, 48px, 52px

### Contact (/contact)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 18px, 22px, 52px

### Privacy (/privacy)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 17px, 22px, 44px

### Terms (/terms)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 17px, 22px, 44px

### Licenses (/licenses)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 12px, 13px, 14px, 15px, 16px, 22px, 72px

### Sign in (/sign-in)
- **At 1440px**: Logo left = 40px, H1 left = 40px (Delta: 0px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 22px, 48px, 72px

