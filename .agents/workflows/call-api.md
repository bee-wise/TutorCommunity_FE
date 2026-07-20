---
description: This workflow defines the standard process for implementing API integration across the BeeWise frontend. Every API implementation must follow these steps to ensure consistency, maintainability, and type safety.
---

# 1. Understand the API

Before writing any code, carefully review the API documentation.

Identify:

- HTTP method
- Endpoint
- Authentication requirements
- Request body
- Query parameters
- Path parameters
- Response structure
- Error responses
- Pagination (if applicable)

Do not implement an API without understanding its contract.

---

# 2. Define Types

Every request and response must have explicit TypeScript types.

Location:

```
packages/core/types/
```

Example:

```
auth.types.ts
```

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
```

Never use `any`.

---

# 3. Define Validation Schema (If Needed)

If the API accepts user input, create a Zod schema.

Location:

```
schemas/
```

Example

```
login.schema.ts
```

Validation belongs to the frontend, not inside API functions.

---

# 4. Create API Function

Every request must use the shared `apiClient`.

Location

```
packages/core/api/
```

Example

```
auth.api.ts
```

```ts
export async function login(data: LoginRequest) {
  return apiClient.post<LoginResponse>("/auth/login", data);
}
```

Rules

- Never call axios directly.
- Never duplicate base URLs.
- Never hardcode tokens.
- Always use `withCredentials`.

---

# 5. Create React Query Hook

Wrap every API with TanStack Query.

Location

```
packages/core/hooks/
```

Example

```
useLoginMutation.ts
```

Example

```ts
export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}
```

For GET requests

```
useTutorListQuery()
```

For POST

```
useCreateTutorMutation()
```

---

# 6. Query Keys

Centralize query keys.

Example

```
packages/core/queryKeys.ts
```

```ts
export const queryKeys = {
  tutor: {
    list: ["tutors"],
    detail: (id: string) => ["tutors", id],
  },
};
```

Never hardcode query keys throughout the project.

---

# 7. Cache Management

Every mutation must invalidate affected queries.

Example

```ts
queryClient.invalidateQueries({
  queryKey: queryKeys.tutor.list,
});
```

Avoid invalidating everything.

Only invalidate related data.

---

# 8. Error Handling

API functions should throw meaningful errors.

UI components should display friendly messages.

Example

```ts
toast.error(error.message);
```

Do not silently ignore errors.

---

# 9. Authentication

Protected APIs

- Cookie Authentication
- HttpOnly
- withCredentials enabled

Never

- Store tokens manually
- Read HttpOnly cookies directly
- Attach Authorization headers manually unless required by backend

Authentication should be handled centrally by `apiClient`.

---

# 10. Response Transformation

Transform responses inside API or hooks, not inside UI components.

Good

```ts
const tutors = response.data.items;
```

Bad

```tsx
<Table data={response.data.data.data.items.data} />
```

Keep UI components clean.

---

# 11. Loading & Empty States

Every query page should handle:

- Loading
- Empty
- Error
- Success

Never assume data always exists.

---

# 12. Pagination

For paginated APIs

Return

```ts
{
  (items, page, pageSize, total, totalPages);
}
```

Support

- page
- pageSize
- search
- sort
- filters

Whenever applicable.

---

# 13. File Upload

Use

```
FormData
```

Do not manually set

```
Content-Type
```

The browser will handle it automatically.

---

# 14. Naming Convention

API Functions

```
login()

logout()

getTutor()

getTutorList()

createTutor()

updateTutor()

deleteTutor()
```

Hooks

```
useTutorQuery()

useTutorListQuery()

useCreateTutorMutation()

useUpdateTutorMutation()

useDeleteTutorMutation()
```

Never use names like

```
fetchData()

callApi()

request()

submit()
```

---

# 15. Folder Structure

Example

```
[app-name]/features/[feature-name]
│
├── api
│   ├── auth.api.ts
│   ├── tutor.api.ts
│   └── booking.api.ts
│
├── hooks
│   ├── useLoginMutation.ts
│   ├── useTutorListQuery.ts
│   └── useBookingQuery.ts
│
├── types
│   ├── auth.types.ts
│   ├── tutor.types.ts
│   └── booking.types.ts
│
├── constants
│
├── queryKeys.ts
│
└── apiClient.ts
```

---

# 16. API Implementation Checklist

Before marking an API task as complete:

- ✅ API contract reviewed
- ✅ Request types created
- ✅ Response types created
- ✅ Zod validation added (if needed)
- ✅ API function implemented
- ✅ React Query hook implemented
- ✅ Query keys added
- ✅ Cache invalidation configured
- ✅ Error handling completed
- ✅ Loading state handled
- ✅ Empty state handled
- ✅ Success state handled
- ✅ TypeScript passes
- ✅ No `any`
- ✅ No duplicated endpoints
- ✅ No duplicated business logic

---

# API Development Principles

Every API implementation should be:

- Consistent
- Predictable
- Reusable
- Type-safe
- Easy to test
- Easy to maintain
- Easy to extend

Business logic belongs in API functions and hooks, not in UI components.
