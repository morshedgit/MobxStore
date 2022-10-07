
import { Outlet, Link,  NavLink,
} from "react-router-dom";
export const MainLayout = ()=>{

    return (<div className='w-screen h-screen grid grid-cols-[10rem_1fr]'>
    <aside className='border p-2'>
      <nav>
        <ul className='flex flex-col'>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cars">Cars</Link>
          </li>
          <li>
            <Link to="/schools">Schools</Link>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main className='p-2'>
      <Outlet/>
    </main>

  </div>)
}