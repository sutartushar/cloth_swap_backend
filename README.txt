Phase 1 — Auth (done ✅)
├── POST /api/auth/register  ✅
└── POST /api/auth/login     ✅

Phase 2 — Auth Middleware (build this FIRST before anything else) (done ✅)
└── protect middleware — verifies JWT on every private route ✅

Phase 4 — Listings (core feature)
├── POST   /api/listings             — create a listing ✅
├── GET    /api/listings             — browse all listings (with filters) ✅

Phase 5 — Swap Requests (done ✅)
├── POST   /api/swaps                — send a swap request
├── GET    /api/swaps/incoming       — view requests I received
├── GET    /api/swaps/outgoing       — view requests I sent
├── PATCH  /api/swaps/:id/accept     — accept a swap
└── PATCH  /api/swaps/:id/reject     — reject a swap

Phase 6 — Chat / Negotiation
├── GET    /api/messages/:swapId     — get chat history
└── POST   /api/messages/:swapId     — send a message (REST fallback)
    + Socket.io for real-time messaging

Phase 7 — Swap Value Calculator
└── POST   /api/calculator           — estimate clothing value

Phase 8 — Admin
├── GET    /api/admin/users          — list all users
├── DELETE /api/admin/users/:id      — remove a user
├── GET    /api/admin/listings       — all listings
├── DELETE /api/admin/listings/:id   — remove a listing
└── GET    /api/admin/analytics      — platform stats



