# 📝 How to Add Services (Step-by-Step Guide)

## 🎯 Quick Answer

You add services through your **Admin Panel** - it's already built and ready to use!

## 📋 Step-by-Step Instructions

### Step 1: Login as Admin

1. Open your browser: `http://localhost:5173`
2. Click **Login**
3. Login with your admin credentials

### Step 2: Go to Manage Services

1. After login, you'll be in the admin dashboard
2. Look for **"Manage Services"** in the sidebar/menu
3. Click on it

**URL:** `http://localhost:5173/admin/services`

### Step 3: Add a New Service

1. Click the **"+ Add New Service"** button (top right)
2. A form will appear with these fields:

**Required Fields:**
- **Title** - e.g., "Oil Change"
- **Short Description** - e.g., "Complete oil and filter change service"
- **Estimated Duration** - e.g., "30 minutes"
- **Estimated Price** - e.g., "49.99"
- **Max Per Day** - e.g., "10" (how many bookings per day)

**Optional Fields:**
- **Service Image** - Upload an image
- **Included Subservices** - e.g., "Oil drain, Filter replacement, Premium oil"

3. Fill in the form
4. Click **"Create Service"**
5. Done! ✅

### Step 4: Service is Automatically Synced

**What happens automatically:**
```
You click "Create Service"
    ↓
Service saved to MySQL
    ↓
Backend automatically calls vectorDBService.addService()
    ↓
Service indexed in vector database
    ↓
Chatbot can now answer questions about it!
```

**No extra steps needed!** The chatbot will immediately know about the new service.

### Step 5: Test the Chatbot

1. Click the **chat icon** (bottom-right corner)
2. Ask: **"What services do you offer?"**
3. The chatbot will now list your service!

## 📊 Example Services to Add

Here are some example services you can add:

### Service 1: Oil Change
- **Title:** Oil Change
- **Description:** Complete oil and filter change service with premium synthetic oil
- **Subservices:** Oil drain, New oil filter, Premium oil refill, Fluid level check
- **Duration:** 30 minutes
- **Price:** $49.99
- **Max Per Day:** 10

### Service 2: Tire Rotation
- **Title:** Tire Rotation
- **Description:** Rotate all four tires for even wear and extended tire life
- **Subservices:** Tire removal, Position rotation, Wheel balancing, Pressure check
- **Duration:** 20 minutes
- **Price:** $29.99
- **Max Per Day:** 15

### Service 3: Brake Service
- **Title:** Brake Service
- **Description:** Complete brake inspection and service including pads and rotors
- **Subservices:** Brake pad replacement, Rotor inspection, Brake fluid check, Test drive
- **Duration:** 1 hour
- **Price:** $149.99
- **Max Per Day:** 5

### Service 4: Engine Diagnostic
- **Title:** Engine Diagnostic
- **Description:** Computer diagnostic scan to identify engine issues
- **Subservices:** OBD-II scan, Error code reading, System check, Report generation
- **Duration:** 45 minutes
- **Price:** $79.99
- **Max Per Day:** 8

### Service 5: Battery Check
- **Title:** Battery Check
- **Description:** Battery health and charging system test
- **Subservices:** Voltage test, Load test, Terminal cleaning, Charging system check
- **Duration:** 15 minutes
- **Price:** $19.99
- **Max Per Day:** 20

## 🔄 How Data Flows

### When You Create a Service:

```
Admin Panel Form
    ↓
POST /api/admin/services
    ↓
AdminServiceController
    ↓
ServiceService.createService()
    ↓
1. Save to MySQL ✅
2. Call vectorDBService.addService() ✅
    ↓
Service indexed in vector database
    ↓
Chatbot can answer questions! 🎉
```

### When You Update a Service:

```
Edit Service → Save
    ↓
ServiceService.updateService()
    ↓
1. Update in MySQL ✅
2. Call vectorDBService.updateService() ✅
    ↓
Vector database updated
    ↓
Chatbot has latest info! 🎉
```

### When You Delete a Service:

```
Delete Service → Confirm
    ↓
ServiceService.deleteService()
    ↓
1. Delete from MySQL ✅
2. Call vectorDBService.deleteService() ✅
    ↓
Removed from vector database
    ↓
Chatbot won't mention it anymore! 🎉
```

## 🧪 Testing After Adding Services

### Test 1: List Services
**Ask:** "What services do you offer?"

**Expected Response:**
```
AutoServe offers the following services:
- Oil Change ($49.99) - 30 minutes
- Tire Rotation ($29.99) - 20 minutes
- Brake Service ($149.99) - 1 hour
- Engine Diagnostic ($79.99) - 45 minutes
- Battery Check ($19.99) - 15 minutes
```

### Test 2: Specific Service
**Ask:** "How much does an oil change cost?"

**Expected Response:**
```
An oil change costs $49.99 and takes approximately 30 minutes. 
It includes oil drain, new oil filter, premium oil refill, and fluid level check.
```

### Test 3: Service Details
**Ask:** "What's included in brake service?"

**Expected Response:**
```
The brake service includes brake pad replacement, rotor inspection, 
brake fluid check, and a test drive. It costs $149.99 and takes about 1 hour.
```

### Test 4: Comparison
**Ask:** "Which service is cheapest?"

**Expected Response:**
```
The cheapest service is Battery Check at $19.99, which takes only 15 minutes.
```

## 🎯 Quick Checklist

- [ ] Backend is running (`./scripts/start-backend.sh`)
- [ ] Frontend is running (`cd frontend && npm run dev`)
- [ ] Logged in as admin
- [ ] Navigated to Manage Services page
- [ ] Added at least 3-5 services
- [ ] Tested chatbot with questions
- [ ] Chatbot gives specific answers! ✅

## 🔍 Troubleshooting

### "I don't see Manage Services"
- Make sure you're logged in as **admin** (not customer or employee)
- Check the sidebar/navigation menu
- Try going directly to: `http://localhost:5173/admin/services`

### "Service created but chatbot doesn't know about it"
- Check backend logs for errors
- Look for: "Adding service to vector DB: [Service Name]"
- If not there, restart backend: `./scripts/restart-backend.sh`

### "Form validation errors"
- All required fields must be filled
- Price must be greater than 0
- Max per day must be at least 1
- Title must be at least 3 characters
- Description must be at least 10 characters

## 📚 Summary

1. ✅ **Login as admin**
2. ✅ **Go to Manage Services** (`/admin/services`)
3. ✅ **Click "+ Add New Service"**
4. ✅ **Fill in the form** (title, description, price, etc.)
5. ✅ **Click "Create Service"**
6. ✅ **Service automatically synced to chatbot!**
7. ✅ **Test chatbot** - it will know about your service!

**That's it!** The admin panel does everything for you. Just add services through the UI and the chatbot will automatically learn about them! 🚀

---

**No SQL needed, no API calls needed - just use the admin panel!** 🎉
