import React, {useEffect, useState} from 'react';
import './index.css';
import * as jsonpatch from 'fast-json-patch';
import TestJson from "./TestJson";


function App() {

    const [patch, setPatch] = useState({})
    const [duration, setDuration] = useState(0)


    useEffect(() => {
        document.title = "Json BenchMark";
    }, []);
    
    var json = TestJson();
    
    const ChangeClick = (e,runCount) => {
        
        const startTime = Date.now();

        for (let i = 0; i < runCount; i++) {
            var changesJson = randomChangeJson(json);
            var patch = generatePatch(json,changesJson);
            setPatch(patch);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        setDuration(duration)
    };

    const generatePatch = (originalJson,modifiedJson) => {
        const patch = jsonpatch.compare(originalJson, modifiedJson);
        return patch;
    };

    const randomChangeJson = (json) => {
        const getRandomValue = (originalValue) => {
            const types = ['string', 'number', 'boolean'];
            const randomType = types[Math.floor(Math.random() * types.length)];

            switch (randomType) {
                case 'string':
                    return Math.random().toString(36).substring(7);
                case 'number':
                    return Math.floor(Math.random() * 100);
                case 'boolean':
                    return Math.random() > 0.5;
                default:
                    return originalValue;
            }
        };

        const getRandomKey = () => {
            return Math.random().toString(36).substring(2, 7);
        };

        const traverseAndChange = (obj) => {
            const keys = Object.keys(obj);
            keys.forEach(key => {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    traverseAndChange(obj[key]);
                } else {
                    obj[key] = getRandomValue(obj[key]);
                }

                // Randomly decide to remove a key
                if (Math.random() > 0.8) {
                    delete obj[key];
                }
            });

            // Randomly decide to add a new key-value pair
            if (Math.random() > 0.8) {
                const newKey = getRandomKey();
                obj[newKey] = getRandomValue(null);
            }
        };

        const newJson = JSON.parse(JSON.stringify(json)); 
        traverseAndChange(newJson);
        return newJson;
    };
    
    return (
        <div className="container">
            <button className="button" onClick={event => ChangeClick(event,1)}>Change Once</button>
            <button className="button" onClick={event => ChangeClick(event,5)}>Change 5 Times</button>
            <br/>
            <br/>
            <label className="label">Time:</label>
            <br/>
            <span className="text">{duration} milliseconds</span>
            <br/>
            <br/>
            <label className="label">Created Json Patch:</label>
            <br/>
            {patch && <span className="text">{JSON.stringify(patch)}</span>}
        </div>

    )
}

export default App