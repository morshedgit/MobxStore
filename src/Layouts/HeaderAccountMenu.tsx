import { observer } from "mobx-react-lite";
import { Form } from "react-router-dom";
import { currentUser } from "../Models/User";

export const HeaderAccountMenu = observer(() => {
  return (
    <section>
      {currentUser.authenticated && (
        <Form className="flex gap-4" method="post" action="/auth/logout">
          <h1>{currentUser.username}</h1>
          <button type="submit">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </Form>
      )}
    </section>
  );
});
