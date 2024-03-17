"use client"

import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import AddDataAdminButton from "@/app/components/AddDataAdminButton";
import Link from "next/link";

const Index = () =>  {

    const router = useRouter();
    const pathname = usePathname();
    const [totalPagination, setTotalPagination] = useState(0);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [search, setSearch] = useState("");
    const [refreshData, setRefreshData] = useState(false);

    const loadData = async() => {
        try {
            axios.get(`/api/post?page=${page}&limit=${limit}&search=${search}`)
            .then(
                response => {
                    setItems(response.data.data);
                    setTotalPagination(response.data.totalPagination);
                    setPage(response.data.page);
                    setLimit(response.data.limit);
                    setTotalData(response.data.totalData);
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

    const handleSearch = (event:any) => {
        event.preventDefault();
        setRefreshData(!refreshData)
    };

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Are you sure want to delete ${name}?`) == true) {
            await axios.delete(`/api/post/${id}`).then(() => {
                alert('deleted successfully');
                router.refresh();
                setRefreshData(!refreshData);
              })
              .catch((error) => {
                throw new Error(error)
              })
              .finally(() => {
              });
          } else {
            router.refresh();         
            setRefreshData(!refreshData);
          }
    };

    useEffect(() => {
        loadData();
    }, [limit, page, refreshData]);


    return (
        <>
            <div className="container-fluid main-content">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Posts</h1>
                    <AddDataAdminButton />
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="row align-items-center py-3">
                            <div className="col-md-6">
                                <div className="dataTables_length row" id="dataTable_length">
                                    <span className="inline col-auto">
                                        Show
                                    </span>
                                    <span className="col-auto">
                                        <select
                                            name="dataTable_length"
                                            className="custom-select custom-select-sm form-control form-control-sm"
                                            onChange={(e) => setLimit(Number(e.target.value))}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </span>
                                
                                </div>
                            </div>
                            <div className="col-md-6">
                                <form
                                    onSubmit={handleSearch} 
                                    className="d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search p-0 float-right">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 small"
                                            placeholder="Search for..."
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                        <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                            <i className="fas fa-search fa-sm" />
                                        </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <table className="table table-sm table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item:any, index) => (
                                    <tr key={item.id}>
                                        <th scope="row" className="align-middle">{++index}</th>
                                        <td className="align-middle">{item.title}</td>
                                        <td className="align-middle">
                                            {item.published == 1 ? 'published' : 'draft' }
                                        </td>
                                        <td>
                                            <Link href={pathname + "/add/?id=" + item.id} className="btn btn-sm btn-info btn-icon-split">
                                                <span className="icon text-white-50">
                                                    <i className="fas fa-info-circle" />
                                                </span>
                                                <span className="text">edit</span>
                                            </Link>
                                            <Link href="#" className="btn btn-sm btn-danger btn-icon-split ml-2" onClick={() => handleDelete(item.id, item.title)}>
                                                <span className="icon text-white-50">
                                                    <i className="fas fa-trash" />
                                                </span>
                                                <span className="text">delete</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-md-5">
                                <div
                                    className="dataTables_info"
                                    id="dataTable_info"
                                    role="status"
                                    aria-live="polite"
                                >
                                    Showing {items.length} of {totalData} entries
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-7">
                                <div
                                    className="dataTables_paginate paging_simple_numbers"
                                    id="dataTable_paginate"
                                >
                                <ul className="pagination my-0 float-right">
                                    <li
                                        className={`paginate_button page-item previous ${1 == page ? "disabled" : ""}`}
                                        id="dataTable_previous"
                                    >
                                        <Link
                                            href="#"
                                            className="page-link"
                                            onClick={() => setPage(page-1)}
                                        >
                                            Previous
                                        </Link>
                                    </li>

                                    {[...Array(totalPagination)].map((x, i) =>
                                        <li className={`paginate_button page-item ${i+1 == page ? "active" : ""}`} key={i+1}>
                                            <Link
                                                href="#"
                                                className="page-link"
                                                onClick={() => setPage(i+1)}
                                            >
                                                {i+1}
                                            </Link>
                                        </li>
                                    )}
                                    
                                    <li className={`paginate_button page-item next ${totalPagination == page ? "disabled" : ""}`} id="dataTable_next">
                                        <Link
                                            href="#"
                                            className="page-link"
                                            onClick={() => setPage(page+1)}
                                        >
                                            Next
                                        </Link>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                   
                </div>


            </div>
        </>
    );
}

export default Index;