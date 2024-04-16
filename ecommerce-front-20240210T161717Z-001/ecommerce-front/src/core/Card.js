import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';
import ShowImageCart from './ShowImageCart';

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = f => f,
  run = undefined
  // changeCartSize
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const [sizes, setSizes] = useState({
    size: false,
    productQuantity: false
  });

  const { size, productQuantity } = sizes;

  const init = () => {
    if(product.s || product.m || product.l || product.xl || product.xxl){
      // console.log("object");
      setSizes({...sizes, size: true, productQuantity: false});
      console.log(size);
    }
    else{
      setSizes({...sizes, productQuantity: true, size: false});
    }
  }

  useEffect(() => {
    console.log(product);
    init();
}, []);

  const showViewButton = showViewProductButton => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
        </Link>
      )
    );
  };
  const addToCart = () => {    
    addItem(product, setRedirect(true));
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCartBtn = showAddToCartButton => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
          Add to cart
        </button>
      )
    );
  };

  let quant = 0;

  const handleSize = name => event => {    
    event.preventDefault();
    // console.log(product[name]);
    quant = product[name];
  }

  const showStock = quantity => {
    // console.log("Quantity " + quantity);
    return quantity > 0 ? (      
      <span className="badge badge-primary badge-pill">In Stock {quantity}</span>
    ) : (
      <span className="badge badge-danger badge-pill">Out of Stock </span>
    );
    // console.log(size);
    // if(size) {
    //   return ( 
    //   <div>
    //     {product.s > 0 ? <button style={{borderRadius : "30px"}} onClick={handleSize('s')} type="button" class="btn btn-outline-primary">S {product.s}</button> : ''}
    //     {product.m > 0 ? <button style={{borderRadius : "30px"}} onClick={handleSize('m')} type="button" class="btn btn-outline-primary">M {product.m}</button> : ''}
    //     {product.l > 0 ? <button style={{borderRadius : "30px"}} onClick={handleSize('l')} type="button" class="btn btn-outline-primary">L {product.l}</button> : ''}
    //     {product.xl > 0 ? <button style={{borderRadius : "30px"}} onClick={handleSize('xl')} type="button" class="btn btn-outline-primary">XL {product.xl}</button> : ''}
    //     {product.xxl > 0 ? <button style={{borderRadius : "30px"}} onClick={handleSize('xxl')} type="button" class="btn btn-outline-primary">XXL {product.xxl}</button> : ''}
    //   </div>
    //   )
    // }
    // else if(productQuantity){
    //   return ( <span className="badge badge-primary badge-pill">In Stock {quantity}</span> )
    // }
    // else{
    //   return ( <span className="badge badge-danger badge-pill">Out of Stock {product.s}</span> )
    // }
  };

  const handleChange = productId => event => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            {/* {console.log(productQuantity)}
            {console.log(size)} */}
            {product.quantity > 0 ? <input type="number" className="form-control" value={count} max={product.quantity} onChange={handleChange(product._id)} /> : ''}
            {/* {productQuantity ? <input type="number" className="form-control" value={count}  onChange={handleChange(product._id)} /> : ""}
            {size ? <input type="number" className="form-control" max={quant}   onChange={handleChange(product._id)} /> : " "} */}
          </div>
        </div>
      )
    );
  };
  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };
  return (
    <div className="card ">
      <div className="card-header card-header-1 ">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <p className="card-p  mt-2">{product.description.substring(0, 100)} </p>
        <p className="card-p black-10">₹ {product.price}</p>
        <p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added on {moment(product.createdAt).format('DD MMMM YYYY')}</p>
        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCartBtn(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
