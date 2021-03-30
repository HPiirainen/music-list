import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRight from '@material-ui/icons/ChevronRight';

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
                >
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
                        >
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
