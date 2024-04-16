import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProduct, getCategories, getProducts, createProductSize, getSuppliers } from './apiAdmin';
import { vaultManager } from 'braintree-web';
import ShowImage from '../core/ShowImage';
import Card from '../core/Card';

const AddProduct = () => {
    const [values, setValues] = useState({
        name: '',
        suppliers: [],
        supplier: '',
        size: false,
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: '',
        sizeVal: '',
        s: '',
        m: '',
        l: '',
        xl: '',
        xxl: '',
    });

    const { user, token } = isAuthenticated();
    const {
        name,
        suppliers,
        supplier,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData,
        sizeVal,
        s,
        m,
        l,
        xl,
        xxl
    } = values;

    // load categories and set form data
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                getSuppliers().then(supp => {
                    if(supp.error){
                        setValues({...values, error: supp.error});
                    }
                    else{
                        setValues({
                            ...values,
                            categories: data,
                            suppliers: supp,
                            formData: new FormData()
                        });
                    }
                })
            }
        });
        
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        // test();
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value , error: ''});
    };

    const checkSize = (e) => {        
        handleChange('sizeVal');        
        if(e.target.value === "yes") {

            setValues({ ...values, sizeVal: 'yes'});
        }
        else{
            setValues({ ...values, sizeVal: 'no'});
        }
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });
        console.log(formData);
        createProduct(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                console.log(data);
                setValues({
                    ...values,
                    name: '',
                    supplier: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    category: '',
                    shipping: '',
                    loading: false,
                    createdProduct: data.name
                });
            }
        });
    };

    const clickSubmitSize = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });
        console.log(formData);
        createProductSize(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                console.log(data);
                setValues({
                    ...values,
                    name: '',
                    supplier: '',
                    description: '',
                    photo: '',
                    price: '',
                    shipping: '',
                    quantity: '',
                    loading: false,
                    createdProduct: data.name
                });
            }
        });
    }

    const [checkVal, setCheck] = useState({
        s: false,
        m: false,
        l: false,
        xl: false,
        xxl: false
    });

    const enableBox = name => event => {        
        if(!checkVal[name]) {
            setCheck({...checkVal, [name]: true})
        }    
        else {
            setCheck({...checkVal, [name]: false});
        }         
    }

    const sizeForm = () => (
        <div className="form-group">
            <div>
                <label className="text-muted">S</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input onChange={enableBox('s')} type="checkbox" checked={checkVal.s} />&nbsp;&nbsp;&nbsp;
                <input onChange={handleChange('s')} type="number" disabled={!checkVal.s} value={s}/>
            </div>

            <div>
                <label className="text-muted">M</label>&nbsp;&nbsp;&nbsp;&nbsp;
                <input onChange={enableBox('m')} type="checkbox" checked={checkVal.m} />&nbsp;&nbsp;&nbsp;
                <input onChange={handleChange('m')} type="number" disabled={!checkVal.m} value={m}/>
            </div>

            <div>
                <label className="text-muted">L</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input onChange={enableBox('l')} type="checkbox" checked={checkVal.l} />&nbsp;&nbsp;&nbsp;
                <input onChange={handleChange('l')} type="number" disabled={!checkVal.l} value={l}/>
            </div>

            <div>
                <label className="text-muted">XL</label>&nbsp;&nbsp;&nbsp;
                <input onChange={enableBox('xl')} type="checkbox" checked={checkVal.xl} />&nbsp;&nbsp;&nbsp;
                <input onChange={handleChange('xl')} type="number" disabled={!checkVal.xl} value={xl}/>
            </div>

            <div>
                <label className="text-muted">XXL</label>&nbsp;
                <input onChange={enableBox('xxl')} type="checkbox" checked={checkVal.xll} />&nbsp;&nbsp;&nbsp;
                <input onChange={handleChange('xxl')} type="number" disabled={!checkVal.xxl} value={xxl}/>
            </div>
        </div>
    )

    const newPostForm = () => (
        <form className="mb-3" > {/* onSubmit={clickSubmit} */}
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>                
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Suppliers</label>
                <select onChange={handleChange('supplier')} className="form-control">
                    <option>Please select</option>
                    {suppliers &&
                        suppliers.map((c, i) => (         
                            
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* <div className="form-group">
                <label className="text-muted">Size</label>
                <div>
                    <label className="text-muted">Yes &nbsp;</label>
                    <input onChange={checkSize} value="yes" type="radio" name="size" className="" />&nbsp;
                    <label className="text-muted">No &nbsp;</label>
                    <input onChange={checkSize} value="no" type="radio" name="size" className="" />&nbsp;
                </div>                
            </div> */}
            
            {/* {values.sizeVal === "yes" ? sizeForm() : ''} */}

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option>Please select</option>
                    {categories &&
                        categories.map((c, i) => (         
                            
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* <div className="form-group">
                <label className="text-muted">Fabric</label>
                <select onChange={handleChange('fabric')} className="form-control">
                    <option>Please select</option>
                    {fabric &&
                        fabric.map((c, i) => (
                            <option key={i} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div> */}

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted" style={{display: sizeVal === "yes" ? 'none' : ''}}>Quantity</label>
                <input onChange={handleChange('quantity')} type="number" style={{display: sizeVal === "yes" ? 'none' : ''}} className="form-control" value={quantity} />
            </div>

            <button onClick={clickSubmit} className="btn btn-outline-primary">Create Product</button>

            {/* {sizeVal === "no" ? <button onClick={clickSubmit} className="btn btn-outline-primary">Create Product</button> : ''} */}
            {/* {sizeVal === "yes" ? <button onClick={clickSubmitSize} className="btn btn-outline-primary">Create Product</button> : ''} */}
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${createdProduct}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add a new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddProduct;
