# ADVANCED FEATURES IMPLEMENTED (FULL MARKS SECTION)

## A. Real-Time Chat System (WebSockets)
**Implemented using Socket.io**
Allows secure real-time messaging between:
- Survivor ↔ Counsellor
- Survivor ↔ Legal Advisor

**Features:**
- Delivered & Seen status
- Typing indicator
- Auto-scroll
- Separate chat rooms for each session
- Messages stored in MongoDB

**Condition Used:**
- Chat only activates when survivor is authenticated
- Counsellor must be verified by admin

## B. CAPTCHA Enabled Authentication
**Used Google reCAPTCHA v2** (Note: Currently implemented with `svg-captcha` for local development)
Added in both Register + Login

**Purpose:**
- Prevent bots
- Protect survivor data

**Condition Used:**
- If CAPTCHA fails → block login attempt
- If multiple failures → cooldown timeout

## C. Dashboard with Analytics & Charts
**Implemented using Chart.js / Recharts**

**Admin Dashboard Shows:**
- Number of active survivors
- Number of counsellors & legal advisors
- Cases by severity
- Monthly reports of help requests
- Open vs Closed support cases

**Condition Used:**
- Only admin sees global stats
- Survivors see only their personal progress chart

## D. Push Notifications System
**Implemented using:**
- Browser Notifications API
- In-app toast notifications (React Toastify)

**Notifications Sent When:**
- Counsellor sends a message
- Legal advisor updates case status
- Admin assigns new counsellor
- Survivor receives safety alert

## E. Payment Gateway
**Implemented using Razorpay / Stripe**
Used for voluntary donations for NGO support.

**Conditions:**
- Minimum donation amount set
- Auto email receipt
- Payment status stored in MongoDB

## F. Role-Based Protected Routes
**Implemented with JWT + React Router**

**Roles:**
- Admin
- Victim/Survivor
- Counsellor
- Legal Advisor

**Condition Used:**
- Admin → can manage all data
- Counsellor → can only access assigned survivors
- Survivor → only their personal dashboard
- Legal Advisor → only legal documents + assigned cases

## G. CRUD Modules with Real-Time Updates
- Legal Rights (Legal Advisor/Admin)
- Support Services (Admin)
- Counsellor Notes (Counsellor)
- Survivor Case Updates (Backend stored)

**Conditions Used:**
- Update allowed only by the role owner
- Every update logged with timestamp
- Real-time UI update after CRUD

## H. Emergency Safe Exit Mode (Unique Feature)
One-click redirects user to Google instantly
- Clears session history
- Removes chat traces from session storage

**Condition Used:**
- Activated only when user feels unsafe
- Quick wipe of sensitive data

## I. Multi-Language Support
**Implemented using i18n**
Supported languages:
- English
- Telugu
- Hindi

**Condition Used:**
- Remembers selected language in localStorage

## J. Dark/Light Mode Toggle
Safe visual environment Uses CSS variables + localStorage
