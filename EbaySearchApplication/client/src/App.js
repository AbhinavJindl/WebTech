import './App.css';
import React, {useEffect} from 'react';
import { Container } from 'react-bootstrap';
import ProductSearch from './ProductSearch';
import { fetchCurrentLocation, fetchWishList } from './Api';
import { connect } from 'react-redux';

function App(props) {
  useEffect(() => {
    fetchWishList();
    fetchCurrentLocation();
  }, []);

  return (
    <Container>
      <ProductSearch/>
    </Container>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
