"use client";

import { useState, SyntheticEvent, useRef, useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import axios from "axios";

const ForgotPassword = ()  => {

  const router = useRouter();
  const password = useRef("");
  const repeatpassword = useRef("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const searchParams = useSearchParams(); 
  const token = searchParams.get('token');

  useEffect(() => {
    axios.get(`/api/reset-password?token=${token}`)
    .then((res) => {
        if(res.data.data) {
            setIsLinkExpired(res.data.data.isLinkExpired);
        }
    })

  }, [token, isLinkExpired]);

  if(isLinkExpired) { 
    router.push("/404");
    return null; 
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    console.log(password);
    console.log(repeatpassword);

    if(password.current != repeatpassword.current) {
        setAlertMsg("password does not match!");
        setShowAlert(true);
        return;
    }
  
    const apiMethod = 'post';
    const apiUrl = '/api/reset-password';
    
    await axios({
        method: apiMethod,
        url: apiUrl,
        data: { 
            token: token,
            password: password.current }
    })
    .then( () => {
        setAlertMsg("Password Successfully Updated!");
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
                    Reset Password
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
                            <label htmlFor="email">New Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                onChange={(e) => password.current = e.target.value}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Repeat New Password</label>
                            <input
                                id="repepatpassword"
                                type="password"
                                className="form-control"
                                onChange={(e) => repeatpassword.current = e.target.value}
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