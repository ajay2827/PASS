import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider } from '@mui/material/styles';
import { useSession } from '@inrupt/solid-ui-react';
import Logout from '../Login/Logout';
import theme from '../../theme';

const NavMenu = ({ menuId, openMenu, setOpenMenu, anchorEl, setAnchorEl }) => {
  const { session } = useSession();
  const handleMenuClose = () => {
    console.log('Closed!');
    setOpenMenu(false);
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        sx={{ marginTop: '40px' }}
      >
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <a
            href={session.info.webId}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: 'black' }}
          >
            Profile
          </a>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <LogoutIcon />
          </IconButton>
          <Logout />
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
};

export default NavMenu;
