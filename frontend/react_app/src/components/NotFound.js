import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Card className="text-center">
            <Card.Header>Oops!!</Card.Header>
            <Card.Body>
                <Card.Title>We have not prepared a page for this</Card.Title>
                <Card.Text>
                    Take me back to
                </Card.Text>
                <div className='text-center' >
                    <Link to="/chat">Home</Link>
                </div>
            </Card.Body>
        </Card>
    )
}