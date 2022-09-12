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
  const o_environment = await import("./o_environment.js")  
  // var o_stat = await Deno.stat(s_path_o_environment);
  // var s_text = await Deno.readTextFile(s_path_o_environment);
}catch{
  console.error(`${s_path_o_environment}: file does not exist, please run '$ cp ${s_path_o_environment_example} ${s_path_o_environment} and adjust the file content`)
  Deno.exit(1)
}

import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { serveTls } from "https://deno.land/std@0.154.0/http/server.ts";

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

console.log(`HTTP webserver running. Access it at: http://localhost:${o_config.n_port}/`);
await serveTls(f_handler, { port: o_config.n_port, hostname: o_config.s_host_name });
