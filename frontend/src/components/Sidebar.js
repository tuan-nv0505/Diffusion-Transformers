import React from 'react';

const Sidebar = ({ isOpen, settings, setSettings }) => {
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <h3>Advanced Settings</h3>

                <div className="setting-group">
                    <label>Inference Steps (Quality)</label>
                    <input 
                        type="number" 
                        name="num_inference_steps" 
                        value={settings.num_inference_steps} 
                        onChange={handleChange} 
                        min="1" max="1000"
                    />
                </div>

                <div className="setting-group">
                    <label>CFG Scale (Guidance)</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        name="guidance_scale" 
                        value={settings.guidance_scale} 
                        onChange={handleChange} 
                        min="1" max="10"
                    />
                </div>

                <div className="setting-group">
                    <label>Seed (-1 for random)</label>
                    <input 
                        type="number" 
                        name="seed" 
                        value={settings.seed} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;