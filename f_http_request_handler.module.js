import { O_url } from "https://deno.land/x/o_url/O_url.module.js";
import { O_request } from "./O_request.module.js";

let f_http_request_handler = async function(
    o_http_request,
    o_connection_info,
    o_webserver
){

    // console.log(o_http_request, o_connection_info,o_webserver)
    o_webserver.o_url = new O_url(o_http_request.url)
    var o_request = new O_request(
      o_connection_info.hostname, 
      new Date().time, 
      o_http_request.url,
    )
    
    o_webserver.o_url.f_update_o_geolocation().then(
      function(){//f_resolve
          o_request.o_url = o_webserver.o_url
          // console.log(o_http_request)
          o_webserver.o_json_db.f_a_o_create(
            O_request,
            o_request
          )
      },
      function(){//f_reject
      }
    )

    var s_pathfile_handler_default = `./${o_webserver.o_url.s_domainname}/f_http_request_handler.module.js`;

    try{
        var o_stat = await Deno.stat(s_pathfile_handler_default);
    }catch{
        console.log(`${s_pathfile_handler_default}: could not open file`)
    }
    
    if(o_stat){

        var o_url_first_js_file = o_webserver.a_o_url_stack_trace.slice(-1)[0];
        var s_pathfile_local_handler = o_url_first_js_file.o_URL.href.split("/").slice(0,-1).join("/") +"/"+ s_pathfile_handler_default;

        var o_module = await import(s_pathfile_local_handler);
        return o_module.f_http_request_handler(
            o_http_request,
            o_connection_info,
            o_webserver
        )
    }else{
        return Promise.resolve(
            new Response(
                "f_http_request_handler.module.js not found",
                { status: 404 }
            )
        )
        // console.log(`${s_path_handler_default}: is being used as default f_http_request_handler`);
        // var o_module = await import(s_path_handler_default)
    }


    
    
}
export {f_http_request_handler}