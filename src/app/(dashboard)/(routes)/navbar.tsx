"use client";
import { useState } from "react";
import { navbarList } from "./navbarList";
import { usePathname } from 'next/navigation'

export default function Navbar() {

    const [toggle, setToggle] = useState(false);
    const [navToggle, setNavToggle] = useState(false);
    const pathname = usePathname();

    const handleToggle = () => {
      setToggle(!toggle); 
    };

    const handleNavToggle = () => {
      setNavToggle(!navToggle);
    };

    const handleNavActive = (url:string, subnav:any) => {
      let act = "";
      if( subnav.length > 0 ){
        {subnav.map((datasub:any, indexsub:any) => {
            if (pathname == datasub.url) {
              act = "active";
            }           
        } )}
      } else {
        if (pathname == url) {
          act = "active";
        }
      }
      return act;
    };

    return (

        <ul
            className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${toggle ? "toggled" : ""}`}
            id="accordionSidebar"
          >
  
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              href="/admin"
            >
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink" />
              </div>
              <div className="sidebar-brand-text mx-3">
                Admin Page
              </div>
            </a>
            <hr className="sidebar-divider my-0" />

            {navbarList.map((data:any, index) => ( 
                <li 
                    className={`nav-item ${handleNavActive(data.url, data.subnav)}`} 
                    key={index} 
                    onClick={
                      () => {
                        (data.subnav.length > 0) ? handleNavToggle() : undefined;
                      }
                    }
                > 
                {
                  (data.subnav.length > 0) ? 
                  <>
                    <label className={`nav-link ${navToggle ? "" : "collapsed"}`} data-toggle="collapse">
                      {/* <i className="fas fa-fw fa-cog" />  */}
                      <span>{data.title}</span>
                    </label>
                    <div className={`collapse ${navToggle ? "show" : ""}`}>
                      <div className="bg-white py-2 collapse-inner rounded">
                      {data.subnav.map((datasub:any, indexsub:any) => {
                          return(
                            <a className="collapse-item" href={datasub.url} key={indexsub}>
                              {datasub.title}
                            </a>
                          )
                      } )}
                      </div>
                    </div>
                  </>
                  :
                  <>
                    <a className="nav-link" href={data.url}>
                      {/* <i className="fas fa-fw fa-table" /> */}
                      <span>{data.title}</span>
                    </a>
                  </>
                }
              
                </li>
            ))}

            <div className="text-center d-none d-md-inline" onClick={handleToggle}>
              <button className="rounded-circle border-0" id="sidebarToggle"></button>
            </div>
 
          </ul>

    )
  }
  