# Troubleshooting Guide

## Frontend: "Failed to load locations" Error

If you're seeing a "Failed to load locations" error on the dashboard, follow these steps:

### 1. Check if the Backend is Running

**Option A: Using Docker (Recommended)**
```bash
cd backend
docker-compose up
```

**Option B: Running Locally**
```bash
cd backend
dotnet run --project Booking.Api
```

The backend should start on **port 8080**.

### 2. Verify Backend is Accessible

Open your browser and navigate to:
```
http://localhost:8080/api/locations
```

You should see a JSON response with locations. If you see an error or the page doesn't load, the backend isn't running properly.

### 3. Check the Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages:

- **"Unable to connect to API"** → Backend is not running
- **"CORS error"** → Backend CORS configuration issue
- **"401 Unauthorized"** → Organization header is missing or invalid
- **"404 Not Found"** → Endpoint doesn't exist (check backend endpoints)

### 4. Common Issues

#### Backend Not Running
**Solution**: Start the backend using one of the methods in step 1.

#### Wrong Port
**Solution**: Check `frontend/.env.local` - it should point to `http://localhost:8080`

#### CORS Issues
The backend should have CORS enabled with `AddDangerousCors()`. If you're still seeing CORS errors, check:
- `backend/Booking.Api/Extensions/CorsExtensions.cs`
- Make sure `app.UseCors()` is called in `Program.cs`

#### Database Connection Issues
If the backend starts but crashes, check:
```bash
# Start PostgreSQL via Docker
cd backend
docker-compose up postgres
```

### 5. Test the Dashboard Endpoint

With the backend running, test the dashboard endpoint directly:

```bash
# Test with Acme Corporation
curl -H "X-Organization-Id: org-acme-corp" http://localhost:8080/api/dashboard/locations

# Test with Global Ventures
curl -H "X-Organization-Id: org-global-ventures" http://localhost:8080/api/dashboard/locations
```

You should see filtered locations for each organization.

### 6. Frontend Dev Server

Make sure the frontend is running:
```bash
cd frontend
pnpm dev
```

The frontend should start on **port 3000**.

### 7. Login Flow

1. Navigate to `http://localhost:3000/sign-in`
2. Enter any email (e.g., `test@example.com`)
3. Enter any password (min 6 characters)
4. Select an organization (Acme Corporation or Global Ventures)
5. Click "Sign in"
6. Navigate to "Locations" in the sidebar

### 8. Check Logs

**Backend logs**: Check the terminal where you ran the backend
**Frontend logs**: Check the browser Developer Tools → Console tab

### 9. Still Not Working?

If you're still experiencing issues:

1. Clear your browser cache and localStorage:
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

2. Restart both backend and frontend

3. Check if you're logged in:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('booking_user'));
   ```

4. Verify the organization ID is being sent:
   - Open Developer Tools → Network tab
   - Filter by "locations"
   - Check the request headers for `X-Organization-Id`

## Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd backend
docker-compose up
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Public Locations: http://localhost:8080/api/locations
- Dashboard Locations: http://localhost:8080/api/dashboard/locations (requires X-Organization-Id header)
