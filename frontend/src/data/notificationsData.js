// Notifications matching the exact reference screenshot
export const initialNotifications = [
  {
    id: 'NOTIF-01',
    title: 'New Claim',
    message: 'New claim submitted for Wireless Earbuds',
    time: '2 min ago',
    type: 'claim',
    read: false,
    link: '/admin/claims/CLM-001'
  },
  {
    id: 'NOTIF-02',
    title: 'Report Approved',
    message: 'Report #RP-042 has been approved',
    time: '10 min ago',
    type: 'success',
    read: false,
    link: '/admin/reports'
  },
  {
    id: 'NOTIF-03',
    title: 'Claim Under Review',
    message: 'Claim #CLM-002 is under review',
    time: '30 min ago',
    type: 'review',
    read: false,
    link: '/admin/claims/CLM-002'
  },
  {
    id: 'NOTIF-04',
    title: 'New Found Item',
    message: 'New found item reported: Water Bottle',
    time: '1 hour ago',
    type: 'item',
    read: true,
    link: '/admin/reports'
  }
];
