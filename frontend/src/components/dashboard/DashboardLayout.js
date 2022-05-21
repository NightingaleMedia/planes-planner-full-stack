import { useState } from 'react';
import PropTypes from 'prop-types';
import { experimentalStyled, ThemeProvider } from '@material-ui/core/styles';

import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { dashboardInner } from './Dashboard__Styles/dashboardInner.theme';

const DashboardLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const DashboardLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '280px'
  }
}));

const DashboardLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const DashboardLayoutContent = experimentalStyled('div')(({theme}) => ({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch',
  backgroundColor: '#edf0f7'
}));

const DashboardLayout = ({ children }) => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  return (

    <DashboardLayoutRoot>
      <DashboardNavbar onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
      <DashboardSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      <DashboardLayoutWrapper>
        <ThemeProvider theme={dashboardInner}>
          <DashboardLayoutContainer>
            <DashboardLayoutContent>
              {children}
            </DashboardLayoutContent>
          </DashboardLayoutContainer>
        </ThemeProvider>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>

  );
};

DashboardLayout.propTypes = {
  children: PropTypes.any
}

export default DashboardLayout;
