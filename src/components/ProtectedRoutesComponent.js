import { Outlet, Navigate } from "react-router-dom"
import UserChatComponent from "./UserChatComponent";
import LoginPage from "../pages/LoginPage";

import axios from "axios"
import React, { useEffect, useState } from "react";

const ProtectedRoutesComponent = ({ admin }) => {
    const [isAuth, setIsAuth] = useState()

    useEffect(()=>{
        axios.get("/api/get-token").then(function(data){
            if(data.data.token){
                setIsAuth(data.data.token)
            }
            return isAuth
        })
    },[isAuth])

    if (isAuth === undefined) return <LoginPage></LoginPage>
    return isAuth && admin && isAuth !== "admin" ? (
        <Navigate to="/login" />
    ) : isAuth && admin ? (
        <Outlet />
    ) : isAuth && !admin ? (
        <>
            <UserChatComponent></UserChatComponent>
            <Outlet></Outlet>
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    )
}

export default ProtectedRoutesComponent;