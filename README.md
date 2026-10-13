# KAIRO

> Access-control and secret-handling audit platform for applications built with AI coding assistants.

KAIRO combines three layers of analysis into one plain-language report:
1. **Static Analysis** with an in-house AST engine built on Tree-sitter and custom YAML rules (V01-V13).
2. **AI-Assisted Logic Review** via a strictly gated provider interface (`ModelClient`) for route-level authorization verification.
3. **Dynamic Sandbox Testing** running inside isolated runners with synthetic dual-role test credentials.

## Documentation
- Product Requirements Document: [docs/spec/PRD.md](docs/spec/PRD.md)
- Technical Requirements Document: [docs/spec/TRD.md](docs/spec/TRD.md)
- App Flow: [docs/spec/APP_FLOW.md](docs/spec/APP_FLOW.md)
- UI/UX Design Brief: [docs/spec/UI_UX_DESIGN_BRIEF.md](docs/spec/UI_UX_DESIGN_BRIEF.md)
- Architecture Understanding: [docs/00_UNDERSTANDING.md](docs/00_UNDERSTANDING.md)
- Assumptions and Decisions: [docs/ASSUMPTIONS.md](docs/ASSUMPTIONS.md)
- Implementation Plan: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
