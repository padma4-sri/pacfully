const CloseIconX = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons closeIconX" alt="closeIconX" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
            <g fill="#fff" stroke="#ccc" strokeWidth="1">
                <circle cx="17" cy="17" r="17" stroke="none" />
                <circle cx="17" cy="17" r="16.5" fill="none" />
            </g>
            <line x2="13" y2="13" transform="translate(10.5 10.5)" fill="none" stroke={color} strokeWidth="3" />
            <line y1="13" x2="13" transform="translate(10.5 10.5)" fill="none" stroke={color} strokeWidth="3" />
        </svg>
    )
}

const FilterIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons FilterIcon" focusable="false" viewBox="0 0 24 24" width="1em" height="1em" fill={color}>
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path>
        </svg>
    )
}

const XIcon = ({ color = "currentcolor", ...props }) => {
    return (
        <svg className="icons XIcon" alt="XIcon" xmlns="http://www.w3.org/2000/svg" width="12.121" height="12.121" viewBox="0 0 12.121 12.121" {...props}>
            <g transform="translate(-1170.139 -34.139)">
                <line x2="10" y2="10" transform="translate(1171.2 35.2)" fill="none" stroke={color} strokeWidth="3" />
                <line y1="10" x2="10" transform="translate(1171.2 35.2)" fill="none" stroke={color} strokeWidth="3" />
            </g>
        </svg>
    )
}

const SearchIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons searchIcon" alt="searchIcon" width="1em" height="1em" viewBox="0 0 22.201 22.201" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)">
                <ellipse cx="8" cy="7.5" rx="8" ry="7.5" transform="translate(0 0)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <line x1="5.923" y1="5.923" transform="translate(13.864 13.346)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
        </svg>
    )
}
const TelephoneIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons telephoneIcon" alt="telephoneIcon" width="1em" height="1em" viewBox="0 0 25.25 25.25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.207,1m8.109,18.574v3.5a2.333,2.333,0,0,1-2.324,2.343c-.073,0-.146,0-.219-.009A23.087,23.087,0,0,1,12.7,21.826a22.746,22.746,0,0,1-7-7A23.087,23.087,0,0,1,2.121,4.71,2.334,2.334,0,0,1,4.235,2.176c.069-.006.139-.009.208-.009h3.5a2.333,2.333,0,0,1,2.333,2.007,14.972,14.972,0,0,0,.817,3.278,2.333,2.333,0,0,1-.525,2.462L9.087,11.4a18.667,18.667,0,0,0,7,7l1.482-1.482a2.333,2.333,0,0,1,2.462-.525,14.972,14.972,0,0,0,3.278.817A2.333,2.333,0,0,1,25.315,19.574Z" transform="translate(-1.102 -1.166)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
    )
}
const UserIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons userIcon" alt="userIcon" width="1em" height="1em" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.333,23.908A2.948,2.948,0,0,1,22.036,25H2.963a2.967,2.967,0,0,1-2.9-3.578,12.7,12.7,0,0,1,8.464-9.463,6.641,6.641,0,1,1,7.949,0,12.7,12.7,0,0,1,6.582,5,.977.977,0,1,1-1.622,1.088,10.743,10.743,0,0,0-8.676-4.769q-.129,0-.26.005t-.259,0A10.79,10.79,0,0,0,1.975,21.82a1.02,1.02,0,0,0,.207.855.992.992,0,0,0,.781.371H22.036a.992.992,0,0,0,.781-.371,1.02,1.02,0,0,0,.207-.855.977.977,0,0,1,1.912-.4,2.965,2.965,0,0,1-.6,2.486ZM12.264,11.322l.236,0,.237,0a4.687,4.687,0,1,0-.474,0Z" transform="translate(0 0)" fill={color} />
        </svg>
    )
}

