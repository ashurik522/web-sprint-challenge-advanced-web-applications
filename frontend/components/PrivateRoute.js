import React from "react";
import { Route, useNavigate } from "react-router-dom";

const navigate = useNavigate()

const PrivateRoute = ({component: Component, ...rest}) => {
    

    return(<Route {...rest} render={
        (props) => {
            if (localStorage.getItem('token')) {
            return <Component {...props} />
        } else {
            return(
            alert("Must log in for access"),
            navigate('/login')
            )
        }
    }
    } />)
}

export default PrivateRoute