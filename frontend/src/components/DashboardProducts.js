import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import "./DashboardProducts.css";

function DashboardProducts() {
    const products = useSelector((state) => state.products);
    console.log(products);
    const user = useSelector((state) => state.user);
    const [deleteProduct] = useDeleteProductMutation();

    function handleDeleteProduct(id) {
        // logic here
        if (window.confirm("Are you sure?")) {
            deleteProduct({ product_id: id, user_id: user._id });
        }
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th></th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id}>
                        <td><img src={product.pictures[0].url} alt="product-img" className="dashboard-product-preview"/></td>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td className="d-flex">
                            <Button onClick={() => handleDeleteProduct(product._id, user._id)}>Delete</Button>
                            <Link to={`/products/${product._id}/edit`} className="btn btn-warning">Edit</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default DashboardProducts;