const WishOutlineIcon = ({ color = "currentcolor", onClick = () => { } }) => {
    return (
        <svg onClick={onClick} className="icons WishOutlineIcon" alt="WishOutlineIcon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize large"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill={color}></path></svg>
    )
}
const WishFullIcon = ({ color = "#CC1414", onClick = () => { } }) => {
    return (
        <svg onClick={onClick} className="icons WishFullIcon" alt="WishFullIcon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FavoriteIcon" fill={color}><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
    )
}
const WishIcon = ({ color = "currentcolor", onClick = () => { } }) => {
    return (
        <svg onClick={onClick} className="icons wishIcon" alt="wishIcon" width="1em" height="1em" viewBox="0 0 27.408 24.365" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.8,13.006a30.645,30.645,0,0,1-2.474,2.671c-.724.73-1.458,1.454-1.983,1.969l0,0c-.971.979-1.961,1.948-2.439,2.415a.967.967,0,0,1-.678.277h0a.964.964,0,0,1-.709-.309,1.015,1.015,0,0,1,.031-1.414c.659-.642,1.3-1.273,1.879-1.854a.992.992,0,0,1,.1-.117c.869-.847,1.7-1.674,2.418-2.4,1.206-1.217,2.076-2.133,2.212-2.345a6.871,6.871,0,0,0,1.27-4.337A5.8,5.8,0,0,0,19.859,2c-2.9,0-5.328,3.461-5.352,3.5a.976.976,0,0,1-.8.425h-.014a.976.976,0,0,1-.8-.447C12.865,5.44,10.556,2,7.548,2A5.8,5.8,0,0,0,1.973,7.57a6.948,6.948,0,0,0,1.27,4.337c1.457,2.254,8.71,8.615,10.5,10.174l.1-.079.834-.652a.968.968,0,0,1,1.375.185,1.014,1.014,0,0,1-.181,1.4l-.736.575-.828.647a.967.967,0,0,1-1.228-.028c-.392-.336-9.63-8.26-11.481-11.124A8.853,8.853,0,0,1,.013,7.463,8.034,8.034,0,0,1,2.338,2.208,7.324,7.324,0,0,1,7.548,0c2.832,0,5.025,2,6.172,3.326C14.9,2,17.136,0,19.859,0A7.324,7.324,0,0,1,25.07,2.208a8.033,8.033,0,0,1,2.324,5.255,8.938,8.938,0,0,1-1.59,5.543Z" transform="translate(0 0)" fill={color} />
        </svg>
    )
}
const CartIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons cartIcon" alt="cartIcon" width="1em" height="1em" viewBox="0 0 26.038 26.038" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1 1)">
                <path d="M36.192,43.231H22.466L19.113,24.793A.962.962,0,0,0,18.175,24H16" transform="translate(-16 -24)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <circle cx="2.341" cy="2.341" r="2.341" transform="translate(5.307 19.355)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <circle cx="2.341" cy="2.341" r="2.341" transform="translate(17.482 19.355)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M49.743,73.615h15.1a1.911,1.911,0,0,0,1.887-1.575L68.192,64H48" transform="translate(-44.154 -59.192)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
        </svg>
    )
}
const MenuIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons menuIcon" alt="menu toggle" width="1em" height="1em" viewBox="0 0 22.625 17" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-513.5 -34.5)">
                <line x2="20.625" transform="translate(514.5 35.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="2" />
                <line x2="20.625" transform="translate(514.5 43)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="2" />
                <line x2="20.625" transform="translate(514.5 50.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="2" />
            </g>
        </svg>
    )
}

const ImagePlaceholderIcon = ({ color = "currentcolor", ...props }) => {
    return (
        <svg className="icons imagePlaceholderIcon" alt="imagePlaceholderIcon" width="1em" height="1em" fill={color} viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"></path>
        </svg>
    )
}
const TickIcon = ({ color = "currentcolor" }) => {
    return (
        <svg className="icons tickIcon" alt="tickIcon" width="1em" height="1em" fill="none" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
            <path id="download" d="M-.3,6.512,5.118,12.25,12.413,1" transform="translate(1.391 -0.184)" fill="none" stroke={color} strokeWidth="3" />
        </svg>
    )
}
const TickIconNew = () => {
    return (
        <svg width="18.526" height="15" viewBox="0 0 18.526 15">
            <path d="M15.742,49,6.307,58.439,2.781,54.912,0,57.7,6.3,64l.815-.811h0L18.526,51.781Z" transform="translate(0 -49)" fill="#43a700" />
        </svg>
    )
}

const Telephone = ({ color = "currentcolor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="36.811" height="36.878" viewBox="0 0 36.811 36.878">
            <path d="M23.348,7.564a8.206,8.206,0,0,1,6.483,6.483M23.348,1A14.772,14.772,0,0,1,36.4,14.032m-1.641,13.1v4.924a3.283,3.283,0,0,1-3.578,3.283A32.482,32.482,0,0,1,17.012,30.3,32.006,32.006,0,0,1,7.164,20.45,32.482,32.482,0,0,1,2.126,6.216,3.283,3.283,0,0,1,5.392,2.641h4.924A3.283,3.283,0,0,1,13.6,5.464a21.075,21.075,0,0,0,1.149,4.612,3.283,3.283,0,0,1-.738,3.463l-2.084,2.084a26.257,26.257,0,0,0,9.847,9.849l2.084-2.082a3.283,3.283,0,0,1,3.463-.738A21.074,21.074,0,0,0,31.931,23.8a3.283,3.283,0,0,1,2.823,3.332Z" transform="translate(-0.911 0.325)" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
        </svg>
    )
}

