import React, { memo } from 'react';
import "./styles.scss";

const AuthencationLayout = ({ data=<></>, className="" }) => {
    return (
        <div className={`authentication__container container-fluid ${className}`}>
            <div className="authentication__wrapper container mx-auto pt-8 pb-8 md-pt-14 md-pb-11 px-4">
                <div className="form__wrapper">
                    {data}
                </div>
            </div>
        </div>
    )
}

export default memo(AuthencationLayout);