import { ThreeDots } from "react-loader-spinner"

export default function Loader(){
    return (
        <div className="loaderDiv">
            <ThreeDots 
                height="80" 
                width="80" 
                radius="9"
                color="#4fa94d" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            /> 
        </div>     
    )
}