const Email = ({ color = "currentcolor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 34.963 28.139">
            <g transform="translate(0.25 0.25)">
                <g>
                    <g>
                        <path d="M29.985,32.139H4.678A4.608,4.608,0,0,1,.1,27.561V9.078A4.608,4.608,0,0,1,4.678,4.5H29.985a4.608,4.608,0,0,1,4.578,4.578v18.4A4.627,4.627,0,0,1,29.985,32.139ZM4.678,6.227a2.9,2.9,0,0,0-2.937,2.85v18.4a2.876,2.876,0,0,0,2.85,2.85H29.9a2.876,2.876,0,0,0,2.85-2.85V9.078a2.876,2.876,0,0,0-2.85-2.85Z" transform="translate(-0.1 -4.5)" fill={color} stroke={color} strokeWidth="0.5" />
                    </g>
                    <g transform="translate(4.871 3.659)">
                        <path d="M18.055,21.831a5.334,5.334,0,0,1-3.887-1.814L5.963,10.171a.858.858,0,1,1,1.3-1.123l8.292,9.932a3.2,3.2,0,0,0,5.01,0l8.206-9.846a.858.858,0,1,1,1.3,1.123L21.857,20.1a4.683,4.683,0,0,1-3.8,1.727Z" transform="translate(-5.738 -8.734)" fill={color} stroke={color} strokeWidth="0.5" />
                    </g>
                    <g transform="translate(23.699 14.714)">
                        <path d="M34.413,30.4a.786.786,0,0,1-.691-.345l-5.959-7.083a.858.858,0,1,1,1.3-1.123l5.96,7.08a.834.834,0,0,1-.087,1.21A.615.615,0,0,1,34.413,30.4Z" transform="translate(-27.538 -21.534)" fill={color} stroke={color} strokeWidth="0.5" />
                    </g>
                    <g transform="translate(2.979 14.781)">
                        <path d="M4.371,30.319a.926.926,0,0,1-.518-.173.839.839,0,0,1-.087-1.209l5.873-7a.858.858,0,1,1,1.292,1.123l-5.87,7A.98.98,0,0,1,4.371,30.319Z" transform="translate(-3.55 -21.608)" fill={color} stroke={color} strokeWidth="0.5" />
                    </g>
                </g>
            </g>
        </svg>
    )
}

const Whatsaap = ({ color = "currentcolor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36.103 36.276">
            <g id="_843786_whatsapp_icon" data-name="843786_whatsapp_icon" transform="translate(-4.112 -3.489)">
                <path d="M34.954,8.761A17.98,17.98,0,0,0,6.662,30.45l-2.55,9.315,9.529-2.5a17.96,17.96,0,0,0,8.59,2.188h.007A17.983,17.983,0,0,0,34.954,8.761ZM22.238,36.417h-.006a14.919,14.919,0,0,1-7.6-2.083l-.546-.324L8.428,35.494l1.509-5.513-.355-.565a14.94,14.94,0,1,1,12.657,7Z" transform="translate(0)" fill={color} fillRule="evenodd" />
                <path d="M33.765,28.811c-.449-.225-2.657-1.311-3.069-1.461s-.711-.225-1.011.225-1.16,1.461-1.422,1.761-.524.337-.973.112a12.267,12.267,0,0,1-3.612-2.229,13.538,13.538,0,0,1-2.5-3.112c-.262-.45-.028-.693.2-.917.2-.2.449-.525.674-.787a3.067,3.067,0,0,0,.449-.749.827.827,0,0,0-.037-.787c-.112-.225-1.011-2.436-1.385-3.335-.365-.876-.735-.757-1.011-.771s-.561-.016-.861-.016a1.65,1.65,0,0,0-1.2.562,5.038,5.038,0,0,0-1.572,3.747A8.736,8.736,0,0,0,18.27,25.7c.225.3,3.167,4.836,7.673,6.782a25.788,25.788,0,0,0,2.561.946,6.156,6.156,0,0,0,2.829.178c.863-.129,2.657-1.086,3.032-2.136a3.754,3.754,0,0,0,.262-2.136C34.514,29.149,34.214,29.036,33.765,28.811Z" transform="translate(-3.332 -3.584)" fill="#222" fillRule="evenodd" />
            </g>
        </svg>
    )
}
const Toggleup = ({ color = "currentcolor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 9.416 6.122">
            <g transform="translate(1.414 4.708) rotate(-90)">
                <line x2="3.294" y2="3.294" transform="translate(0 0)" fill="none" stroke={color} strokeLinecap="square" strokeWidth="2" />
                <line y1="3.294" x2="3.294" transform="translate(0 3.294)" fill="none" stroke={color} strokeLinecap="square" strokeWidth="2" />
            </g>
        </svg>
    )
}
const Toggledown = ({ color = "currentcolor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 9.416 6.122">
            <g transform="translate(8.001 1.414) rotate(90)">
                <line x2="3.294" y2="3.294" transform="translate(0 0)" fill="none" stroke={color} strokeLinecap="square" strokeWidth="2" />
                <line y1="3.294" x2="3.294" transform="translate(0 3.294)" fill="none" stroke={color} strokeLinecap="square" strokeWidth="2" />
            </g>
        </svg>
    )
}
const Workingaction = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 28 28">
            <g>
                <g transform="translate(0)">
                    <path d="M14,0A14,14,0,1,1,0,14,14,14,0,0,1,14,0Z" fill="#cccccc" />
                </g>
                <g transform="translate(12.904 10.5)">
                    <line x2="3.294" y2="3.294" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="square" strokeWidth="2" />
                    <line y1="3.294" x2="3.294" transform="translate(0 3.294)" fill="none" stroke="#fff" strokeLinecap="square" strokeWidth="2" />
                </g>
            </g>
        </svg>
    )
}
const LeftArrow = ({ color = "currentcolor" }) => {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <g>
                <g transform="translate(0)">
                    <path d="M14,0A14,14,0,1,1,0,14,14,14,0,0,1,14,0Z" fill={color} />
                </g>
                <g transform="translate(12.904 10.5)">
                    <line x2="3.294" y2="3.294" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="square" strokeWidth="2" />
                    <line y1="3.294" x2="3.294" transform="translate(0 3.294)" fill="none" stroke="#fff" strokeLinecap="square" strokeWidth="2" />
                </g>
            </g>
        </svg>
    )
}

