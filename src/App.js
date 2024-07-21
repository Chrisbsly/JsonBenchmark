import React, {useState} from 'react';
import './index.css';
import * as jsonpatch from 'fast-json-patch';
import TestJson from "./TestJson";


function App() {

    const [patch, setPatch] = useState({})
    const [duration, setDuration] = useState(0)
    
    
    var json = TestJson();
    
    const ChangeClick = (e) => {
        
        const startTime = Date.now();

        for (let i = 0; i < 5; i++) {
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

        const traverseAndChange = (obj) => {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        traverseAndChange(obj[key]);
                    } else {
                        obj[key] = getRandomValue(obj[key]);
                    }
                }
            }
        };

        const newJson = JSON.parse(JSON.stringify(json)); // Deep copy of the original JSON
        traverseAndChange(newJson);
        return newJson;
    };
    
    return (
        <div>
            <button onClick={event => ChangeClick(event)}>change</button>
            <br/>
            <br/>
            <label>Change Patch:</label>
            <br/>
            {patch && <span>{JSON.stringify(patch)}</span>}
            <br/>
            <br/>
            <label>time:</label>
            <br/>
            <span>{duration} milliseconds</span>
        </div>

    )
}

export default App