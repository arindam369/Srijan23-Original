import RegisterPage2 from "@/components/Register/Register2";
import AuthContext from "@/store/AuthContext";
import { useContext } from "react";

export default function ProtectedRoute(Component){
    const Auth = (props)=>{
        const authCtx = useContext(AuthContext);
        if(!authCtx.isAuthenticated){
            return (
                <RegisterPage2/>
            )
        }
        return (<Component {...props} />);
    };
    if(Component.getInitialProps){
        Auth.getInitialProps = Component.getInitialProps;
    }
    return Auth;
}