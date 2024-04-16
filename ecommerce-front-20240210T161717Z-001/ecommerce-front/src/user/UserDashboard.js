import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";
import ShowImage from "../core/ShowImage";
import ShowImageCart from "../core/ShowImageCart";

const Dashboard = () => {
    const [history, setHistory] = useState([]);

    const {
        user: { _id, name, email, role }
    } = isAuthenticated();
    const token = isAuthenticated().token;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        });
    };

    useEffect(() => {
        init(_id, token);
    }, []);

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">
                            My Cart
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>
                            Update Profile
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        {/* {console.log(history)} */}
                        {history.map((h, i) => {
                            return (
                                <div>
                                    <hr />
                                    {h.products.map((p, i) => {
                                        console.log(p);
                                        return (
                                            <div className="row">
                                                <div key={i} className="col" > {/*style={{border: "1px solid red"}}*/}
                                                <hr/>
                                                    <h6>Product name: {p.name}</h6>
                                                    <h6>
                                                        Product price: ₹{p.price}
                                                    </h6>
                                                    <h6>Quantity: {p.count} </h6>
                                                    <h6>Amont: {h.amount}</h6>
                                                    <h6>
                                                        Purchased date:{" "}
                                                        {moment(
                                                            p.createdAt
                                                        ).format('DD MMMM YYYY')}
                                                    </h6>
                                                    <h6>Order Status: {h.status}</h6>
                                                    <h6>Delivery Address: {h.address}</h6>
                                                </div >
                                                
                                                {/* <div className="col-3" style={{height: "30%"}}>
                                                    <ShowImageCart item={p} url="product" />
                                                </div> */}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{userLinks()}</div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
