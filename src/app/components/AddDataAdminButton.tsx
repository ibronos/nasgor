"use client";

import { usePathname  } from "next/navigation";

type TypeParams = {
    buttonTitle?:string
}

const AddDataAdminButton = ( {buttonTitle} : TypeParams ) =>  {

    const pathname = usePathname();
    
    return (
        <a
            href={pathname+"/add"}
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
            <i className="fas fa-plus fa-sm text-white-50" /> Add {buttonTitle}
        </a>
    );
}

export default AddDataAdminButton;