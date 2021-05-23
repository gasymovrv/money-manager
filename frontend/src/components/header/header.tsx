import React, { useContext, useState } from 'react';
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
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import { AddExpenseDialog, AddIncomeDialog } from '../dialog/add-operation.dialog';
import { exportToXlsxFile } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import StyledMenu from '../menu/styled-menu';

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
      height: 50,
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
  const [error, setError] = useState<boolean>(false);
  const [openAddIncome, setOpenAddIncome] = React.useState(false);
  const [openAddExpense, setOpenAddExpense] = React.useState(false);
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickOnMainMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isWelcome) {
      setMainMenuAnchorEl(event.currentTarget);
    }
  };

  const handleClickOnAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMainMenu = () => {
    setMainMenuAnchorEl(null);
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

  const handleExportToExcel = async () => {
    setError(false);
    try {
      await exportToXlsxFile()
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.root}>

          <Box className={classes.root}>
            <IconButton
              className={classes.menuButton}
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
              onClose={handleCloseMainMenu}
            >
              <MenuItem onClick={handleExportToExcel}>Export to Excel</MenuItem>
            </StyledMenu>
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
                      onAction={refreshTable}
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
                      onAction={refreshTable}
                  />
              </Box>
          </Box>
          }

          <IconButton aria-label="account" onClick={handleClickOnAccountMenu}>
            <AccountCircle fontSize="large"/>
          </IconButton>
          <StyledMenu
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
          </StyledMenu>

        </Toolbar>
      </AppBar>
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  )
}

export default Header;
