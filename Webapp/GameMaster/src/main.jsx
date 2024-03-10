import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter} from "react-router-dom";
import {RouterProvider} from "react-router-dom";
import Home from "./Home.jsx";
import GameMenu from "./Gamemenu.jsx";
import Game1 from "./game.jsx";
import Game2 from "./game2.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "gamemenu",
        element: <GameMenu />,
        children: [
            {
                path: "game",
                element: <Game1 />,
            },
            {
                path: "game2",
                element: <Game2 />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)

