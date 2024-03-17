"use client";

import { useState, SyntheticEvent, useRef } from "react";
import { useRouter  } from "next/navigation";
import axios from "axios";


const ForgotPassword = () => {

  const router = useRouter();
  const email = useRef("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
  
    const apiMethod = 'post';
    const apiUrl = '/api/forgot-password';
    
    await axios({
        method: apiMethod,
        url: apiUrl,
        data: { email: email.current }
    })
    .then( () => {
        setAlertMsg("Reset link sent!");
        router.refresh();
    })
    .catch((error) => {
        setAlertMsg(error.response.data.message);
    })
    .finally(() => {
        setShowAlert(true);
    });

  };

  return (
    
        <div className="container py-4">

            <div className="card w-50 m-auto">
                <div className="card-header text-center">
                    Forgot Password
                </div>

                <div className="card-body">

                    <div className={`alert alert-success alert-dismissible fade p-2 ${showAlert ? "show" : "d-none"}`} role="alert">
                        {alertMsg}
                        <button 
                            type="button" 
                            className="btn ml-auto" 
                            onClick={() => setShowAlert(false)}
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

                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary ml-2">Submit</button>
                        </div>

                    </form>

                </div>

            </div>

        </div> 
  );
};

export default ForgotPassword;