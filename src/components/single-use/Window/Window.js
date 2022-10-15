import "./Window.css";
import SideMenu from "./SideMenu/SideMenu";
import ChatBox from "./ChatBox/ChatBox";


const Window = (props) => {
    const { user } = props;

    return (
        <div id="window">
            <div id="taskbar">
                <div id="label">
                    <img src="./logo.png" alt="logo"></img>
                    <h3>AyoL Chat</h3>
                </div>
                <button id="close" onClick={() => {window.location.href = "/";}}>X</button>
            </div>
            <div id="main">
                <ChatBox user={user} />
                <SideMenu/>
            </div>
        </div>
    );
};

export default Window;