import React, { useState, useEffect } from 'react';

const Game1 = () => {
    const [guess, setGuess] = useState('');
    const [history, setHistory] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // Load history from localStorage on component mount
        const savedHistory = localStorage.getItem('history');
        if (savedHistory) {
            setHistory(savedHistory);
        }
        else {
            // If no history is available, initiate conversation with a default prompt
            initiateConversation();
        }
    }, []);

    //begin game
    const initiateConversation = async () => {
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    prompt: 'ChatGPT Let’s play 21 questions. Try to work out what I am thinking of. ask me with yes or no questions'
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
                    prompt: 'Hello this is a chat history and the following has already been said: ' + history + ' this is the end of history. ignore <strong>User:</strong> and <strong>Game Master:</strong>. now this is the new message from what the user sent: ' + guess + ' do not write: Game Master: only send one question'
                }).toString(),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update the history with the result
            const result = await response.json();

            // Update the history with the result, including labels for user and AI
            const newHistory = `<p><strong>User:</strong> ${guess}</p><p><strong>Game Master:</strong> ${result}</p>`;
            setHistory(prevHistory => prevHistory + newHistory);
            console.log(result);

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
