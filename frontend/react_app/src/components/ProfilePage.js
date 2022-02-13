import React, { useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import landing_img from '../images/landing_img.svg'
import '../css/Profile.css';
import { defaultProfilePictureImageDataUri } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera } from "@fortawesome/free-solid-svg-icons"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Dialog from "react-bootstrap-dialog";

export default function Profile() {

    let CustomDialog = useRef(null);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fisrstname: '',
        lastname: '',
        emailid :'',
        profile_picture: ''
    })

    const redirectPage = (page) => {
        navigate(page)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const editProfilePicture = () => {
        //pass
    }


    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
            reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
       
        const profilePictureHandler = (e) => {
            let profile_picture_file = e.target.files[0];

            getBase64(profile_picture_file, (result) => {
                setFormData({...formData, profile_picture: result});
            });
        }

    const removeProfilePicture = () => {
        setFormData({...formData, profile_picture: ''});
        }
       
        const removeProfilePictureRef = () => {
            CustomDialog.show({
                body:"Are you sure you want to remove your profile picture ?",
                actions: [
                    Dialog.DefaultAction(
                        "Remove",
                        () => {removeProfilePicture()},
                        "btn-danger"
                    ),
                    Dialog.Action(
                        "Close",
                        () => {
                        if(CustomDialog){
                            CustomDialog.hide()
                        }
                        },
                        "btn-primary"
                    ),
                    ],
                });
        };

    return (
        <Row style={{ padding: '0px', margin: '10% 0%' }}>   
            <Col className="shadow" style={{ backgroundColor: '#C9E6FE', border: '1px solid #ebebeb', borderRadius: '20px', padding: '10px 20px' }} sm={12} md={12} lg={{offset: 3, span: 6}} xl={{offset: 3, span: 6}}>
                 <Row style={{ padding: '0px 0px', margin: '0px 0px 30px 0px' }}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <p style={{ marginBottom: '0px', textAlign: 'left', color: "#0A194E", fontSize: '22px' }}>Profile Settings</p>
                            <div style={{ display: "none" }}>
                                <Dialog
                                ref={(el) => {
                                CustomDialog = el;
                                }}
                                />
                            </div>
                        </Col>
                    </Row>
                <Row>
                    <Col sm={12} md={2} lg={2} xl={2}> 
                    <div style={{ position: 'relative' }}>
                        <img src={formData && formData.profile_picture ? formData.profile_picture : defaultProfilePictureImageDataUri} className="circular_square"/>
                        <div className="profile_picture_upload">
                            <label htmlFor="profile_picture">
                                <FontAwesomeIcon onClick={() => editProfilePicture()} color="gray" icon={faCamera} className="profile_picture_change"/>
                            </label>
                            <input onChange={profilePictureHandler} id="profile_picture" type="file" />
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={10} lg={10} xl={10}>
                        <p style={{ textAlign: 'left', color: "#0A194E", fontSize: '20px' }}>@username</p>
                        <p style={{ textAlign: 'left', color: "blue", fontSize: '18px', margin: '2px 5px 0px 0px' }}> Logout</p>
                    </Col>
                </Row>
                <Row style={{ padding: '0px', margin: '0px 0px 20px 0px' }}>
                    <Col sm={12} md={12} lg={12} xl={12} style={{ marginBottom: '10px' }}>
                        <p style={{ textAlign: 'left', paddingLeft: '10px', color: "blue", fontSize: '18px' }}>Edit Details</p>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col lg={4} xl={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Control onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} id="firstname" name="firstname" value={formData.firstname} type="text" placeholder="First name" />
                                    </Form.Group> 
                                </Col>
                                <Col lg={4} xl={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Control onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} id="lastname" name="lastname" value={formData.lastname} type="text" placeholder="Last name" />
                                    </Form.Group> 
                                </Col>
                            </Row> 
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                    <Col lg={8} xl={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Control onChange={(e) => setFormData({ ...formData, emailid: e.target.value })} id="emailid" name="emailid" value={formData.emailid} type="text" placeholder="Enter your email" />
                                        </Form.Group>
                                    </Col> 
                            </Row>                     
                            <Row style={{ margin: '10px 0px 0px 0px', padding: '0px' }}>
                                <Col lg={4} xl={4}>
                                    <Button size="md" className="customButton" type="submit">
                                        Save
                                    </Button>
                                </Col>
                                <Col lg={4} xl={4}>
                                    <Button size="md" className="customButtonChangePassword" onClick={() => redirectPage('/Profilepage')} >
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