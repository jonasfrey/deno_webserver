
var f_handler = async function(
    o_request, 
    o_connection_info, 
    o_webserver, 
    s_url = "https://deno.land"
){
    var s_response = await fetch(s_url+o_webserver.o_url.s_path);
    return Promise.resolve(
        new Response(s_response.body)
    )
}

export {f_handler}