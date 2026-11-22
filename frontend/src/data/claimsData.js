// Realistic mock claims matching reference screenshot
export const initialClaims = [
  {
    id: 'CLM-001',
    reportId: 'REP-2025-001',
    itemName: 'Wireless Earbuds',
    claimantName: 'Rahul Sharma',
    claimantEmail: 'rahul.sharma@campus.edu',
    claimantPhone: '+91 98765 43210',
    studentId: 'STU-2023-014',
    department: 'Computer Science',
    submissionDate: '16 Nov, 2025',
    status: 'Pending',
    evidenceAvailable: true,
    evidenceType: 'Purchase Invoice & Bluetooth MAC',
    evidenceUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
    ownershipExplanation: 'Lost near Central Library table 4. Has custom name "Rahul-AirPods" when paired.',
    identificationDetails: 'Valid Student ID Card provided.',
    adminRemarks: '',
    history: [
      { status: 'Pending', date: '16 Nov, 2025 10:15 AM', by: 'System', notes: 'Claim initiated by Rahul Sharma' }
    ]
  },
  {
    id: 'CLM-002',
    reportId: 'REP-2025-002',
    itemName: 'Backpack',
    claimantName: 'Sneha Patil',
    claimantEmail: 'sneha.patil@campus.edu',
    claimantPhone: '+91 98765 43211',
    studentId: 'STU-2022-088',
    department: 'Electronics & Telecommunication',
    submissionDate: '15 Nov, 2025',
    status: 'Under Review',
    evidenceAvailable: true,
    evidenceType: 'ID card inside bag matching student profile',
    evidenceUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    ownershipExplanation: 'Black Puma backpack containing engineering textbooks and student ID card.',
    identificationDetails: 'Cross-verifying student ID card found inside.',
    adminRemarks: 'Admin is verifying ID match with campus registry.',
    history: [
      { status: 'Pending', date: '15 Nov, 2025 02:00 PM', by: 'System', notes: 'Claim submitted' },
      { status: 'Under Review', date: '15 Nov, 2025 03:30 PM', by: 'Admin', notes: 'Under investigation' }
    ]
  },
  {
    id: 'CLM-003',
    reportId: 'REP-2025-003',
    itemName: 'Water Bottle',
    claimantName: 'Aman Verma',
    claimantEmail: 'aman.verma@campus.edu',
    claimantPhone: '+91 98765 43212',
    studentId: 'STU-2024-055',
    department: 'Mechanical Engineering',
    submissionDate: '14 Nov, 2025',
    status: 'Approved',
    evidenceAvailable: true,
    evidenceType: 'Engraved initials photograph',
    evidenceUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    ownershipExplanation: 'Milton stainless steel bottle with initials "AV" scratched on bottom base.',
    identificationDetails: 'Initials confirmed matching claimant name.',
    adminRemarks: 'Claim approved. Awaiting student to pick up.',
    history: [
      { status: 'Pending', date: '14 Nov, 2025 11:00 AM', by: 'System', notes: 'Claim submitted' },
      { status: 'Approved', date: '14 Nov, 2025 04:00 PM', by: 'Admin', notes: 'Ownership validated' }
    ]
  },
  {
    id: 'CLM-004',
    reportId: 'REP-2025-004',
    itemName: 'Laptop Charger',
    claimantName: 'Priya Singh',
    claimantEmail: 'priya.singh@campus.edu',
    claimantPhone: '+91 98765 43213',
    studentId: 'STU-2023-119',
    department: 'Information Technology',
    submissionDate: '13 Nov, 2025',
    status: 'Rejected',
    evidenceAvailable: false,
    evidenceType: 'None',
    evidenceUrl: null,
    ownershipExplanation: 'Lost a 65W charger in Lab 2.',
    identificationDetails: 'Could not provide serial or wattage match.',
    adminRemarks: 'Rejected: Specification mismatch with found 45W charger.',
    history: [
      { status: 'Pending', date: '13 Nov, 2025 09:30 AM', by: 'System', notes: 'Claim submitted' },
      { status: 'Rejected', date: '13 Nov, 2025 01:20 PM', by: 'Admin', notes: 'Wattage and brand mismatch' }
    ]
  },
  {
    id: 'CLM-005',
    reportId: 'REP-2025-005',
    itemName: 'ID Card',
    claimantName: 'Rohan Mehta',
    claimantEmail: 'rohan.mehta@campus.edu',
    claimantPhone: '+91 98765 43214',
    studentId: 'STU-2021-042',
    department: 'Civil Engineering',
    submissionDate: '12 Nov, 2025',
    status: 'Completed',
    evidenceAvailable: true,
    evidenceType: 'Aadhaar / National Identity Match',
    evidenceUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80',
    ownershipExplanation: 'College ID card bearing STU-2021-042.',
    identificationDetails: 'Physical in-person identification done.',
    adminRemarks: 'Card returned to student at admin counter.',
    history: [
      { status: 'Pending', date: '12 Nov, 2025 10:00 AM', by: 'System', notes: 'Claim submitted' },
      { status: 'Approved', date: '12 Nov, 2025 11:30 AM', by: 'Admin', notes: 'Approved' },
      { status: 'Completed', date: '12 Nov, 2025 02:00 PM', by: 'Admin', notes: 'Handover complete' }
    ]
  }
];
