# Component Architecture & File Changes

## 📁 Complete File Structure Overview

```
frontend/
├── src/
│   ├── App.jsx ✏️ UPDATED
│   │   └── Route added: /service/:serviceId
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx (unchanged)
│   │   │   └── Renders: Features, Hero, Testimonials, etc.
│   │   │
│   │   ├── ServiceDetailsPage.jsx ✨ NEW FILE
│   │   │   ├── Receives: serviceId param, service data from state
│   │   │   ├── Features:
│   │   │   │   ├── Auth check using useAuth()
│   │   │   │   ├── Service details display
│   │   │   │   ├── Booking sidebar widget
│   │   │   │   └── Conditional BookingForm
│   │   │   └── Exports: ServiceDetailsPage component
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx (unchanged)
│   │   │   ├── Signup.jsx (unchanged)
│   │   │   └── ForgotPassword.jsx (unchanged)
│   │   │
│   │   └── customer/
│   │       └── BookAppointment.jsx (unchanged)
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Features.jsx ✏️ UPDATED
│   │   │   │   ├── Changes:
│   │   │   │   │   ├── Added 2 new services (Maintenance, AC Service)
│   │   │   │   │   ├── Made ServiceCard clickable
│   │   │   │   │   ├── Added navigation handler
│   │   │   │   │   ├── Enhanced hover effects
│   │   │   │   │   └── Changed grid: lg:grid-cols-4 → lg:grid-cols-3
│   │   │   │   └── Exports: ServicesSection component
│   │   │   │
│   │   │   ├── Hero.jsx (unchanged)
│   │   │   ├── Testimonials.jsx (unchanged)
│   │   │   └── LandingFooter.jsx (unchanged)
│   │   │
│   │   ├── appointment/
│   │   │   ├── BookingForm.jsx ✨ NEW FILE (90+ lines)
│   │   │   │   ├── Props: serviceId, serviceName, onSubmitSuccess
│   │   │   │   ├── Features:
│   │   │   │   │   ├── Personal info section
│   │   │   │   │   ├── Appointment details section
│   │   │   │   │   ├── Vehicle information section
│   │   │   │   │   ├── Additional notes section
│   │   │   │   │   ├── Form validation
│   │   │   │   │   ├── Error handling
│   │   │   │   │   ├── Success feedback
│   │   │   │   │   └── localStorage integration
│   │   │   │   └── Exports: BookingForm component
│   │   │   │
│   │   │   ├── AppointmentForm.jsx ✏️ UPDATED
│   │   │   │   ├── Now wraps BookingForm
│   │   │   │   └── Maintains backward compatibility
│   │   │   │
│   │   │   ├── AppointmentCard.jsx (unchanged)
│   │   │   └── AppointmentList.jsx (unchanged)
│   │   │
│   │   ├── common/
│   │   │   ├── Button.jsx (unchanged)
│   │   │   ├── InputField.jsx (unchanged)
│   │   │   ├── Modal.jsx (unchanged)
│   │   │   └── Loader.jsx (unchanged)
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx (unchanged)
│   │   │   ├── Footer.jsx (unchanged)
│   │   │   ├── Navbar.jsx (unchanged)
│   │   │   └── Sidebar.jsx (unchanged)
│   │   │
│   │   ├── chatbot/
│   │   │   └── ChatbotWidget.jsx (unchanged)
│   │   │
│   │   └── dashboard/
│   │       ├── ProgressTracker.jsx (unchanged)
│   │       └── ServiceSummary.jsx (unchanged)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx (unchanged - used by new components)
│   │   └── UserContext.jsx (unchanged)
│   │
│   ├── hooks/
│   │   ├── useAuth.js (unchanged - used by new components)
│   │   ├── useFetch.js (unchanged)
│   │   └── useWebSocket.js (unchanged)
│   │
│   ├── services/
│   │   ├── appointmentService.js (unchanged - ready for integration)
│   │   ├── authService.js (unchanged)
│   │   ├── chatbotService.js (unchanged)
│   │   ├── customerService.js (unchanged)
│   │   └── employeeService.js (unchanged)
│   │
│   ├── styles/
│   │   └── globals.css (unchanged)
│   │
│   └── utils/
│       ├── apiHelper.js (unchanged)
│       ├── formatDate.js (unchanged)
│       └── validators.js (unchanged)
│
├── IMPLEMENTATION_SUMMARY.md ✨ NEW
├── USER_FLOW_GUIDE.md ✨ NEW
└── ...
```

