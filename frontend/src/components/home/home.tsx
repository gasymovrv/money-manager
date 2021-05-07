import React from 'react';
import MainTable from '../main-table/main-table';
import Header from '../header/header';
import { Container } from '@material-ui/core';

const Home: React.FC = () => (
  <Container maxWidth="xl">
    <Header/>
    <MainTable/>
  </Container>
)

export default Home;