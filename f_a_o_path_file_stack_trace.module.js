import {O_path_file} from "https://deno.land/x/o_path_file@0.1/O_path_file.module.js"


var f_a_o_path_file_stack_trace = function(s_trace){
    var s_trace = new Error().stack
    let a_s_line  = s_trace.split('\n')
    var a_o_path_file_stack_trace = []
    var s_search = "file://"
    var s_search2 = ":"
    for(let s_line of a_s_line){
        let a_s_part = s_line.split(s_search)
        a_s_part.shift()
        var s_tmp = a_s_part.join(s_search)
        a_s_part = s_tmp.split(s_search2)
        a_s_part.pop()
        a_s_part.pop()
        var s_path_name_file_name = a_s_part.join(s_search2)
        var n_index = s_line.indexOf(s_search)
        if(n_index ==-1){continue}

        a_o_path_file_stack_trace.push(
            new O_path_file(s_path_name_file_name)
        )
    }
    // console.log(a_o_path_file_stack_trace)

    return a_o_path_file_stack_trace

}

export {f_a_o_path_file_stack_trace}