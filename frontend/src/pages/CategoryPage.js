import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import Loading from "../components/Loading";
import ProductPreview from "../components/ProductPreview";
import { Col, Container, Row } from "react-bootstrap";
import "./CategoryPage.css";

function CategoryPage () {
	const {category} = useParams();
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		setLoading(true);
		axiosInstance.get(`/products/category/${category}`)
		.then((responseData) => {
			setLoading(false);
			setProducts(responseData.data);
			console.log(responseData.data);
		})
		.catch((error) => {
			setLoading(false);
			console.log("Error getting the data on specific category:", error);
		});

	}, [category]);

	if (loading) {
		<Loading/>
	}
	const productsSearch = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="category-page-container">
			<div className={`pt-3 ${category}-banner-container category-banner-container`}>
				<h1 className="text-center">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
			</div>
			<div className="filters-container d-flex justify-content-center pt-4 pb-4">
				<input type="search" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}/>
			</div>
			{productsSearch.length === 0 ? (
				<h1>No product to show</h1>
			): (
				<Container>
					<Row>
						<Col md={{ span: 10, offset: 1}}>
							<div className="d-flex justify-content-center align-items-center flex-wrap">
								{productsSearch.map((product) => (
									<ProductPreview {...product} />
								))}
							</div>
						</Col>
					</Row>
				</Container>
			)}
		</div>
	)
}

export default CategoryPage;
