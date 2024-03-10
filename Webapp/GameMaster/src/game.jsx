    import React, { useState, useEffect } from 'react';
    import app from "./App.jsx";

    const Game1 = () => {
        const [guess, setGuess] = useState('');
        const [history, setHistory] = useState('');
        const [isSending, setIsSending] = useState(false);
        const [firstprompt, setfirstprompt] = useState('ChatGPT you are a gameshow host and we are going to play 21 questions. in this game you think of a word. you can only answer yes or no but you can say extra thing that game show hosts always say. call your self THE GAME MASTER. introduce the game pleas');

        useEffect(() => {
            // Load history from localStorage on component mount
            const savedHistory = localStorage.getItem('history');
            if (savedHistory) {
                setHistory(savedHistory);
                document.getElementById("startButton").style.display = "none";
            }
            else {
                // If no history is available, initiate conversation with a default prompt
            }
        }, []);

        let synth = window.speechSynthesis

        function speak(text, callback) {
            if (text !== '') {
                // Check if voices are loaded
                if (synth.getVoices().length === 0) {
                    // Wait for 'voiceschanged' event
                    synth.onvoiceschanged = function() {
                        // Call speak again after voices are loaded
                        speak(text, callback);
                    };
                    return;
                }

                let allVoices = synth.getVoices().filter(voice => voice.lang === "en-GB");
                let desiredVoiceIndex = 2; // Change this index to the desired voice index
                let desiredVoice = allVoices[desiredVoiceIndex];

                if (desiredVoice) {
                    let utterThis = new SpeechSynthesisUtterance(text);
                    utterThis.voice = desiredVoice;

                    utterThis.onstart = function(event) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    };

                    synth.speak(utterThis);
                } else {
                    console.error("Desired voice not found.");
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        }

        function startgame(){
            initiateConversation();
            document.getElementById("startButton").style.display = "none";
        }

        //begin game
        const initiateConversation = async () => {
            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        prompt: firstprompt
                    }).toString(),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Update the history with the initial response
                const result = await response.json();

                setHistory(`<p><strong>Game Master:</strong> ${result}</p>`);
                // Save history to localStorage
                localStorage.setItem('history', `<p><strong>Game Master:</strong> ${result}</p>`);

                synth.cancel()
                speak(result)

            } catch (error) {
                console.error('Error:', error);
            }
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            setIsSending(true);

            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                         prompt: `this is the starting prompt: ${firstprompt}. now this is the conversation history: ${history}. This is the end of the history. Disregard lines tagged with <strong>User:</strong> or <strong>Game Master:</strong>. the user said '${guess}'. Responding to the user also say how many questions until game over so if for example: no. it is not round. you have 5 more question. end of example. if 0 questions and it is not gauss type at the end [loss] else if win or word is correct type on end [winn] for example: Yes you have it right. it took yoou 5 questions. [win]. end of example.`
                    }).toString(),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Update the history with the result
                const result = await response.json();

                synth.cancel()
                speak(result)

                // Update the history with the result, including labels for user and AI
                const newHistory = `<p><strong>User:</strong> ${guess}</p><p><strong>Game Master:</strong> ${result}</p>`;
                setHistory(prevHistory => prevHistory + newHistory);

                setGuess('');

                // Save history to localStorage
                localStorage.setItem('history', history + newHistory);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsSending(false); // Set isSending to false when the request is complete
            }
        };

        const handleInputChange = (event) => {
            setGuess(event.target.value);
        };

        return (
            <div>
            <div>
                <button id="startButton" onClick={startgame}>Start the game</button>
                <div id="History" dangerouslySetInnerHTML={{ __html: history }}></div>
            </div>
                <form onSubmit={handleSubmit} className="guessform">
                <label>
                    <input id="guessword" type="text" value={guess} onChange={handleInputChange}/>
                </label>
                <button type="submit" disabled={isSending}>Raad</button>
            </form>
            </div>
        );
    };

    export default Game1;
