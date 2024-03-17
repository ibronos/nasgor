"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type typeParams = {
    handleMedia: any
};

const BrowseFile = ( {handleMedia} : typeParams ) =>  {

    const [showSelect, setShowSelect] = useState(false);
    const [isUploading, setUploading] = useState(false);

    const [media, setMedia] = useState({});

    const handleShowSelect = () => {
        setShowSelect(!showSelect); 
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file); 
        
        try {

            const apiMethod = 'post';
            const apiUrl = '/api/media';
            
            await axios({
                method: apiMethod,
                url: apiUrl,
                data: formData
            })
            .then(response => {
                // console.log(response.data.data.media);
                setUploading(false);
                setMedia(response.data.data.media);
            })
            .catch((error: any) => {
                throw new Error(error);
            })
            .finally(() => {
            });

        } catch (error:any) {
            console.error(error.response.data);
        }
    };

    useEffect(() => {
        handleMedia(media);
    }, [media]);

    if (isUploading) { 
        return <p className="container-fluid py-4">Uploading...</p> 
    };
    
    return (
        <>
            <button type="button" className={`d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm`} onClick={handleShowSelect}>
                <i className="fas fa-check fa-sm text-white-50 pr-1" /> 
                Select File
            </button>

            <span className="px-2">or</span>

            <label className={`custom-file-upload d-sm-inline-block btn btn-sm btn-danger shadow-sm`} >
                <input
                    type="file"
                    name="file"
                    onChange={(e) => {
                        if (e.target.files) {
                            const targetFile = e.target.files[0];
                            handleUpload(targetFile);
                        }
                    }} 
                /> 
                <i className="fas fa-upload fa-sm text-white-50 pr-1" /> 
                Upload
            </label>

            <div className={`modal fade ${showSelect ? "show" : ""}`}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Select File</h5>
                            <button type="button" className="close" onClick={handleShowSelect}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            asd
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Select</button>
                        </div>
                    </div>
                </div>
            </div>

            <div 
                className={`${showSelect ? "modal-backdrop" : "d-none"}`}
                style={{ 
                    opacity: '0.5', 
                }} 
            >
            </div>

        </>

    );
}

export default BrowseFile;