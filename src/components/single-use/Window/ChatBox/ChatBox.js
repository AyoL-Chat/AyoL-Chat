import "./ChatBox.css";
import GUN from 'gun';
const db = GUN();
import Message from '../../../multi-use/Message/Message'
import SEA from 'gun/sea'

let newMessage = {text: null, ayo: null};
let messages = [];

const ChatBox = ({user, username}) => {
    const ayos = [
        "./ayos/0.png",
        "./ayos/1.png",
        "./ayos/2.png",
    ];

    var match = {
        // lexical queries are kind of like a limited RegEx or Glob.
        '.': {
          // property selector
          '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
        },
        '-': 1, // filter in reverse
      };
  
      // Get Messages
      db.get('chat')
        .map(match)
        .once(async (data, id) => {
          if (data) {
            // Key for end-to-end encryption
            const key = '#foo';
  
            var message = {
              // transform the data
              who: await db.user(data).get('alias'), // a user might lie who they are! So let the user system detect whose data it is.
              what: (await SEA.decrypt(data.what, key)) + '', // force decrypt as text.
              when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
            };
  
            if (message.what) {
              messages = [...messages.slice(-100), message].sort((a, b) => a.when - b.when);
              if (canAutoScroll) {
                autoScroll();
              } else {
                unreadMessages = true;
              }
            }
          }
        });
  
    async function sendMessage() {
  
      if (newMessage.text){
        newMessage = newMessage.text
      }
      else {
        newMessage = newMessage.ayo
      }
  
      const secret = await SEA.encrypt(newMessage, '#foo');
      const message = user.get('all').set({ what: secret });
      const index = new Date().toISOString();
      db.get('chat').get(index).put(message);
      newMessage = {text: null, ayo: null};
      canAutoScroll = true;
      autoScroll();
    }

    return (
        <div id="chat-box">
            <ul id="message-view">
                {
                    messages.forEach(message => (
                        <Message message={message} sender={message.who} />
                    ))
                }
            </ul>
            <div id="emoji-bar">
                {
                    ayos.map(a => (
                        <a>
                            <img src={a} alt={a} ></img>
                        </a>
                    ))
                }
            </div>
            <form id="message-input">
                <input type="text" placeholder="type here..."/>
                <button onClick={sendMessage}>Send</button>
            </form>
        </div>
    );
};

export default ChatBox;