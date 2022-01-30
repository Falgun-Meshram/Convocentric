import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import '../css/Signup.css';




export default function SignUp() {
    const [userName, updateUserName] = useState("");
    const [email, updateEmail] = useState("");
    const [password, updatePassword] = useState("");
    const [confirm, updateConfirm] = useState("");
    const [validated, setValidated] = useState(false);

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
        console.log(password === value);
        if (password !== value) {
            setValidated(false)
        } else {
            setValidated(true)
        }
    };
    const handleSubmit = (e) => {
        console.log(e.currentTarget.checkValidity());
        if (e.currentTarget.checkValidity() === false) {
            console.log('in');
            e.stopPropagation();
            e.preventDefault();
        } else {

            e.preventDefault()
            console.log(`handleSubmite called with`)
            console.log(userName);
            console.log(email);
            console.log(password);
            console.log(confirm);
        }
        setValidated(true);

    };

    return (
        <Container fluid >
            <Row style={{ height: '100%' }} className='align-items-center' >
                <Col className='background'>
                </Col>
                <Col>
                    <Form className='formAlign' noValidate validated={validated} onSubmit={handleSubmit} >
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }} >Convocentric</h2>
                        <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: '#4566DA' }}>Welcome to Convecentric</h3>

                        <Form.Group className="mb-3" controlId="form.userName">
                            <Form.Label className='formColor' >User Name</Form.Label>
                            <Form.Control required type="text" placeholder="Enter an username" onChange={handleUserName} />
                            <Form.Control.Feedback type="invalid">Please provide a valid name.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Form.email">
                            <Form.Label className='formColor' >Email address</Form.Label>
                            <Form.Control required pattern='[\w\.]+@([\w]+\.)+[\w]{2,4}$' type="email" placeholder="name@example.com" onChange={handleEmail} />
                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="form.password">
                            <Form.Label className='formColor' >Password</Form.Label>
                            <Form.Control required pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$' type="password" placeholder="Enter a password" onChange={handlePassword} />
                            <Form.Control.Feedback type='invalid' >Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="form.confirm">
                            <Form.Label className='formColor' >Confirm Password</Form.Label>
                            <Form.Control required pattern={password} type="password" placeholder="Enter a password" onChange={handleConfirm} />
                            <Form.Control.Feedback type='invalid' >Password should match
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className='text-center' >
                            <Button type="submit" size="lg" className="btn btn-primary btn-block lg">Sign Up</Button>
                        </div>
                    </Form>
                    <div className='text-center' >
                        <p className='text-center' style={{ paddingTop: '1rem' }} >Already have an account?</p>
                        <Link to="/">Sign In</Link>
                    </div>

                </Col>
            </Row>
        </Container >
    )
}