# GearUp Service Booking Flow - User Guide

## 📋 Complete User Journey

### Step 1: Browse Services (Landing Page)
```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                             │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Engine    │  │   Tire      │  │  Detailing  │         │
│  │   Repair    │  │  Services   │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Diagnostics │  │ Maintenance │  │  AC Service │         │
│  │             │  │  (NEW)      │  │  (NEW)      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ✨ 6 Service Cards (3-Column Grid)                        │
│  🎨 Hover Effect: Scale + Enhanced Shadow                   │
│  🔗 Each Card Clickable                                     │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Service Details Page
```
┌─────────────────────────────────────────────────────────────┐
│                 SERVICE DETAILS PAGE                        │
│                                                              │
│  ← Back to Services                                         │
│                                                              │
│  ┌─────────────────────────────────┬──────────────────────┐│
│  │                                 │                      ││
│  │  Service Title (e.g., Engine    │  ┌────────────────┐ ││
│  │  Repair)                        │  │  Service Info  │ ││
│  │                                 │  │  Sidebar       │ ││
│  │  📝 Full Description             │  │                │ ││
│  │  • What's Included (5 points)    │  │  Duration:     │ ││
│  │  • Why Choose Us                 │  │  2-4 Hours     │ ││
│  │                                 │  │                │ ││
│  │                                 │  │  Price:        │ ││
│  │                                 │  │  $150-$500     │ ││
│  │                                 │  │                │ ││
│  │                                 │  └────────────────┘ ││
│  │                                 │                      ││
│  │                                 │  ┌────────────────┐ ││
│  │                                 │  │  Book Now BTN  │ ││
│  │                                 │  │  (Logged In)   │ ││
│  │                                 │  │           OR   │ ││
│  │                                 │  │  Log In BTN    │ ││
│  │                                 │  │  (Not Auth)    │ ││
│  │                                 │  └────────────────┘ ││
│  └─────────────────────────────────┴──────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Authentication Check

#### If NOT Logged In:
```
┌──────────────────────────────────────────────┐
│           LOGIN PROMPT DISPLAY               │
│                                              │
│  You need to log in to book this service.   │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │         [LOG IN BUTTON]              │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  Don't have an account? [SIGN UP]           │
│                                              │
└──────────────────────────────────────────────┘
        ↓ Click "Log In" or "Sign Up"
        → Redirects to Auth Pages
```

#### If Logged In:
```
┌──────────────────────────────────────────────┐
│      BOOKING FORM BECOMES VISIBLE            │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │      [BOOK NOW / HIDE FORM]          │  │
│  └──────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
        ↓ Click "Book Now"
        → Form Appears Below
```

### Step 4: Booking Form (Only for Logged In Users)

```
┌──────────────────────────────────────────────────────────┐
│            BOOKING FORM                                  │
│                                                          │
│  📋 PERSONAL INFORMATION                                 │
│  ├─ Full Name *              [_________________]         │
│  ├─ Email Address *          [_________________]         │
│  └─ Phone Number *           [_________________]         │
│                                                          │
│  📅 APPOINTMENT DETAILS                                  │
│  ├─ Preferred Date *         [_________________]         │
│  │  (Date Picker - min: Today)                          │
│  └─ Preferred Time *         [▼ Select Time Slot]       │
│     Available: 09:00-11:30, 14:00-17:00                 │
│                                                          │
│  🚗 VEHICLE INFORMATION                                  │
│  ├─ Vehicle Type *           [▼ Sedan/SUV/...]          │
│  └─ Vehicle Model/Year *     [_________________]         │
│                                                          │
│  📝 ADDITIONAL INFORMATION                               │
│  └─ Additional Notes         [_________________]         │
│     [Multi-line textarea]                               │
│                                                          │
│  ┌──────────────┬──────────────┐                         │
│  │ CONFIRM BOOK │ CLEAR FORM   │                         │
│  └──────────────┴──────────────┘                         │
│                                                          │
│  * Fields marked with * are required                    │
└──────────────────────────────────────────────────────────┘
```

### Step 5: Form Validation & Submission

#### Validation Rules:
```
✅ Name       → Required, non-empty
✅ Email      → Required, valid format (contains @)
✅ Phone      → Required, minimum 10 characters
✅ Date       → Required, cannot be in past
✅ Time       → Required, must select from dropdown
✅ Vehicle    → Required, must select from dropdown
✅ Model      → Required, non-empty
```

