const getElements = (defaultElements: string[], elements?: string[]) => {
    let res = [];
    res = defaultElements;
    if (elements.length === 1) {
        switch (elements[0][0]) {
            case "+":
                res.push(elements[0].slice(1))
                break;
            case "-":
                res = res.filter(b => b !== elements[0].slice(1));
                break
            default:
                res = elements;
        }
    }
    else
        res = elements;

    return res;
}

export default getElements;