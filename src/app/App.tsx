import { Spin } from "antd";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorPage from "../components/Error";
import { Provider } from "react-redux";
import store from "../shared/store/store";
import "antd/dist/reset.css";
import Ant from "antd/es/app";
import "@ant-design/v5-patch-for-react-19";

const routes = [
  {
    path: "/",
    Component: lazy(() => import("../app/layout/layout")),
    children: [
      {
        index: true,
        Component: lazy(() => import("../pages/Home")),
      },
      {
        path: "/explore",
        Component: lazy(() => import("../pages/ServerExplorer")),
      },
      {
        path: "/add-channel",
        Component: lazy(() => import("../pages/AddChannel")),
      },
      {
        path: "/server/:serverId",
        Component: lazy(() => import("../pages/ServerView")),
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    Component: lazy(() => import("../pages/Login")),
  },
  {
    path: "/register",
    Component: lazy(() => import("../pages/Register")),
  },
];

const Routes = () => {
  return createBrowserRouter(routes);
};

function App() {
  return (
    <Ant>
      <Suspense fallback={<Spin />}>
        <Provider store={store}>
          <RouterProvider router={Routes()} />
        </Provider>
      </Suspense>
    </Ant>
  );
}

export default App;
