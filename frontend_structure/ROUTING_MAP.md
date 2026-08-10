# Frontend Routing Map
# StratMen Foundation

---

## Complete Route Map

### 1. Public Marketing Routes

| Path | Component | Layout | Description |
|:---|:---|:---|:---|
| `/` | `Home` | `PublicLayout` | Landing page with hero, mission, footprint stats |
| `/activities` | `Activities` | `PublicLayout` | Sunday Meetings, Industry Visits, Talks |
| `/journey` | `Journey` | `PublicLayout` | Vertical timeline milestone view |
| `/about` | `AboutUs` | `PublicLayout` | Background story & team profiles |

---

### 2. StratChat Gate & Auth Routes

| Path | Component | Layout | Description |
|:---|:---|:---|:---|
| `/stratchat` | `StratChatLanding` | None | Combined Gate: Log In + Embedded Join Us Application |
| `/auth/callback` | `GoogleAuthSuccess` | None | OAuth callback token handler |
| `/access-pending` | `AccessPending` | None | Screen shown when user is authenticated but not yet allowlisted |

---

### 3. StratChat Portal Routes (Protected — Auth + Allowlist Guard)

| Path | Component | Layout | Guard | Description |
|:---|:---|:---|:---|:---|
| `/stratchat/feed` | `Feed` | `StratChatLayout` | `ProtectedMemberRoute` | Social feed with posts, comments, likes |
| `/stratchat/profile` | `Profile` | `StratChatLayout` | `ProtectedMemberRoute` | User profile & personal posts |
| `/stratchat/chat` | `GroupChat` | `StratChatLayout` | `ProtectedMemberRoute` | Real-time group chat window |
| `/stratchat/admin` | `AdminPortal` | `StratChatLayout` | `ProtectedAdminRoute` | Integrated Admin Portal (Requests, Allowlist, Users, Content) |

---

## Route Guards

### ProtectedMemberRoute
```jsx
const ProtectedMemberRoute = ({ children }) => {
  const { isAuthenticated, isAllowlisted } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/stratchat" replace />;
  }

  if (!isAllowlisted) {
    return <Navigate to="/access-pending" replace />;
  }

  return children;
};
```

### ProtectedAdminRoute
```jsx
const ProtectedAdminRoute = ({ children }) => {
  const { userData, isAuthenticated, isAllowlisted } = useSelector((state) => state.auth);

  if (!isAuthenticated || !isAllowlisted) {
    return <Navigate to="/stratchat" replace />;
  }

  if (userData?.role !== 'admin' && !userData?.is_admin) {
    return <Navigate to="/stratchat/feed" replace />;
  }

  return children;
};
```
