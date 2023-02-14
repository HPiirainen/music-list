import React, { PropsWithChildren, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import FilterList from '@mui/icons-material/FilterList';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Lock from '@mui/icons-material/Lock';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  appTitle: string;
}

const TopBar: React.FC<PropsWithChildren<TopBarProps>> = ({
  appTitle,
  children,
}) => {
  const theme = useTheme();
  const { logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="sticky"
      color="secondary"
      sx={{ zIndex: theme.zIndex.drawer + 3 }}
    >
      <Toolbar>
        <Typography component="h1" variant="h5">
          {appTitle}
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton
            sx={{ marginRight: theme.spacing(2) }}
            color="inherit"
            aria-label="Log out"
            onClick={() => logout()}
            size="large"
          >
            <Lock />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Open filters"
            onClick={() => toggleDrawer(true)}
            size="large"
          >
            <FilterList />
          </IconButton>
        </Box>
        <Drawer anchor="right" open={drawerOpen} variant="persistent">
          <Box
            sx={{ padding: theme.spacing(1.5), maxWidth: 350, minWidth: 250 }}
          >
            <IconButton
              color="inherit"
              aria-label="Close filters"
              onClick={() => toggleDrawer(false)}
              size="large"
            >
              <ChevronRight />
            </IconButton>
            {children}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
