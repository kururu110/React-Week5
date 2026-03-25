//定義useRef後需要匯入
import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";
import "./assets/style.css";
import * as bootstrap from "bootstrap";
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 產品初始資料模板
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  // 表單資料狀態(儲存登入表單輸入)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // 登入狀態管理(控制顯示登入或產品頁）
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});

  // useRef 建立對 DOM 元素的參考，這裡用於控制產品Modal的顯示與隱藏
  const productModalRef = useRef(null);

  const handleInputChange = (e) =>{
    const { name , value } = e.target;
    // console.log(name,value)
    setFormData((preData) =>({
      ...preData,
      [name]:value,
    }));
  }

  // Modal中變更欄位輸入的函式
  const handleModalInputChange = (e) =>{
    const { name, value, checked, type } = e.target;
    setTempProduct((pre) => ({
      ...pre,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Modal中變更圖片的函式
  const handleModalImageChange = (index, value) =>{
    setTempProduct((pre) =>{
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

      if (value !== "" && index === newImage.length-1 && newImage.length < 5){
        newImage.push("");
      }
      if (value === "" && newImage.length > 1 && newImage[newImage.length-1] === ""){
        newImage.pop();
      }
      return {
        ...pre,
        imagesUrl: newImage,
      };
    })
  }

  // Modal中新增圖片的函式
  const handleAddImage = () =>{
    setTempProduct((pre) =>{
      const newImage = [...pre.imagesUrl];
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    })
  }

  // Modal中刪除圖片的函式
  const handleDeleteImage = () =>{
    setTempProduct((pre) =>{
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    })
  }

  // 從後端取得API資料的函式
  const getProducts = async (page=1) =>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error){
      console.error("載入失敗", error.response);
    }
  }

  // 更新產品的函式
  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit"){
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    // 處理產品資料格式，符合後端API要求
    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: tempProduct.imagesUrl.filter((url) => url !== ""),
      },
    }

    // 根據modal type決定更新或是新增產品
    try {
      const response = await axios[method](url, productData);
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response);
    }
  }

  // 刪除產品的函式
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response);
    };
  }

  // 上傳圖片的函式
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if(!file) {
      return
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData)
      setTempProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }))
    } catch (error) {
      console.log(error.response);
    }
  }

  const onSubmit = async (e) =>{
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      // console.log(response)
      const {token, expired} = response.data;
      document.cookie = `hextoken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;

      const responseCheck = await axios.post(`${API_BASE}/api/user/check`);
      console.log("檢查登入狀態回應", responseCheck);
      
      getProducts();
      setIsAuth(true);
      
    } catch (error) {
      setIsAuth(false);
      console.error("登入失敗:", error.response?.data?.message || error.message);
      alert("登入失敗，請檢查帳號密碼是否正確");
    }
  }

  const checkLogin = async () =>{
        try {
          const response = await axios.post(`${API_BASE}/api/user/check`);
          console.log("檢查登入狀態回應：", response);
          setIsAuth(true);
          getProducts();
        } catch (error) {
          console.log(error.response?.data.message);
          alert("登入狀態異常，請重新登入");
          setIsAuth(false);
        }
      };

  useEffect(() => {
    // 從 Cookie 取得 token
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hextoken="))
      ?.split("=")[1];
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        checkLogin();
      } else {
        setIsAuth(false);
      }

      // 在 useEffect 中初始化
      productModalRef.current = new bootstrap.Modal("#productModal", {
        keyboard:false,
      })
    },[]);

    // 打開Modal的函式
    const openModal = (type, product) => {
      // console.log(product);
      setModalType(type);
      setTempProduct((pre) => ({
        ...pre,
        ...product,
      }));
      productModalRef.current.show();
    }

    // 關閉Modal的函式
    const closeModal = () => {
      productModalRef.current.hide();
    }

  return (
    <>
    {!isAuth ? (
      <div className='container'>
        <h1>請先登入</h1>
        <form onSubmit={(e)=> onSubmit(e)}>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" name="username" placeholder="name@example.com" value={formData.username} onChange={(e) => handleInputChange(e)} />
            <label htmlFor="floatingInput">Email address</label>
            </div>
          <div className="form-floating">
            <input type="password" className="form-control" name="password" placeholder="Password" value={formData.password} onChange={(e) => handleInputChange(e)} />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className='btn btn-primary mt-2' type='submit'>登入</button>
        </form>
    </div>) : (
      <>
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <div className="text-end mt-4">
                {/* 新增產品按鈕 */}
                <button type="button" className="btn btn-primary" onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}>建立新的產品</button></div>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{width:"200px"}}>分類</th>
                    <th style={{width:"250px"}}>產品名稱</th>
                    <th style={{width:"200px"}}>原價</th>
                    <th style={{width:"200px"}}>售價</th>
                    <th style={{width:"200px"}}>是否啟用</th>
                    <th style={{width:"200px"}}>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? "啟用" : "未啟用" }</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openModal("edit", product)}>編輯</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal("delete", product)}>刪除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination pagination={pagination} onChangePage={getProducts}/>
            </div>
          </div>
        </div>
        </>
    )}
    
    <ProductModal
      modalType={modalType}
      tempProduct={tempProduct}
      handleModalInputChange={handleModalInputChange}
      handleModalImageChange={handleModalImageChange}
      handleAddImage={handleAddImage}
      handleDeleteImage={handleDeleteImage}
      deleteProduct={deleteProduct}
      updateProduct={updateProduct}
      uploadImage={uploadImage}
      closeModal={closeModal}
    />
    </>
  );
}

export default App;
