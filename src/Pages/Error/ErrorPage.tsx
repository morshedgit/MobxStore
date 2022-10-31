import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError() as { message: string };
  return (
    <section>
      <h1>Error</h1>
      <p>{error.message}</p>
    </section>
  );
}

export default ErrorPage;
