import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import Loading from "../components/Loading";
import SimilarProduct from "../components/SimilarProduct";
import { Container, Row, Col, Badge, ButtonGroup, Form, Button } from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { LinkContainer } from "react-router-bootstrap";
import { useAddToCartMutation } from "../services/appApi";
import ToastMessage from '../components/ToastMessage';
import "./ProductPage.css";

function ProductPage () {
	const {id} = useParams();
	const user = useSelector((state) => state.user);
	const [product, setProduct] = useState(null);
	const [similar, setSimilar] = useState(null);
	const [addToCart, { isSuccess }] = useAddToCartMutation();

	useEffect(() => {
		axiosInstance.get(`/products/${id}`)
		.then((responseData) => {
			setProduct(responseData.data.product);
			setSimilar(responseData.data.similar);
		})
		.catch((error) => {
			console.log("error fetching a product:", error);
		});
	}, [id]);

	const handleDragStart = (e) => e.preventDefault();
	if(!product) {
		return <Loading/>
	}

	//function that handles adding items to cart
	function handleAddToCart () {
		addToCart({
			userId: user._id,
			productId: id,
			price: product.price,
			image: product.pictures[0].url
		})
	}


	//image responsive depending on screen size in alice corousel
	const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
    };

	const images = product.pictures.map((picture) => (
		<img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />
	));

	let similarProducts = [];
	if(similar) {
		similarProducts = similar.map((product, idx) => (
			<div className="item" data-value={idx}>
				<SimilarProduct {...product}/>
			</div>
		))
	}
	return (
		<Container className="pt-4" style={{ position: "relative" }}>
			<Row>
				<Col lg={6}>
                    <AliceCarousel mouseTracking items={images} controlsStrategy="alternate" />
                </Col>
                <Col lg={6} className="pt-4">
                	<h1>{product.name}</h1>
                	<p><Badge bg="primary">{product.category}</Badge></p>
                	<p className="product__price">Ksh{product.price}</p>
                	<p style={{ textAlign: "center" }} className="py-3">
                        <strong>Description:</strong> {product.description}
                    </p>
                    {user && !user.isAdmin && (
                        <ButtonGroup style={{ width: "80%" }}>
                            <Form.Select size="lg" style={{ width: "40%", borderRadius: "0" }}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Select>
                            <Button size="lg" disabled={!user} onClick={handleAddToCart}>
                                Add to cart
                            </Button>
                        </ButtonGroup>
                    )}
                    {isSuccess && <ToastMessage bg="info" title="Added to cart" body={`${product.name} is in your cart`} />}
                    {user && user.isAdmin && (
                        <LinkContainer to={`/product/${product._id}/edit`}>
                            <Button size="lg">Edit Product</Button>
                        </LinkContainer>
                    )}
                </Col>
			</Row>
			<div className="my-4">
				<h2>Similar Products</h2>
				<div className="d-flex justify-content-center align-items-center flex-wrap">
					<AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy="alternate" />
				</div>
			</div>
		</Container>
	)
}

export default ProductPage;