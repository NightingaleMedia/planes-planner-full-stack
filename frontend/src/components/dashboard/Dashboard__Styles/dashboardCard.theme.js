import { createTheme } from '@material-ui/core/styles';

const dashboardCardTheme = createTheme({
  palette: {
    background: {
      paper: '#f7f7f7',
    },
    text: {
      primary: '#1b4ded',
      secondary: '#171c24'
    }
  }
});

export { dashboardCardTheme };
