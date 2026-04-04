export const mockUsers = [
  { id: 1, name: 'Admin User', role: 'Admin', email: 'admin@uni.edu' },
  { id: 2, name: 'Student One', role: 'Student', email: 'student1@uni.edu' },
  { id: 3, name: 'Club President', role: 'Club Member', email: 'president@club.edu' },
];

export const mockEvents = [
  {
    id: 101,
    title: 'CodeRed Hackathon 2026',
    date: '2026-04-15',
    time: '08:00 AM - 08:00 PM',
    venue: 'Main Auditorium',
    capacity: 150,
    registeredCount: 150, // FULL
    status: 'Approved',
    audience: 'University Students Only',
    organizer: 'Tech Society',
    category: 'Academic',
    mode: 'Physical',
    deadline: '2026-04-10',
    description: 'A 12-hour intense coding competition. Build innovative solutions for campus problems. Food and drinks provided!',
    featured: true
  },
  {
    id: 102,
    title: 'Global Career Fair',
    date: '2026-05-20',
    time: '09:00 AM - 04:00 PM',
    venue: 'University Grounds',
    capacity: 500,
    registeredCount: 475,
    status: 'Approved',
    audience: 'Open to All',
    organizer: 'Career Guidance Unit',
    category: 'Workshop',
    mode: 'Physical',
    deadline: '2026-05-15',
    description: 'Meet recruiters from top tech companies. Bring your resume and prepare for on-the-spot interviews.',
    featured: true
  },
  {
    id: 103,
    title: 'AI & Data Science Workshop',
    date: '2026-03-25',
    time: '10:00 AM - 01:00 PM',
    venue: 'Zoom (Online)',
    capacity: 100,
    registeredCount: 40, 
    status: 'Approved',
    audience: 'University Students Only',
    organizer: 'AI Club',
    category: 'Workshop',
    mode: 'Online',
    deadline: '2026-03-24',
    description: 'Deep dive into neural networks and machine learning models with industry experts.',
    featured: false
  },
  {
    id: 104,
    title: 'Campus Music Night',
    date: '2026-06-01',
    time: '07:00 PM - 11:30 PM',
    venue: 'Open Air Theater',
    capacity: 300,
    registeredCount: 150, 
    status: 'Approved',
    audience: 'Open to All',
    organizer: 'Arts Council',
    category: 'Cultural',
    mode: 'Physical',
    deadline: '2026-05-28',
    description: 'Enjoy a spectacular night of live bands and DJ performances under the stars.',
    featured: false
  },
  {
    id: 105,
    title: 'Inter-Faculty Sports Meet',
    date: '2025-01-10',
    time: '08:00 AM - 06:00 PM',
    venue: 'University Stadium',
    capacity: 200,
    registeredCount: 50,
    status: 'Approved',
    audience: 'University Students Only',
    organizer: 'Sports Council',
    category: 'Sports',
    mode: 'Physical',
    deadline: '2025-01-05', // Registration Closed
    description: 'Compete in track and field events. Bring glory to your faculty!',
    featured: false
  }
];

export const mockMyEvents = [
  {
    id: 101,
    title: 'CodeRed Hackathon 2026',
    date: '2026-04-15',
    time: '08:00 AM - 08:00 PM',
    venue: 'Main Auditorium',
    capacity: 150,
    registeredCount: 150,
    status: 'Approved',
    audience: 'University Students Only',
    organizer: 'Tech Society',
    category: 'Academic',
    mode: 'Physical',
    deadline: '2026-04-10',
    description: 'A 12-hour intense coding competition.',
    featured: true,
    registrationDate: '2026-03-15'
  },
  {
    id: 103,
    title: 'AI & Data Science Workshop',
    date: '2026-03-25',
    time: '10:00 AM - 01:00 PM',
    venue: 'Zoom (Online)',
    capacity: 100,
    registeredCount: 40, 
    status: 'Approved',
    audience: 'University Students Only',
    organizer: 'AI Club',
    category: 'Workshop',
    mode: 'Online',
    deadline: '2026-03-24',
    description: 'Deep dive into neural networks.',
    featured: false,
    registrationDate: '2026-03-18'
  }
];

