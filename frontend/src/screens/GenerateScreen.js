// src/screens/GenerateScreen.js
import React, { useState, useEffect, useRef } from 'react';
import APIs, { endpoints, BASE_URL } from '../configs/APIs';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import '../App.css';

const GenerateScreen = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [advancedSettings, setAdvancedSettings] = useState({
        negattive_prompt: "",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        seed: 42
    });

    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! What kind of image would you like me to generate today?', status: 'completed' }
    ]);
    const [activeTaskId, setActiveTaskId] = useState(null);
    
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const updateLastAiMessage = (updateData) => {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex].role === 'ai') {
                newMessages[lastIndex] = { ...newMessages[lastIndex], ...updateData };
            }
            return newMessages;
        });
    };

    const handleSendMessage = async (promptText) => {
        const formData = {
            prompt: promptText,
            ...advancedSettings
        };

        const userMsg = { role: 'user', text: formData.prompt };
        const loadingAiMsg = { role: 'ai', status: 'processing' };
        setMessages(prev => [...prev, userMsg, loadingAiMsg]);

        try {
            const res = await APIs.post(endpoints.generate, formData);
            if (res.data && res.data.task_id) {
                setActiveTaskId(res.data.task_id);
            }
        } catch (error) {
            console.error("API Error:", error);
            updateLastAiMessage({ status: 'failed', errorMsg: "Error generating image." });
        }
    };

    useEffect(() => {
        let eventSource;
        if (activeTaskId) {
            const streamUrl = `${BASE_URL}${endpoints.stream(activeTaskId)}`;
            eventSource = new EventSource(streamUrl);

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.status === "completed") {
                        updateLastAiMessage({ status: 'completed', imageUrl: data.image_url });
                        setActiveTaskId(null);
                        eventSource.close();
                    } else if (data.status === "failed") {
                        updateLastAiMessage({ status: 'failed', errorMsg: data.error });
                        setActiveTaskId(null);
                        eventSource.close();
                    }
                } catch (err) {
                    console.error("Parse SSE Error:", err);
                }
            };
            eventSource.onerror = (err) => {
                console.error("SSE Error:", err);
                updateLastAiMessage({ status: 'failed', errorMsg: "Error occurred while generating image." });
                setActiveTaskId(null);
                eventSource.close();
            };
        }
        return () => { if (eventSource) eventSource.close(); };
    }, [activeTaskId]);

    return (
        <div className="app-container">
            <Sidebar 
                isOpen={isSidebarOpen} 
                settings={advancedSettings} 
                setSettings={setAdvancedSettings} 
            />

            <div className="chat-main">
                <div className="chat-header">
                    <button 
                        className="toggle-sidebar-btn" 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        title={isSidebarOpen ? "Close menu" : "Open menu"}
                    >
                        ☰
                    </button>
                </div>

                <div className="chat-history">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <ChatInput 
                    onSend={handleSendMessage} 
                    isProcessing={activeTaskId !== null} 
                />
            </div>
        </div>
    );
};

export default GenerateScreen;