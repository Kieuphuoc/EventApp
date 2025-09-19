🎟️ Online Event Management and Booking System

A powerful, modern, and user-friendly platform to create, manage, and experience events seamlessly — from registration to real-time engagement and ticket check-in.

🚀 Features
🔐 User Account Management

Register and login as an Event Organizer or Event Attendee

Sign up as an Attendee using your Google Account

Secure OAuth2 authentication and role-based access control

📅 Event Creation

Organizers can create events with title, date/time, location, ticket info, and media

Google Maps integration to show event location automatically

🎫 Online Ticket Booking

Attendees can search and filter events by category (music, sports, workshops, etc.)

Book tickets and pay via MoMo, VNPAY, and other gateways

Receive a QR Code ticket instantly and confirmation email

📲 QR Code Check-in

Staff can scan tickets using QR codes

Attendees just need to bring their phone for check-in

🔔 Notifications & Reminders

Get notified via email when event details are updated

Receive reminders before events start

⭐ Event Reviews & Ratings

Leave ratings, feedback, and comments after attending events

Organizers gain insights for quality improvement

📊 Realtime Analytics

Organizers access dashboards showing ticket sales, revenue, and user interests

Data visualized with interactive charts and graphs

💬 Real-time Chat

Attendees can chat with organizers through an in-app chatroom

Some Screen bellow: 

<img src="https://github.com/user-attachments/assets/f633854d-e455-4755-9db8-dfe09fd6d8ba" width="200" />


🛠️ Tech Stack
| Component     | Technology            |
|---------------|------------------------|
| **Frontend**  | React Native           |
| **Backend**   | Django    |
| **Database**  | MySQL     |
| **Auth**      | OAuth2                    |
| **Audio Storage** | Cloudinary              |
| **Payment** | Momo |

# 1. Clone the repository
git clone https://github.com/KieuPhuoc/EventApp.git

# 2. Install dependencies
cd EventApp
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start development server
npm run dev
