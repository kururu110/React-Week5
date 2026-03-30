import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct(params){
    // const location = useLocation();
    // const product = location.state?.productData;

    const { id } = useParams();
    const [product, setProduct] = useState();

    useEffect(() => {
       const handleView = async (id) =>{
        try {
            const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
            console.log(response.data.product);
            setProduct(response.data.product);
            navigate(`/product/${id}`,{
                state: {
                    productData: response.data.product,
                }
            })
        } catch(error){
            console.log(error.response);
        }
     };
     handleView(id);
    }, [id]);

    const addCart = async(id, qty=1) => {
        try {
            const data = {
                product_id: id,
                qty
            }
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {data});
            console.log(response.data);
        } catch(error) {
            console.log(error.response);
        }
    }

    return(
        !product ?(<h2>查無產品</h2>) : (
        <div className="container mt-3">
            <div className="card" style={{width: "18rem"}}>
                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                    <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">價格：{product.price}</p>
                        <p className="card-text"><small className="text-muted">{product.unit}</small></p>
                        <button type="button" className="btn btn-primary" onClick={() => addCart(product.id)}>加入購物車</button>
                    </div>
            </div>
        </div>)
    )
}

export default SingleProduct;