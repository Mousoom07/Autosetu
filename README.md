# AutoSetu — Gaadi Ki Seva, Poori Shraddha Se

**Aapki Gaadi, Hamari Zimmedari.**

AutoSetu is a booking and workshop-management platform for a multi-brand car service centre in Bengaluru. It replaces phone-tag scheduling with a "book like a train ticket" flow — customers see live technician availability and rupee pricing before they commit, and the shop floor runs off a live job board instead of a whiteboard.

🔗 **Live demo:** [autosetu.vercel.app](https://autosetu.vercel.app/)

---
<img width="1896" height="922" alt="image" src="https://github.com/user-attachments/assets/328d190f-6fa0-430b-8f9c-8fcb36da6e05" />
<img width="1896" height="916" alt="image" src="https://github.com/user-attachments/assets/f5806627-105f-4f66-a74a-2b116988e1b2" />
![Uploading image.png…]()



## ✨ Features

### For customers
- **No-account booking** — book a slot with just a name and mobile number; look up any booking later by phone number
- **Choose seva → technician → slot** — pick the service, see who's free and their specialisation, then lock a real (not promised) time slot
- **Transparent pricing** — starting estimates shown in rupees before booking; nothing extra billed without a call/message first
- **Digital booking chit** — a shareable, printable confirmation with a chit number (e.g. `#AS-48213`), add-to-calendar (`.ics`) support
- **My Appointments** — track, reschedule, or cancel any booking; status flows through Booked → Confirmed → In Progress → Completed
- **Reviews** — customers can leave ratings/reviews that surface on the homepage
- **Reminders** — SMS (1 hour before) and email (evening before) appointment reminders

### For the shop floor (staff portal)
- **Role-based accounts** — Technician, Service Advisor, Front Desk, Shop Manager, approved by a manager before first sign-in
- **Live board** — real-time counts of bookings by status (Booked, Confirmed, In Progress, Completed, Cancelled, No Show)
- **Search & filters** — by customer, date, technician, service, or status; list and calendar views
- **Team profiles** — technician specialisations and availability visible to customers and staff alike

---

## 🛠 Tech Stack

> Update this section to match the actual stack used in this repo.

- Deployed on [Vercel](https://vercel.com/)
- Frontend: _e.g. Next.js / React_
- Styling: _e.g. Tailwind CSS_
- Data/State: _e.g. local storage for demo bookings, or a backend/DB if connected_

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/autosetu.git
cd autosetu

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

> Update to reflect the actual folder layout.

```
autosetu/
├── app/ or pages/       # Routes: Home, Services, My Appointments, Staff Portal
├── components/          # UI components (booking form, chit, job board, etc.)
├── public/               # Static assets
└── ...
```

---

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Home — hero, how it works, pricing at a glance, reviews, FAQs |
| `/services` | Full service catalogue with technician-level pricing and booking flow |
| `/appointments` | Customer booking lookup and management |
| `/staff` | Staff sign-in and live shop-floor job board |

---

## 🏪 About

AutoSetu is modeled on an independent multi-brand service centre on Residency Road, Bengaluru, running since 2013 — insurance-approved, ISO 9001-aligned workshop process, and certified multi-brand technicians using genuine parts (Bosch, MRF, Mobil).

---

## 📄 License

Add your license here (e.g. MIT).

---

## 🙋 Support

For questions about this project, open an issue on this repository.
