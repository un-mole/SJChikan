import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getCategories, createSupplier } from "./apiAdmin";

const AddSupplier = () => {
    // const [name, setName] = useState("");
    // const [error, setError] = useState(false);
    // const [success, setSuccess] = useState(false);
    // const [phone, setPhone] = useState(0);
    // const [email, setEmail] = useState("");
    // const [address, setAddress] = useState("");

    const [ values, setValues ] = useState({
        name : '',
        error: false,
        categories: [],
        category: '',
        success: false,
        phone: Number,
        email: '',
        address: ''
    });

    const { name, error, categories, category, success, phone, email, address} = values;

    // destructure user and token from localstorage
    const { user, token } = isAuthenticated();

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    categories: data,
                    formData: new FormData()
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => e => {
        // setError("");
        setValues({...values, error: '', success: false});
        // setName(e.target.value);        
        setValues({...values, [name]: e.target.value});
    };

    const clickSubmit = e => {
        e.preventDefault();
        // setError("");
        setValues({...values, error: ''});

        // setSuccess(false);
        setValues({...values, success: false});
        const data = {
            name: values.name,
            phone: values.phone,
            email: values.email,
            category: values.category,
            address: values.address
        }
        createSupplier(user._id, token, data).then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({...values, error: false, success: true});
            }
        })
        
        // make request to api to create category
        // createCategory(user._id, token, { name }).then(data => {
        //     if (data.error) {
        //         setError(data.error);
        //     } else {
        //         setError("");
        //         setSuccess(true);
        //     }
        // });
    };

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange('name')} value={name} autoFocus />
            </div>

            <div className="form-group">
                <label className="text-muted">Phone number</label>
                <input type="number" className="form-control" onChange={handleChange('phone')} value={phone} autoFocus />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" onChange={handleChange('email')} value={email} autoFocus />
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

            <div className="form-group">
                <label className="text-muted">Address</label>
                <input type="text" className="form-control" onChange={handleChange('address')} value={address} autoFocus />
            </div>
            <button className="btn btn-outline-primary">Create Supplier</button>
        </form>
    );

    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">{name} is created</h3>;
        }
    };

    const showError = () => {
        if (error) {
            console.log(error);
            return <h3 className="text-danger">{error}</h3>;
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
            title="Add a new supplier"
            description={`G'day ${user.name}, ready to add a new supplier?`}
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

export default AddSupplier;
