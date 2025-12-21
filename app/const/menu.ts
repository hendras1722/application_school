export const dataManagementMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: 'ic:outline-analytics'
  },
  {
    id: 'students',
    label: 'Daftar Siswa',
    to: '/admin/daftar-siswa',
    icon: 'lucide:user'
  },
  {
    id: 'teachers',
    label: 'Daftar Guru',
    to: '/admin/daftar-guru',
    icon: 'lucide:users'
  },
  {
    id: 'mapel',
    label: 'Mata Pelajaran',
    to: '/admin/mata-pelajaran',
    icon: 'lucide:book'
  },
  {
    id: 'announcement',
    label: 'Pengumuman',
    to: '/admin/pengumuman',
    icon: 'lucide:bell'
  },
];

export const settingsMenu = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'tabler:settings',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        to: '/dashboard/settings/profile'
      },
      {
        id: 'security',
        label: 'Security',
        children: [
          {
            id: 'change-password',
            label: 'Change Password',
            to: '/dashboard/settings/security/password'
          },
          {
            id: 'two-factor',
            label: 'Two-Factor Auth',
            to: '/dashboard/settings/security/2fa'
          },
          {
            id: 'sessions',
            label: 'Active Sessions',
            to: '/dashboard/settings/security/sessions'
          }
        ]
      },
      {
        id: 'preferences',
        label: 'Preferences',
        to: '/dashboard/settings/preferences'
      }
    ]
  }
];
