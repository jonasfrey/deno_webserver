var o_current_run_info = {
  a_s_argument : Deno.args,
  s_current_folder_name_file_name : import.meta.url.split('//')
}

import { O_folder_file }  from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"

window.o_deno_webserver = {
a_o_folder_file_current_file: [
  new O_folder_file(import.meta.url.split('//').pop())
]
}
// /console.log(window.o_deno_webserver)

var s_path_o_environment_example = "./o_environment.example.js";
var s_path_o_environment = "./o_environment.js";
try{
  var o_stat = await Deno.stat(s_path_o_environment);
  // var s_text = await Deno.readTextFile(s_path_o_environment);
}catch{
  console.error(`${s_path_o_environment}: file does not exist, please run '$ cp ${s_path_o_environment_example} ${s_path_o_environment} and adjust the file content`)
  Deno.exit(1)
}

const {o_environment} = await import("./o_environment.js")

try{
const o_stat_certificate_file = await Deno.stat(o_environment.o_ssl.s_path_certificate_file)
const o_stat_key_file = await Deno.stat(o_environment.o_ssl.s_path_key_file)

}catch{
// if(!o_stat_certificate_file.isFile || !o_stat_key_file.isFile){ //assuming the files or folders can be overwritten
  
if(o_environment.o_ssl.b_auto_generate){

  var a_s_command = [
      'openssl req -newkey rsa:4096',
      '-x509',
      '-sha256',
      '-days 3650',
      '-nodes',
      '-subj',
      `"/C=${o_environment.o_ssl.o_auto_generate.s_country_name_2_letter_code}/ST=${o_environment.o_ssl.o_auto_generate.s_state_or_province}/L=${o_environment.o_ssl.o_auto_generate.s_locality_name}/O=${o_environment.o_ssl.o_auto_generate.s_organization_name}/CN=${o_environment.o_ssl.o_auto_generate.s_common_name}"`,
      `-out ${o_environment.o_ssl.s_path_certificate_file}`,
      `-keyout ${o_environment.o_ssl.s_path_key_file}`
  ] // this works only with the weird string shit
  // wtf without the lines below it wont work
  var s_command = a_s_command.join(' ').slice();
  var a_s_command = s_command.split(' ');

  console.log(`run this command to generate the certificates:`)
  console.log(`${a_s_command.join(' ')}`)
  Deno.exit()

  // const o_process = Deno.run(
  //     {
  //         cmd:a_s_command,
  //         stdout: "piped",
  //         stderr: "piped",
  //     }
  // )
  // // console.log(await o_process.status());
  // const { n_code } = await o_process.status();
  
  // const raw_output = await o_process.output();
  // const raw_error_output = await o_process.stderrOutput();
  // await o_process.close()

  // console.log(raw_output)

}


}


import { serve, serveTls } from "https://deno.land/std@0.154.0/http/server.ts";

import { O_json_db } from "https://deno.land/x/o_json_db@0.5/O_json_db.module.js";

import { O_url } from "https://deno.land/x/o_url/O_url.module.js";

var o_json_db = new O_json_db()

import { O_request } from "./O_request.module.js";

var o_folder_file = new O_folder_file(import.meta.url.split("//").pop())


window.o_deno_webserver = {
import_meta_url: import.meta.url, 
o_folder_file: o_folder_file,
s_path_name_folder_name_root: o_folder_file.s_folder_name, 
s_directory_seperator : "/"
}

window.o_deno_webserver.s_path_name_folder_name_default_handlers = 
window.o_deno_webserver.s_path_name_folder_name_root + 
window.o_deno_webserver.s_directory_seperator +
"default_f_handlers" 

window.o_deno_webserver.s_path_name_file_name_default_handler = 
window.o_deno_webserver.s_path_name_folder_name_default_handlers + 
window.o_deno_webserver.s_directory_seperator +
"f_handler_fileexplorer.module.js"


const f_handler = async (o_http_request, o_connection_info) => {
// var o_url = new O_url(o_http_request.url)
var o_url = new O_url(o_http_request.url)
window.o_deno_webserver.o_url_request = o_url
var o_request = new O_request(
  o_connection_info.hostname, 
  new Date().time, 
  o_http_request.url,
)

o_url.f_update_o_geolocation().then(
  function(){//f_resolve
      o_request.o_url = o_url
      // console.log(o_http_request)
      o_json_db.f_o_create(
        o_request
      )
  },
  function(){//f_reject
  }
)

window.o_deno_webserver.s_path_name_folder_name_domainorip_root = 
window.o_deno_webserver.s_path_name_folder_name_root + 
window.o_deno_webserver.s_directory_seperator +
o_url.s_hostname 

 
var s_path_name_file_name_handler = 
window.o_deno_webserver.s_path_name_folder_name_domainorip_root + 
window.o_deno_webserver.s_directory_seperator +
"f_handler.module.js"

try{
  var o_stat = await Deno.stat(s_path_name_file_name_handler);
  // console.log(o_stat)
}catch{
  console.log(`${s_path_name_file_name_handler} handler does not exist, using default handler: ${window.o_deno_webserver.s_path_name_file_name_default_handler}`)
  s_path_name_file_name_handler = window.o_deno_webserver.s_path_name_file_name_default_handler
}

var { f_handler } = await import(s_path_name_file_name_handler)
// console.log(f_handler)
return f_handler(o_http_request, o_connection_info).then(
  function(o_response){ //f_resolve
    return o_response
  }
)
.catch(function(){
  return new Response(
    "server error",
    { status: 500 }
    )
});

};
// try{
//   var s_text_cert = await Deno.readTextFile(o_environment.o_ssl.s_path_certificate_file);
//   var s_text_key = await Deno.readTextFile(o_environment.o_ssl.s_path_key_file);

// }catch{
//   console.log("could not read .key or .crt")
//   Deno.exit()
// }


if(o_environment.o_not_encrypted.n_port < 1024 || o_environment.o_encrypted.n_port < 1024){
  console.log("ports under 1024 needs root/superuser privileges")
}
serve(
async function(o_request){
  var s_url_new = o_request.url.replace("http", "https");
  s_url_new = s_url_new.replace(":"+o_environment.o_not_encrypted.n_port, ":"+o_environment.o_encrypted.n_port)
   return Promise.resolve(new Response(
     "moved",
     { 
         status: 301,  
         headers: {
             "location": s_url_new,
         },
     }
   ))
 },
   { 
     port:parseInt(o_environment.o_not_encrypted.n_port),
     hostname: o_environment.o_not_encrypted.s_host,
   }
 );

console.log(`HTTP webserver running. Access it at: ${o_environment.o_not_encrypted.s_url}:${o_environment.o_not_encrypted.n_port}/`);
console.log(`HTTPS webserver running. Access it at: ${o_environment.o_encrypted.s_url}:${o_environment.o_encrypted.n_port}/`);

serveTls(
  f_handler,
  { 
    certFile: o_environment.o_ssl.s_path_certificate_file,
    keyFile: o_environment.o_ssl.s_path_key_file,
    port: o_environment.o_encrypted.n_port,
    hostname: o_environment.o_encrypted.s_host,
  }
);


