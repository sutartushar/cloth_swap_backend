# ClothSwap Frontend - Complete Setup Guide

## Overview

A fully functional Next.js 15 frontend has been built for the ClothSwap platform with complete Context Hook-based state management. The frontend integrates seamlessly with the Express.js backend for a complete sustainable fashion exchange application.

## Project Structure

```
cloth_swap_backend/
├── src/                    # Backend source code
├── frontend/              # Next.js 15 Frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── contexts/         # React Context for state management
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies
│   ├── tsconfig.json     # TypeScript config
│   ├── next.config.js    # Next.js configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── README.md         # Frontend documentation
```

## Installation & Setup

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 3: Start Development Server

Make sure the backend is running on port 4000, then:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Architecture

### State Management (Context Hooks)

The frontend uses React Context API for global state management with four main contexts:

#### 1. **AuthContext** (`contexts/AuthContext.tsx`)
- Manages user authentication state
- Handles login/register/logout operations
- Stores JWT token in localStorage
- Provides `useAuth()` hook

**Key Methods:**
- `login(email, password)` - Authenticate user
- `register(name, email, password, phone_number, location)` - Create account
- `logout()` - Clear session

#### 2. **ListingContext** (`contexts/ListingContext.tsx`)
- Manages clothing listings
- Handles CRUD operations for listings
- Supports filtering and searching
- Provides `useListing()` hook

**Key Methods:**
- `fetchListings(filters)` - Get listings with optional filters
- `createListing(listingData)` - Create new listing

#### 3. **SwapContext** (`contexts/SwapContext.tsx`)
- Manages swap requests (incoming/outgoing)
- Handles swap acceptance/rejection
- Provides `useSwap()` hook

**Key Methods:**
- `fetchIncomingSwaps()` - Get swap requests received
- `fetchOutgoingSwaps()` - Get swap requests sent
- `sendSwapRequest(requester_listing_id, receiver_listing_id, message)` - Initiate swap
- `acceptSwap(swapId)` - Accept incoming request
- `rejectSwap(swapId)` - Reject incoming request

#### 4. **ChatContext** (`contexts/ChatContext.tsx`)
- Manages messaging between swap partners
- Handles message sending and fetching
- Tracks unread messages
- Provides `useChat()` hook

**Key Methods:**
- `fetchMessages(swapId)` - Get conversation messages
- `sendMessage(swapId, content)` - Send message
- `fetchUnreadCounts()` - Get unread message counts

### Page Structure

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page with features |
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Listings | `/listings` | Browse all listings |
| Create Listing | `/create-listing` | Add new clothing item |
| Swaps | `/swaps` | Manage swap requests |

### Component Hierarchy

```
Layout (Providers)
├── Navigation
├── HeroSection
├── FeaturesSection
├── Auth Forms
│   ├── LoginForm
│   └── RegisterForm
├── ListingsPage
│   ├── ListingCard
│   └── Swap Modal
├── CreateListingForm
├── SwapsPage
│   ├── Tabs
│   ├── SwapRequestCard
│   └── ChatModal
```

## Key Features

### 1. **Authentication**
- Email/password registration
- Secure login with JWT tokens
- Persistent sessions with localStorage
- Protected routes

### 2. **Listing Management**
- Create, read listings
- Filter by: clothing type, size, condition, location
- Search by title/description
- Pagination support

### 3. **Swap System**
- Initiate swaps with optional messages
- Manage incoming/outgoing requests
- Accept or reject swaps
- Status tracking (pending/accepted/rejected)

### 4. **Real-time Chat**
- Message exchange between swap partners
- Unread message tracking
- Message timestamps
- Persistent history

### 5. **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- Works on all screen sizes
- Touch-friendly interface

## Styling

- **Framework**: Tailwind CSS
- **Color Scheme**: Indigo primary, Pink secondary, Neutral grays
- **Icons**: Lucide React for consistent icon set
- **Responsive**: Mobile, tablet, and desktop optimized

## API Integration

The frontend connects to the backend Express.js API:

**Base URL**: `http://localhost:4000`

All API calls include:
- Authorization headers with JWT token
- Error handling with user feedback
- Loading states during operations
- Automatic token validation

## Error Handling

- User-friendly error messages
- Network error handling
- Form validation
- Protected route redirects

## Development Tips

### Hot Module Replacement (HMR)
Changes are automatically reflected in the browser during development.

### Debugging
- Use React DevTools for component inspection
- Check browser console for errors
- Network tab for API calls
- localStorage for token inspection

### Adding New Features
1. Create context in `contexts/` if managing state
2. Add component in `components/`
3. Create page in `app/` if new route needed
4. Use hooks to access context state

## Building for Production

```bash
npm run build
npm run start
```

Or deploy to Vercel (recommended):

```bash
vercel deploy
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:4000` |

## Dependencies

- **next**: ^15.0.0 - React framework
- **react**: ^18.3.1 - UI library
- **axios**: ^1.6.0 - HTTP client
- **tailwindcss**: ^3.4.1 - Styling
- **lucide-react**: ^0.263.1 - Icons
- **typescript**: ^5.0.0 - Type safety

## Next Steps

1. **Start Backend**: `cd .. && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Create Account**: Register at http://localhost:3000/register
4. **List Items**: Create listings at `/create-listing`
5. **Browse & Swap**: Find items and initiate swaps at `/listings`
6. **Chat & Manage**: Manage swaps and communicate at `/swaps`

## Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart dev server

### Authentication not persisting
- Check localStorage for token in DevTools
- Verify JWT_SECRET matches between frontend and backend

### Styling issues
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Clear browser cache

## Support

For issues or questions, refer to:
- Frontend README: `frontend/README.md`
- Backend documentation in parent directory
- API types: `src/types.ts`
