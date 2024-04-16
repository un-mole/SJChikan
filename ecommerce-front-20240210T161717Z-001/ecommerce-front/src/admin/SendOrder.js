import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProduct, sendOrder } from "./apiAdmin";
import Card from "../core/Card";
import ShowImage from "../core/ShowImage";

const SendOrder = (id) => {    
    const [product, setProduct] = useState({
        name: '',
        supplier: '',
        email: '',
        description: '',
        category: '',
        quantity: 1,
        message: '',
        error: false,
        success: false
    });
    // destructure user and token from localstorage
    const { user, token } = isAuthenticated();
    const { name, supplier, description, category, quantity, message, error, success } = product;
    
    const handleChange = name => e => {
        setProduct({...product, error: false, [name]: e.target.value});        
    };

    const init = () => {
        console.log(id);
        getProduct(window.location.pathname.substring(21,)).then(data => {
            if(data.error){
                console.log(data.error);
            }
            else{
                // console.log(data);
                setProduct({
                    name: data.name,
                    supplier: data.supplier.name,
                    email: data.supplier.email,
                    description: data.description,
                    category: data.category.name
                });
            }
        })
    }

    useEffect(() => {
        init();
    }, []);

    const clickSubmit = e => {
        e.preventDefault();
        sendOrder(product);
        setProduct({
            name: '',
            description: '',
            supplier: '',
            category: '',
            quantity: '',
            message: '',
            error: '',
            success: true
        })
        // setProduct({...product, error: false, success: false})
        
    };

    const newCategoryFom = () => (
        <div>
            {/* <div className="col-8">
                <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {item.map((product, i) => (
                            <div className="col-4 mb-3">
                                <Card product={item} />
                                <ShowImage item={product} url="product" />
                            </div>
                        ))}
                    </div>
                <hr />                    
            </div> */}
        <form onSubmit={clickSubmit}>
            
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange('name')} disabled value={name} autoFocus required />
            </div>
            <div className="form-group">
                <label className="text-muted">Description</label>
                <input type="text" className="form-control" onChange={handleChange('description')} disabled value={description} autoFocus required />
            </div>
            <div className="form-group">
                <label className="text-muted">Supplier</label>
                <input type="text" className="form-control" onChange={handleChange('supplier')} disabled  value={supplier} autoFocus required />
            </div>
            <div className="row">
                <div className="col-3">
                    <div className="form-group">
                        <label className="text-muted">Category</label>
                        <input type="text" className="form-control" onChange={handleChange('category')} disabled value={category} autoFocus required />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Quantity</label>
                        <input type="number" className="form-control" onChange={handleChange('quantity')} value={quantity} min={1} autoFocus required />
                    </div>
                </div>
                <div className="col">
                    {/* <Card product={product} /> */}
                    {/* <ShowImage item={product} url="/admin/product/order/:productId" /> */}
                    {/* <img src={`${API}/product/order/`} /> */}
                </div>
            </div>
            <div className="form-group">
                <label className="text-muted">Message</label>
                <textarea type="text" className="form-control" onChange={handleChange('message')} value={message} autoFocus required />
            </div>
            {message ? <button className="btn btn-outline-primary" onClick={clickSubmit}>Send Order</button> : ''}
        </form>
        </div>
    );

    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">Order sent</h3>;
        }
    };

    const showError = () => {
        if (error) {
            return <h3 className="text-danger">Category should be unique</h3>;
        }
    };

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout
            title="Send a new order"
            description={`G'day ${user.name}, ready to send a new order?`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryFom()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
};

export default SendOrder;
