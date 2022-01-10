import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Link from 'next/link'
import AccessDenied from '../components/access-denied'
import cookieCutter from 'cookie-cutter'


export default function Page () {
    let timer;
    const [session, loading] = useSession()
    const [connectLink, setLink] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setLink("");
        setStatus("-");
        cookieCutter.set('id', 'test')
        console.log(cookieCutter.get('id'));
        const fetchData = async () => {
            const res = await fetch('/api/ks/list?app=rstudio');
            const json = await res.json();
            if (json.status == "Running" && loading == false) { 
                setStatus(json.status);
                setLink("http://"+session.user.name+".rstudio.app.ksc.re.kr")            }
        }
        fetchData()
    }, [session])

    const click_connect = async () =>{
        timer = setTimeout(function () {
            click_connect();
          }, 5000);
        const res = await fetch('/api/ks/list?app=rstudio');
        const json = await res.json();
        if(json == undefined){
            console.log("null return");
            return;
        }
        if (json.status == "Running") { 
            setStatus(json.status);
            setLink("http://"+session.user.name+".rstudio.app.ksc.re.kr")
            clearTimeout(timer);
        }
    }

    const click_create = async () => {
        const res = await fetch('/api/ks/create?app=rstudio')
        const json = await res.json()
        setStatus("creating")
        click_connect()
    }
    const click_delete = async () => {
        const res = await fetch('/api/ks/delete?app=rstudio')
        const json = await res.json()
        setLink("")
        setStatus("-")
        clearTimeout(timer);
    }

    if (!session) { return <Layout><AccessDenied /></Layout> }
    return (
        <Layout>
            <h1>RStudio</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Pod Name</th>
                        <th style={{ width: '10%' }}>Status</th>
                        <th style={{ width: '50%' }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>RStudio</td>
                        <td>{status}</td>
                        <td><Link href={`${connectLink}`} ><a target='_blank'>{connectLink}</a></Link></td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <button onClick={() => click_create()} className="btn btn-sm btn-success btn-delete-user" disabled={false}>create</button>&nbsp;
                            <button onClick={() => click_delete()} className="btn btn-sm btn-danger btn-delete-user" disabled={false}>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    );
}