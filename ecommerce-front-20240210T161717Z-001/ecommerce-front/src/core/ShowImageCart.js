import React from "react";
import { API } from "../config";

const ShowImageCart = ({ item, url }) => (
    <div className="product-img">
        <img
            src={`${API}/${url}/photo/${item._id}`}
            alt={item.name}
            className="mb-3"
            style={{ maxHeight: "30%", maxWidth: "100%" }}
        />
    </div>
);

export default ShowImageCart;
