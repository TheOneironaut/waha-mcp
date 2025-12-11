# Bug Fix: Group Invite Code API Response

## Problem Description

The WAHA API endpoint for getting group invite codes returns **plain text (URL)** instead of JSON, causing a parsing error in the client.

### Original Error
```
Unexpected token 'h', "https://ch"... is not valid JSON
```

### Root Cause
- The endpoint `/api/:session/groups/:id/invite-code` returns `text/plain` (a URL string)
- The client's `request()` method always tries to parse responses as JSON
- This causes a JSON parsing error when receiving plain text

## Solution

### 1. Added `requestText()` Method

Created a new private method in `WAHAClient` that handles plain text responses:

```typescript
private async requestText(
  endpoint: string,
  options: RequestInit = {}
): Promise<string> {
  // ... handles text/plain responses
  return await response.text();
}
```

### 2. Updated Group Invite Code Methods

Modified both `getGroupInviteCode()` and `revokeGroupInviteCode()` to:
- Use `requestText()` instead of `request()`
- Auto-format groupId to include `@g.us` suffix if missing
- Wrap the plain text URL in a JSON object: `{ inviteCode: url }`

```typescript
async getGroupInviteCode(session: string, groupId: string): Promise<{ inviteCode: string }> {
  // Ensure groupId has @g.us suffix
  const formattedGroupId = groupId.includes('@') ? groupId : `${groupId}@g.us`;
  
  // WAHA API returns plain text (URL) instead of JSON
  const inviteUrl = await this.requestText(endpoint, { method: "GET" });
  
  return { inviteCode: inviteUrl };
}
```

## Benefits

1. ✅ **Fixes JSON Parsing Error**: No more "Unexpected token 'h'" errors
2. ✅ **Auto-formats Group IDs**: Handles both `120363423077897152` and `120363423077897152@g.us`
3. ✅ **Prevents HTTP 500**: Always sends properly formatted groupId to API
4. ✅ **Consistent API**: Returns JSON object `{ inviteCode: string }` like other methods

## Testing

Tested with real WAHA server:

```javascript
// Both work now:
await client.getGroupInviteCode("bot10", "120363423077897152@g.us");
await client.getGroupInviteCode("bot10", "120363423077897152"); // Auto-adds @g.us

// Result:
{ inviteCode: "https://chat.whatsapp.com/Lqzbt25pIACLHy7lnm7iam" }
```

## Files Changed

- `src/client/waha-client.ts`:
  - Added `requestText()` method
  - Updated `getGroupInviteCode()` 
  - Updated `revokeGroupInviteCode()`

## Backward Compatibility

✅ **Fully backward compatible** - the return type remains the same:
```typescript
Promise<{ inviteCode: string }>
```

Only the internal implementation changed to handle the text response correctly.
