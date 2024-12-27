import React from 'react';
import SkeletonImg from './img';
import SkeletonLine from './line';

const SkeletonLoader = ({ length = 1, pclassName = "flex col gap-1", width = "100%", height = "20px", borderRadius = "5px", className = '', full = false }) => {
    const arr = Array.from({ length });
    return <div className={pclassName}>
        {
            arr.map((loader, ind) => (
                <React.Fragment key={`skeletonLoader${ind + 1}`}>
                    <SkeletonLine
                        animation="pulse"
                        width={(ind + 1 === length && length > 1 && !full) ? '60%' : width}
                        height={height}
                        style={{ borderRadius: borderRadius }}
                        className={className}
                    />
                </React.Fragment>
            ))
        }
    </div>
}

const LineLoader = ({ width = "100%", height = "20px", borderRadius = "5px", className = '' }) => (
    <SkeletonLine
        animation="pulse"
        width={width}
        height={height}
        style={{ borderRadius: borderRadius }}
        className={className}
    />
);

export { SkeletonLine, SkeletonImg, SkeletonLoader, LineLoader };
