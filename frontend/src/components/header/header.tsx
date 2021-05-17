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
import AddExpenseDialog from '../dialog/add-expense.dialog';
import AddIncomeDialog from '../dialog/add-income.dialog';

type HeaderProps = {
  isWelcome: boolean,

  refreshTable(): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxHeight: '10vh',
    },
    buttonsBox: {
      minWidth: 400,
      display: 'flex',
      justifyContent: 'center',
    },
    menuButton: {
      marginRight: theme.spacing(3),
    },
    greenText: {
      color: theme.palette.greenText.main
    },
    redText: {
      color: theme.palette.redText.main
    }
  }),
);

const Header: React.FC<HeaderProps> = ({isWelcome, refreshTable}) => {
  const {user} = useContext(AuthContext);
  const classes = useStyles();
  const [openAddIncome, setOpenAddIncome] = React.useState(false);
  const [openAddExpense, setOpenAddExpense] = React.useState(false);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickOnAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleOpenAddIncome = () => {
    setOpenAddIncome(true);
  };

  const handleCloseAddIncome = () => {
    setOpenAddIncome(false);
  };

  const handleOpenAddExpense = () => {
    setOpenAddExpense(true);
  };

  const handleCloseAddExpense = () => {
    setOpenAddExpense(false);
  };

  const handleLogout = () => {
    window.location.assign('logout');
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.root}>

        <Box className={classes.root}>
          <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6">
            Money Manager
          </Typography>
        </Box>

        {!isWelcome &&
        <Box className={classes.buttonsBox}>
            <Box>
                <Button
                    variant="outlined"
                    className={`${classes.menuButton} ${classes.greenText}`}
                    onClick={handleOpenAddIncome}
                >
                    Add income
                </Button>
                <AddIncomeDialog
                    open={openAddIncome}
                    handleClose={handleCloseAddIncome}
                    onSave={refreshTable}
                />
            </Box>

            <Box>
                <Button
                    variant="outlined"
                    className={`${classes.menuButton} ${classes.redText}`}
                    onClick={handleOpenAddExpense}
                >
                    Add expense
                </Button>
                <AddExpenseDialog
                    open={openAddExpense}
                    handleClose={handleCloseAddExpense}
                    onSave={refreshTable}
                />
            </Box>
        </Box>
        }

        <IconButton aria-label="account" onClick={handleClickOnAccountMenu}>
          <AccountCircle fontSize="large"/>
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={accountMenuAnchorEl}
          keepMounted
          open={Boolean(accountMenuAnchorEl)}
          onClose={handleCloseAccountMenu}
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
