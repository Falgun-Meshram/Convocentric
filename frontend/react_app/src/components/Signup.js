import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Modal, Alert } from 'react-bootstrap';
import '../css/Signup.css';
import axios from 'axios';

export default function SignUp() {

    const navigate = useNavigate();

    const [userName, updateUserName] = useState("");
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [confirm, updateConfirm] = useState("");
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [existingUsername, setExistingUsername] = useState(false);
    const [existingEmail, setExistingEmail] = useState(false);
    const [show, setShow] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

        }, 1000);
        return () => {
            if (seconds === 1 && signUpSuccess)
                navigate("/chat");
            clearInterval(myInterval);
        };
    });

    const handleClose = () => setShow(false);

    const handleUserName = ({ target: { value } }) => {
        updateUserName(value)
    };
    const handleEmail = ({ target: { value } }) => {
        updateEmail(value)
    };
    const handlePassword = ({ target: { value } }) => {
        updatePassword(value)
    };
    const handleConfirm = ({ target: { value } }) => {
        updateConfirm(value)
        if (password !== value) {
            setValidated(false)
        } else {
            setValidated(true)
        }
    };
    const handleSubmit = async (e) => {
        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            e.preventDefault();
            setValidated(true);
        } else {
            setLoading(true);
            setExistingUsername(false);
            setExistingEmail(false)

            e.preventDefault();
            const options = {
                method: 'POST',
                url: process.env.REACT_APP_BASE_URL+'signup/',
                data: { username: userName, email, password }
            };

            axios.request(options).then(function (response) {
                const { ok, error } = response.data;
                setLoading(false);
                if (ok) {
                    setSeconds(5);
                    setShow(true);
                    setValidated(true);
                    setSignUpSuccess(true)
                } else {
                    if (error.username)
                        setExistingUsername(true);
                    if (error.email)
                        setExistingEmail(true)
                }
            }).catch(function (error) {
                setNetworkError(true);
                setTimeout(() => {
                    setNetworkError(false);
                }, 5000);
                setLoading(false)
            });
        }

    };
    return (
        <Container fluid >
            <Row style={{ height: '100%' }} className='align-items-center' >
                <Col className='background'>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Row style={{ padding: '0px 20px', margin: '50px 0px 0px 0px' }}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }} >Convocentric</h2>
                            <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: '#4566DA' }}>Welcome to Convocentric</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form className='formAlign' noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                                <Form.Group className="mb-3" controlId="form.userName">
                                    <Form.Label className='formColor' >User Name</Form.Label>
                                    <Form.Control required type="text" placeholder="Enter an username" onChange={handleUserName} />
                                    {
                                        existingUsername ?
                                            <div class='userNameExists'>UserName exists already</div>

                                            :

                                            <Form.Control.Feedback type="invalid">Please provide a valid name</Form.Control.Feedback>
                                    }
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="Form.email">
                                    <Form.Label className='formColor' >Email address</Form.Label>
                                    <Form.Control required pattern='[\w\.]+@([\w]+\.)+[\w]{2,4}$' type="email" placeholder="name@example.com" onChange={handleEmail} />
                                    {
                                        existingEmail ?
                                            <div class='userNameExists'>Email exists already</div>

                                            :

                                            <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
                                    }
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="form.password">
                                    <Form.Label className='formColor' >Password</Form.Label>
                                    <Form.Control required pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$' type="password" placeholder="Enter a password" onChange={handlePassword} />
                                    <Form.Control.Feedback type='invalid' >Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="form.confirm">
                                    <Form.Label className='formColor' >Confirm Password</Form.Label>
                                    <Form.Control required pattern={password} type="password" placeholder="Confirm password" onChange={handleConfirm} />
                                    <Form.Control.Feedback type='invalid' >Password should match
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className='text-center' >
                                    {loading ?
                                        <Spinner animation="border" />
                                        :
                                        <Button type="submit" size="lg" className="btn btn-primary btn-block">Sign Up</Button>
                                    }
                                </div>
                                {
                                    networkError ?
                                        <div className='text-center' >
                                            <Alert style={{ marginTop: "1rem" }} variant="danger" onClose={() => setNetworkError(false)} dismissible>
                                                <Alert.Heading>Network error!</Alert.Heading>
                                                <p>
                                                    Could not connect to the server. Please try again after a while.
                                                </p>
                                            </Alert>
                                        </div>
                                        :
                                        ""
                                }
                            </Form>
                            <div className='text-center' >
                                <p className='text-center' style={{ paddingTop: '1rem' }} >Already have an account?</p>
                                <Link to="/">Sign In</Link>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up Successfull</Modal.Title>
                </Modal.Header>
                <Modal.Body>You will be redirected to main lounge in {seconds} seconds</Modal.Body>
            </Modal>
        </Container >
    )
}