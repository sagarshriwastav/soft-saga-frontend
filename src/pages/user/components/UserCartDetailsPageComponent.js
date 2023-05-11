import { Container, Row, Col, Alert, Form, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CartItemComponenet from "../../../components/CartItemComponent";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";




const UserCartDetailsPageComponent = ({ cartItems, itemsCount, cartSubtotal, userInfo, addToCart, removeFromCart, reduxDispatch, getUser, createOrder }) => {

    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [userAddress, setUserAddress] = useState(false)
    const [missingAddress, setMissingAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("pp")
    const navigate = useNavigate();



    const changeCount = (productID, count) => {
        reduxDispatch(addToCart(productID, count));
    }


    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm("Are you sure?")) {
            reduxDispatch(removeFromCart(productID, quantity, price))
        }
    }

    getUser().then(res => console.log(res))

    useEffect(() => {
        getUser().then((data) => {
            if (!data.address || !data.city || !data.country || !data.zipCode || !data.state || !data.phoneNumber) {
                setButtonDisabled(true)
                setMissingAddress(" .In order to make order, fill out your profile with correct address, city etc");
            } else {
                setUserAddress({ address: data.address, city: data.city, country: data.country, zipCode: data.zipCode, state: data.state, phoneNumber: data.phoneNumber })
                setMissingAddress(false)
            }
        })
            .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data))
    }, [getUser, userInfo._id])



    const orderHandler = () => {
        const orderData = {
            orderTotal: {
                itemsCount: itemsCount,
                cartSubtotal: cartSubtotal,
            },
            cartItems: cartItems.map(item => {
                return {
                    productID: item.productID,
                    name: item.name,
                    price: item.price,
                    image: { path: item.image ? (item.image.path ?? null) : null },
                    quantity: item.quantity,
                    count: item.count,
                }
            }),
            paymentMethod: paymentMethod,
        }
        createOrder(orderData)
            .then(data => {
                if(data){
                navigate("/user/order-details/" + data._id)
                }
            })
            .catch((err) => console.log(err))
    }

    const choosePayment = (e) => {
        setPaymentMethod(e.target.value);
    }

    return (
        <Container fluid >
            <Row className="mt-4" >
                <h1>Cart Details</h1>
                <Col md={8}>
                    <br></br>
                    <Row>
                        <Col md={6}><h2>Shipping</h2>
                            <b>Name</b>: {userInfo.name} {userInfo.lastName} <br></br>
                            <b>Adress</b>: {userAddress.address} {userAddress.city} {userAddress.state} {userAddress.zipCode} <br />
                            <b>Phone</b>: {userAddress.phoneNumber}
                        </Col>
                        <Col md={6}><h2>Payment method</h2>
                            <Form.Select onChange={choosePayment} >
                                <option value="pp">
                                    PayPal
                                </option>
                                <option value="cod">
                                    Cash on Delivery(delivery may be delayed)
                                </option>
                            </Form.Select>
                        </Col>
                        <Row>
                            <Col>
                                <Alert className="mt-3" variant="danger">
                                    Not delivered
                                    {missingAddress}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className="mt-3" variant="success">
                                    Not paid yet
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br></br>
                    <h2>Order items</h2>
                    <ListGroup variant="flush" >
                        {cartItems.map((item, idx) => (
                            <CartItemComponenet item={item} key={idx} removeFromCartHandler={removeFromCartHandler} changeCount={changeCount} ></CartItemComponenet>))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup>
                        <ListGroupItem>
                            <h3>Order summary</h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            Items price (tax including): <span className="fw-bold">${cartSubtotal}</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Shipping : <span className="fw-bold">included</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Tax : <span className="fw-bold">included</span>
                        </ListGroupItem>
                        <ListGroupItem className="text-danger" >
                            Total price : <span className="fw-bold">${cartSubtotal}</span>
                        </ListGroupItem>
                        <ListGroupItem  >
                            <div className="d-grid gap-2">
                                <Button type="button" onClick={orderHandler} variant="danger" size="lg" disabled={buttonDisabled} >
                                    Place order
                                </Button>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}
export default UserCartDetailsPageComponent;