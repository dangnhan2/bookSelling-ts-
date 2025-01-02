import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import HomePage from "./pages/client/home";
import AboutPage from "./pages/client/about";
import BookPage from "pages/client/book";
import LoginPage from "./pages/client/auth/login";
import RegisterPage from "./pages/client/auth/register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppHeader />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/book",
          element: <BookPage />,
        },
        // {
        //   path: "/checkout",
        //   element: (
        //     <ProtectedRoute>
        //       <div>checkout</div>
        //     </ProtectedRoute>
        //   ),
        // },
      ],
    },

    // {
    //   path: "/admin",
    //   element: <LayoutAdmin />,
    //   children: [
    //     {
    //       index: true,
    //       element: (
    //         <ProtectedRoute>
    //           <DashBoard />
    //         </ProtectedRoute>
    //       ),
    //     },
    //     {
    //       path: "/admin/book",
    //       element: (
    //         <ProtectedRoute>
    //           <ManageBook />
    //         </ProtectedRoute>
    //       ),
    //     },
    //     {
    //       path: "/admin/user",
    //       element: (
    //         <ProtectedRoute>
    //           <ManageUser />
    //         </ProtectedRoute>
    //       ),
    //     },
    //     {
    //       path: "/admin/order",
    //       element: (
    //         <ProtectedRoute>
    //           <ManageOrder />
    //         </ProtectedRoute>
    //       ),
    //     },
    //   ],
    // },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },

    {
      path: "*",
      element: <div>NotFound</div>,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
