import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

import { useState, useEffect } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";


const ProductsPageComponent = ({ fetchProducts, deleteProduct }) => {

    const [products, setProducts] = useState([])
    const [productDeleted, setProductDeleted] = useState(false);
    const dispatch = useDispatch()

    const deleteHandler = async (productId) => {
        if (window.confirm("Are you sure?")) {
            const data = await deleteProduct(productId)
            if (data.message === "product removed")
                setProductDeleted(!productDeleted);
        }
    }

    async function getData(){
        const abctrl = new AbortController();
        try {
            const prods = await fetchProducts(abctrl);
            console.log(prods);
            setProducts(prods);
        } catch (error) {
            console.log(error);
            dispatch(logout());
        }
    }
// To Do
    useEffect(() => {
        // const abctrl = new AbortController();
    //     fetchProducts(abctrl).then((res) => setProducts(res))
    // .catch((er) =>{
    //         	console.log(er);
    //             //  dispatch(logout()) //to do
    //             // setProducts([{ name: er.response.data.message ? er.response.data.message : er.response.data }])
    // }
    //         );

        // return () => abctrl.abort();
        getData();
    }, []);


    return (
        <Row className="m-5" >
            <Col md={2} >
                <AdminLinksComponent></AdminLinksComponent>
            </Col>
            <Col md={10} >
                <h1>Product List{" "}
                    <LinkContainer to="/admin/create-new-product" >
                        <Button variant="primary" size="lg">Create new</Button>
                    </LinkContainer>
                </h1>
                <Table striped bordered hover responsive >
                    {/* table looks good in mob devices "striped bordered hover responsive"*/}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, idx) => (
                            <tr key={idx} >
                                <td>{idx + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.category}</td>
                                <td>
                                    <LinkContainer to={`/admin/edit-product/${item._id}`}>
                                        <Button className="btn-sm">
                                            <i className="bi bi-pencil-square" ></i>
                                        </Button>
                                    </LinkContainer>
                                    {" / "}
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(item._id)}>
                                        <i className="bi bi-x-circle" ></i>
                                    </Button>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}
export default ProductsPageComponent;