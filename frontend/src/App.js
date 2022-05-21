import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import './i18n';
import SplashScreen from './components/SplashScreen';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import routes from './routes';
import { createCustomTheme } from './theme';
import { initialSettings } from './contexts/SettingsContext';

const App = () => {
  const content = useRoutes(routes);
  // This is if we want to create and save settings
  // const { settings } = useSettings();
  const settings = initialSettings;
  const auth = useAuth();

  useScrollReset();

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  console.log({ theme });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" />
      {auth.isInitialized ? content : <SplashScreen />}
    </ThemeProvider>
  );
};

export default App;
