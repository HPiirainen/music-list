import React, { ChangeEvent } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';

type SwitchHandler = (state: boolean, genre: string) => void;
type Identifier = string | number;

interface ListSwitchProps {
  identifier: Identifier;
  label: string;
  isChecked: boolean;
  onSwitch: SwitchHandler;
  isDisabled?: boolean;
}

const ListSwitch: React.FC<ListSwitchProps> = ({
  identifier,
  label,
  isChecked,
  onSwitch,
  isDisabled,
}) => {
  const slugify = (text: string | number) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // TODO: These re-render whenever a toggle is switched.
  const labelId = `switch-label-${slugify(identifier)}`;

  const sendState = (e: ChangeEvent, checked: boolean) => {
    onSwitch(checked, label);
  };

  return (
    <ListItem>
      <ListItemIcon>
        <Switch
          color="primary"
          size="small"
          inputProps={{ 'aria-labelledby': labelId }}
          checked={isChecked}
          onChange={sendState}
          disabled={isDisabled}
        />
      </ListItemIcon>
      <ListItemText
        id={labelId}
        disableTypography
        primary={<Typography variant="overline">{label}</Typography>}
      />
    </ListItem>
  );
};

export default ListSwitch;
