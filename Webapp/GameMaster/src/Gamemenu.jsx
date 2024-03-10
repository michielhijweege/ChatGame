import {Link, Outlet} from 'react-router-dom';

const Home = () => {

    return (
        <>
            <div className="flex flex-col min-h-screen w-full">
                {/* Navigation */}
                <nav className="nav">
                    {/* Navigation content */}
                    <Link to="/gamemenu/game">
                        <button>21 Questions</button>
                    </Link>

                    <Link to="/gamemenu/game2">
                        <button>trivia</button>
                    </Link>
                </nav>

                {/* Main Content */}
                <div>
                    {/* Outlet for rendering child components */}
                    <Outlet />
                </div>

                {/* Footer */}
            </div>
        </>
    )
};

export default Home;
