import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Link, Typography } from '@material-ui/core';
import { getVersion } from '../../services/api.service';
import { useEffectCallback } from '../../helpers/common.helper';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2vh',
      color: theme.palette.type === 'dark'
        ? theme.palette.secondary.dark
        : theme.palette.secondary.light,
      backgroundColor: theme.palette.background.default,
    },
    boxMargin: {
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(5)
    }
  }),
);

const Footer: React.FC = () => {
  const classes = useStyles();
  const [version, setVersion] = useState<string>();
  const [isLoadingVersion, setLoadingVersion] = useState<boolean>(true);

  const loadVersion = useEffectCallback({
    asyncFunctions: [getVersion],
    successActions: [(version: any) => {
      setVersion(version);
      setLoadingVersion(false);
    }],
    errorActions: [(err: any) => {
      console.log(`Getting version error: ${err}`)
    }]
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Developed by R.Gasymov
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
