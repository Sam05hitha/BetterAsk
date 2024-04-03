import { createBrowserRouter } from "react-router-dom";
import Layout from "../../Pages/Layout/Layout";
import Error from "../../Pages/Error/Error";
import Home from "../../Pages/Home/Home";
import Chat from "../../Pages/Chat/Chat";

export const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/chat/:id",
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);
