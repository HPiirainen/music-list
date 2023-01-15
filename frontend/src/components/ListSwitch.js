import React from 'react';
import PropTypes from 'prop-types';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    Typography
} from '@mui/material';

const ListSwitch = props => {
    const { identifier, label, isChecked, onSwitch } = props;
    const labelId = `switch-label-${identifier}`;

    const sendState = e => {
        onSwitch(e.target.checked, label);
    }

    return (
        <ListItem>
            <ListItemIcon>
                <Switch
                    color="primary"
                    size="small"
                    inputProps={{ 'aria-labelledby': labelId }}
                    checked={isChecked}
                    onChange={sendState}
                />
            </ListItemIcon>
            <ListItemText
                id={labelId}
                disableTypography
                primary={<Typography variant="overline">{label}</Typography>}
            />
        </ListItem>
    )
}

ListSwitch.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    isChecked: PropTypes.bool,
    onSwitch: PropTypes.func,
};

export default ListSwitch;
