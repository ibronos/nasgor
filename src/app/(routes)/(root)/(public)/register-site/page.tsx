"use client";

import { useState, SyntheticEvent, useEffect } from "react";
import { useRouter  } from "next/navigation";
import axios from "axios";

const AddData = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterAllowed, setIsRegisterAllowed] = useState(true);
  const router = useRouter();

  useEffect(() => {

    axios.get("/api/registersite")
    .then((res) => {
      setIsLoading(false);
      if(res.data.data.totalUser > 0) {
        setIsRegisterAllowed(false);
      }
    })

  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
        await axios.post("/api/registersite", {
            email: email,
            name: name,
            password: password,
        }).then(() => {
          alert('data updated!')
          router.refresh();
        })
        .catch((error) => {
          throw new Error(error)
        })
        .finally(() => {});
      } catch (error:any) {
        console.error(error.response.data);
      }
  };

  if(!isRegisterAllowed) { 
    router.push("/404");
    return null; 
  }

  if (isLoading) { 
    return <p className="container py-4">Loading...</p> 
  };

  return (
    
        <div className="container py-4">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Register Admin Site</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">Email</label>
                    <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">Name</label>
                    <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">Password</label>
                    <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mt-2">
                    <button type="submit" className="btn btn-primary ml-2">Submit</button>
                </div>

            </form>
        </div> 
  );
};

export default AddData;