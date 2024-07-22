// assets
import { DashboardOutlined, DesktopOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  DesktopOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const Academic = {
  id: 'group-academic',
  title: 'Academic',
  type: 'group',
  children: [
    {
      id: 'classes',
      title: 'Classes',
      type: 'item',
      url: '/classes',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'subject',
      title: 'Subjects',
      type: 'item',
      url: '/subjects',
      icon: icons.DesktopOutlined,
      breadcrumbs: false
    },
    {
      id: 'classSubMap',
      title: 'Mapping',
      type: 'item',
      url: '/classSubMAp',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'students',
      title: 'Students',
      type: 'item',
      url: '/students',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'attendance',
      title: 'Attendance',
      type: 'item',
      url: '/attendance',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      type: 'item',
      url: '/attedance-report',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default Academic;
