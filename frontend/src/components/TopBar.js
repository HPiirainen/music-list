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

const styles = theme => ({
    menuButton: {
        marginLeft: 'auto',
    },
    drawerContent: {
        padding: theme.spacing(3, 2),
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
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6">{appTitle}</Typography>
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    className={classes.drawer}
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => toggleDrawer(false)}
                >
                    <Box className={classes.drawerContent}>
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
