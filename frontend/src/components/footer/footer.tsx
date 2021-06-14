import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Link, Typography } from '@material-ui/core';
import { getVersion } from '../../services/api.service';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      color: theme.palette.secondary.dark,
      height: 30,
      backgroundColor: theme.palette.background.default,
    },
    boxMargin: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2)
    }
  }),
);

const Footer: React.FC = () => {
  const classes = useStyles();
  const [version, setVersion] = useState<string>();
  const [isLoadingVersion, setLoadingVersion] = useState<boolean>(true);

  const loadVersion = () => {
    let mounted = true;
    (async () => {
      if (mounted) {
        try {
          const ver = await getVersion();
          setVersion(ver);
          setLoadingVersion(false);
        } catch (err) {
          console.log(`Getting version error: ${err}`);
        }
      }
    })();
    return () => {
      mounted = false
    };
  }

  useEffect(loadVersion, []);

  return (
    <footer className={classes.root}>
      {
        !isLoadingVersion &&
        <Box className={classes.boxMargin}>
            <Typography variant="subtitle2">
                v{version}
            </Typography>
        </Box>
      }
      <Box className={classes.boxMargin}>
        <Typography variant="subtitle2">
          Developed by: Gasymov R.V.
        </Typography>
      </Box>
      <Box className={classes.boxMargin}>
        <Link color="inherit" href="https://github.com/gasymovrv/money-manager">
          <Typography variant="subtitle2">Github</Typography>
        </Link>
      </Box>
    </footer>
  )
}

export default Footer;
