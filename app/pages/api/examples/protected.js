// This is an example of to protect an API route
import { getSession } from 'next-auth/client'
import { exec } from 'child_process';


export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    const kubectl_create = exec("pwd");

    kubectl_create.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    kubectl_create.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    kubectl_create.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    res.send({ content: 'This is protected content. ttYou can access this content because you are signed in.' })
  } else {
    res.send({ error: 'You must be sign in to view the protected content on this page.' })
  }
}
