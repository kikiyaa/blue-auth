import { exec } from 'child_process';
import { getSession } from 'next-auth/client'

export default async (req, res) => {
    const session = await getSession({ req })
    console.log(session)
    if (session) {
        console.log(req.body)
        const message = req.body;
        const words = message.split(' ');
        console.log("delete " + req.query.app + " in " + session.user.name);
        const command = "kubectl delete -f ./kube_script/"+req.query.app+".yaml -n "+session.user.name;
        //const command = "pwd"
        const kubectl_delete = exec(command);
    
        kubectl_delete.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        
        kubectl_delete.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        
        kubectl_delete.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
        res.send({ content: 'pod delete' })
    } else {
        res.send({ error: 'Please login first' })
    }
}