#### If Validation Fails:
```
┌────────────────────────────────┐
│  ❌ ERROR MESSAGE              │
│  "Valid email is required"     │
│  "Phone must be 10+ digits"    │
│  etc...                        │
└────────────────────────────────┘
```

#### If Validation Passes:
```
┌────────────────────────────────┐
│  ✅ SUCCESS!                   │
│  "Booking submitted            │
│   successfully!                │
│   We will contact you soon."   │
│                                │
│  • Button disabled for 2s      │
│  • Form resets                 │
│  • Success callback triggers   │
└────────────────────────────────┘
```

---

## 🎯 Key Features Summary

### 1️⃣ **Six Service Cards**
- Engine Repair
- Tire Services
- Detailing
- Diagnostics
- **Maintenance** (NEW)
- **AC Service** (NEW)

### 2️⃣ **Clickable Service Cards**
- Smooth hover animation (scale + shadow)
- "Learn More →" button indication
- Navigation with service data passed

### 3️⃣ **Authentication Protection**
- Unauthenticated users see login prompt
- Authenticated users see booking form
- Seamless redirect to auth pages

### 4️⃣ **Comprehensive Booking Form**
- Personal information section
- Appointment details with date/time pickers
- Vehicle information collection
- Additional notes for special requests
- Complete form validation
- User feedback on success/error

### 5️⃣ **Responsive Design**
- Mobile: Stack vertically
- Tablet: 2-column layout
- Desktop: Full layout with sidebar
- All elements touch-friendly

---

## 🔄 Data Flow

```
User selects Service Card
    ↓
Route: /service/:serviceId
    ↓
ServiceDetailsPage loads
    ↓
Check if authenticated?
    ├─ NO → Show Login Prompt
    │       └─ User clicks Log In / Sign Up
    │           → Redirects to Auth Pages
    │
    └─ YES → Show "Book Now" Button
             ↓
         User clicks "Book Now"
             ↓
         BookingForm appears
             ↓
         User fills form
             ↓
         Client-side validation
             ├─ FAIL → Show error message
             │
             └─ PASS → Submit to localStorage (demo)
                       ↓
                       Show success message
                       ↓
                       Form resets
```

---

## 📊 Available Time Slots

```
Morning:    09:00  09:30  10:00  10:30  11:00  11:30
Afternoon:  14:00  14:30  15:00  15:30  16:00  16:30
Evening:    17:00
```

---

## 🚗 Vehicle Type Options

- Sedan
- SUV
- Truck
- Van
- Coupe
- Hatchback
- Convertible
- Other

---

## 💾 Stored Booking Data Example

```javascript
{
  serviceId: 1,
  serviceName: "Engine Repair",
  name: "John Doe",
  email: "john@example.com",
  phone: "(555) 123-4567",
  date: "2024-11-15",
  time: "09:30",
  vehicleType: "Sedan",
  vehicleModel: "2020 Honda Civic",
  additionalNotes: "Please check the transmission",
  createdAt: "2024-10-27T15:30:00Z"
}
```

---

## 🎨 Color Scheme & Styling

| Element | Style |
|---------|-------|
| Primary Button | Solid color (primary) |
| Hover State | Scale up + Enhanced shadow |
| Error Messages | Red background with icon |
| Success Messages | Green background with icon |
| Form Inputs | Border + Focus ring |
| Cards | Rounded corners + Shadow |
| Sidebar | Sticky + Gradient background |

---

## ✅ Testing Scenarios

### Scenario 1: Browse and Book (Logged In)
1. Visit landing page
2. See 6 service cards
3. Click on a card
4. View service details
5. Click "Book Now"
6. Fill booking form
7. Submit successfully

### Scenario 2: Browse and Authentication (Not Logged In)
1. Visit landing page
2. Click on a service card
3. View service details
4. See "Log In" prompt
5. Click "Log In"
6. Redirected to login page

### Scenario 3: Form Validation
1. Log in
2. Click on service card
3. Click "Book Now"
4. Try submitting empty form
5. See validation error messages
6. Fill invalid email
7. See email validation error
8. Fill form correctly
9. Successfully submit

---

## 🚀 Ready to Deploy!

All features are implemented and ready for testing. The frontend is fully functional and can be connected to a backend API by updating the `appointmentService.js` file.

**Status**: ✅ Complete  
**Date**: October 27, 2025  
**Version**: 1.0.0
