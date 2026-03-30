import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart(params){
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
                console.log(response.data.data);
                setCart(response.data.data);
            } catch(error) {
                console.log(error.response);
            }
        };
        getCart();
    }, []) ;

    const updateCart = async(cartId, productId, qty=1) => {
        try {
            const data = {
                product_id: productId,
                qty: Number(qty)
            }
            const response = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {data});
            console.log(response.data);

            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            console.log(response2.data.data);
            setCart(response2.data.data);
        } catch(error) {
            console.log(error.response);
        }
    }

    const delCart = async(cartId) => {
        try {
            const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
            console.log(response.data);

            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            console.log(response2.data.data);
            setCart(response2.data.data);
        } catch(error) {
            console.log(error.response);
        }
    }

    const clearCart = async(cartId) => {
        try {
            const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
            console.log(response.data);

            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            console.log(response2.data.data);
            setCart(response2.data.data);
        } catch(error) {
            console.log(error.response);
        }
    }

    return(
        <div className="container">
            <h2>購物車列表</h2>
            <div className="text-end mt-4">
                <button type="button" className="btn btn-outline-danger" onClick={() => clearCart()}>清空購物車</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">品名</th>
                        <th scope="col">數量/單位</th>
                        <th scope="col">小計</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cart?.carts?.map(cartItem => (
                           <tr key={cartItem.id}>
                            <td>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => delCart(cartItem.id)}>刪除</button>
                            </td>
                            <th scope="row">{cartItem.product.title}</th>
                            <td>
                                <div className="input-group input-group-sm mb-3">
                                    <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={cartItem.qty} onChange={(e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value))} />
                                    <span className="input-group-text" id="inputGroup-sizing-sm">{cartItem.product.unit}</span>
                                </div>
                            </td>
                            <td className="text-end">{cartItem.final_total}</td>
                            </tr> 
                        ))
                    }
                    
                </tbody>
                <tfoot>
                    <tr>
                        <td className="text-end" colSpan="3">總計</td>
                        <td className="text-end">{cart.final_total}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Cart;