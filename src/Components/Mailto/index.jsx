import React from 'react';
import Button from 'Components/Common/Button';

const Mailto = ({ email, subject = '', body = '', children, className = '', target }) => {
    let params = subject || body ? '?' : '';
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;

    return <Button href={`mailto:${email}${params}`} className={className} target={target}>{children}</Button>;
};

export default Mailto;