---

## 🔗 Component Relationship Diagram

```
App.jsx (Router)
├── /                      → LandingPage
│                              └── Features.jsx ✨ UPDATED
│                                  ├── ServiceCard ✨ CLICKABLE
│                                  │   └── onClick → navigate(/service/:id)
│                                  │
│                                  └── 6 Services (data array)
│                                      ├── Engine Repair (id: 1)
│                                      ├── Tire Services (id: 2)
│                                      ├── Detailing (id: 3)
│                                      ├── Diagnostics (id: 4)
│                                      ├── Maintenance (id: 5) ✨ NEW
│                                      └── AC Service (id: 6) ✨ NEW
│
├── /service/:serviceId    → ServiceDetailsPage ✨ NEW
│                              ├── uses useAuth() → check isAuthenticated
│                              ├── uses useLocation() → get service data
│                              ├── if NOT authenticated
│                              │   └── Show Login/Signup Buttons
│                              │       └── Navigate to /login or /signup
│                              │
│                              └── if authenticated
│                                  ├── Show "Book Now" Button
│                                  └── onClick → Show BookingForm.jsx ✨
│                                      └── BookingForm
│                                          ├── Personal Info Inputs
│                                          ├── Appointment Details
│                                          ├── Vehicle Info
│                                          ├── Additional Notes
│                                          ├── Form Validation
│                                          └── Submit → localStorage
│
├── /login                 → Login
├── /signup                → Signup
└── /forgot-password       → ForgotPassword
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  LandingPage                            │
│  Shows 6 Service Cards                  │
└─────────────────────────────────────────┘
            ↓ User clicks card
            └─ navigate(/service/1, { state: { service } })
                        ↓
┌─────────────────────────────────────────┐
│  ServiceDetailsPage                     │
│  • Receive :serviceId from URL          │
│  • Receive service object from state    │
│  • Check useAuth().isAuthenticated      │
└─────────────────────────────────────────┘
        ↙                                  ↘
    NOT Auth                           Authenticated
        ↓                                   ↓
    Show                             Show "Book Now"
    Login/Signup                      Button
    Buttons                                ↓
        ↓                          User clicks "Book Now"
    Redirect                              ↓
    to Auth                      setShowBookingForm(true)
    Pages                                 ↓
                        ┌─────────────────────────────────┐
                        │  BookingForm Renders            │
                        │  • Input: Personal Info         │
                        │  • Input: Appointment Details   │
                        │  • Input: Vehicle Info          │
                        │  • Textarea: Notes              │
                        │  • Validate Form                │
                        │  • Submit → localStorage        │
                        │  • Show Success Message         │
                        └─────────────────────────────────┘
```

---

## 🧩 Component Props & Communication

### Features.jsx (Updated)
```javascript
// Props accepted:
// None - standalone component

// State:
const services = [
  { id, title, description, detailedDescription, style }
]

// Handlers:
handleServiceClick(service) → navigate(/service/:id, { state: { service } })

// Exports:
<ServicesSection />
```

### ServiceDetailsPage.jsx (New)
```javascript
// Hooks:
const { serviceId } = useParams()        // From URL
const location = useLocation()            // For state.service
const navigate = useNavigate()            // For navigation
const { isAuthenticated } = useAuth()     // For auth check

// State:
const [showBookingForm, setShowBookingForm] = useState(false)

// Conditional Render:
- if (!isAuthenticated) → Show Login prompt
- if (isAuthenticated && showBookingForm) → Render <BookingForm />

// Exports:
<ServiceDetailsPage />
```

### BookingForm.jsx (New)
```javascript
// Props:
- serviceId: number
- serviceName: string
- onSubmitSuccess: function (callback)

// Hooks:
const { user } = useAuth()               // Pre-fill user info

// State:
const [formData, setFormData] = useState({
  name, email, phone, date, time, vehicleType, vehicleModel, additionalNotes
})
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState(false)

// Methods:
- handleChange(e)                   // Update form state
- validateForm()                    // Client-side validation
- handleSubmit(e)                   // Submit booking

// Data Storage:
- localStorage.setItem('bookings', JSON.stringify(bookingData))

// Exports:
<BookingForm serviceId={} serviceName={} onSubmitSuccess={} />
```

