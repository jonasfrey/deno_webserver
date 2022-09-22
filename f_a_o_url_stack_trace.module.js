import {O_url} from "https://deno.land/x/o_url@0.3/O_url.module.js"

var f_a_o_url_stack_trace = function(){
    
    var s_trace = new Error().stack;
    let a_s_line  = s_trace.split('\n')
    var a_o_url_stack_trace = []
    var s_search = "file://"
    var s_search2 = ":"
    for(let s_line of a_s_line){
        var n_index_start = s_line.indexOf(s_search);
        if(n_index_start == -1){
            continue;
        }
        var n_index_end = s_line.length;
        var n_index_count = 0;
        while(n_index_end > 0){
            n_index_count += (s_line[n_index_end] == s_search2) ? 1 : 0;
            if(n_index_count == 2){
                break;
            }
            n_index_end--;
        }
        let s_url = s_line.slice(n_index_start, n_index_end);
        // console.log(s_url)
        a_o_url_stack_trace.push(
            new O_url(s_url)
        )
    }

    return a_o_url_stack_trace

}

export {f_a_o_url_stack_trace}