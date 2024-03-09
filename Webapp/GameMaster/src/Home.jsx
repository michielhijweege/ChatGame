import {Link, Outlet} from 'react-router-dom';

const Home = () => {

    return (
        <>
            <div className="flex flex-col min-h-screen w-full">
                {/* Main Content */}
                <div className="flex-grow container mx-auto mt-24 md:mt-18">
                    {/* Outlet for rendering child components */}
                    <Link to="gamemenu">
                        <button>START GAME</button>
                    </Link>
                </div>

                {/* Footer */}
            </div>
        </>
    )
};

export default Home;
