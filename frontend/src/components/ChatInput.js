// src/components/ChatInput.js
import React, { useState } from 'react';

const ChatInput = ({ onSend, isProcessing }) => {
    const [prompt, setPrompt] = useState("");

    const handleSend = () => {
        if (!prompt.trim() || isProcessing) return;
        onSend(prompt);
        setPrompt(""); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="input-area-wrapper">
            <div className="input-box">
                <div className="input-row">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message AI Image Generator..."
                        rows={1}
                        disabled={isProcessing}
                    />
                    <button 
                        className="send-btn" 
                        onClick={handleSend}
                        disabled={!prompt.trim() || isProcessing}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;