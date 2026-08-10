# Frontend Architecture Reference
# StratMen Foundation

---

## Full File Map

```
stratmen-frontend/
├── .env                              # VITE_API_URL, VITE_CLOUDINARY_*
├── .env.example
├── .gitignore
├── index.html                        # Root HTML with meta tags, Inter font link
├── package.json
├── vite.config.js                    # Vite + React plugin + path aliases
├── eslint.config.js
├── jsconfig.json                     # Path aliases: @/ → src/
├── components.json                   # shadcn/ui configuration
│
├── public/
│   ├── favicon.ico
│   └── og-image.png                  # Open Graph image for social sharing
│
└── src/
    ├── main.jsx                      # ReactDOM.createRoot entry
    ├── App.jsx                       # Provider → TooltipProvider → Router → Toaster → SplashScreen
    ├── index.css                     # TailwindCSS imports + CSS custom properties
    │
    ├── assets/images/                # Logo, hero images, seed/tree for splash
    │
    ├── config/
    │   └── constants.js              # API_BASE_URL, Cloudinary config
    │
    ├── api/services/                 # API communication layer
    │   ├── axiosInstance.js           # Base Axios instance
    │   ├── axiosService.js           # AxiosService class with interceptors
    │   ├── tokenService.js           # localStorage token get/set/remove
    │   ├── errorHandler.js           # Centralized error processing
    │   ├── index.js                  # Export barrel
    │   ├── userService.js            # Auth + profile API calls
    │   ├── postService.js            # Posts CRUD
    │   ├── chatService.js            # Chat messages
    │   ├── adminService.js           # Admin dashboard + management
    │   ├── allowlistService.js       # Allowlist CRUD
    │   ├── joinRequestService.js     # Join request APIs
    │   └── contentService.js         # Activities, journey, team, footprints, homepage
    │
    ├── store/                        # Redux Toolkit
    │   ├── index.js                  # configureStore
    │   ├── authSlice.js              # { user, token, isAuthenticated, role }
    │   └── uiSlice.js                # { theme, sidebarOpen }
    │
    ├── hooks/                        # Custom React hooks
    │   ├── useAuth.js                # Auth state + login/logout actions
    │   ├── usePosts.js               # Fetch posts + polling
    │   └── useChat.js                # Fetch messages + polling
    │
    ├── routes/                       # Route configuration
    │   ├── index.jsx                 # createBrowserRouter
    │   ├── AuthenticationRoutes.jsx  # Public + auth pages
    │   ├── MemberRoutes.jsx          # StratChat protected pages
    │   └── AdminRoutes.jsx           # Admin protected pages
    │
    ├── layout/                       # Layout components
    │   ├── PublicLayout/             # Navbar + Footer + Outlet
    │   │   ├── index.jsx
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── StratChatLayout/          # Header + 3-col + Outlet
    │   │   ├── index.jsx
    │   │   ├── Header.jsx
    │   │   ├── LeftSidebar.jsx
    │   │   └── RightSidebar.jsx
    │   └── AdminLayout/             # Sidebar + Header + Outlet
    │       ├── index.jsx
    │       ├── Sidebar.jsx
    │       └── Header.jsx
    │
    ├── views/                        # Page components
    │   ├── landing/
    │   │   ├── Home.jsx
    │   │   ├── layout.jsx
    │   │   └── components/
    │   │       ├── HeroSection.jsx
    │   │       ├── MissionVision.jsx
    │   │       └── FootprintStats.jsx
    │   │
    │   └── pages/
    │       ├── AboutUs/AboutUs.jsx
    │       ├── Activities/Activities.jsx
    │       ├── Journey/Journey.jsx
    │       ├── JoinUs/JoinUs.jsx
    │       │
    │       ├── authentication/
    │       │   ├── Login.jsx
    │       │   ├── Register.jsx
    │       │   ├── ForgotPassword.jsx
    │       │   ├── ResetPassword.jsx
    │       │   ├── EmailVerification.jsx
    │       │   └── GoogleAuthSuccess.jsx
    │       │
    │       ├── stratchat/
    │       │   ├── StratChatLanding.jsx
    │       │   ├── Feed.jsx
    │       │   ├── Profile.jsx
    │       │   └── GroupChat.jsx
    │       │
    │       └── admin/
    │           ├── Dashboard.jsx
    │           ├── UserManagement.jsx
    │           ├── AllowlistManagement.jsx
    │           ├── JoinRequests.jsx
    │           ├── ActivitiesManagement.jsx
    │           ├── JourneyManagement.jsx
    │           ├── TeamManagement.jsx
    │           ├── FootprintsManagement.jsx
    │           └── HomepageManagement.jsx
    │
    ├── components/                   # Reusable components
    │   ├── ui/                       # shadcn/ui base components
    │   │   ├── button.jsx
    │   │   ├── input.jsx
    │   │   ├── dialog.jsx
    │   │   ├── card.jsx
    │   │   ├── sonner.jsx
    │   │   ├── tooltip.jsx
    │   │   ├── dropdown-menu.jsx
    │   │   └── ...
    │   │
    │   ├── Loader.jsx                # Loading spinner
    │   ├── Loadable.jsx              # React.lazy wrapper
    │   ├── ErrorComponent.jsx        # Error boundary fallback
    │   ├── Logo.jsx                  # Brand logo
    │   ├── SearchBox.jsx             # Search input
    │   ├── NoRecords.jsx             # Empty state
    │   ├── ConfirmationDialog.jsx    # Confirm action modal
    │   ├── ImageLightbox.jsx         # Image preview modal
    │   │
    │   ├── feed/                     # StratChat Feed components
    │   │   ├── PostCard.jsx
    │   │   ├── PostCreator.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── CommentItem.jsx
    │   │
    │   ├── chat/                     # Group Chat components
    │   │   ├── ChatWindow.jsx
    │   │   └── ChatMessage.jsx
    │   │
    │   ├── cards/                    # Reusable card variants
    │   ├── custom-table/             # Data table for admin
    │   └── form-management/          # Form builder helpers
    │
    ├── themes/
    │   └── theme.js                  # Theme tokens
    │
    ├── lib/
    │   └── utils.js                  # cn() helper, date formatting
    │
    └── utils/
        └── helpers.js                # Shared utilities
```
