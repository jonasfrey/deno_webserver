var o_current_run_info = {
    a_s_argument : Deno.args,
    s_current_path_name_file_name : import.meta.url.split('//')
}

import { O_path_file }  from "https://deno.land/x/o_path_file@0.1/O_path_file.module.js"

const o_config  = await import("./.deno_webserver/o_config.js");

import { serve } from "https://deno.land/std@0.153.0/http/server.ts";

import { O_json_db } from "https://deno.land/x/o_json_db/O_json_db.module.js";

var o_json_db = new O_json_db()

import * as log from "https://deno.land/std@0.153.0/log/mod.ts";
import { O_request } from "./O_request.module.js";


const f_handler = (o_http_request) => {

  console.log(o_http_request.headers.get('host'))
  // console.log(o_request)
  // console.log(typeof o_request)
  // var o_request = new O_request(
    // new 
  // )
  return new Response("test", { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${o_config.n_port}/`);
await serve(f_handler, { port: o_config.n_port, hostname: o_config.s_host_name });