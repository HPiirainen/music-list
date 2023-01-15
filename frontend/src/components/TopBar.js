import React, { useState } from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRight from '@mui/icons-material/ChevronRight';

const styles = theme => ({
    menuButton: {
        marginLeft: 'auto',
    },
    drawerContent: {
        padding: theme.spacing(1.5),
        maxWidth: 350,
        minWidth: 250,
    },
});

const TopBar = props => {
    const { appTitle, classes } = props;

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = open => {
        setDrawerOpen(open);
    }

    return (
        <AppBar position="sticky" color="secondary">
            <Toolbar>
                <Typography component="h1" variant="h5">{appTitle}</Typography>
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Open filters"
                    onClick={() => toggleDrawer(true)}
                    size="large">
                    <MenuIcon />
                </IconButton>
                <Drawer
                    className={classes.drawer}
                    anchor="right"
                    open={drawerOpen}
                    variant="persistent"
                >
                    <Box className={classes.drawerContent}>
                        <IconButton
                            color="inherit"
                            aria-label="Close filters"
                            onClick={() => toggleDrawer(false)}
                            size="large">
                            <ChevronRight />
                        </IconButton>
                        { props.children }
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

TopBar.propTypes = {
    appTitle: PropTypes.string,
};

export default withStyles(styles)(TopBar);
