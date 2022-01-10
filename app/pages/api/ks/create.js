import { exec } from 'child_process';
import { getSession } from 'next-auth/client'

export default async (req, res) => {
    const session = await getSession({ req })

    console.log(session)
    if (session) {
        console.log(session)
        console.log("create " + req.query.app + " in " + session.user.name);
        const command = "/bin/bash ./kube_script/"+req.query.app+".sh " + session.user.name +" "+ session.user.uid + " " +session.user.gid;
        //const command = "pwd";
        console.log(command)
        const kubectl_create = exec(command);

        kubectl_create.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    
        kubectl_create.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    
        kubectl_create.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        res.send({ content: 'pod create' })
    } else {
        res.send({ error: 'Please login first' })
    }
}
