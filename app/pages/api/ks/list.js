import { execSync } from 'child_process';
import { getSession } from 'next-auth/client'

export default async (req, res) => {
    const session = await getSession({ req })
    console.log(session)
    if (session) {
        console.log("get list");
        const get_status_command = "kubectl get pod -l app="+req.query.app+" -o jsonpath=\"{.items[*].status.phase}\" -n "+session.user.name;
        console.log(get_status_command)
        const get_port_command = "kubectl  get svc "+req.query.app+" -o=jsonpath=\"{.spec.ports[*].nodePort}\" -n "+session.user.name;
        console.log(get_port_command)
        const status = execSync (get_status_command)
        const port = execSync (get_port_command)
        const result_string = ""+status.toString() + " " + port.toString();
        console.log(result_string)
        res.send({
            status: status.toString(),
            port: port.toString(),
        })
    } else {
        res.send({ error: 'Please login first' })
    }
}