function combinator({text, init}:{text:string, init?: { variables: Record<string, any> } }) {
    let generate_texts = text.match(/{([^}]+)}/g) || [];
    let generated_texts: string[] = [];
    let text_options:{source_text:string,  text_option:any}[] = []; // Вариации


    const moreArrayFunctions = (arr: any) => ({
        current: -1,
        arr,
        next(){
    
            if( this.current >= ( this.arr.length - 1 ) ){
                 this.current = 0;
            }else{
                this.current++;
            }
    
            return this.arr[this.current];
        }
    });
    
    generate_texts.forEach((combination:string) => {
        let source_text = combination;//исходные текст
            combination = combination.slice(1, -1);//Убираем фигурные скобки 
        let combinations = combination.split(`|`);
        text_options.push({
            source_text: source_text,
            text_option: combinations
        });
    });

    let max_count_option:number = 1;

    for(let text_options_index = 0; text_options_index < text_options.length; text_options_index++){
        let el = text_options[text_options_index];
        let length = el.text_option.length;
        max_count_option = max_count_option * length;
    }

    for(let index = 0; index < max_count_option; index++) {
        generated_texts.push(text);
    }

    for(let text_options_index = 0; text_options_index < text_options.length; text_options_index++) {
        const option = text_options[text_options_index];
        option.text_option = moreArrayFunctions(option.text_option);
        for(let generated_text_index = 0; generated_text_index < generated_texts.length; generated_text_index++) {
            let generated_text = generated_texts[generated_text_index];
            generated_text = generated_text.replace(option.source_text, option.text_option.next())
            generated_texts[generated_text_index] = generated_text;
        }
        
    }

    if (init) {
        const variable_keys = Object.keys(init.variables);
        for (var variableIndex = 0 ; variableIndex < variable_keys.length; variableIndex++) {
            let key = variable_keys[variableIndex];
            text = text.replace("$$" + variable_keys[variableIndex] + "$$", init.variables[key])
        }

    }

    return generated_texts;
}


export default combinator;


console.log(combinator({text:"{key1|key2|key3}|{key4|key5}|{key6|key7}"}))