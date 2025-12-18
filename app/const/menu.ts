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
    id: 'data-master',
    label: 'Data Master',
    icon: 'ic:baseline-article',
    to: '/admin/user',
    children: [
      {
        id: 'users',
        label: 'Users',
        to: '/admin/user'
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        to: '/admin/suppliers'
      },
      {
        id: 'products',
        label: 'Products',
        children: [
          {
            id: 'all-products',
            label: 'All Products',
            to: '/dashboard/products/all'
          },
          {
            id: 'categories',
            label: 'Categories',
            children: [
              {
                id: 'main-categories',
                label: 'Main Categories',
                to: '/dashboard/products/categories/main'
              },
              {
                id: 'sub-categories',
                label: 'Sub Categories',
                to: '/dashboard/products/categories/sub'
              },
              {
                id: 'tags',
                label: 'Tags',
                to: '/dashboard/products/categories/tags'
              }
            ]
          },
          {
            id: 'inventory',
            label: 'Inventory',
            to: '/dashboard/products/inventory'
          }
        ]
      }
    ]
  },
  {
    id: 'reports asd',
    label: 'Reports',
    icon: 'ic:baseline-area-chart',
    children: [
      {
        id: 'sales-report',
        label: 'Sales Report',
        children: [
          {
            id: 'daily-sales',
            label: 'Daily Sales',
            to: '/dashboard/reports/sales/daily'
          },
          {
            id: 'monthly-sales',
            label: 'Monthly Sales',
            to: '/dashboard/reports/sales/monthly'
          },
          {
            id: 'yearly-sales',
            label: 'Yearly Sales',
            to: '/dashboard/reports/sales/yearly'
          }
        ]
      },
      {
        id: 'inventory-report',
        label: 'Inventory Report',
        to: '/dashboard/reports/inventory'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        children: [
          {
            id: 'customer-analytics',
            label: 'Customer Analytics',
            to: '/dashboard/reports/analytics/customers'
          },
          {
            id: 'product-analytics',
            label: 'Product Analytics',
            to: '/dashboard/reports/analytics/products'
          }
        ]
      }
    ]
  }
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
