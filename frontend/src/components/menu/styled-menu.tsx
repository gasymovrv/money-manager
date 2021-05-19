import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuProps } from '@material-ui/core';
import React from 'react';

const StyledMenu = withStyles((theme) => ({}))
((props: MenuProps) => (
  <Menu
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default StyledMenu;