const ValidSuccesArrow = ({ color ="#CF2C91" }) => {
    return (
        <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.7369 0.00415039L6.30496 9.43785L2.7801 5.91283L0 8.69927L6.29796 14.9957L7.1127 14.1852L18.52 2.78359L15.7369 0.00415039Z" fill={color}/>
        </svg>
    )
}
const ValidErrorArrow = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18.526" height="15" viewBox="0 0 11 11">
            <path d="M105.154,146.1,109,142.254l-1.654-1.654-3.846,3.846L99.654,140.6,98,142.254l3.846,3.846L98,149.946l1.654,1.654,3.846-3.846,3.846,3.846L109,149.946Z" transform="translate(-98 -140.6)" fill="#e44061" />
        </svg>
    )
}
const CopyUrl = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20.004" height="18" viewBox="0 0 20.004 18">
            <path d="M17.482,10.03A4,4,0,0,1,14,16H10a4,4,0,0,1,0-8h1a1,1,0,0,0,0-2H10a6,6,0,0,0,0,12h4a6,6,0,0,0,5.21-8.98L19.2,9a1,1,0,1,0-1.72,1.03M2.522,7.97A4,4,0,0,1,6,2h4a4,4,0,0,1,0,8H9a1,1,0,0,0,0,2h1A6,6,0,1,0,10,0H6A6,6,0,0,0,.792,8.98L.8,9a1,1,0,1,0,1.72-1.03" transform="translate(0 0)" />
        </svg>
    )
}

const EditIcon = () => {
    return (
        <svg width="19.996" height="20" viewBox="0 0 19.996 20">
            <g transform="translate(-2 -1.998)">
                <path id="Path_391" data-name="Path 391" d="M20.693,3.3a4.456,4.456,0,0,0-6.3,0,.714.714,0,0,0,0,1.011.547.547,0,0,0,.05.033c.013.015.018.034.033.049l2.06,2.06L5.892,17.1,4.254,15.459,13.28,6.433a.714.714,0,1,0-1.01-1.01L2.741,14.953h0l-.53.53a.718.718,0,0,0-.155.234A.729.729,0,0,0,2,15.989v5.295A.714.714,0,0,0,2.714,22h5.3a.712.712,0,0,0,.5-.209L20.693,9.61A4.465,4.465,0,0,0,20.693,3.3Zm-2.724.153a3.022,3.022,0,0,1,2.152,4.57L18.045,5.952h0L15.962,3.869A3.013,3.013,0,0,1,17.969,3.458ZM3.428,20.569V16.654l1.957,1.957h0l1.956,1.956ZM6.9,18.107,17.54,7.467l1.638,1.638L8.539,19.744Z" transform="translate(0 0)" fill="#222" />
            </g>
        </svg>
    )
};

