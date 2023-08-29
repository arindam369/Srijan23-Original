import PermissionDeniedPage from "@/components/PermissionError";
import RegisterPage2 from "@/components/Register/Register2";
import AuthContext from "@/store/AuthContext";
import { useContext } from "react";

export default function AdminProtectedRoute(Component){
    const AdminAuth = (props)=>{
        const authCtx = useContext(AuthContext);
        if(!authCtx.isAuthenticated){
            return (
                <RegisterPage2/>
            )
        }
        if(authCtx.userId === 'halderarindam10000' || authCtx.userId === 'vineetkothari3017'){
            return (<Component {...props} />);
        }
        else{
            return (
                <>
                    <PermissionDeniedPage/>
                </>
            )
        }
        
    };
    if(Component.getInitialProps){
        AdminAuth.getInitialProps = Component.getInitialProps;
    }
    return AdminAuth;
}