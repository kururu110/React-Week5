import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products(params){
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                console.log(response.data.products);
                setProducts(response.data.products);
            } catch(error) {
                console.log(error.response)
            }
        }
        getProducts();
    },[])

     const handleView = async (id) =>{
        navigate(`/product/${id}`);
    //     try {
    //         const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
    //         console.log(response.data);
    //         navigate(`/product/${id}`,{
    //             state: {
    //                productData: response.data.product,
    //            }
    //        })
    //    } catch(error){
    //        console.log(error.response);
    //    }
     }

    return(
        <div className="container">
            <div className="row">
                {
                    products.map(product => (
                    <div className="col-md-4 mb-3" key={product.id}>
                        <div className="card">
                            <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                            <div className="card-body">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">價格：{product.price}</p>
                                <p className="card-text"><small className="text-muted">{product.unit}</small></p>
                                <button type="button" className="btn btn-primary" onClick={() => handleView(product.id)}>查看更多</button>
                            </div>
                        </div>
                    </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Products;