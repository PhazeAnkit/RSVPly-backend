# Mini Event Platform – MERN Stack

RSVPly lets you create events, manage guest responses, and update event details effortlessly. Plan smarter, invite faster, and track RSVPs in real time.

---

## 🚀 Features Implemented

- **User Authentication**
  Secure Sign Up and Login functionalities using JWT (JSON Web Tokens) for stateless session management.

- **Event Management (CRUD)**
  Authenticated users can create, view, edit, and delete events.

- **Ownership Protection**
  Users can only modify or delete events that they personally created.

- **Capacity Enforcement**
  The system strictly enforces the event's defined capacity to prevent overbooking.

- **Concurrency Handling**
  Robust backend logic prevents race conditions when multiple users attempt to RSVP for the last available spot simultaneously.

- **Responsive UI**
  A frontend built with React.js that adapts seamlessly across Desktop, Tablet, and Mobile screen sizes.

---

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js & Express.js
- **Database**: MongoDB Atlas (Cloud‑hosted)
- **Security**: Bcrypt for password hashing and JWT for session management

---

## 🧠 RSVP Booking & Concurrency Strategy

The most critical requirement of this project was the implementation of a fail‑safe RSVP system. To solve the challenge of concurrent registrations, the application utilizes a **Multi‑Layer Consistency Strategy**.

### 1. Database Transactions (ACID)

All operations within the `joinEvent` and `leaveEvent` services are wrapped in a **MongoDB Session Transaction**. This ensures that the user‑to‑event relationship and the event's seat count remain synchronized. If any part of the process fails, the entire operation is rolled back to prevent data corruption.

### 2. Atomic Conditional Updates

To prevent overbooking during high‑concurrency moments, the system avoids the read‑then‑write anti‑pattern. Instead, the `EventRepository` uses a single atomic `updateOne` call with a conditional filter.

```ts
// Atomic seat booking logic
EventModel.updateOne(
  {
    _id: eventId,
    $expr: { $lt: ["$bookedCount", "$eventCapacity"] }, // Server-side capacity check
  },
  { $inc: { bookedCount: 1 } } // Atomic increment
);
```

**How it works**:

- The database engine itself checks if `bookedCount` is less than `eventCapacity` at the exact moment of execution.

**Result**:

- If multiple requests target the last available spot, only the first request satisfies the condition.
- Subsequent requests return a `modifiedCount` of `0`, triggering an **Event Full** error.

### 3. Duplicate Prevention

Using the `$addToSet` operator and `{ eventsJoined: { $ne: eventId } }` filters, the system guarantees that a user can only have one active RSVP per event.

---

## 🔗 Repository Links

- **Frontend Repository**: [Frontend](https://github.com/PhazeAnkit/RSVPly-frontend.git)
- **Backend Repository**: [Backend](https://github.com/PhazeAnkit/RSVPly-backend.git)

---

## 💻 Local Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB Atlas account or a local MongoDB instance

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/PhazeAnkit/RSVPly-backend.git
cd RSVPly-backend
```

#### 2. Server Setup

```bash
npm install
# Create a .env file with the following environment variables
#
# MONGODB_URI=
# JWT_SECRET=
npm run dev
```

---
