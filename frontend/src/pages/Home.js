import React from 'react'
import {useEffect} from 'react';
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import categories from '../categories';
import { LinkContainer } from "react-router-bootstrap";
import axiosInstance from '../axios';
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice";
import ProductPreview from "../components/ProductPreview";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(0, 8);
  useEffect(() => {
    axiosInstance.get('/products')
    .then((responseData) => dispatch(updateProducts(responseData.data)))
    .catch((error) => console.log("Error fetching products:", error));
  }, [])
  return (
    <div>
      <div className='home-banner'>Home</div>
      <div className='featured-products-container container mt-4'>
        <h2>Recent products</h2>

        {/* last products from backend here*/}
        <div className="d-flex justify-content-center flex-wrap">
          {lastProducts.map((product) => (<ProductPreview {...product}/>) )}
        </div>

        <div>
          <Link to="/category/all" style={{textAlign: "right", display: "block", textDecoration: "None"}}>
            See more {">>"}
          </Link>
        </div>
      </div>

      {/*sale banner*/}
      <div className='sale__banner--container mt-4'>
        <img src='https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png' alt='sale-banner'/>
      </div>
      <div className='recent-products-container mt-4'>
        <h2>Categories</h2>
        <Row>
          {categories.map((category) => (
            <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`}>
              <Col md={4}>
                <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`, gap: "10px" }} className='category-tile'>
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Home
