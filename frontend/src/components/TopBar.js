import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const TopBar = (props) => {
  const { appTitle } = props;
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => {
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
            {props.children}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  appTitle: PropTypes.string,
};

export default TopBar;
