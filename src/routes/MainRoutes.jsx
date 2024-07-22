import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
// ..............
const Classes = Loadable(lazy(() => import('pages/components/Classes')));
const Subjects = Loadable(lazy(() => import('pages/components/Subjects')));
const ClassSubjectMapping = Loadable(lazy(() => import('pages/components/ClassSubjectMapping')));
const Attendance = Loadable(lazy(() => import('pages/components/Attendance')));
const AttendanceReport = Loadable(lazy(() => import('pages/components/AttendanceReport')));
const Students = Loadable(lazy(() => import('pages/components/Students')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'classes',
      element: <Classes />
    },
    {
      path: 'subjects',
      element: <Subjects />
    },
    {
      path: 'classSubMAp',
      element: <ClassSubjectMapping />
    },
    {
      path: 'students',
      element: <Students />
    },
    {
      path: 'attendance',
      element: <Attendance />
    },
    {
      path: 'attedance-report',
      element: <AttendanceReport />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
