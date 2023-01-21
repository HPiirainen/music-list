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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRight from '@mui/icons-material/ChevronRight';

interface TopBarProps {
  appTitle: string;
}

const TopBar: React.FC<PropsWithChildren<TopBarProps>> = ({
  appTitle,
  children,
}) => {
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar>
        <Typography component="h1" variant="h5">
          {appTitle}
        </Typography>
        <IconButton
          sx={{ marginLeft: 'auto' }}
          color="inherit"
          aria-label="Open filters"
          onClick={() => toggleDrawer(true)}
          size="large"
        >
          <MenuIcon />
        </IconButton>
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
