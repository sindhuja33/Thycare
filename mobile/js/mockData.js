/* CareConnect — mock data (no backend, all fake) */

const MOCK = {
  user: {
    id: "USR-10293",
    name: "Sindhuja Stephen Raj",
    email: "sindhujastephenraj33@gmail.com",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?img=47",
    membership: "Premium",
    kycVerified: true,
    address: "12, Lakeview Apartments, Anna Nagar, Chennai, Tamil Nadu 600040",
    joined: "2024-11-03"
  },

  services: [
    {
      id: "srv-attender",
      name: "Patient Attender",
      description: "Trained attenders for round-the-clock support with daily activities, mobility and monitoring.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
      startingPrice: 899,
      unit: "per shift",
      rating: 4.8,
      reviews: 1240,
      icon: "user-round"
    },
    {
      id: "srv-babysitter",
      name: "Baby Sitter",
      description: "Certified, background-verified babysitters for infants and toddlers at your home.",
      image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
      startingPrice: 699,
      unit: "per shift",
      rating: 4.9,
      reviews: 860,
      icon: "baby"
    },
    {
      id: "srv-eldercare",
      name: "Elder Care",
      description: "Compassionate caregivers specialized in elderly assistance, mobility and companionship.",
      image: "https://images.unsplash.com/photo-1580281657702-257584239a55?w=600&q=80",
      startingPrice: 999,
      unit: "per shift",
      rating: 4.7,
      reviews: 2010,
      icon: "heart-handshake"
    },
    {
      id: "srv-mothercare",
      name: "Mother Care",
      description: "Postnatal care specialists supporting new mothers with recovery and newborn care.",
      image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600&q=80",
      startingPrice: 1099,
      unit: "per shift",
      rating: 4.9,
      reviews: 540,
      icon: "flower"
    },
    {
      id: "srv-postsurgery",
      name: "Post Surgery Care",
      description: "Skilled nursing support for wound care, medication and recovery after surgery.",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
      startingPrice: 1299,
      unit: "per shift",
      rating: 4.8,
      reviews: 375,
      icon: "bandage"
    },
    {
      id: "srv-nursing",
      name: "Nursing Assistant",
      description: "Registered nursing assistants for injections, vitals monitoring and clinical support.",
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&q=80",
      startingPrice: 1199,
      unit: "per shift",
      rating: 4.9,
      reviews: 980,
      icon: "stethoscope"
    }
  ],

  plans: [
    {
      id: "plan-basic",
      name: "Basic",
      price: 0,
      period: "forever",
      color: "slate",
      benefits: [
        "Book up to 2 services / month",
        "Standard caregiver matching",
        "Email support",
        "Pay per booking"
      ],
      discount: "No discount",
      priorityBooking: false,
      emergencySupport: false
    },
    {
      id: "plan-premium",
      name: "Premium",
      price: 499,
      period: "month",
      color: "blue",
      popular: true,
      benefits: [
        "Unlimited bookings",
        "10% discount on every booking",
        "Priority caregiver matching",
        "24/7 chat support",
        "Free report storage"
      ],
      discount: "10% off all bookings",
      priorityBooking: true,
      emergencySupport: false
    },
    {
      id: "plan-premium-plus",
      name: "Premium+",
      price: 999,
      period: "month",
      color: "green",
      benefits: [
        "Everything in Premium",
        "20% discount on every booking",
        "Emergency same-day support",
        "Dedicated relationship manager",
        "Free health checkup every quarter"
      ],
      discount: "20% off all bookings",
      priorityBooking: true,
      emergencySupport: true
    }
  ],

  patients: [
    {
      id: "pat-001",
      name: "Lakshmi Stephen",
      relationship: "Mother",
      age: 68,
      gender: "Female",
      conditions: ["Diabetes", "Hypertension"],
      photo: "https://i.pravatar.cc/150?img=45",
      reports: [
        { name: "Blood Sugar Report - Jun 2026.pdf", size: "1.2 MB", date: "2026-06-12" },
        { name: "ECG Report - Apr 2026.pdf", size: "860 KB", date: "2026-04-02" }
      ]
    },
    {
      id: "pat-002",
      name: "Stephen Raj",
      relationship: "Father",
      age: 72,
      gender: "Male",
      conditions: ["Parkinson's Disease"],
      photo: "https://i.pravatar.cc/150?img=52",
      reports: [
        { name: "Neurology Consult - May 2026.pdf", size: "2.1 MB", date: "2026-05-20" }
      ]
    },
    {
      id: "pat-003",
      name: "Aadhya",
      relationship: "Daughter",
      age: "2 Years",
      gender: "Female",
      conditions: ["Healthy"],
      photo: "https://i.pravatar.cc/150?img=48",
      reports: []
    }
  ],

  caregivers: [
    {
      id: "cg-001",
      name: "Priya Raman",
      photo: "https://i.pravatar.cc/150?img=32",
      experience: "8 Years",
      rating: 4.9,
      completedServices: 865,
      languages: ["Tamil", "English"],
      verified: true,
      phone: "+91 90031 55210"
    },
    {
      id: "cg-002",
      name: "Muthu Kumar",
      photo: "https://i.pravatar.cc/150?img=13",
      experience: "6 Years",
      rating: 4.8,
      completedServices: 612,
      languages: ["Tamil", "English", "Telugu"],
      verified: true,
      phone: "+91 89012 44378"
    },
    {
      id: "cg-003",
      name: "Fathima Begum",
      photo: "https://i.pravatar.cc/150?img=44",
      experience: "10 Years",
      rating: 5.0,
      completedServices: 1204,
      languages: ["Tamil", "Urdu", "English"],
      verified: true,
      phone: "+91 93841 20095"
    }
  ],

  bookings: [
    {
      id: "CC-BK-88213",
      service: "Elder Care",
      patient: "Lakshmi Stephen",
      amount: 999,
      date: "2026-07-29",
      time: "09:00 AM",
      duration: "12 hours",
      status: "upcoming",
      caregiver: "Priya Raman",
      address: "12, Lakeview Apartments, Anna Nagar, Chennai"
    },
    {
      id: "CC-BK-88190",
      service: "Post Surgery Care",
      patient: "Stephen Raj",
      amount: 1299,
      date: "2026-07-15",
      time: "08:00 AM",
      duration: "24 hours",
      status: "completed",
      caregiver: "Muthu Kumar",
      address: "12, Lakeview Apartments, Anna Nagar, Chennai",
      rating: 5
    },
    {
      id: "CC-BK-88104",
      service: "Baby Sitter",
      patient: "Aadhya",
      amount: 699,
      date: "2026-06-30",
      time: "02:00 PM",
      duration: "6 hours",
      status: "completed",
      caregiver: "Fathima Begum",
      address: "12, Lakeview Apartments, Anna Nagar, Chennai",
      rating: 4
    },
    {
      id: "CC-BK-88067",
      service: "Nursing Assistant",
      patient: "Lakshmi Stephen",
      amount: 1199,
      date: "2026-06-18",
      time: "10:00 AM",
      duration: "8 hours",
      status: "cancelled",
      caregiver: null,
      address: "12, Lakeview Apartments, Anna Nagar, Chennai"
    },
    {
      id: "CC-BK-88012",
      service: "Patient Attender",
      patient: "Stephen Raj",
      amount: 899,
      date: "2026-06-05",
      time: "07:00 AM",
      duration: "12 hours",
      status: "rejected",
      caregiver: null,
      address: "12, Lakeview Apartments, Anna Nagar, Chennai",
      reason: "No caregivers available in your area at selected time"
    }
  ],

  notifications: [
    { id: 1, title: "Booking Confirmed", body: "Your Elder Care booking CC-BK-88213 has been confirmed with Priya Raman.", time: "10 min ago", type: "success", read: false },
    { id: 2, title: "Caregiver Assigned", body: "Priya Raman has been assigned to your booking for Lakshmi Stephen.", time: "35 min ago", type: "info", read: false },
    { id: 3, title: "Payment Successful", body: "₹999 paid successfully for booking CC-BK-88213.", time: "40 min ago", type: "success", read: false },
    { id: 4, title: "Booking Reminder", body: "Your caregiver arrives tomorrow at 09:00 AM. Please keep reports ready.", time: "2 hours ago", type: "info", read: true },
    { id: 5, title: "Rate Your Experience", body: "How was your Post Surgery Care service with Muthu Kumar?", time: "1 day ago", type: "info", read: true },
    { id: 6, title: "Booking Completed", body: "Your booking CC-BK-88190 has been marked completed.", time: "1 day ago", type: "success", read: true },
    { id: 7, title: "Premium Renewal", body: "Your Premium plan renews on 05 Aug 2026.", time: "2 days ago", type: "info", read: true },
    { id: 8, title: "Booking Cancelled", body: "Booking CC-BK-88067 was cancelled as per your request.", time: "3 days ago", type: "error", read: true },
    { id: 9, title: "New Service Added", body: "Nursing Assistant service is now available in your area.", time: "4 days ago", type: "info", read: true },
    { id: 10, title: "KYC Verified", body: "Your identity verification is complete. You're all set!", time: "5 days ago", type: "success", read: true },
    { id: 11, title: "Special Offer", body: "Get 20% off your next booking with Premium+. Upgrade now.", time: "6 days ago", type: "info", read: true },
    { id: 12, title: "Booking Rejected", body: "Booking CC-BK-88012 could not be assigned. Reports were not available in your area.", time: "1 week ago", type: "error", read: true },
    { id: 13, title: "Report Uploaded", body: "Blood Sugar Report for Lakshmi Stephen uploaded successfully.", time: "1 week ago", type: "success", read: true },
    { id: 14, title: "Welcome to CareConnect", body: "Thanks for joining CareConnect! Book your first home service today.", time: "2 weeks ago", type: "info", read: true },
    { id: 15, title: "Profile Updated", body: "Your profile details were updated successfully.", time: "2 weeks ago", type: "info", read: true }
  ],

  faqs: [
    { q: "What is CareConnect?", a: "CareConnect is a doorstep home healthcare platform that connects you with verified caregivers, attenders, and nursing assistants for in-home care. We do not provide hospital services." },
    { q: "How do I book a caregiver?", a: "Go to Home, choose a service, select the patient, pick date/time/duration, add requirements, upload reports if needed, confirm the address, review and submit your booking." },
    { q: "How are caregivers verified?", a: "All caregivers undergo background checks, ID verification, and skill assessment before being onboarded to CareConnect." },
    { q: "Can I cancel a booking?", a: "Yes, you can cancel any upcoming booking from the Bookings page before the caregiver is dispatched. Cancellation charges may apply within 24 hours of the scheduled time." },
    { q: "What if I need to book urgently?", a: "Premium+ members get access to Emergency Support for same-day caregiver assignment, subject to availability in your area." },
    { q: "How does payment work?", a: "Payment is collected after a caregiver is assigned to your booking. We accept UPI, cards, and net banking." },
    { q: "Can I add multiple patients?", a: "You can add up to 3 patient profiles under your account, each with their own medical details and reports." },
    { q: "What areas do you serve?", a: "CareConnect currently operates in select cities. You can check serviceability by entering your address during booking." },
    { q: "How do subscriptions work?", a: "Subscriptions give you discounts, priority booking and extra support. You can upgrade, downgrade or cancel anytime from the Subscription page." },
    { q: "Is my medical data secure?", a: "Yes, all uploaded reports and medical information are encrypted and only shared with your assigned caregiver for the duration of the service." }
  ],

  promos: [
    { title: "20% OFF", subtitle: "on your first Elder Care booking", color: "from-blue-600 to-blue-500" },
    { title: "Upgrade to Premium+", subtitle: "Unlock emergency same-day care", color: "from-green-600 to-green-500" },
    { title: "Refer & Earn ₹200", subtitle: "Invite friends to CareConnect", color: "from-indigo-600 to-blue-500" }
  ]
};

// expose globally (no modules, plain script includes)
window.MOCK = MOCK;
