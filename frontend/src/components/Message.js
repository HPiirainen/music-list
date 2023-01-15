import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Snackbar } from '@mui/material';
import { Alert, AlertTitle } from '@mui/lab';

const styles = theme => ({
    title: {
        textTransform: 'capitalize',
    },
    list: {
        padding: theme.spacing(0, 0, 0, 2),
        margin: 0,
    },
    alert: {
        minWidth: 350,
    },
});

const Message = props => {
    const { classes, message, onClear, duration } = props;

    const onClose = (event, reason) => {
        if ( reason === 'clickaway' ) {
            return;
        }
        onClear();
    };

    if ('message' in message) {
        let content = message.message;
        if (Array.isArray(content)) {
            console.log(content);
            content = content.map((msg, index) => <li key={index}>{msg}</li>);
            content = <ul className={classes.list}>{content}</ul>;
        }
        return (
            <Snackbar
                open={true}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                autoHideDuration={duration}
                onClose={onClose}
            >
                <Alert severity={message.type} variant="filled" className={classes.alert}>
                    <AlertTitle className={classes.title}>{message.type}</AlertTitle>
                    {content}
                </Alert>
            </Snackbar>
        );
    }
    return null;
};

Message.propTypes = {
    message: PropTypes.object.isRequired,
    onClear: PropTypes.func,
    duration: PropTypes.number,
};

Message.defaultProps = {
    duration: 10000,
};

export default withStyles(styles)(Message);
