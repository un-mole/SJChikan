import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues, updateOrderStatus, fromTo } from "./apiAdmin";
import moment from "moment";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [selectedDateFrom, setSelectedDateFrom] = useState(null);
    const [selectedDateTo, setSelectedDateTo] = useState(null);
    const [dateOrder, setDateOrder] = useState([]);

    const { user, token } = isAuthenticated();

    const loadOrders = () => {
        // console.log(user);
        listOrders(user._id, token).then(data => {
            if (data.error) {
                return <h1 className="text-danger">No orders</h1>;
                // console.log(data.error);
            } else {
                // console.log(data);
                const obj = data.filter((o, i) => {
                    if(o !== null) return o;
                })
                setOrders(obj);
                console.log(obj.length);
            }
        });
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                // console.log(data.error);
            } else {
                setStatusValues(data);
            }
        });
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showOrdersLength = () => {
        console.log(orders);        
        if (orders.length > 0) {
            // return (
                // <h1 className="text-danger display-2">
                //     Total orders: {orders.length}
                // </h1>
            // );
        } else {
            return <h1 className="text-danger">No orders</h1>;
        }
    };   
    
    const submitDate = e => {
        e.preventDefault();
        console.log("Submit date");
        fromTo({selectedDateFrom, selectedDateTo}).then(data => {
            if(data.error){
                // console.log(data.error);
            }
            else{
                setOrders(data.result);
                // console.log(data.result);
                // setDateOrder(data.result);
                // console.log("orders");
                // console.log(dateOrder);
                // console.log(orders);
            }
            // console.log(data);
        })
        // .catch(err => console.log(err))
        // console.log(`From ${selectedDateFrom}`);
        // console.log(`To ${selectedDateTo}`);
    }

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input
                type="text"
                value={value}
                className="form-control"
                readOnly
            />
        </div>
    );

    const handleStatusChange = (e, orderId) => {
        // console.log("From " + moment(selectedDateFrom).toDate('DD MMMM YYYY'));
        // console.log("To " + selectedDateTo);
        updateOrderStatus(user._id, token, orderId, e.target.value).then(
            data => {
                if (data.error) {
                    console.log("Status update failed");
                } else {
                    loadOrders();
                }
            }
        );
    };

    const showStatus = o => (
        <div className="form-group">
            <h3 className="mark mb-4">Status: {o.status}</h3>
            <select
                className="form-control"
                onChange={e => handleStatusChange(e, o._id)}
            >
                <option>Update Status</option>
                {statusValues.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <Layout
            title="Orders"
            description={`G'day ${
                user.name
            }, you can manage all the orders here`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="row">
                        <div className="col">
                            <label>From</label>
                            <DatePicker
                            selected={selectedDateFrom}
                            onChange={date => setSelectedDateFrom(date)}
                            dateFormat='dd MMMM yyyy'
                            minDate={Date.parse('01 May 2022')}
                            maxDate={selectedDateTo}
                            />
                        </div>
                        
                        <div className="col">
                            <label>To</label>
                            <DatePicker 
                            selected={selectedDateTo}
                            onChange={date => setSelectedDateTo(date)}
                            dateFormat='dd MMMM yyyy'
                            minDate={selectedDateFrom}
                            maxDate={Date.now()}                
                            />
                        </div>                        
                    </div>
                    <br />
                    <div>
                        <button type="button" onClick={submitDate} class="btn btn-primary">Submit</button>
                    </div>
                    
                    {showOrdersLength()}
                    {/* {console.log(orders)} */}
                    {orders.map((o, oIndex) => {
                        console.log(o);
                        if(o == null){
                            console.log("null");
                        }
                        else{
                            return (
                                <div
                                    className="mt-5"
                                    key={oIndex}
                                    style={{ borderBottom: "5px solid indigo" }}
                                >
                                    <h2 className="mb-5">
                                        <span className="bg-primary">
                                            Order ID: {o._id}
                                        </span>
                                    </h2>
    
                                    <ul className="list-group mb-2">
                                        <li className="list-group-item">
                                            {showStatus(o)}
                                        </li>
                                        <li className="list-group-item">
                                            Transaction ID: {o.transaction_id}
                                        </li>
                                        <li className="list-group-item">
                                            Amount: ₹{o.amount}
                                        </li>
                                        <li className="list-group-item">
                                            Ordered by: {o.user.name}
                                        </li>
                                        <li className="list-group-item">
                                            Mobile: {o.user.phone}
                                        </li>
                                        <li className="list-group-item">
                                            Ordered on:{" "}
                                            {moment(o.createdAt).format('DD MMMM YYYY')}
                                        </li>
                                        <li className="list-group-item">
                                            Delivery address: {o.address}
                                        </li>
                                    </ul>
    
                                    <h3 className="mt-4 mb-4 font-italic">
                                        Total products in the order:{" "}
                                        {o.products.length}
                                    </h3>
    
                                    {o.products.map((p, pIndex) => (
                                        <div
                                            className="mb-4"
                                            key={pIndex}
                                            style={{
                                                padding: "20px",
                                                border: "1px solid indigo"
                                            }}
                                        >
                                            {showInput("Product name", p.name)}
                                            {showInput("Product price", p.price)}
                                            {showInput("Product total", p.count)}
                                            {showInput("Product Id", p._id)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
