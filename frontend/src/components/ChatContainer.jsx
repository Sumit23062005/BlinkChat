import React , {useEffect} from 'react'
import {useChatStore} from "../store/useChatStore.js" ;
import {useAuthStore} from "../store/useAuthStore.js" ;
import ChatHeader from './ChatHeader.jsx';  
import NoChatHistoryPlaceHolder from './NoChatHistoryPlaceHolder.jsx';
import MessageInput from './MessageInput.jsx';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton.jsx';
function ChatContainer() {
  const { selectedUser, getMessagesByUserId , messages , isMessagesLoading} = useChatStore() ;
  const {  authUser} = useAuthStore() ;
  const messageEndRef = React.useRef(null) ;


  useEffect(() => {
    getMessagesByUserId(selectedUser._id);

  },[selectedUser, getMessagesByUserId]) ;

  useEffect(() => {
    if(messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior : "smooth"}) ;

    }
  } , [messages]) ;

  if (!authUser) {
  return <MessagesLoadingSkeleton />;
}
   return (
    <>
   <ChatHeader /> 
   <div className='flex-1 px-6 overflow-y-auto py-8'>
      {messages.length > 0 && !isMessagesLoading ? (
         <div className='max-w-3xl mx-auto space-y-6'>
          {messages.map(msg => (
            <div key={msg._id} className={`chat ${msg.senderId.toString() === authUser._id.toString() ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble relative ${
              msg.senderId.toString() === authUser._id.toString() ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Shared" className='rounded-lg h-48 object-cover'/> 
              )}
              {msg.text && <p className='mt-2'>{msg.text}</p>}
              {/* {new Date(msg.createdAt).toISOString().slice(11,16)} */}
              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

              }
            </div>
            </div>
          ))} 
          <div ref={messageEndRef} /> 
         </div>
      ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
        <NoChatHistoryPlaceHolder name={selectedUser.fullName} /> 
      ) }
   </div>
   <MessageInput />
    </>
 
  )
}

export default ChatContainer
