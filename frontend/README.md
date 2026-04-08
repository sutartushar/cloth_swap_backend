# ClothSwap Frontend

A modern Next.js 15 frontend for the ClothSwap application - a sustainable fashion exchange platform.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Browse Listings**: Discover clothing items with advanced filtering
- **Create Listings**: List your pre-loved clothing items for swap
- **Swap Management**: Send, receive, accept, and reject swap requests
- **Real-time Chat**: Communicate with swap partners directly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Global State Management**: Context hooks for auth, listings, swaps, and chat

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── listings/          # Browse listings page
│   ├── create-listing/    # Create listing page
│   ├── swaps/             # My swaps page
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── Navigation.tsx     # Navigation bar
│   ├── LoginForm.tsx      # Login form
│   ├── RegisterForm.tsx   # Registration form
│   ├── ListingsPage.tsx   # Listings page component
│   ├── CreateListingForm.tsx # Create listing form
│   ├── SwapsPage.tsx      # Swaps management page
│   ├── ChatModal.tsx      # Chat interface
│   └── ...
├── contexts/              # React Context API
│   ├── AuthContext.tsx    # Authentication state
│   ├── ListingContext.tsx # Listings state
│   ├── SwapContext.tsx    # Swaps state
│   └── ChatContext.tsx    # Chat state
└── public/                # Static assets
```

## Context Hooks

### AuthContext
Manages user authentication state and operations.

```typescript
const { user, token, login, register, logout, isLoading, error } = useAuth();
```

### ListingContext
Handles clothing listings management.

```typescript
const { listings, fetchListings, createListing, isLoading, error } = useListing();
```

### SwapContext
Manages swap requests and operations.

```typescript
const { 
  incomingSwaps, 
  outgoingSwaps, 
  sendSwapRequest, 
  acceptSwap, 
  rejectSwap 
} = useSwap();
```

### ChatContext
Handles messaging between swap partners.

```typescript
const { messages, sendMessage, fetchMessages, unreadCounts } = useChat();
```

## Features in Detail

### Authentication
- User registration with email, password, phone, and location
- Secure login with JWT token storage
- Automatic token refresh on app reload
- Protected routes with auth checks

### Listings
- Create listings with details: title, type, size, condition, brand, value, location
- Browse all listings with filtering by type, size, condition, location
- Search functionality for listing titles and descriptions
- Pagination support

### Swaps
- Initiate swap requests with optional messages
- Manage incoming and outgoing swap requests
- Accept or reject swap requests
- View swap status (pending, accepted, rejected)

### Chat
- Real-time messaging within swap conversations
- Unread message counts
- Message timestamps and sender info
- Persistent message history

## API Integration

The frontend communicates with the backend API at `http://localhost:4000`. Ensure the backend is running before starting the frontend.

### API Endpoints Used

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/listings` - Get listings with filters
- `POST /api/listings` - Create listing
- `POST /api/swaps` - Send swap request
- `GET /api/swaps/incoming` - Get incoming swaps
- `GET /api/swaps/outgoing` - Get outgoing swaps
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap
- `POST /api/chat/:swapId` - Send message
- `GET /api/chat/:swapId` - Get messages
- `GET /api/chat/unread` - Get unread counts

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

The frontend can be deployed to Vercel with zero configuration:

```bash
vercel deploy
```

Or deploy to any Node.js hosting platform:

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
