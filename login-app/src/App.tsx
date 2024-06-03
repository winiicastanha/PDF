import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, Description } from '@mui/icons-material';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Login from './pages/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'quill/dist/quill.snow.css';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Logout } from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
const drawerWidth = 240;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Gerador de PDF
          </Typography>
        <IconButton edge="start" color='inherit' aria-label="button-sair">
          <Logout />
        </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex">
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Início" />
            </ListItem>
            <ListItem button component={Link} to="/templates">
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText primary="Templates" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  </ThemeProvider>
  );
};

export default App;
