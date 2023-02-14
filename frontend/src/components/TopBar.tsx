import React, { PropsWithChildren, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="sticky"
      color="secondary"
      sx={{ zIndex: theme.zIndex.drawer + 2 }}
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
            onClick={handleDialogOpen}
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
      {/* TODO: Add proper styles for the dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Logout?</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={logout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default TopBar;
