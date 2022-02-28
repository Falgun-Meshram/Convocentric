import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import '../css/Signin.css';
import '../css/Signin.css';
import axios from 'axios'

export default function Signin() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [wrongUsername, setWrongUsername] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const redirectPage = (page) => {
        navigate(page)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setWrongUsername(false);
        setWrongPassword(false);
        setNetworkError(false);
        const options = {
            method: 'POST',
            url: process.env.REACT_APP_BASE_URL+'login/',
            data: formData
        };
        axios.request(options).then(function (response) {
            setLoading(false);
            if(response.data.ok){
                setShow(true);
                let user = response.data.user;
                localStorage.setItem('isAuth', true);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(user));
                redirectPage('/home');
            }else{
                setWrongPassword(true);
                console.error('Some error occured.');
            }
        }).catch(function (error) {
            console.error(error);
            setNetworkError(true);
            setLoading(false);
        });
    }

    return (
        <Row style={{ padding: '0px', margin: '0px' }} className="align-items-center">
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

                        <Form className='formAlign' onSubmit={(e) => handleSubmit(e)}>
                            <Form.Group className="mb-3" noValidate>

                                <Form.Label style={{ color: '#4A6BDB' }}>Username</Form.Label>
                                <Form.Control required onChange={(e) => setFormData({ ...formData, username: e.target.value })} id="username" name="username" value={formData.username} type="text" placeholder="Username" />
                                <Form.Control.Feedback type="invalid">Please provide a valid name</Form.Control.Feedback>

                                {/* {
                                wrongUsername ?
                                    <div class='userNameExists'>You have entered a wrong username</div>
                                    :
                            } */}
                                {/* <Form.Text className="text-muted">
                                </Form.Text> */}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#4A6BDB' }}>
                                    Password
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip id="info_tooltip">
                                                Your password must be atleast 8 characters, and must contain atleast
                                                one capital letter, one small letter and one number and one special character.
                                            </Tooltip>}
                                    >
                                        <i style={{ marginLeft: '10px', color: 'green', fontSize: '20px', cursor: 'pointer' }} className="fa fa-info-circle"></i>
                                    </OverlayTrigger>
                                </Form.Label>

                                <Form.Control required pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} id="password" name="password" value={formData.password} type="password" placeholder="Password" />
                                {
                                    wrongPassword ?
                                        <div class='userNameExists'>You have entered wrong credentials</div>
                                        :
                                        ''
                                    // <Form.Control.Feedback type="invalid">Please provide a valid name</Form.Control.Feedback>
                                }
                            </Form.Group>
                            {/* <Row style={{ margin: '0px', padding: '0px', marginTop: '-10px' }}>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <p style={{ color: '#5E7DE0', cursor: 'pointer', fontSize: '14px', marginTop: '2px', textAlign: 'right' }} onClick={() => redirectPage('/forgot_password')}>
                                        Forgot Password ?
                                    </p>
                                </Col>
                            </Row> */}


                            <Row style={{ margin: '0px', padding: '0px', marginTop: '35px' }}>
                                {loading ? <div className='text-center' >
                                    <Spinner animation="border" />
                                </div>
                                    :
                                    <Col

                                        xs={12} sm={12} md={{ offset: 6, span: 6 }} lg={{ offset: 3, span: 5 }} xl={{ offset: 3, span: 5 }}>
                                        <Button type="submit" size="lg" className="btn btn-primary btn-block">Sign In</Button>
                                    </Col>
                                }
                            </Row>
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


                            <Row style={{ margin: '10px 0px 0px 0px', padding: '0px' }}>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <p style={{ margin: '0px', color: '#2A4CBF', padding: '15px 20px 5px 0px', fontSize: '15px', textAlign: 'center' }}>Don’t have an account yet? </p>
                                    <p onClick={() => redirectPage('/signup')} style={{ cursor: 'pointer', margin: '0px', color: '#1C3FB5', padding: '0px 20px 0px 0px', fontSize: '22px', textAlign: 'center' }}>Create an account</p>
                                </Col>
                            </Row>

                        </Form>
                    </Col>
                </Row>
            </Col>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In Successfull</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please click
                    <Link to="/chat" > here </Link>
                    to go to homepage</Modal.Body>
            </Modal>
        </Row>

    )
}

