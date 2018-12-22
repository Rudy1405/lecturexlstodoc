const xlsx = require('node-xlsx').default;
const Paint = require('../models/paint')
const mongoose = require('mongoose')
const Range = require('../models/range')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/paints"); 


function saveExcel(req, res, line, file_path) {
try {   
            const workSheetsFromFile = xlsx.parse(`${__dirname}/${file_path}`); /// File PATH

            let paints = []
            let paintName///color
            const category = 'Base agua' /// this can change with the sheet .
            let base 
            //// buscar de la bd  Rango segun el id de la linea  eso se guarda en el arreglo de ranges 

            const rango = await Range.findById(line.__id)
            let range 
            let presentations = [] // objs array
            let presentationsName // name 1l,4l,19l 
            let onelts = []
            let fourlts =[]
            let nineteenlts = []

            let values = [] ///objs array
            let colorant // ink .
            let ounce
            let ouncePart


            workSheetsFromFile[0].data.forEach(function(val,j) {
                let cont = true    
                if(j === workSheetsFromFile[0].data.length -1){
                    savePresentation(onelts,fourlts,nineteenlts)
                
                }

                if(val.length === 0 || val.includes('COLOR') ){ /// dont let read headers or empty spaces
                    cont = false
                }
                
                if(val[0] !== undefined){
                        if(( typeof(val[0])== 'number' || val[0].includes('-') || val[0].includes(' ') ) && onelts.length > 0 && cont === true ) {
                        //    console.log(j,': ',val,'=> ',typeof(val), ' ::: \n')
                            savePresentation(onelts,fourlts,nineteenlts) 
                            onelts = []
                            fourlts= []
                            nineteenlts= []
                        }
                }
                if(cont === true){
                    workSheetsFromFile[0].data[j].forEach( function(value,i) {  
                        switch (i) {
                                case 0:
                                {
                                    if(typeof(value)== 'number' || value.includes('-') || value.includes(' '))
                                        paintName = value  
                                    break;
                                }
                                case 1:
                                {
                                    base = value
                                    break;
                                }
                                case 2:
                                {
                                    colorant = value
                                    break;
                                }
                                case 3:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 4:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 5:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 6:
                                {
                                    if(value.includes('R-'))
                                        range = rango.__id
                                    break
                                }
                        
                                default:
                                    break
                        }//switch
                    });//foreach data[]
                }///if
            });// foreach data
    } catch (error) {
        return next(error)
    }
}/// saveexcel

function valueSpliter(str){
    arr = str.split(" ")
    return arr
}

function saveElement(i,colorant,ounce,ouncePart){

    let element ={
        ink: colorant,
        ounce: ounce,
        ouncePart: ouncePart
    }
    //save our element in the array 
    switch (i) {
        case 3:
            {
                onelts.push(element)
                break;
            }
        case 4:
            {
                fourlts.push(element)
                break;
            }
        case 5:
            {
                nineteenlts.push(element)
                break;
            }            
    
        default:
            break;
    }

}

function savePresentation(onelts,fourlts,nineteenlts){
    let elementarr
    for (let index = 0; index < 3; index++) {
        switch (index) {
            case 0:
                {
                    presentationsName = '1L'
                    elementarr = onelts
                    break
                }
            case 1:
                {
                    presentationsName = '4L'
                    elementarr = fourlts
                    break
                }
            case 2:
                {
                    presentationsName = '19L'
                    elementarr = nineteenlts
                    break
                }
            default:
                break;
        }
        let presentation ={
            name: presentationsName,
            elements: elementarr
        }
        elementarr = []
       presentations.push(presentation)
    }
    savePaint(presentations)
    presentations = []
}

async function savePaint(presentations){

    try {
        let paint = new Paint ({
            color: paintName,
            category: category,
            presentations: presentations,
            base: base,
            line: line,
            range: range
        })
        paints.push(paint)  
        paint = await paint.save()
    } catch (error) {
        console.log('dude, un error:  ', error)
    }
}

module.exports= {
    saveExcel
}