export const mockBudgets = [
  { 
    id: 1, 
    event: 'Tech Symposium', 
    introduction: 'A symposium to discuss the latest technology trends in AI and Web Development.',
    objectives: 'Gather 500+ participants and host 5 keynote speakers.',
    equipmentCost: 150000,
    laborCost: 90000,
    materialsCost: 150000,
    miscellaneousCost: 60000,
    amount: 450000, 
    justification: 'This budget is heavily required to secure the main university auditorium and ensure proper catering for the attendees.',
    status: 'Approved' 
  },
  { 
    id: 2, 
    event: 'Art Workshop', 
    introduction: 'A 2-day workshop focusing on watercolor painting techniques.',
    objectives: 'Teach basic techniques to 50 beginners.',
    equipmentCost: 15000,
    laborCost: 30000,
    materialsCost: 30000,
    miscellaneousCost: 15000,
    amount: 90000, 
    justification: 'Covers the high quality paint, brushes, and canvas costs needed for the workshop.',
    status: 'Pending' 
  },
];

export const mockQuizzes = [
  { id: 1, title: 'Tech Symposium Basics', questions: 5 },
  { id: 2, title: 'Art Workshop Recap', questions: 3 },
];

export const mockRequests = [
  {
    id: 'REQ-1001',
    fullName: 'Alice Walker',
    email: 'alice@my.sliit.lk',
    academicYear: 'Year 2',
    requestType: 'Club Management Request',
    description: 'Requesting permission to establish a new CyberSecurity Student Chapter under the IT faculty. We have 50 interested students.',
    status: 'Pending',
    submittedDate: '2026-03-20'
  },
  {
    id: 'REQ-1002',
    fullName: 'Brian Perera',
    email: 'brian@my.sliit.lk',
    academicYear: 'Year 3',
    requestType: 'Event Approval Request',
    description: 'Requesting approval to organize an Inter-Faculty Debate Competition in the main hall. Expected 120 participants across 6 faculties.',
    status: 'Pending',
    submittedDate: '2026-03-22'
  },
  {
    id: 'REQ-1003',
    fullName: 'Chamara Silva',
    email: 'chamara@my.sliit.lk',
    academicYear: 'Year 1',
    requestType: 'Club Management Request',
    description: 'Requesting to form a Photography Club focused on campus events documentation and creative digital media.',
    status: 'Pending',
    submittedDate: '2026-03-23'
  },
  {
    id: 'REQ-1004',
    fullName: 'Dinusha Fernando',
    email: 'dinusha@my.sliit.lk',
    academicYear: 'Year 4',
    requestType: 'Event Approval Request',
    description: 'Seeking approval for a Final Year Project Showcase event inviting industry professionals and alumni as judges.',
    status: 'Pending',
    submittedDate: '2026-03-24'
  }
];

/** Event rows shown on Event Management and in Manage Requests “View status” dialog */
export const mockManagedEvents = [
  { id: 'E-001', title: 'Annual Tech Symposium 2026', date: '2026-08-15', venue: 'Main Hall', capacity: 500, status: 'Approved' },
  { id: 'E-002', title: 'Robotics Workshop: Level 1', date: '2026-09-10', venue: 'Lab 04', capacity: 50, status: 'Pending' },
  { id: 'E-003', title: 'University Cultural Night', date: '2026-10-05', venue: 'Auditorium', capacity: 1200, status: 'Approved' },
  { id: 'E-004', title: 'Freshers Welcome: Faculty of IT', date: '2026-11-20', venue: 'Sports Ground', capacity: 2000, status: 'Rejected' },
];

export const mockFinanceRequests = [
  {
    id: 'REQ-2001',
    name: 'Annual Music Festival Proposal',
    type: 'Event',
    submittedDate: '2026-03-15',
    status: 'Pending',
    description: 'Budget request for arranging sound systems, guest artists, and stage decorations for the annual university music festival.',
    pdfUrl: 'dummy.pdf'
  },
  {
    id: 'REQ-2002',
    name: 'Robotics Club Budget Request',
    type: 'Club',
    submittedDate: '2026-03-18',
    status: 'Pending',
    description: 'Requesting funds for procuring microcontrollers, sensors, and structural components for the upcoming inter-university robotics competition.',
    pdfUrl: 'dummy.pdf'
  },
  {
    id: 'REQ-2003',
    name: 'Sports Meet Expense Proposal',
    type: 'Event',
    submittedDate: '2026-03-20',
    status: 'Pending',
    description: 'Detailed expense report and budget proposal for the annual inter-faculty sports meet, including venue booking and medical team costs.',
    pdfUrl: 'dummy.pdf'
  }
];
