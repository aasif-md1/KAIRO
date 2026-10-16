# Layout Alignment & Density Audit (BEFORE Redesign)

Audit timestamp: 2026-10-16T11:12:47.033Z
Target acceptance thresholds:
- **Left Edge Alignment**: Logo, H1, first paragraph left edge match (Tolerance <= 1px)
- **Empty Right Space**: <= 15% across standard layout sections
- **Container Consistency**: Unified 1200px content width with 40px desktop padding

| Page | Viewport | Logo Left | H1 Left | 1st P Left | Left Edge Delta | Widest Text Block Share | Max Empty Right Share | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** (/) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 56% | 19% | NEEDS_FIX |
| **Home** (/) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 49% | 22% | NEEDS_FIX |
| **Home** (/) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 36% | 29% | NEEDS_FIX |
| **How it works** (/how-it-works) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 63% | 0% | NEEDS_FIX |
| **How it works** (/how-it-works) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 56% | 1% | NEEDS_FIX |
| **How it works** (/how-it-works) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 42% | 14% | NEEDS_FIX |
| **Coverage** (/coverage) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 93% | 0% | NEEDS_FIX |
| **Coverage** (/coverage) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 90% | 1% | NEEDS_FIX |
| **Coverage** (/coverage) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 67% | 14% | NEEDS_FIX |
| **Security** (/security) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 59% | 0% | NEEDS_FIX |
| **Security** (/security) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 53% | 1% | NEEDS_FIX |
| **Security** (/security) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 40% | 14% | NEEDS_FIX |
| **About** (/about) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 59% | 0% | NEEDS_FIX |
| **About** (/about) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 53% | 1% | NEEDS_FIX |
| **About** (/about) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 40% | 14% | NEEDS_FIX |
| **Contact** (/contact) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 59% | 0% | NEEDS_FIX |
| **Contact** (/contact) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 53% | 1% | NEEDS_FIX |
| **Contact** (/contact) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 40% | 14% | NEEDS_FIX |
| **Privacy** (/privacy) | 1280px | 38px | 45px | 321px | MISALIGNED (6px) | 46% | 0% | NEEDS_FIX |
| **Privacy** (/privacy) | 1440px | 43px | 70px | 346px | MISALIGNED (27px) | 41% | 0% | NEEDS_FIX |
| **Privacy** (/privacy) | 1920px | 288px | 316px | 592px | MISALIGNED (28px) | 31% | 0% | NEEDS_FIX |
| **Terms** (/terms) | 1280px | 38px | 45px | 321px | MISALIGNED (6px) | 46% | 0% | NEEDS_FIX |
| **Terms** (/terms) | 1440px | 43px | 70px | 346px | MISALIGNED (27px) | 41% | 0% | NEEDS_FIX |
| **Terms** (/terms) | 1920px | 288px | 316px | 592px | MISALIGNED (28px) | 31% | 0% | NEEDS_FIX |
| **Licenses** (/licenses) | 1280px | 38px | 45px | 45px | MISALIGNED (6px) | 59% | 0% | NEEDS_FIX |
| **Licenses** (/licenses) | 1440px | 43px | 70px | 70px | MISALIGNED (27px) | 53% | 1% | NEEDS_FIX |
| **Licenses** (/licenses) | 1920px | 288px | 316px | 316px | MISALIGNED (28px) | 40% | 14% | NEEDS_FIX |
| **Sign in** (/sign-in) | 1280px | 38px | 717px | 165px | MISALIGNED (678px) | 35% | 0% | NEEDS_FIX |
| **Sign in** (/sign-in) | 1440px | 43px | 794px | 250px | MISALIGNED (751px) | 30% | 0% | NEEDS_FIX |
| **Sign in** (/sign-in) | 1920px | 288px | 1031px | 496px | MISALIGNED (743px) | 23% | 0% | NEEDS_FIX |


## Detailed Observations & Font Scales by Page

### Home (/)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 22%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 36px, 38px, 56px

### How it works (/how-it-works)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 18px, 24px, 28px, 44px

### Coverage (/coverage)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 44px

### Security (/security)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 18px, 26px, 44px

### About (/about)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 12px, 13px, 14px, 15px, 16px, 18px, 24px, 44px

### Contact (/contact)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 18px, 44px

### Privacy (/privacy)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 22px, 38px

### Terms (/terms)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 22px, 38px

### Licenses (/licenses)
- **At 1440px**: Logo left = 43px, H1 left = 70px (Delta: 27px)
- **Max Empty Right Margin**: 1%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 16px, 18px, 44px

### Sign in (/sign-in)
- **At 1440px**: Logo left = 43px, H1 left = 794px (Delta: 751px)
- **Max Empty Right Margin**: 0%
- **Font Sizes in Use**: 11px, 12px, 13px, 14px, 15px, 16px, 20px

