import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import axiosInstance from './axiosInstance';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Home() {

    const navigate = useNavigate();

    const redirectPage = (page) => {
        navigate(page)
    }
    
    const logout = () => {
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_BASE_URL+'logout/',
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
              "Content-Type": "application/json",
              accept: "application/json",
            }
          };
          axios.request(options).then((response) => {
            if (response.data.ok) {
                localStorage.clear()
                redirectPage('/');
            } else {
                console.log("Error");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <Row style={{ padding: '0px', margin: '0px', textAlign: 'center' }} className="align-items-center">
            <Col style={{ marginTop: '20px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <h1 style={{ margin: '0 auto' }}>WELCOME HOME</h1>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button style={{ marginTop: '20px' }} size="md" onClick={() => logout()}>Logout</Button>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button variant="success" style={{ marginTop: '20px' }} size="md" onClick={() => redirectPage('/profile')}>Go to Profile</Button>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button variant="primary" style={{ marginTop: '20px' }} size="md" onClick={() => redirectPage('/chat')}>Go to Chat</Button>
            </Col>
        </Row>
    )
}

