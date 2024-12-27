import React from 'react'
import "./styles.scss";
import { Link } from 'react-router-dom';
import { SkeletonLine } from "Components/Skeletion";

export const BackgroundBox = ({ children, className = 'pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8' }) => {
  return (
    <div className={`backgroundBox r-5 ${className}`}>{children}</div>
  )
}

export const PageTitle = ({ children, className = 'fs-24 lg-fs-30 line-12 fw-700 pb-3' }) => {
  return (
    <div className={`page__title ${className}`}>{children}</div>
  )
}

export const BoxTitle = ({ to = '', children, className = 'fs-22 line-8 lg-fs-24 lg-line-12 fw-700 pb-4 lg-pb-2' }) => {
  return (
    <Link to={to} aria-label={"title"} className={`box__title flex left ${className}`}>{children}</Link>
  )
}

export const Para = ({ children, className = 'fs-15 line-6' }) => {
  return (
    <p className={`${className}`}>{children}</p>
  )
}

export const ParaBold = ({ children, className = 'fs-15 line-6 fw-700' }) => {
  return (
    <p className={`${className}`}>{children}</p>
  )
}

export const LineLoader = ({ width = "130px", height = "24px", borderRadius = "5px" }) => (
  <SkeletonLine
    animation="pulse"
    width={width}
    height={height}
    style={{ borderRadius: borderRadius }}
  />
);