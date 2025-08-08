// CronSettings.jsx
import React, { useState } from 'react';
import api from '../utils/api'; // adjust path

const CronSettings = () => {
    const [timer, setTimer] = useState('');

    const updateTimer = async () => {
        try {
            await api.put('updateCronTimer', { timer });
            alert('Timer updated!');
        } catch (err) {
            console.log(err)
            alert('error')
        }
    };

    return (
        <div className="card p-3 my-3">
            <h5>Update Cron Reminder Timer</h5>
            <input
                type="text"
                className="form-control my-2"
                placeholder="e.g., 6h or 10m or 10s"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
            />
            <button className="btn btn-primary" onClick={updateTimer}>Update Timer</button>
        </div>
    );
};

export default CronSettings;
