const SkeletonLine = ({width="100%", animation, height="100%", color="#e5e7eb", className="", style={}}) => {
  return (
    <div className={`r-2 ${className} ${animation===false ? "" : animation==="pulse" ? "animate-pulse" : "animate-wave"}`} style={{width, height, background:color, ...style}} />
  )
}
export default SkeletonLine;