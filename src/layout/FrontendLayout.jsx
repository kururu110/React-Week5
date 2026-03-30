import { Link, Outlet } from "react-router-dom";

function FrontendLayout(params){
    return(
        <>
        <header>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/">首頁</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/products">產品列表</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/cart">購物車</Link>
                </li>
            </ul>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
        </>
    )
}

export default FrontendLayout;