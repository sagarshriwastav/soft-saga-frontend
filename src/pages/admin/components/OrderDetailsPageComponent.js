import { Container, Row, Col, Alert, Form, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CartItemComponenet from "../../../components/CartItemComponent";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";



const OrderDetailsPageComponent = ({ getOrder, markAsDelivered }) => {
    const { id } = useParams();
    const dispatch = useDispatch()

    const [userInfo, setUserInfo] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("")
    const [isPaid, setIsPaid] = useState(false)
    const [isDelivered, setIsDelivered] = useState(false)
    const [cartSubtotal, setCartSubtotal] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [orderButtonMessage, setOrderButtonMessage] = useState('Mark as delivered')
    const [cartItems, setCartItems] = useState([])


    useEffect(() => {
        getOrder(id)
            .then((order) => {
                setUserInfo(order.user)
                setPaymentMethod(order.paymentMethod)
                order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false)
                order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false)
                setCartSubtotal(order.orderTotal.cartSubtotal)
                if (order.isDelivered) {
                    setOrderButtonMessage("Order is finished")
                    setButtonDisabled(true)
                }
                setCartItems(order.cartItems)
            })
            .catch((er) =>
                dispatch(logout())
                // console.log(er.response.message.data ? er.response.message.data : er.response.data)
            )
    }, [isDelivered, id])
    return (
        <Container fluid >
            <Row className="mt-4" >
                <h1>Order Details</h1>
                <Col md={8}>
                    <br></br>
                    <Row>
                        <Col md={6}><h2>Shipping</h2>
                            <b>Name</b>: {userInfo.name} {userInfo.lastName} <br></br>
                            <b>Adress</b>: {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode}<br></br>
                            <b>Phone</b>:{userInfo.phoneNumber}
                        </Col>
                        <Col md={6}><h2>Payment method</h2>
                            <Form.Select value={paymentMethod} disabled={true} >
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
                                <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                                    {isDelivered ? <>Delivered at {isDelivered}</> : <>Not Delivered</>}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                                    {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br></br>
                    <h2>Order items</h2>
                    <ListGroup variant="flush" >
                        {cartItems.map((item, idx) => (
                            <CartItemComponenet key={idx} item={item} orderCreated={true} ></CartItemComponenet>))}
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
                                <Button type="button" disabled={buttonDisabled} variant="danger" size="lg" onClick={() => markAsDelivered(id).then((res) => {
                                    if (res) {
                                        setIsDelivered(true)
                                    }
                                })
                                    .catch(er => console.log(er.response.data.message ? er.response.data.message : er.response.data))
                                } >
                                    {orderButtonMessage}
                                </Button>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}
export default OrderDetailsPageComponent;