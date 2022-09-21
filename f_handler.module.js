import { O_url } from "https://deno.land/x/o_url/O_url.module.js";
import { O_request } from "./O_request.module.js";

let f_handler = async function(
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
          o_webserver.o_json_db.f_o_create(
            o_request
          )
      },
      function(){//f_reject
      }
    )
    
    var s_path_handler = `./${o_webserver.o_url.s_domainname}/f_handler.module.js`;
    var s_path_handler_default = `./default_f_handlers/fileexplorer/f_handler.module.js`;
    try{
        var o_stat = await Deno.stat(s_path_handler);
    }catch{
        console.log(`${s_path_handler}: could not open file`)
    }
    if(o_stat){
        var o_module = await import(s_path_handler);
        return o_module.f_handler(
            o_http_request,
            o_connection_info,
            o_webserver
        )
    }else{
        return Promise.resolve(
            new Response(
                "f_handler.module.js not found",
                { status: 404 }
            )
        )
        // console.log(`${s_path_handler_default}: is being used as default f_handler`);
        // var o_module = await import(s_path_handler_default)
    }


    
    
}
export {f_handler}