const AccountMobile = () => {
    return (
        <svg width="12.183" height="16" viewBox="0 0 12.183 16">
            <path d="M6.484,2.323l.929-.28a2.189,2.189,0,0,1,2.629,1.2l.718,1.6a2.19,2.19,0,0,1-.5,2.5L9.067,8.447A.2.2,0,0,0,9,8.57a3.756,3.756,0,0,0,.673,1.787,5.448,5.448,0,0,0,.961,1.3c.193.171.3.208.344.194l1.6-.489A2.19,2.19,0,0,1,15,12.179l1.02,1.413a2.189,2.189,0,0,1-.27,2.871l-.706.668a2.986,2.986,0,0,1-2.856.708c-2.193-.612-4.159-2.463-5.92-5.513S3.885,6.641,4.455,4.434A2.986,2.986,0,0,1,6.484,2.323Zm.345,1.143A1.791,1.791,0,0,0,5.612,4.733c-.48,1.856.069,4.188,1.69,7s3.362,4.445,5.207,4.959a1.791,1.791,0,0,0,1.713-.425l.706-.668a1,1,0,0,0,.123-1.3l-1.02-1.413a1,1,0,0,0-1.1-.369l-1.6.491c-.931.278-1.777-.472-2.684-2.044a4.484,4.484,0,0,1-.826-2.517,1.393,1.393,0,0,1,.434-.864l1.19-1.109a1,1,0,0,0,.229-1.136l-.718-1.6a1,1,0,0,0-1.195-.545Z" transform="translate(-4.25 -1.949)" fill="#212121" />
        </svg>
    )
};

const AccountHome = () => {
    return (
        <svg width="14.773" height="16" viewBox="0 0 14.773 16">
            <path d="M9.2,2.437a1.847,1.847,0,0,1,2.381,0l5.54,4.672a1.847,1.847,0,0,1,.656,1.412v8.045A1.436,1.436,0,0,1,16.337,18H13.464a1.436,1.436,0,0,1-1.436-1.436V12.052a.205.205,0,0,0-.205-.205H8.95a.205.205,0,0,0-.205.205v4.514A1.436,1.436,0,0,1,7.309,18H4.436A1.436,1.436,0,0,1,3,16.566V8.52a1.847,1.847,0,0,1,.656-1.412Zm1.587.941a.616.616,0,0,0-.794,0L4.45,8.05a.616.616,0,0,0-.219.471v8.045a.205.205,0,0,0,.205.205H7.309a.205.205,0,0,0,.205-.205V12.052A1.436,1.436,0,0,1,8.95,10.615h2.873a1.436,1.436,0,0,1,1.436,1.436v4.514a.205.205,0,0,0,.205.205h2.873a.205.205,0,0,0,.205-.205V8.52a.616.616,0,0,0-.219-.471Z" transform="translate(-3 -2.002)" fill="#212121" />
        </svg>
    )
};

const AccountPerson = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path id="_9040556_person_icon" data-name="9040556_person_icon" d="M10,10A4,4,0,1,0,6,6,4,4,0,0,0,10,10Zm2.667-4A2.667,2.667,0,1,1,10,3.333,2.667,2.667,0,0,1,12.667,6ZM18,16.667A1.306,1.306,0,0,1,16.667,18H3.333A1.306,1.306,0,0,1,2,16.667c0-1.333,1.333-5.333,8-5.333S18,15.333,18,16.667Zm-1.333-.005a3.563,3.563,0,0,0-1.109-2.219c-.869-.869-2.505-1.776-5.557-1.776s-4.688.907-5.557,1.776a3.57,3.57,0,0,0-1.109,2.219Z" transform="translate(-2 -2)" />
        </svg>
    )
};

const AccountJob = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17.308" height="15" viewBox="0 0 17.308 15">
            <path id="_10219050_business_briefcase_job_work_profession_icon" data-name="10219050_business_briefcase_job_work_profession_icon" d="M4.462,3.308H2.731A1.731,1.731,0,0,0,1,5.038v9.231A1.731,1.731,0,0,0,2.731,16H16.577a1.731,1.731,0,0,0,1.731-1.731V5.038a1.731,1.731,0,0,0-1.731-1.731H14.846V2.731A1.731,1.731,0,0,0,13.115,1H6.192A1.731,1.731,0,0,0,4.462,2.731v.577ZM2.154,7.6v6.671a.577.577,0,0,0,.577.577H16.577a.577.577,0,0,0,.577-.577V7.6s-5.687,2.5-5.766,2.5h0v.715a.577.577,0,0,1-.577.577H8.5a.577.577,0,0,1-.577-.577V10.1c-.078,0-5.769-2.5-5.769-2.5Zm8.077.9v1.738H9.077V8.5Zm6.923-2.163v-1.3a.577.577,0,0,0-.577-.577H2.731a.577.577,0,0,0-.577.577v1.3L7.923,8.89V7.923A.577.577,0,0,1,8.5,7.346h2.308a.577.577,0,0,1,.577.577v.969l5.769-2.555ZM13.692,3.308V2.731a.577.577,0,0,0-.577-.577H6.192a.577.577,0,0,0-.577.577v.577Z" transform="translate(-1 -1)" fillRule="evenodd" />
        </svg>
    )
};

const InvoiceIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
            <g transform="translate(-3 -3)">
                <path d="M9.516,6a.5.5,0,0,0,0,1h2.777L8.146,11.146a.5.5,0,0,0,.707.707L13,7.707v2.777a.5.5,0,0,0,1,0V6.5a.5.5,0,0,0-.5-.5Z" fill="#212121" />
                <path d="M12.766,17a2.5,2.5,0,0,0,2.47-2.11A2.5,2.5,0,0,0,17,12.5v-7A2.5,2.5,0,0,0,14.5,3h-7A2.5,2.5,0,0,0,5.1,4.8,2.5,2.5,0,0,0,3,7.266V13.5A3.5,3.5,0,0,0,6.5,17ZM4,7.266A1.5,1.5,0,0,1,5,5.851V12.5A2.5,2.5,0,0,0,7.5,15h6.68a1.5,1.5,0,0,1-1.415,1H6.5A2.5,2.5,0,0,1,4,13.5ZM7.5,4h7A1.5,1.5,0,0,1,16,5.5v7A1.5,1.5,0,0,1,14.5,14h-7A1.5,1.5,0,0,1,6,12.5v-7A1.5,1.5,0,0,1,7.5,4Z" fill="#212121" />
            </g>
        </svg>
    )
};

const WhatsappIcon = () => {
    return (
        <svg id="Laag_1" data-name="Laag 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
            <circle className="cls-2" cx="249.75" cy="249.73" r="243.73"/>
            <g>
                <path className="cls-1" d="m87.66,413.18c.43-1.66.61-2.57.9-3.43,8.83-26.29,17.65-52.59,26.56-78.85.77-2.28.7-4.1-.53-6.22-7.93-13.71-13.79-28.29-17.05-43.78-1.65-7.83-2.49-15.85-3.39-23.82-1.77-15.61-.17-31.05,3.24-46.3,6.33-28.22,19.39-52.92,39.25-74,25.27-26.82,56.16-43.06,92.52-48.6,31.5-4.8,61.94-.54,90.7,13.19,41.39,19.76,69.5,51.56,84.13,95.13,6.12,18.23,8.54,36.99,7.67,56.14-1.02,22.43-6.51,43.75-16.57,63.9-10.11,20.23-23.86,37.57-41.28,51.89-21,17.27-44.91,28.54-71.73,33.55-14.69,2.75-29.45,3.45-44.31,2.05-20.65-1.95-40.22-7.61-58.55-17.34-2.19-1.16-4.14-1.4-6.53-.62-27.07,8.74-54.16,17.39-81.26,26.06-.98.31-1.98.56-3.78,1.06Zm41.54-41.06c1.68-.46,2.52-.65,3.33-.91,14.71-4.76,29.4-9.58,44.14-14.22,1.4-.44,3.48-.32,4.68.43,24.27,15.22,50.63,22.07,79.25,20.48,21.53-1.19,41.53-7.39,59.95-18.4,22.49-13.45,39.72-31.94,51.22-55.54,12.45-25.54,16.45-52.39,11.73-80.46-4.08-24.29-14.22-45.79-30.27-64.43-13.72-15.93-30.33-27.99-49.8-36.03-23.02-9.51-46.9-12.38-71.46-8.5-24.09,3.81-45.57,13.62-64.31,29.31-14.79,12.39-26.44,27.21-34.73,44.63-11.12,23.35-15,47.89-11.87,73.54,2.61,21.36,10.08,40.91,22.36,58.58,1.48,2.12,1.82,3.98.99,6.39-4.01,11.61-7.92,23.25-11.85,34.88-1.06,3.15-2.07,6.32-3.35,10.25Z"/>
                <path className="cls-1" d="m203.88,173.53h1.53c7.13,0,8.92,1.29,11.62,7.98,3.43,8.52,6.49,17.23,10.58,25.41,2.88,5.75,1.53,10.14-1.87,14.59-2.2,2.87-4.62,5.58-7,8.31-2.67,3.05-2.95,4.55-.85,8.07,11.25,18.86,26.41,33.49,46.56,42.64,1.93.88,3.88,1.69,5.83,2.52,4.15,1.77,5.29,1.66,8.3-1.83,3.86-4.48,7.58-9.1,11.19-13.79,2.92-3.8,4.64-4.63,9.04-2.6,10.42,4.8,20.72,9.86,31.1,14.77,2.84,1.34,4.12,3.51,3.85,6.57-.65,7.52-1.21,15.27-7.11,20.79-12.22,11.44-26.48,16.7-43.03,11.4-11.57-3.71-23.08-7.84-34.14-12.86-13.49-6.12-24.68-15.75-34.99-26.31-11.35-11.63-20.98-24.61-29.3-38.53-5.17-8.65-8.64-17.98-9.04-28.2-.58-14.46,4.8-26.37,15.66-35.82,3.67-3.2,8.23-3.32,12.07-3.11Z"/>
            </g>
        </svg>
    )
}



