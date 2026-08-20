import React from 'react';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
            <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
                {isUser ? 'U' : 'AI'}
            </div>
            
            <div className="message-content">
                {message.text && <p>{message.text}</p>}

                {message.status === 'processing' && (
                    <div className="magic-image-skeleton">
                        <div className="loading-content">
                            <svg 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <p>Crafting your vision...</p>
                        </div>
                    </div>
                )}

                {message.status === 'completed' && message.imageUrl && (
                    <img src={message.imageUrl} alt="AI Generated" className="generated-image" />
                )}

                {message.status === 'failed' && (
                    <div className="error-text">
                        <p>⚠️ Error: {message.errorMsg}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;