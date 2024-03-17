"use client"

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect, SyntheticEvent } from "react";
import slugify from 'react-slugify';
import Image from 'next/image';
import BrowseFile from "@/app/components/BrowseFile";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';

const AddData = () =>  {

    const router = useRouter();
    const queryParams = useSearchParams();
    const id = queryParams.get('id');

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { data: session } = useSession();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [listCat, setListCat] = useState([]);
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState<number | string | null>(null);
    const [categories, setCategories] = useState<number[]>([]);
    const [published, setPublished] = useState(true);

    const [image, setImage] = useState("");
    const [imageId, setImageId] = useState("");

    const CustomEditor = dynamic( () => {
        return import( '@/app/components/custom-editor' );
      }, { ssr: false } );

    const handleMedia = (media: any) => {
        if(media.id) { 
            setImageId(media.id); 
        }
        if(media.name) {
            setImage("/media/"+media.name);
        }
    };

    const handleTitle = (nameParam:string) => {
        setTitle(nameParam);
        setSlug( slugify(nameParam) );
    }

    const removeMedia = () => {
        setImage("")
        setImageId("");
    } 

    const handlePublished = () => {
        setPublished(!published);
    }

    const handleCategories = (idParam: string) => {
        let id: number = Number(idParam);
        const indexOfId = categories.indexOf(id);

        //if category id exist, remove. Otherwise add
        if( indexOfId > -1 ) { 
            categories.splice(indexOfId, 1);
        } else {
            categories.push(id);
        }
  
    }

    const handleContent = (dataContent: string) => {
        setContent(dataContent);
    }

    const handleSubmit = async (e: SyntheticEvent) => {    
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title); 
        formData.append("slug", slug); 
        formData.append("content", content); 
        formData.append("imageId", imageId);  
        formData.append("authorId", String(authorId)); 
        formData.append("categories", JSON.stringify(categories)); 
        formData.append("published", String(published));

        try {

            const apiMethod = id ? 'patch' : 'post';
            const apiUrl = id ? `/api/post/${id}` : '/api/post';
            
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
                throw new Error(error);
            })
            .finally(() => {
            });

        } catch (error:any) {
            console.error(error.response.data);
        }

    };

    const loadData = async() => {
        try {
            axios.get(`/api/post/${id}`)
            .then(
                response => {
                    // console.log(response.data.data);
                    if(response.data.data){
                        setTitle(response.data.data.title);
                        setSlug(response.data.data.slug);
                        setPublished( Boolean(response.data.data.published) );
                        setContent(response.data.data.content);
                        
                        let cat = response.data.data.categories;
                        let resCat:number[] = [];
                        cat.map(function(val:any) {
                            resCat.push( Number(val.category_id) );
                        });

                        setCategories(resCat);

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

    const getListCat = () => {
        try {
            axios.get(`/api/postcat/`)
            .then(
                response => {
                    // console.log(response.data.data);
                    if(response.data.data){
                        setListCat(response.data.data);
                    }
                }
            )
            .catch((error) => {
                throw new Error(error);
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

        getListCat();

        if (session && session.user) { 
            setAuthorId(session?.user?.id);
        }; 

    }, [session]);

    return (
        <div className="container-fluid main-content">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">{id? 'Update' : 'Create'} Post</h1>
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
                        <div className="row">
                            <div className="col-md-9">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => handleTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Slug</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Image</label>
                                    <div>
                                        {
                                            image ? 
                                            (
                                                <div 
                                                    className="card"
                                                    style={{ maxWidth: '10%'}} 
                                                    >
                                                    <div className="card-body p-1">
                                                        <Image 
                                                            src={image} alt="" 
                                                            width={0}
                                                            height={0}
                                                            sizes="100vw"
                                                            style={{ 
                                                                width: '100%', 
                                                                height: 'auto',
                                                            }} 
                                                        />
                                                    </div>

                                                    <div className="card-footer p-2">
                                                        <button className="btn btn-sm btn-danger btn-icon-split ml-2" onClick={() => removeMedia() }>
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-trash" />
                                                            </span>
                                                        </button>
                                                    </div>
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
                                    <label>Content</label>
                                    <CustomEditor 
                                        initialData={content}
                                        handleCKEditor={handleContent}
                                    />

                                </div>
                            </div>
                            <div className="col-md-3">
                            <div className="card">
                                    <div className="card-header">
                                        Save as Draft
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="published" checked={!published} onChange={handlePublished} />
                                                <label className="form-check-label" htmlFor="published">
                                                    Draft
                                                </label>
                                            </div>    
                                        </div>
                                    </div>
                                </div>

                                <div className="card mt-4">
                                    <div className="card-header">
                                        Categories
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            {
                                                listCat ? 
                                                (
                                                    <>
                                                        {listCat.map((item:any, index) => (
                                                            <div className="form-check" key={index}>
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="checkbox" 
                                                                    value={item.id} 
                                                                    id={`list`+item.id} 
                                                                    onChange={(e) => handleCategories(e.target.value)} 
                                                                    defaultChecked={categories.indexOf(item.id) > -1 ? true : false}
                                                                />

                                                                <label className="form-check-label" htmlFor={`list`+item.id}>
                                                                    {item.name}
                                                                </label>

                                                            </div>    
                                                        ))}
                                                    </>
                                                ) 
                                                : 
                                                <p>{"No Categories"}</p>
                                            }
                                            
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="card-footer">
                        <a className="btn btn-secondary" onClick={() => router.back()}>Back</a>
                        <button type="submit" className="btn btn-primary ml-2">{id? 'Update' : 'Submit'}</button>
                    </div>
                </div>
            </form>


        </div>
    );
}

export default AddData;