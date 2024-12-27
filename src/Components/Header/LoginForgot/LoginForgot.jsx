import React, { useState, memo, useEffect } from 'react';
import "./styles.scss";
import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import ForgotPassword from "Components/Header/ForgotPassword";
import { useDispatch, useSelector } from 'react-redux';
import { closeLoginForgot } from 'Utilities';
import Login from '../Login/Login';

const LoginForgot = () => {
    const openForgotPassword = useSelector((state) => state?.openForgotPassword);
    const openLogin = useSelector((state) => state?.openLogin);
    const getUrlType = useSelector((state) => state?.getUrlType);
    const wilistProductId = useSelector((state) => state?.wilistProductId?.id);

    const dispatch = useDispatch();
    const [resMessage, setResMessage] = useState("");
    const [loginForgot, setLoginForgot] = useState(true);

    useEffect(() => {
        if (resMessage) setResMessage("");
    }, [openLogin]);
    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            openGlobal={openLogin ? openLogin : openForgotPassword}
            shadow={true}
            setGlobalAction={() => closeLoginForgot(dispatch)}
            className="header__login__sidebar"
        >
            <div className="sidebar__login w-1/1 h-1/1 px-4 sm-px-6 py-4 overflow-hidden overflow-y-auto">
                <div className="close__block tr flex right w-1/1">
                    <CloseButton onClickFunction={() => closeLoginForgot(dispatch)} />
                </div>
                {
                    (openLogin && !openForgotPassword) ?
                        <Login resMessage={resMessage} setResMessage={setResMessage} getUrlType={getUrlType} wilistProductId={wilistProductId} />
                        : <></>
                }
                {
                    (!openLogin && openForgotPassword) ?
                        <ForgotPassword loginForgot={loginForgot} setLoginForgot={setLoginForgot} setResMessages={setResMessage} />
                        : <></>
                }
            </div>
        </ModelNew>
    )
}

export default memo(LoginForgot);