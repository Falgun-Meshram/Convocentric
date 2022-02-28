import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import '../css/Profile.css';
import { defaultProfilePictureImageDataUri } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons"
// import Dialog from "react-bootstrap-dialog";
import axiosInstance from './axiosInstance';
import { Spinner } from 'react-bootstrap';

export default function Profile() {

    // let CustomDialog = useRef(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [editStatusMsg, setEditStatusMsg] = useState('');
    const [editDataError, setEditDataError] = useState('');
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        id:'',
        password:'',
        first_name: '',
        last_name: '',
        email :'',
        profile_picture: '',
        username: '',
    })
    const [originalFormData, setOriginalFormData] = useState({
        id:'',
        password:'',
        first_name: '',
        last_name: '',
        email :'',
        profile_picture: '',
        username: '',
    })

    useEffect(() => {
        let currentFormData = {};
        if(localStorage.getItem('user')){
            let user = JSON.parse(localStorage.getItem('user'));
            currentFormData = {...user}
        }
        setFormData(currentFormData);
        setOriginalFormData(currentFormData);
    }, []);

    const redirectPage = (page) => {
        navigate(page)
    }

    const logout = () => {
        axiosInstance.get("logout/").then((response) => {
            if (response.data.ok) {
                localStorage.removeItem("isAuth");
                localStorage.removeItem("user");
                redirectPage('/');
            } else {
                console.log("Error");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const shallowEqual = (object1, object2) => {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          if (object1[key] !== object2[key]) {
            return false;
          }
        }
        return true;
      }

    const handleSubmit = (e) => {

        e.preventDefault();
        if(shallowEqual(formData, originalFormData)){
            setEditDataError(true);
            setEditStatusMsg("You have not changed any values.");
            setTimeout(function () {
                setEditStatusMsg("");
            }, 5000);
        }else if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            e.preventDefault();
            setValidated(true);
        }else{
            const options = {
                method: 'PUT',
                url: 'manage_user/'+formData.id+'/',
                data: formData
            };
            axiosInstance.request(options).then(function (response) {
                setLoading(false);
                if(response.status === 204){
                    setFormData(formData);
                    setEditStatusMsg('User data saved successfully.');
                    setEditDataError(false);
                    setTimeout(() => {
                        setEditStatusMsg('');
                    }, 5000);
                    localStorage.setItem('user', JSON.stringify(formData))
                }else{
                    setEditDataError(true);
                    setEditStatusMsg(response.data.error);
                    setTimeout(() => {
                        setEditStatusMsg('');
                    }, 5000);
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
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

    // const removeProfilePicture = () => {
    //     setFormData({...formData, profile_picture: ''});
    // }
    
    // const removeProfilePictureRef = () => {
    //     CustomDialog.show({
    //         body:"Are you sure you want to remove your profile picture ?",
    //         actions: [
    //             Dialog.DefaultAction(
    //                 "Remove",
    //                 () => {removeProfilePicture()},
    //                 "btn-danger"
    //             ),
    //             Dialog.Action(
    //                 "Close",
    //                 () => {
    //                 if(CustomDialog){
    //                     CustomDialog.hide()
    //                 }
    //                 },
    //                 "btn-primary"
    //             ),
    //             ],
    //         });
    // };

    return (
        <Row style={{ padding: '0px', margin: '10% 0%' }}>
            <Col className="shadow-lg" style={{ backgroundColor: '#F6F6F6', border: '1px solid #ebebeb', borderRadius: '20px', padding: '10px 20px' }} sm={12} md={12} lg={{offset: 3, span: 6}} xl={{offset: 3, span: 6}}>
                 {/* <Row style={{ padding: '0px 0px', margin: '0px 0px 30px 0px' }}>
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
                    </Row> */}
                <Row> 
                    <Col sm={12} md={2} lg={2} xl={2}> 
                    <div style={{ position: 'relative' }}>
                        <img alt="profile_photo" src={formData && formData.profile_picture ? formData.profile_picture : defaultProfilePictureImageDataUri} className="circular_square"/>
                        <div className="profile_picture_upload">
                            <label htmlFor="profile_picture">
                                <FontAwesomeIcon color="gray" icon={faCamera} className="profile_picture_change"/>
                            </label>
                            <input onChange={profilePictureHandler} id="profile_picture" type="file" />
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={2} lg={2} xl={2}>
                        <p style={{ textAlign: 'left', color: "#2A4CBF", fontSize: '20px', margin: '8px 0px 0px 10px' }}>@{formData.username}</p>
                        <p style={{ cursor:'pointer', textAlign: 'left', fontSize: '18px', margin: '2px 5px 0px 15px', fontWeight: 'bold', color: "#162B71" }} onClick={() => logout()}> Logout</p>
                    </Col>
                </Row>
                <Row style={{ padding: '0px', margin: '0px 0px 20px 0px' }}>
                    <Col sm={12} md={12} lg={12} xl={12} style={{ marginBottom: '10px' }}>
                        <p style={{ textAlign: 'left', paddingLeft: '10px', color: 'black', fontWeight: 'normal', fontSize: '18px' }}>Edit Details</p>
                    </Col>
                    <Col sm={12} md={12} lg={12} xl={12}>
                        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col sm={4} md={4} lg={4} xl={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Control required onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} id="first_name" name="first_name" value={formData.first_name || ''} type="text" placeholder="First name" />
                                        <Form.Control.Feedback type="invalid">Please provide a valid firstname</Form.Control.Feedback>
                                    </Form.Group> 
                                </Col>
                                <Col sm={4} md={4} lg={4} xl={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Control required onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} id="last_name" name="last_name" value={formData.last_name || ''} type="text" placeholder="Last name" />
                                        <Form.Control.Feedback type="invalid">Please provide a valid lastname</Form.Control.Feedback>
                                    </Form.Group> 
                                </Col>
                            </Row> 
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col sm={8} md={8} lg={8} xl={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Control required pattern='[\w\.]+@([\w]+\.)+[\w]{2,4}$' onChange={(e) => setFormData({ ...formData, email: e.target.value })} id="email" name="email" value={formData.email || ''} type="email" placeholder="Enter your email" />
                                        <Form.Control.Feedback type="invalid">Please provide a valid email id</Form.Control.Feedback>
                                    </Form.Group>
                                </Col> 
                            </Row>   
                            <Row style={{ margin: '0px', padding: '0px' }}>
                                <Col sm={8} md={8} lg={8} xl={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Control disabled onChange={(e) => setFormData({ ...formData, username: e.target.value })} id="username" name="username" value={formData.username || ''} type="text" placeholder="Enter username" />
                                    </Form.Group>
                                </Col> 
                            </Row>   
                            {editStatusMsg?<Row style={{ margin: '0px', padding: '0px' }}>
                                <Col sm={8} md={8} lg={8} xl={8}>
                                    <p style={{ margin: '0px 0px 10px 0px', color: editDataError?'red':'green'}}>{editStatusMsg}</p>
                                </Col> 
                            </Row>:''}                 
                            {loading ?
                            <Row style={{ margin: '10px 0px 0px 0px', padding: '0px' }}>
                                <Col lg={{span: 2, offset: 3}} xl={{span: 2, offset: 3}}>
                                    <div className='text-center'>
                                        <Spinner animation="border" />
                                    </div>
                                </Col>
                            </Row>:
                            <Row>
                                <Col lg={4} xl={4}>
                                    <Button size="md" className="customButton" type="submit">
                                        Save
                                    </Button>
                                </Col>
                                <Col lg={4} xl={4}>
                                    <Button size="md" className="customButtonChangePassword" onClick={() => redirectPage('/home')} >
                                        Back to Home 
                                    </Button>
                                </Col>
                            </Row>}

                            {/* // <Col lg={4} xl={4}>
                            //     <Button size="md" className="customButtonChangePassword" onClick={() => redirectPage('/change_password')} >
                            //         Change Password
                            //     </Button>
                            // </Col>  */}
                        </Form>
                    </Col>
                </Row>
            </Col> 
        </Row>
    )
}