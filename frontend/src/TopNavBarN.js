import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IconButton } from "rsuite";
import OffRoundIcon from '@rsuite/icons/OffRound';

const TopNavBarN = ({ onLogout, userJsonVal, bookingCount, clearFilters }) => {
  const history = useNavigate();
  const [userID, setUserID] = useState('');
  const getUserId = localStorage.getItem('userid'); //userJsonVal.userid;
  const [token, setToken] = useState(localStorage.getItem('userId'));
  const [backendData, setBackendData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userid');
    setToken(null);
    history('/login');
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  useEffect(() => {
    if (userJsonVal && userJsonVal.userid) {
      const userId = userJsonVal.userid;
      setUserID(userId);
      fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/order-service/user-orders?userid=${userId}`)
        .then((response) => response.json())
        .then((data) => setBackendData(data.length))
        .catch((err) => console.log('Error fetching data:', err));
    }
  }, [userJsonVal]);

  useEffect(() => {
    if (userJsonVal && userJsonVal.userid) {
      const userId = userJsonVal.userid;
      setUserID(userId);
      fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/order-service/user-orders?userid=${userId}`)
        .then((response) => response.json())
        .then((data) => setBackendData(data))
        .catch((err) => console.log('Error fetching data:', err));
    }
  }, [userJsonVal]);

  useEffect(() => {
    if (userID === null) {
      history('/login');
    }
  }, [userID, history]);

  if (!getUserId) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <h2 className="ftco-heading-2">
            <LinkContainer to="/" className="logo">
              <Navbar.Brand>Supremo<span> Rental</span></Navbar.Brand>
            </LinkContainer>
          </h2>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AboutUs">
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AskMe">
                <Nav.Link>Ask Me</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handleModalShow}>Chat With Me</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>

        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chat With Me</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              src="https://example.com" // Replace with the URL you want to embed
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              title="Chat With Me"
            ></iframe>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <h2 className="ftco-heading-2">
            <LinkContainer to="/" className="logo" onClick={clearFilters}>
              <Navbar.Brand>Supremo<span> Rental</span></Navbar.Brand>
            </LinkContainer>
          </h2>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/" onClick={clearFilters}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AboutUs">
                <Nav.Link>About Us</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/AskMe">
                <Nav.Link>Ask Me</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handleModalShow}>Chat With Me</Nav.Link>
            </Nav>
            <Nav>
              <LinkContainer to="/mybookings">
                <Nav.Link><span className='noOfOrder'>{bookingCount ? bookingCount : 0}</span> My Bookings</Nav.Link>
              </LinkContainer>
              <span className='pipeSym nav-link'>|</span>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <span className='pipeSym nav-link'>|</span>
              <span className='nav-link pt-2'>Welcome, <span style={{ color: '#fff' }}>{getUserId ? getUserId : 'Guest'}</span></span>
              <IconButton icon={<OffRoundIcon />} appearance="primary" className='topNavIconSignOut' onClick={handleLogout} />
            </Nav>
          </Navbar.Collapse>
        </Container>

        <Modal show={showModal} onHide={handleModalClose} className='chatWithMeWin'>
          <Modal.Header closeButton>
            <Modal.Title>Chat With Me</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              src="https://132.145.206.251:9200" // Replace with the URL you want to embed
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Chat With Me"
            ></iframe>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      </Navbar>
    );
  }
};

export default TopNavBarN;
