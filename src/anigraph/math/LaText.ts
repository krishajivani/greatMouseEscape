export class LaText{
    static nDigitsDisplay:number=3;
    static beginMath(){
        return "\\("
    }
    static endMath(){
        return "\)"
    }
    static inline(strings: TemplateStringsArray){
        return "\\("+strings.raw+"\\)";
    }

    static raw(strings:TemplateStringsArray){
        return strings.raw;
    }

    static columnVector(entries:number[]){
        let rstring = ""
        rstring = rstring+"\\begin{bmatrix}"
        for(let e of entries){
            rstring+=`${e.toFixed(LaText.nDigitsDisplay)}\\\\`
        }
        rstring = rstring+"\\end{bmatrix}"
        return rstring;
    }

    static matrix(entries:number[], rows:number, columns:number){
        let rstring = ""
        rstring = rstring+"\\begin{bmatrix}"
        for(let r=0;r<rows;r++) {
            for (let c = 0; c < columns; c++) {
                rstring += `${entries[columns*r+c].toFixed(LaText.nDigitsDisplay)}`
                if(c<columns-1){
                    rstring+=` &`
                }
            }
            if(r<rows-1){
                rstring+=`\\\\`
            }
        }
        rstring = rstring+"\\end{bmatrix}"
        return rstring;
    }
}


