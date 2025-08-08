import { Users } from "react-feather";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark">
            <div className="container">
                <a className="navbar-brand text-white" href="#"><Users className="mr-1" />&nbsp;Attendance Dashboard </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {auth?.user.role === 1 && (
                            <>
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link active text-white fw-light" aria-current="page">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link active text-white fw-light" aria-current="page">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <form className="d-flex" role="search">
                        <div className="ms-auto">
                            {auth?.user && (
                                <>
                                    <span className="badge bg-light text-muted">Logged In As: {auth.user.name}</span> &nbsp;
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
