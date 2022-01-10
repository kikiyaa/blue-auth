const ldap = require("ldapjs")
import NextAuth from "next-auth"
var fs = require('fs');
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "LDAP",
      credentials: {
        username: { label: "ID", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          console.log("ldap")
          const opts = {
            scope: 'sub',
            attributes: ['uid', 'uidNumber', 'gidNumber']
          };
          // You might want to pull this call out so we're not making a new LDAP client on every login attemp
          console.log("client")
          var tlsOptions = {
            key: fs.readFileSync('certs/ldap.key'),
            cert: fs.readFileSync('certs/ldap.pem'),
            requestCert: true,
            rejectUnauthorized: false,
            ca: [ fs.readFileSync('certs/ca.pem') ]
          };

          const client = ldap.createClient({
            url: 'ldaps://150.183.150.24:636',
            tlsOptions: tlsOptions
          });
          console.log("bind")
          const id = "uid="+credentials.username+",dc=cm,dc=cluster";
          client.bind(id,credentials.password, (error) => {
            if (error) {
              console.error("Failed");
              reject(new Error ("CheckID"));
            } else {
              client.search(id, opts, (err, res) => {
                if (err) {
                  reject(new Error ("CheckID"));
                }
                res.on('searchEntry', function (data) {
                  const user_profile = JSON.stringify(data.object, null, 2)
                  console.log('Data object', data.object.uid);
                  console.log('Data object', data.object.uidNumber);
                  console.log('Data object', data.object.gidNumber); 
                  resolve({
                    name: data.object.uid,
                    uid: data.object.uidNumber,
                    gid: data.object.gidNumber,
                  })              
                });
                res.once('error', function (error){
                  console.log(error)
                  reject(new Error ("CheckID"));
                });
                res.once('end', function () {
                  console.log('All passed');
                });
              });
              console.log("Logged in")
            }
          })
        })
      },
    }),
  ],
  jwt: {
    encryption: true,
    secret: process.env.SECRET,
  },
  debug: false,
  theme: "auto",
})