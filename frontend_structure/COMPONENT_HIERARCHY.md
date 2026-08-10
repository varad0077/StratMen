# Frontend Component Hierarchy
# StratMen Foundation

---

## Component Tree

```
<App>
├── <Provider store={store}>                    # Redux store
│   ├── <TooltipProvider>
│   │   ├── <RouterProvider router={router}>    # React Router
│   │   │
│   │   │   ┌── PUBLIC MARKETING ROUTES ───────────────────────────
│   │   │   │
│   │   │   ├── <PublicLayout>                  # Navbar + Footer wrapper
│   │   │   │   ├── <Navbar />                  # Links: Home, Activities, Journey, About + StratChat CTA
│   │   │   │   ├── <Outlet />                  # Renders child page
│   │   │   │   │   ├── <Home />                # Hero + Mission/Vision + FootprintStats
│   │   │   │   │   ├── <Activities />          # Sunday Meetings, Visits, Talks cards
│   │   │   │   │   ├── <Journey />             # Vertical timeline view
│   │   │   │   │   └── <AboutUs />             # Story & Team cards
│   │   │   │   └── <Footer />                  # Footer links & copyright
│   │   │   │
│   │   │   ┌── STRATCHAT ENTRY GATE & AUTH ───────────────────────
│   │   │   │
│   │   │   ├── <StratChatLanding />            # Combined Gate (/stratchat)
│   │   │   │   ├── <LoginForm />               # Google OAuth + Email/Password Login
│   │   │   │   └── <JoinUsForm />              # Embedded "Apply to Join" Form right below
│   │   │   │
│   │   │   ├── <GoogleAuthSuccess />           # OAuth callback token extractor
│   │   │   ├── <AccessPending />               # Unapproved member status screen
│   │   │   │
│   │   │   ┌── STRATCHAT PORTAL (Protected) ──────────────────────
│   │   │   │
│   │   │   ├── <ProtectedMemberRoute>          # Auth + Allowlist guard
│   │   │   │   ├── <StratChatLayout>
│   │   │   │   │   ├── <StratChatHeader />     # Logo + user menu + logout
│   │   │   │   │   ├── <LeftSidebar />         # Profile + Feed, Chat, Profile & (Admin Portal*)
│   │   │   │   │   ├── <Outlet />
│   │   │   │   │   │   ├── <Feed />
│   │   │   │   │   │   │   ├── <PostCreator /> # Text + Cloudinary image + submit
│   │   │   │   │   │   │   ├── <FilterBar />   # All / Saved / My Posts
│   │   │   │   │   │   │   └── <PostCard /> × N
│   │   │   │   │   │   │       ├── Author info
│   │   │   │   │   │   │       ├── Content text + Image Lightbox
│   │   │   │   │   │   │       ├── Actions (like, comment, bookmark, copy, delete)
│   │   │   │   │   │   │       └── <CommentSection />
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── <Profile />         # User stats & post history
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── <GroupChat />       # Realtime CDC chat window
│   │   │   │   │   │   │   ├── <ChatWindow />
│   │   │   │   │   │   │   └── Chat Input + Send
│   │   │   │   │   │   │
│   │   │   │   │   │   └── <AdminPortal />     # Integrated inside StratChat (Admin Only)
│   │   │   │   │   │       ├── <JoinRequestsTab />   # Review Applications
│   │   │   │   │   │       ├── <AllowlistTab />      # Manage Members
│   │   │   │   │   │       ├── <UserMgmtTab />       # Suspend / Delete Users
│   │   │   │   │   │       ├── <ContentEditorTab />  # Manage Public Website Content
│   │   │   │   │   │       └── <AuditLogsTab />      # Action Logs
│   │   │   │   │   │
│   │   │   │   │   └── <RightSidebar />        # Verified members list + community stats
│   │   │
│   │   ├── <Toaster />                         # Sonner toast container
│   │   └── <SplashScreen />                    # Seed→tree splash animation on first load
```
