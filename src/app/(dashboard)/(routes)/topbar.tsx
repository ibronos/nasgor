"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Topbar() {
    const { data: session } = useSession();
    const [name, setName] = useState<any | null>(null);
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!show); 
    };

    useEffect(() => {
        if (session && session.user) { setName(session.user.name) };
    });

    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                >
                    <i className="fa fa-bars" />
                </button>
                <ul className="navbar-nav ml-auto">
                    <li className={`nav-item dropdown no-arrow ${show ? "show" : ""}`} onClick={handleShow}>

                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="userDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                {name}
                            </span>
                            <Image 
                            className="img-profile rounded-circle" 
                            src="/sb-admin/images/undraw_profile.svg" 
                            alt="" 
                            width={0}
                            height={0}
                            sizes="auto"
                            style={{ width: '2rem', height: '2rem' }} 
                            />
                        </a>
                        {/* Dropdown - User Information */}
                        <div
                            className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${show ? "show" : ""}`}
                            aria-labelledby="userDropdown"
                        >
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                Profile
                            </a>
                            <div className="dropdown-divider" />
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    data-toggle="modal"
                                    data-target="#logoutModal"
                                    onClick={() => signOut()}
                                    >
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                    Logout
                                </a>
                            </div>

                    </li>
                </ul>
            </nav>
        </>

    )
  }
  