import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Link from 'next/link'
import AccessDenied from '../components/access-denied'


export default function Page () {
    let timer;
    const [session, loading] = useSession()
    const [connectLink, setLink] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setLink("")
        setStatus("-")
        const fetchData = async () => {
            const res = await fetch('/api/ks/list?app=filerun');
            const json = await res.json();
            console.log(loading)
            if (json.status == "Running" && loading == false) { 
                setStatus(json.status);
                setLink("http://"+session.user.name+".filerun.app.ksc.re.kr")            }
        }
        fetchData()
    }, [session])

    const click_connect = async () =>{
        timer = setTimeout(function () {
            click_connect();
          }, 5000);
        const res = await fetch('/api/ks/list?app=filerun');
        const json = await res.json();
        if(json == undefined){
            console.log("null return");
            return;
        }
        if (json.status == "Running") { 
            setStatus(json.status);
            setLink("http://"+session.user.name+".filerun.app.ksc.re.kr")
            clearTimeout(timer);
        }
    }

    const click_create = async () => {
        const res = await fetch('/api/ks/create?app=filerun')
        const json = await res.json()
        if (json.content) { console.log(json.content) }
        setStatus("creating")
        click_connect()
    }
    const click_delete = async () => {
        const res = await fetch('/api/ks/delete?app=filerun')
        const json = await res.json()
        setLink("")
        setStatus("-")
        clearTimeout(timer);
    }

    if (!session) { return <Layout><AccessDenied /></Layout> }
    return (
        <Layout>
            <h1>File Manager</h1>
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
                        <td>Filerun</td>
                        <td>{status}</td>
                        <td><Link href={`${connectLink}?page=login&action=login&nonajax=1&username=superuser&password=superuser`} ><a target='_blank'>{connectLink}</a></Link></td>
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