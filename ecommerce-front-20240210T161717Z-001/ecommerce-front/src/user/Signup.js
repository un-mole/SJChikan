import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup, otp, checkSignup } from '../auth';

const Signup = () => {    

    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        cpassword: '',
        otp1: '',
        error: '',
        success: false
    });

    const [modal, setModal] = useState(false);
    const [otp2, setOtp2] = useState('');
    
    const { name, email, phone , password, cpassword, otp1, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleChangeOTP = name => event => {
        setValues({...values, error: false, [name]: event.target.value});
        if(parseInt(event.target.value) === otp2){

            signup({ ...values }).then(data => {
                if(data.error){
                    setValues({ ...values, error: data.error, success: false });
                }
                else{
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                        cpassword: '',
                        otp1: '',
                        error: '',
                        success: true
                    });
                }
            });

            // setValues({
            //     ...values,
            //     name: '',
            //     email: '',
            //     phone: '',
            //     password: '',
            //     cpassword: '',
            //     otp1: '',
            //     error: '',
            //     success: true
            // });

        }
        // else{
            // setValues({...values, error: 'OTP not correct', [name]: event.target.value});
        // }
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        
        // otp({email}).then(data => {
        //     if(data.error){
        //         setValues({ ...values, error: data.error, success: false });
        //     }
        //     else{
                
        //     }
        // });

        checkSignup({ email }).then(data => {
            if(data.error){
                setValues({ ...values, error: data.error, success: false });
            }
            else{
                otp({ email }).then(data => {
                    if(data.error){
                        setValues({ ...values, error: data.error, success: false });
                    }
                    else{
                        console.log(data);
                        setOtp2(data.otp);                                              
                    }
                })
            }
        });

        // signup({ name, email, phone, password }).then(data => {
        //     if (data.error) {
        //         setValues({ ...values, error: data.error, success: false });
        //     } else {
        //         otp({email}).then(data => {
        //             if(data.error){
        //                 setValues({ ...values, error: data.error, success: false });
        //             }
        //             else{                        
                        // otpReceived = data.otp;
                        // setOtp2(data.otp);
                        // if(otp1 === data.otp){
                        //     setValues({
                        //         ...values,
                        //         name: '',
                        //         email: '',
                        //         phone: '',
                        //         password: '',
                        //         cpassword: '',
                        //         otp1: '',
                        //         error: '',
                        //         success: true
                        //     });
                        // }
            //         }
            //     });     
            // }
            // console.log(`OTP Received = ${otpReceived}`);
        // });
    };

    const test = () => (
        <div className="form-group">
            <label className="text-muted">OTP</label>
            <input onChange={handleChangeOTP('otp1')} type="number" className="form-control" value={otp1} />
        </div>
    );    

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Phone Number</label>
                <input onChange={handleChange('phone')} type="number" className="form-control" value={phone} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>

            <div className="form-group">
                <label className="text-muted">Confirm Password</label>
                <input onChange={handleChange('cpassword')} type="password" className="form-control" value={cpassword} />
            </div>                    

            <button onClick={checkPassword} className="btn btn-primary">
                Submit
            </button>

            <br /><br />
            {modal && test()}
        </form>
    );

    const checkPassword = (e) => {
        
        if(password === cpassword){
            setModal(true);            
            clickSubmit(e);
        }
        else{
            e.preventDefault();
            setValues({...values, error: 'Password Not Matching', success: false});
            // showError();
            // clickSubmit(e);
        }
    }

    const showError = () => (    
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    return (
        <Layout
            title="Signup"
            description="Signup to SJ Chikan Vatika E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {signUpForm()}
        
        </Layout>
    );
};

export default Signup;
