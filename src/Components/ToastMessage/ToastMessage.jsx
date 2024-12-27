import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_TOAST } from 'Store/action';

const ToastMessage = () => {
    const dispatch = useDispatch();
    const toastMessageDetails = useSelector((state) => state?.toastMessageDetails);
    const state = {
        open: true,
        vertical: 'top',
        horizontal: 'right',
        Transition: Slide
    }
    const { vertical, horizontal, Transition } = state;
    const handleClose = () => {
        dispatch(ACTION_TOAST({
            open: false,
            message: ""
        }));
    };
    return (
        toastMessageDetails?.open ? <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={toastMessageDetails?.open}
            onClose={handleClose}
            message={toastMessageDetails?.message}
            key={vertical + horizontal}
            TransitionComponent={Transition}
            autoHideDuration={6000}
        /> : null
    )
}

export default ToastMessage;