
import { Outlet, Link,  NavLink,
} from "react-router-dom";
export const MainLayout = ()=>{

    return (<div className='w-screen h-screen grid grid-cols-[10rem_1fr]'>
    <aside className='border p-2'>
      <nav>
        <ul className='flex flex-col'>
          <li>
            <NavLink to="/" className={({isActive})=>isActive?'underline':''} end>Home</NavLink>
          </li>
          <li>
            <NavLink to="/cars" className={({isActive})=>isActive?'underline':''}>Cars</NavLink>
          </li>
          <li>
            <NavLink to="/schools" className={({isActive})=>isActive?'underline':''}>Schools</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
    
    <main className='p-2'>
      <Outlet/>
    </main>

  </div>)
}