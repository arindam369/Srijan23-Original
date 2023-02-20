import AuthContext from "@/store/AuthContext";
import { useContext } from "react";
import Loader from "./Loader";

export default function LoaderLayout({children}){
    const authCtx = useContext(AuthContext);
    const {isLoading} = authCtx;

    return (
        <>
            {isLoading && <Loader/>}
            {children}
        </>
    )
}