import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';

import '../css/Signup.css';


export default function SignUp() {

    const navigate = useNavigate();

    const [userName, updateUserName] = useState("");
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [confirm, updateConfirm] = useState("");
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [existingUsername, setExistingUsername] = useState(false);
    const [show, setShow] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

        }, 1000);
        return () => {
            console.log(`seconds ${seconds} and signup ${signUpSuccess}`);
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
            console.log('in');
            e.stopPropagation();
            e.preventDefault();
            setValidated(true);

        } else {
            setLoading(true);
            setExistingUsername(false);
            e.preventDefault()
            console.log(`handleSubmited called with`)
            console.log(userName);
            console.log(email);
            console.log(password);
            console.log(confirm);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            // setExistingUsername(true);
            setSeconds(5);
            setSignUpSuccess(true);
            setShow(true);
            setValidated(true);
        }

    };
    return (
        <Container fluid >
            <Row style={{ height: '100%' }} className='align-items-center' >
                <Col className='background'>
                </Col>
                <Col>
                    <Form className='formAlign' noValidate validated={validated} onSubmit={(e) => handleSubmit(e)} >
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }} >Convocentric</h2>
                        <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: '#4566DA' }}>Welcome to Convocentric</h3>

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
                            <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
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
                                <Button type="submit" size="lg" className="btn btn-primary btn-block lg">Sign Up</Button>
                            }
                        </div>
                    </Form>
                    <div className='text-center' >
                        <p className='text-center' style={{ paddingTop: '1rem' }} >Already have an account?</p>
                        <Link to="/" >Sign In</Link>
                    </div>

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