const Download = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16">
            <g transform="translate(-4 -3)">
                <g transform="translate(4 3)">
                    <rect width="15" height="2" rx="1" transform="translate(0 14)" fill="#fff" />
                    <rect width="4" height="2" rx="1" transform="translate(0 16) rotate(-90)" fill="#fff" />
                    <rect width="4" height="2" rx="1" transform="translate(13 16) rotate(-90)" fill="#fff" />
                    <path d="M11.69,14.691a.938.938,0,0,1-.544-.169L7.394,11.876a.938.938,0,1,1,1.088-1.529l3.208,2.242,3.19-2.4a.938.938,0,1,1,1.126,1.5L12.253,14.5a.938.938,0,0,1-.563.188Z" transform="translate(-4.186 -3.433)" fill="#fff" />
                    <path d="M11.938,12.381A.938.938,0,0,1,11,11.443v-7.5a.938.938,0,0,1,1.876,0v7.5A.938.938,0,0,1,11.938,12.381Z" transform="translate(-4.433 -3)" fill="#fff" />
                </g>
            </g>
        </svg>
    )
};

const InfoPdpIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
            <path d="M19,9.4a9.4,9.4,0,1,0-9.4,9.4,9.4,9.4,0,0,0,9.4-9.4Zm-1.637,0A7.767,7.767,0,1,1,9.4,1.637,7.767,7.767,0,0,1,17.17,9.4Z" fill="#79989e" />
            <rect width="1.847" height="1.848" transform="translate(8.48 4.034)" fill="#79989e" />
            <path d="M28.259,29.332V23.89H25.65v1.848h.857v3.594H25.65V31.18h3.371V29.332Z" transform="translate(-17.932 -16.407)" fill="#79989e" />
        </svg>
    )
};

const LoggedIcon = ({ color = "#fff" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 15.062 14.484">
            <path d="M-.3,6.512,5.118,12.25,12.413,1" transform="translate(1.391 -0.184)" fill="none" stroke={color} strokeWidth="3" />
        </svg>
    )
}

