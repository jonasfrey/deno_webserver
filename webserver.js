var o_current_run_info = {
    a_s_argument : Deno.args,
    s_current_path_name_file_name : import.meta.url.split('//')
}

import { O_path_file }  from "https://deno.land/x/o_path_file@0.1/O_path_file.module.js"

const o_config  = await import("./.deno_webserver/o_config.js");

import { serve } from "https://deno.land/std@0.153.0/http/server.ts";

import { O_json_db } from "https://deno.land/x/o_json_db@0.5/O_json_db.module.js";

import {existsSync } from "https://deno.land/std/fs/mod.ts";


var o_json_db = new O_json_db()

import * as log from "https://deno.land/std@0.153.0/log/mod.ts";

import { O_request } from "./O_request.module.js";


const f_handler = async (o_http_request, o_connection_info) => {
  var o_request = new O_request(
    o_connection_info.hostname, 
    new Date().time, 
    o_http_request.url
  )

  o_json_db.f_o_create(
    o_request
  )

  // console.log(o_http_request)
  var s_sep = "://"
  var a_s_part = o_http_request.url.split(s_sep)
  var s_protocol = a_s_part.shift()
  var s_rest = a_s_part.join(s_sep)

  var a_s_part = s_rest.split("/")
  var s_domain_or_ip_and_maybe_port = a_s_part.shift()
  // console.log(s_domain_or_ip_and_maybe_port)
  var a_s_part = s_domain_or_ip_and_maybe_port.split(":")
  var s_domain_or_ip_or_ip = a_s_part.shift()
  // console.log(s_domain_or_ip_or_ip)
  var a_s_domain_level = s_domain_or_ip_or_ip.split(".")  
  
  var b_exists = false
  try{
    var o_stat = await Deno.stat(s_domain_or_ip_or_ip);
    console.log(o_stat)
    b_exists = true 
  }catch{
    console.log('not exist')
  }
  if(b_exists){

    var { f_handler } = await import(`./${s_domain_or_ip_or_ip}/f_handler.module.js`)
    console.log(f_handler)
    var o_response = await f_handler(o_http_request, o_connection_info);
    console.log(o_response)
    return o_response
  }
  

  return new Response("running", { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${o_config.n_port}/`);
await serve(f_handler, { port: o_config.n_port, hostname: o_config.s_host_name });