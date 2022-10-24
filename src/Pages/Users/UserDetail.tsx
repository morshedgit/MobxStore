import { observer } from "mobx-react-lite";
import { Link, useLoaderData } from "react-router-dom";
import { User } from "../../Models/Common";
import { UserForm } from "./UserForm";

export const UserDetail = observer(
  (props: { mode: "NEW" | "EDIT" | "VIEW" }) => {
    const user: User = useLoaderData() as User;
    return (
      <section className="w-full md:min-w-[600px] md:w-[80%]">
        <div className="flex justify-between  w-full border-b-2 border-sky-200">
          <h2 className="text-2xl">
            <Link to="/admin/users">Users</Link>
            {user?.id && (
              <Link to={`/admin/users/${user.id}`}>/ {user.username}</Link>
            )}
          </h2>

          {props.mode === "VIEW" && (
            <Link to={`/admin/users/${user.id}/edit`}>
              <span className="material-symbols-outlined">edit</span>
            </Link>
          )}
          {props.mode === "EDIT" && (
            <Link to={`/admin/users/${user.id}`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
          {props.mode === "NEW" && (
            <Link to={`/admin/users`}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          )}
        </div>

        {props.mode === "VIEW" && (
          <>
            <h3 className="text-xl font-bold">{user.username}</h3>
            <p className="">{user.authenticated}</p>
          </>
        )}
        {props.mode === "EDIT" && <UserForm user={user} />}
        {props.mode === "NEW" && <UserForm />}
      </section>
    );
  }
);
