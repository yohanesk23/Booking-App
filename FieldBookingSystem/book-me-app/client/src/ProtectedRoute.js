/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { isMobile, isTablet } from "react-device-detect";

import { useAuth } from "./hook/useAuthentication";

const ProtectedRoute = ({ children }) => {
  const [userName, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [validated, setValidated] = useState(false);
  const { isLoggedIn, signIn, errors, isLoading, getUser } = useAuth();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getUser();
  }, [isLoading]);

  useEffect(() => {
    if (!isLoggedIn) {
      handleShow();
    }
  }, [isLoggedIn]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
    } else {
      signIn(userName, password);
    }

    setValidated(true);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center w-100 my-5">
        <Spinner animation="border" role="status" variant={"light"}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    if (!isLoggedIn) {
      return (
        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName={isMobile || isTablet ? "w-100" : "w-50"}
          centered
        >
          <Modal.Body>
            <h2 className="text-center">BookMe</h2>
            <p className="text-center">
              To get admin access, please login to continue.
            </p>
            {errors && <Alert variant={"danger"}>{errors.message}</Alert>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter password.
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      );
    } else {
      return children;
    }
  }
};

export default ProtectedRoute;
