import { createBrowserRouter } from "react-router-dom";
import Home from "../Home";
import App from "../App";
import Models from "../Models";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
    },
    {
        path: '/home',
        element: <Home/>
    },
    {
        path: '/models',
        element: <Models/>
    }
])

export default router;