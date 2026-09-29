import { Link } from 'react-router-dom';
import error from '../images/404.svg'
function ErrorPage() {
    return (

        <section className="bg-white dark:bg-gray-900 w-full h-screen flex items-center justify-center flex-col px-5">
            <img src={error} alt="" className='w-[250px] md:w-[400px] ' />

            <h1 className="mb-4 text-7xl tracking-tight  lg:text-9xl error-text">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400 text-center">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <Link to="/"
                className="px-2 py-2 text-lg familyWeight  rounded-[4px] truncate transition duration-150 bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white text-white flex justify-between items-center w-fit"
            >Back to Homepage</Link>

        </section>
    );
}

export default ErrorPage;