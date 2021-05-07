import React, { useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AuthContext } from '../../interfaces/auth-context.interface';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxHeight: '10vh',
    },
    menuButton: {
      backgroundColor: theme.palette.primary.light,
      fontWeight: 'bold',
      marginRight: theme.spacing(5),
    },
    greenText: {
      color: theme.palette.greenText.main
    },
    redText: {
      color: theme.palette.redText.main
    }
  }),
);

const Header: React.FC = (props) => {
  const {user} = useContext(AuthContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.location.assign('logout');
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.root}>
        <Box className={classes.root}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6">
            Money Manager
          </Typography>
        </Box>
        <Box>
          <Button variant="outlined" className={`${classes.menuButton} ${classes.greenText}`}>
            Add income
          </Button>
          <Button variant="outlined" className={`${classes.menuButton} ${classes.redText}`}>
            Add expense
          </Button>
        </Box>
        <IconButton aria-label="account" onClick={handleClick}>
          <AccountCircle fontSize="large"/>
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar
                alt="Avatar"
                src={user.picture}
              />
            </ListItemAvatar>
            <ListItemText primary={user.name}/>
          </ListItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header;
