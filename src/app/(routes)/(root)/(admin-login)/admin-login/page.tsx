"use client";

import { useState, SyntheticEvent, useRef } from "react";
import { useRouter  } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Props = {
    className?: string;
    callbackUrl?: string;
    error?: string;
};

const AdminLogin = (props: Props) => {

  const router = useRouter();
  const email = useRef("");
  const password = useRef("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
  
    const res = await signIn("credentials", {
        email: email.current,
        password: password.current,
        redirect: false,
    });
  
    if (!res?.error) {
        router.push(props.callbackUrl ?? "/admin");
    } else {
        setShowAlert(true);
    }

  };

  return (
    
        <div className="container py-4">

            <div className="card w-50 m-auto">
                <div className="card-header text-center">
                    Administrator Login
                </div>

                <div className="card-body">

                    <div className={`alert alert-danger alert-dismissible fade p-2 ${showAlert ? "show" : "d-none"}`} role="alert">
                        Login Failed!
                        <button 
                            type="button" 
                            className="btn ml-auto" 
                            onClick={() =>setShowAlert(false)}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                onChange={(e) => email.current = e.target.value}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                onChange={(e) => password.current = e.target.value}
                                required
                            />
                        </div>

                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary ml-2">Submit</button>
                        </div>

                    </form>

                </div>

                <div className="card-footer">
                    <Link href={"/forgot-password"}>forgot password?</Link>
                </div>
            </div>

        </div> 
  );
};

export default AdminLogin;