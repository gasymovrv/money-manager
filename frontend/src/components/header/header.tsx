import React, { useContext, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AuthContext } from '../../interfaces/auth-context.interface';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import { AddExpenseDialog, AddIncomeDialog } from '../dialog/add-operation.dialog';
import { exportToXlsxFile } from '../../services/api.service';
import StyledMenu from '../menu/styled-menu';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showError } from '../../actions/error.actions';
import { COMMON_ERROR_MSG } from '../../constants';

type HeaderProps = {
  hasActions?: boolean,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
    },
    buttonsBox: {
      minWidth: 400,
      display: 'flex',
      justifyContent: 'center',
    },
    greenText: {
      color: theme.palette.greenText.main
    },
    redText: {
      color: theme.palette.redText.main
    },
    appBar: {
      marginBottom: theme.spacing(1)
    },
    cursor: {
      cursor: 'pointer'
    },
  }),
);

const Header: React.FC<HeaderProps> = ({hasActions, children}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {user} = useContext(AuthContext);
  const classes = useStyles();
  const [openChildren, setOpenChildren] = useState(false);
  const [openAddIncome, setOpenAddIncome] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOnMainMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasActions) {
      setMainMenuAnchorEl(event.currentTarget);
    }
  };

  const handleClickOnAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleExportToExcel = async () => {
    try {
      await exportToXlsxFile()
    } catch (error) {
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.root}>

        <Box className={classes.root}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClickOnMainMenu}
          >
            <MenuIcon/>
          </IconButton>
          <StyledMenu
            id="main-menu"
            anchorEl={mainMenuAnchorEl}
            keepMounted
            open={Boolean(mainMenuAnchorEl)}
            onClose={() => setMainMenuAnchorEl(null)}
          >
            <MenuItem onClick={handleExportToExcel}>Export to Excel</MenuItem>
          </StyledMenu>

          <Typography
            className={classes.cursor}
            variant="h6"
            onClick={() => history.push('/')}
          >
            Money Manager
          </Typography>
        </Box>

        {hasActions &&
        <Box className={classes.buttonsBox}>
            <Box>
                <Button
                    variant="outlined"
                    className={classes.greenText}
                    onClick={() => setOpenAddIncome(true)}
                >
                    Add income
                </Button>
                <AddIncomeDialog
                    open={openAddIncome}
                    handleClose={() => setOpenAddIncome(false)}
                />
            </Box>

            <Box>
                <Button
                    variant="outlined"
                    className={classes.redText}
                    onClick={() => setOpenAddExpense(true)}
                >
                    Add expense
                </Button>
                <AddExpenseDialog
                    open={openAddExpense}
                    handleClose={() => setOpenAddExpense(false)}
                />
            </Box>

            <Box>
                <Tooltip title="Show filters">
                    <IconButton size="small" onClick={() => setOpenChildren(true)}>
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
        }

        <Box>
          <IconButton aria-label="account" onClick={handleClickOnAccountMenu}>
            <AccountCircle fontSize="large"/>
          </IconButton>
          <StyledMenu
            id="account-menu"
            anchorEl={accountMenuAnchorEl}
            keepMounted
            open={Boolean(accountMenuAnchorEl)}
            onClose={() => setAccountMenuAnchorEl(null)}
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
            <ListItem>

            </ListItem>
            <MenuItem onClick={() => history.push('/profile')}>
              <ListItemText
                primary={user.currentAccount.name}
                secondary={user.currentAccount.currency}
              />
            </MenuItem>
            <MenuItem onClick={() => window.location.assign('logout')}>Logout</MenuItem>
          </StyledMenu>
        </Box>

      </Toolbar>
      <Drawer anchor="top" open={openChildren} onClose={() => setOpenChildren(false)}>
        {children}
      </Drawer>
    </AppBar>
  )
}

export default Header;
