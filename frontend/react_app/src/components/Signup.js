import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';

import '../css/Signup.css';
import Login from './Login';

export default function SignUp() {
    return (
        <Container fluid >
            <Row style={{ height: '100%' }} className='align-items-center' >
                <Col className='background'>
                </Col>
                <Col>
                    <Form className='formAlign' >
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }} >Convocentric</h2>
                        <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: '#4566DA' }}>Welcome to Convecentric</h3>

                        <Form.Group className="mb-3" controlId="form.userName">
                            <Form.Label className='formColor' >User Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter an username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Form.email">
                            <Form.Label className='formColor' >Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="form.password">
                            <Form.Label className='formColor' >Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter a password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="form.confirm">
                            <Form.Label className='formColor' >Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter a password" />
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
        </Container>
    )
}