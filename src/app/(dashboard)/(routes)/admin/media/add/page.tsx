"use client"

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect, SyntheticEvent } from "react";
import Image from 'next/image';
import BrowseFile from "@/app/components/BrowseFile";

const AddData = () =>  {

    const router = useRouter();
    const queryParams = useSearchParams();
    const id = queryParams.get('id');

    const [name, setName] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [image, setImage] = useState("");
    const [imageId, setImageId] = useState("");

    const handleMedia = (media: any) => {
        if(media.id) { 
            setImageId(media.id); 
        }
        if(media.name) {
            setImage("/media/"+media.name);
        }
    };

    const removeMedia = () => {
        setImage("")
        setImageId("");
    } 

    const handleSubmit = async (e: SyntheticEvent) => {    
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name); 
        formData.append("imageId", imageId);  

        try {

            const apiMethod = id ? 'patch' : 'post';
            const apiUrl = id ? `/api/media/${id}` : '/api/media';
            
            await axios({
                method: apiMethod,
                url: apiUrl,
                data: formData
            })
            .then(() => {
                setShowAlert(true);
                setAlertMessage('updated successfully');
                router.refresh();
            })
            .catch((error) => {
                throw new Error(error)
            })
            .finally(() => {
            });

        } catch (error:any) {
            console.error(error.response.data);
        }
    };

    const loadData = async() => {
        try {
            axios.get(`/api/media/${id}`)
            .then(
                response => {
                    // console.log(response);
                    if(response.data.data){
                        console.log(response.data.data);
                        setName(response.data.data.name);
                        if( response.data.data.image_id ){
                            getFileById(response.data.data.image_id);
                            setImageId(response.data.data.image_id);
                        }
                    }
                }
            )
            .catch((error) => {
                throw new Error(error)
            })
            .finally(() => {});

        } catch (error:any) {
            console.error(error.response.data);
        }
    }

    const getFileById = async(id:number) => {
        try {
            axios.get(`/api/media/${id}`)
            .then(
                response => {
                    // console.log(response);
                    if(response.data.data){
                        setImage("/media/"+response.data.data.name);
                    }
                }
            )
            .catch((error) => {
                throw new Error(error)
            })
            .finally(() => {});

        } catch (error:any) {
            console.error(error.response.data);
        }
    }
    
    useEffect(() => {
        if(id) {
            loadData();
        }
    }, []);

    return (
        <div className="container-fluid main-content">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">{id? 'Show' : 'Create'} Media</h1>
            </div>

            <div className={`alert alert-primary alert-dismissible fade ${showAlert ? "show" : "d-none"}`} role="alert">
                {alertMessage}
                <button type="button" className="close" onClick={() =>setShowAlert(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card h-100">
                    <div className="card-body">
                        <div className="form-group mb-3">
                            <label>Image</label>
                            <div>
                                {
                                    id ? 
                                    (
                                        <div 
                                            className="card"
                                            style={{ maxWidth: '100%'}} 
                                            >
                                            <div className="card-body p-1">
                                                <Image 
                                                    src={"/media/"+name} alt="" 
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{ 
                                                        width: '100%', 
                                                        height: 'auto',
                                                    }} 
                                                />
                                            </div>

                                            {/* <div className="card-footer p-2">
                                                <button className="btn btn-sm btn-danger btn-icon-split ml-2" onClick={() => removeMedia() }>
                                                    <span className="icon text-white-50">
                                                        <i className="fas fa-trash" />
                                                    </span>
                                                </button>
                                            </div> */}

                                        </div>
                                    
                                    ) 
                                    : 
                                    (
                                        <>
                                            <BrowseFile handleMedia={handleMedia} />                                        
                                        </>
                            
                                    )
                                }
                            </div>

                        </div>
                        <div className="form-group">
                            <label>{name}</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <a className="btn btn-secondary" onClick={() => router.back()}>Back</a>
                        {/* <button type="submit" className="btn btn-primary ml-2">{id? 'Update' : 'Submit'}</button> */}
                    </div>
                </div>
            </form>


        </div>
    );
}

export default AddData;