import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import landing_img from '../images/landing_img.svg'
import '../css/Profile.css';

export default function Profile() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fisrstname: '',
        lastname: '',
        emailid :''
    })

    const redirectPage = (page) => {
        navigate(page)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    return (
        <Row style={{ padding: '0px', margin: '10% 0%' }}>   
            <Col sm={12} md={12} lg={{offset: 3, span: 6}} xl={{offset: 3, span: 6}}>
                 <Row style={{ padding: '0px 0px', margin: '0px 0px 40px 0px' }}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <p style={{ marginBottom: '0px', textAlign: 'left', color: "#0A194E", fontSize: '22px' }}>Profile Setting</p>
                        </Col>
                    </Row>
                <Row>
                    <Col sm={12} md={2} lg={2} xl={2}> 
                        <img className="circular--square" src={landing_img} />
                    </Col>
                    <Col sm={12} md={10} lg={10} xl={10}>
                        <p style={{ textAlign: 'left', color: "#0A194E", fontSize: '14px' }}> @Username</p>
                        <p style={{ textAlign: 'left', color: "blue", fontSize: '14px' }}> Logout</p>
                    </Col>
                </Row>
                <Row style={{ padding: '0px', margin: '10px 0px 10px 0px' }}>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <p style={{ textAlign: 'left', color: "blue", fontSize: '18px' }}> Edit Details</p>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col lg={6} xl={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Control onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} id="firstname" name="firstname" value={formData.firstname} type="text" placeholder="firstname" />
                                    </Form.Group> 
                                </Col>
                                <Col lg={6} xl={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Control onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} id="lastname" name="lastname" value={formData.lastname} type="text" placeholder="lastname" />
                                    </Form.Group> 
                                </Col>
                            </Row> 
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Form.Group className="mb-3">
                                <Col lg={12} xl={12}>
                                    <Form.Control onChange={(e) => setFormData({ ...formData, emailid: e.target.value })} id="emailid" name="emailid" value={formData.emailid} type="text" placeholder="email id" />
                                </Col> 
                                </Form.Group>
                            </Row>                     
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col lg={6} xl={6}>
                                    <Button size="md" className="customButton" type="submit">
                                        Save
                                    </Button>
                                </Col>
                                <Col lg={6} xl={6}> 
                                    <Button size="md" className="customButton"onClick={() => redirectPage('/Profilepage')} >
                                        Change Password
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col> 
        </Row>
    )
}