const FullWishlist = () => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1304_11155)">
                <g clip-path="url(#clip1_1304_11155)">
                    <path d="M11.5 5.5C11.5 7.15685 7.49997 10.5 6.5 11C5 10.5 1.00003 6.65685 1.00003 5C0.5 3.5 1.34317 1.5 3.00003 1.5C4.65688 1.5 11.5 3.5 11.5 5.5Z" fill="#CC1414" />
                    <path d="M11.296 6.36056C10.9584 6.7715 10.5967 7.162 10.2128 7.53C9.8958 7.84962 9.57443 8.16661 9.34457 8.39209C8.91944 8.82072 8.48599 9.24498 8.27671 9.44944C8.19749 9.52723 8.09089 9.57078 7.97986 9.57072C7.92158 9.57082 7.86392 9.55886 7.81049 9.53557C7.75707 9.51229 7.70904 9.47819 7.66944 9.43543C7.59073 9.35075 7.54811 9.23872 7.55065 9.12313C7.55318 9.00755 7.60067 8.89749 7.68302 8.81634C7.97155 8.53526 8.25219 8.25899 8.5057 8.00461C8.51894 7.98643 8.53358 7.9693 8.54948 7.95338C8.92995 7.58254 9.29379 7.22046 9.60815 6.9026C10.1362 6.36976 10.5171 5.96871 10.5766 5.87589C10.9708 5.32374 11.1667 4.65457 11.1327 3.97703C11.107 3.33895 10.8418 2.73399 10.39 2.28268C9.93819 1.83137 9.33294 1.56685 8.69484 1.54182C7.42513 1.54182 6.36209 3.05715 6.35158 3.07422C6.31258 3.13124 6.26035 3.17795 6.19934 3.21036C6.13834 3.24277 6.07039 3.2599 6.00132 3.2603H5.99519C5.92524 3.25884 5.85673 3.24024 5.79566 3.20611C5.73459 3.17199 5.68283 3.12339 5.64492 3.06459C5.63267 3.04795 4.62172 1.54182 3.30473 1.54182C2.66551 1.56616 2.05902 1.83083 1.60649 2.28296C1.15397 2.73508 0.888743 3.34133 0.863839 3.98053C0.832414 4.65776 1.02812 5.32608 1.41988 5.87939C2.0578 6.86626 5.23337 9.65128 6.01708 10.3339L6.06086 10.2993L6.42601 10.0138C6.47056 9.97885 6.52166 9.95319 6.5763 9.93832C6.63094 9.92345 6.688 9.91967 6.74412 9.92723C6.80023 9.93478 6.85427 9.95349 6.90303 9.98228C6.95179 10.0111 6.9943 10.0493 7.02802 10.0948C7.09705 10.1872 7.12737 10.3029 7.11258 10.4173C7.09779 10.5318 7.03904 10.6359 6.94878 10.7078L6.62654 10.9595L6.26401 11.2428C6.18685 11.3033 6.09105 11.3352 5.99299 11.333C5.89493 11.3308 5.80069 11.2945 5.72636 11.2305C5.55473 11.0834 1.51007 7.61407 0.699654 6.36013C0.204129 5.65137 -0.0401448 4.79726 0.00569589 3.93368C0.0497537 3.06748 0.412279 2.2481 1.02365 1.63289C1.32075 1.32853 1.67544 1.08631 2.06706 0.920337C2.45868 0.754369 2.8794 0.667969 3.30473 0.666168C4.54466 0.666168 5.50482 1.54182 6.00701 2.12239C6.52365 1.54182 7.50263 0.666168 8.69484 0.666168C9.12024 0.667911 9.54105 0.754283 9.93275 0.920253C10.3244 1.08622 10.6792 1.32847 10.9764 1.63289C11.5876 2.24814 11.95 3.06753 11.9939 3.93368C12.0363 4.79734 11.7915 5.65073 11.2977 6.36056H11.296Z" fill="#CC1414" />
                    <path d="M11 3C11.5 4.5 11.5 6.5 8.5 5C7.39543 5 6.5 4.10457 6.5 3C6.5 1.89543 7.39543 1 8.5 1C9.60457 1 11 1.89543 11 3Z" fill="#CC1414" />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_1304_11155">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
                <clipPath id="clip1_1304_11155">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
const PlpColorFilter = () => {
    return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5252 20.1414L10.6667 20.2828L10.8081 20.1414L22.8081 8.14142L22.949 8.0005L22.8086 7.85908L20.9286 5.96575L20.7872 5.82333L20.6452 5.96525L10.6665 15.9441L6.02122 11.3117L5.8798 11.1707L5.73858 11.3119L3.85858 13.1919L3.71716 13.3333L3.85858 13.4747L10.5252 20.1414ZM0.2 13.3333C0.2 6.0838 6.08379 0.2 13.3334 0.2C20.5829 0.2 26.4667 6.0838 26.4667 13.3333C26.4667 20.5828 20.5829 26.4667 13.3334 26.4667C6.08379 26.4667 0.2 20.5828 0.2 13.3333Z" fill="white" stroke="#DFDFDF" stroke-width="0.8" />
            <path d="M14.1403 23.5448C19.8484 23.5448 24.4757 18.9175 24.4757 13.2094C24.4757 7.50133 19.8484 2.87402 14.1403 2.87402C8.43224 2.87402 3.80493 7.50133 3.80493 13.2094C3.80493 18.9175 8.43224 23.5448 14.1403 23.5448Z" fill="#222222" />
            <path d="M13.5 1.16675C6.6 1.16675 1 6.76675 1 13.6667C1 20.5667 6.6 26.1668 13.5 26.1668C20.4 26.1668 26 20.5667 26 13.6667C26 6.76675 20.4 1.16675 13.5 1.16675ZM11 19.9167L4.75 13.6667L6.5125 11.9042L11 16.3793L20.4875 6.89175L22.25 8.66675L11 19.9167Z" fill="white" />
        </svg>
    )
}


export {
    WhatsappIcon, XIcon, CloseIconX, FilterIcon, SearchIcon, TelephoneIcon, UserIcon, WishIcon, CartIcon, MenuIcon, ImagePlaceholderIcon, TickIcon,
    Email, Telephone, Whatsaap, Workingaction, Toggleup, Toggledown, LeftArrow, ValidSuccesArrow, ValidErrorArrow, WishOutlineIcon, WishFullIcon,
    CopyUrl, TickIconNew, EditIcon, AccountMobile, AccountHome, AccountPerson, AccountJob, InvoiceIcon, Download,
    InfoPdpIcon, LoggedIcon, FullWishlist, PlpColorFilter
}