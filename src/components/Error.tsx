import type React from "react";
import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string };
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Oops! Something went wrong."
      subTitle={
        error?.statusText || error?.message || "An unexpected error occurred."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Go Home
        </Button>,
        <Button key="back" onClick={() => navigate(-1)}>
          Go Back
        </Button>,
      ]}
    />
  );
};

export default ErrorPage;
