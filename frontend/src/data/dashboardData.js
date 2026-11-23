// Analytics curve matching exact values in reference image
export const analyticsTrendData = {
  'Last 6 Months': [
    { period: 'Jun', reports: 70, claims: 42 },
    { period: 'Jul', reports: 90, claims: 62 },
    { period: 'Aug', reports: 110, claims: 70 },
    { period: 'Sep', reports: 92, claims: 60 },
    { period: 'Oct', reports: 118, claims: 80 },
    { period: 'Nov', reports: 136, claims: 80 }
  ],
  'Last 7 Days': [
    { period: 'Mon', reports: 12, claims: 6 },
    { period: 'Tue', reports: 18, claims: 10 },
    { period: 'Wed', reports: 15, claims: 8 },
    { period: 'Thu', reports: 22, claims: 14 },
    { period: 'Fri', reports: 26, claims: 16 },
    { period: 'Sat', reports: 19, claims: 12 },
    { period: 'Sun', reports: 14, claims: 9 }
  ],
  'Last 30 Days': [
    { period: 'W1', reports: 34, claims: 18 },
    { period: 'W2', reports: 42, claims: 24 },
    { period: 'W3', reports: 50, claims: 32 },
    { period: 'W4', reports: 46, claims: 28 }
  ],
  'This Year': [
    { period: 'Q1', reports: 240, claims: 150 },
    { period: 'Q2', reports: 310, claims: 190 },
    { period: 'Q3', reports: 380, claims: 240 },
    { period: 'Q4', reports: 420, claims: 270 }
  ]
};

export const claimsBreakdownData = [
  { name: 'Pending', value: 24, color: '#F59E0B' },
  { name: 'Under Review', value: 32, color: '#3B82F6' },
  { name: 'Approved', value: 120, color: '#10B981' },
  { name: 'Rejected', value: 18, color: '#EF4444' },
  { name: 'Returned', value: 95, color: '#8B5CF6' }
];

export const categoryDistributionData = [
  { name: 'Electronics', count: 94, fill: '#1B5CE2' },
  { name: 'Wallets & Bags', count: 52, fill: '#10B981' },
  { name: 'ID Cards & Keys', count: 48, fill: '#F59E0B' },
  { name: 'Clothing', count: 32, fill: '#8B5CF6' },
  { name: 'Water Bottles', count: 22, fill: '#06B6D4' }
];

export const adminProfileData = {
  name: 'Admin',
  role: 'Campus Administrator',
  badge: 'Admin',
  email: 'admin@campus.edu',
  phone: '+91 98765 00000',
  office: 'Central Admin Building, Room 102',
  joinedDate: 'July 2024',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  securityLevel: 'Super Administrator'
};
