import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { signin, authenticate, isAuthenticated } from "../auth";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { forgot } from "../auth";

const Forgot = () => {

    const [values, setValues] = useState({
        email: '',
        otp: '',
        password: '',
        cpassword: '',
        temp: 0,
        error: ''
    });

    const { email, otp, password, cpassword, error } = values;

    let temp = values.temp;    

    const handleChange = name => e => {
        setValues({...values, temp:1})
        console.log(values);
        // setValues({...values, [name]: e.target.value})
        console.log(values.temp);
    }

    const submitButton = (e) => {
        e.preventDefault();
        if(temp === 0){
            // setValues({...values, temp: 1});
            temp = 1;
        }
        
        forgot({ email })
        .then(data => {
            if(data.error){
                setValues({error: data.error});
            }            
        });        
        
        // console.log(temp);
    }

    const panelEmail = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange("email")} type="email" className="form-control" value={email} />
            </div>

            <button onClick={submitButton} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const panel = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange("email")} type="email" className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">OTP</label>
                <input onChange={handleChange("otp")} type="number" className="form-control" value={otp} />
            </div>

            <button onClick={submitButton} className="btn btn-primary">
                Submit
            </button>
        </form>
    );
    
    const showError = () => (    
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    return(
        <Layout
            title="Forgot Password"
            description="Change Password to SJ Chikan Vatika E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            <h4>{temp}</h4>
            {temp > 0 ? panel() : panelEmail()}
            {showError()}
        </Layout>
    );
}

export default Forgot;