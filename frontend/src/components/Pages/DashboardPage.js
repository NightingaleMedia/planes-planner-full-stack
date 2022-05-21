import React from 'react';
import ClientOnly from '../Assets/ClientOnly';
import DashboardLayout from '../dashboard/DashboardLayout';
import PropTypes from 'prop-types';
import Router from 'next/router';
import nProgress from 'nprogress';
import { Box } from '@material-ui/core';

Router.events.on('routeChangeStart', () => {
  nProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  nProgress.done();
});

const DashboardPage = ({ children }) => (
  <DashboardLayout>
    <ClientOnly>
      <Box sx={{ mx: 'auto', my: 4, maxWidth: '95%', minHeight: '90vh' }}>
        {children}
      </Box>
    </ClientOnly>
  </DashboardLayout>
);

DashboardPage.propTypes = {
  children: PropTypes.any,
};

export default DashboardPage;