---

## 🔄 State Management

### Global State (via Context)
```javascript
// AuthContext
- user: { id, username, email }
- isAuthenticated: boolean
- loading: boolean
- login(credentials)
- logout()
```

### Component Local State
```javascript
// ServiceDetailsPage
- showBookingForm: boolean

// BookingForm
- formData: { name, email, phone, date, time, vehicleType, vehicleModel, additionalNotes }
- loading: boolean
- error: string
- success: boolean
```

### Data Storage
```javascript
// localStorage
- bookings: Array<BookingObject>
  └─ BookingObject: { serviceId, serviceName, name, email, phone, date, time, vehicleType, vehicleModel, additionalNotes, createdAt }
```

---

## 📋 Form Field Specifications

| Field | Type | Validation | Required | Pre-filled |
|-------|------|-----------|----------|-----------|
| Name | Text | Non-empty | Yes | user?.username |
| Email | Email | Valid format | Yes | user?.email |
| Phone | Tel | 10+ digits | Yes | - |
| Date | Date | Not in past | Yes | - |
| Time | Select | Must choose | Yes | - |
| Vehicle Type | Select | Must choose | Yes | - |
| Vehicle Model | Text | Non-empty | Yes | - |
| Additional Notes | Textarea | Optional | No | - |

---

## 🎯 Available Options

### Time Slots (13 options)
```
09:00, 09:30, 10:00, 10:30, 11:00, 11:30,
14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00
```

### Vehicle Types (8 options)
```
Sedan, SUV, Truck, Van, Coupe, Hatchback, Convertible, Other
```

### Services (6 total)
```
1. Engine Repair
2. Tire Services
3. Detailing
4. Diagnostics
5. Maintenance (NEW)
6. AC Service (NEW)
```

---

## 🔐 Authentication Checks

```javascript
// In ServiceDetailsPage
if (!isAuthenticated) {
  // Show login prompt with buttons to:
  // - /login
  // - /signup
}

if (isAuthenticated) {
  // Show "Book Now" button
  // Render BookingForm on demand
}
```

---

## ✨ Key Implementation Details

### 1. Service Card Click Handler
```javascript
const handleServiceClick = (service) => {
  navigate(`/service/${service.id}`, { state: { service } })
}
```

### 2. Service Details Page Routing
```javascript
<Route path="/service/:serviceId" element={<ServiceDetailsPage />} />
```

### 3. Get Service from Location State
```javascript
const location = useLocation()
const service = location.state?.service || null
```

### 4. Booking Form Submission
```javascript
const bookingData = {
  serviceId, serviceName, ...formData, createdAt: new Date().toISOString()
}
const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
existingBookings.push(bookingData)
localStorage.setItem('bookings', JSON.stringify(existingBookings))
```

---

## 🚀 Integration Points for Backend

### To Connect to Real Backend API:

1. **Update `appointmentService.js`:**
```javascript
createBooking: async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  })
  return response.json()
}
```

2. **Update `BookingForm.jsx` handleSubmit:**
```javascript
// Instead of localStorage:
const result = await appointmentService.createBooking(bookingData)
```

---

## 📝 File Changes Summary

| File | Status | Changes |
|------|--------|---------|
| `App.jsx` | ✏️ Updated | Added route: `/service/:serviceId` |
| `Features.jsx` | ✏️ Updated | Added 2 services, clickable cards, navigation |
| `BookingForm.jsx` | ✨ New | Complete form with validation |
| `ServiceDetailsPage.jsx` | ✨ New | Details page with auth check |
| `AppointmentForm.jsx` | ✏️ Updated | Wrapper for BookingForm |
| `IMPLEMENTATION_SUMMARY.md` | ✨ New | Detailed documentation |
| `USER_FLOW_GUIDE.md` | ✨ New | User journey visualization |

---

**Status**: ✅ All files updated and ready for testing  
**Date**: October 27, 2025  
**Version**: 1.0.0
