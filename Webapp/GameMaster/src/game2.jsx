import React, { useState, useEffect } from 'react';
import app from "./App.jsx";

const Game2 = () => {
    const [guess, setGuess] = useState('');
    const [historytrivia, setHistory] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [firstprompt, setfirstprompt] = useState('ChatGPT you are a gameshow host and we are going to play trivia. you wil ask trivia guestions. call your self THE GAME MASTER. introduce the game pleas');
    const [nexttriviaquestion, setNextTriviaQuestion] = useState('');

    useEffect(() => {
        // Load history from localStorage on component mount
        const savedHistory = localStorage.getItem('historytrivia');
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
            localStorage.setItem('historytrivia', `<p><strong>Game Master:</strong> ${result}</p>`);

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
            let nexttriviaquestion; // Define nexttriviaquestion variable here

            try {
                const responsetrivia = await fetch('http://localhost:3000/trivia', {
                    method: 'GET',
                });

                if (!responsetrivia.ok) {
                    throw new Error('Network response was not ok');
                }
                const { question } = await responsetrivia.json(); // Extract question from response

                // Now you can use the received question
                console.log(question); // Log the question
                setNextTriviaQuestion(question); // Set nexttriviaquestion
                nexttriviaquestion = question; // Assign question to nexttriviaquestion
                console.log(nexttriviaquestion);

            } catch (error) {
                console.error('Error fetching trivia:', error);
            }

            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    prompt: `Now, this is the conversation history: ${historytrivia}. This is the end of the history. Disregard lines tagged with <strong>User:</strong> or <strong>Game Master:</strong>. The user said '${guess}' is this correct on the earlyer question. The trivia question is: "${nexttriviaquestion}" this should say`
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
            localStorage.setItem('historytrivia', historytrivia + newHistory);
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
                <div id="History" dangerouslySetInnerHTML={{ __html: historytrivia }}></div>
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

export default Game2;
