import {O_path_file} from "https://deno.land/x/o_path_file@0.3/O_path_file.module.js"


var f_handler = async function(
    o_http_request,
    o_connection_info
    ){
    var s_stack = new Error().stack 
    // console.log(s_stack)
    var {f_a_o_path_file_stack_trace} = await import('./../f_a_o_path_file_stack_trace.module.js')
    var a_o_path_file_stack_trace = f_a_o_path_file_stack_trace(s_stack)
    // console.log(a_o_path_file_stack_trace)
    var o_path_file_last = a_o_path_file_stack_trace.splice(-2,1).shift()
    // console.log(o_path_file_last.s_path_name)

    var s_sep = "://"
    var a_s_part = o_http_request.url.split(s_sep)
    a_s_part.shift()
    var s_path_name_file_name_query_fragment = "/"+a_s_part.join(s_sep).split("/").slice(1).join('/')
    var s_sep = "#"
    var a_s_part = s_path_name_file_name_query_fragment.split(s_sep)
    var s_path_name_file_name_query = a_s_part.shift()
    var s_sep = "?"
    var s_path_name_file_name = s_path_name_file_name_query.split(s_sep).shift()
    // console.log(s_path_name_file_name_relative)
    var s_path_name_file_name_absolute = o_path_file_last.s_path_name + o_path_file_last.s_dir_separator + s_path_name_file_name
    var o_path_file_absolute = new O_path_file(s_path_name_file_name_absolute)
    var s_file_name = o_path_file_absolute.s_file_name
    if(s_file_name == null){
        s_file_name = "index.html" // default   
    }
    var s_path_name_file_name_absolute = o_path_file_absolute.s_path_name + o_path_file_absolute.s_dir_separator + s_file_name
    var o_path_file_absolute = new O_path_file(s_path_name_file_name_absolute)
    // console.log(o_path_file_absolute)

    // console.log(window.o_deno_webserver.a_o_path_file_current_file)
    
    try{
        var file_content = await Deno.readFile(s_path_name_file_name_absolute);
    }catch{
        console.log("not found")
        return Promise.resolve(
            new Response(
                "not found",
                { status: 404 }
                )
        )
    }

    return Promise.resolve(
        new Response(
            file_content,
            { 
                status: 200, 
                headers: {
                    "content-type": o_path_file_absolute.o_mime_type_guessed_by_file_extension.s_mime_type,
                },
            }
        )
    )

}

export {f_handler}