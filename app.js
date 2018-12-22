const xlsx = require('node-xlsx').default;
const express = require('express');
const Paint = require('./models/paint')
const mongoose = require('mongoose')
const multer = require('multer');

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/paints"); 


let paints = []
let paintName //color  .
const category = 'Base agua' /// this can change with the sheet .
let base // .
const line = 'Berelinte 7' //.
let range // . 

let presentations = [] // objs array
let presentationsName // name 1l,4l,19l 
let onelts = []
let fourlts =[]
let nineteenlts = []

let values= [] ///objs array
let colorant // ink .
let ounce
let ouncePart

function saveExcel(file_name){
    
    const workSheetsFromFile = xlsx.parse(`${__dirname}/uploads/${file_name}`);

try {
    workSheetsFromFile[0].data.forEach(function(val,j) {
        let cont = true    

    if(j === workSheetsFromFile[0].data.length -1){
        savePresentation(onelts,fourlts,nineteenlts)
    
    }

    if(val.length === 0 || val.includes('COLOR') ){
        // console.log('esta wea esta vacia')
        cont = false
    }
    
    if(val[0] !== undefined){
            if(( typeof(val[0])== 'number' || val[0].includes('-') || val[0].includes(' ') ) && onelts.length > 0 && cont === true )
            {
            console.log(j,': ',val,'=> ',typeof(val), ' ::: \n')
            savePresentation(onelts,fourlts,nineteenlts) 
            onelts = []
            fourlts= []
            nineteenlts= []
            }
    }


    if(cont === true){
        workSheetsFromFile[0].data[j].forEach( function(value,i) {
        // console.log(i,': ',value,'=> ',typeof(value))  
        switch (i) {
                case 0:
                {
                    if(typeof(value)== 'number' || value.includes('-') || value.includes(' '))
                        paintName = value
            //       console.log(i,': PaintName => ',paintName)  
                    break;
                }
                case 1:
                {
                    base = value
            //        console.log(i,': Base => ',base)
                    break;
                }
                case 2:
                {
                    colorant = value
            //        console.log(i,': ink => ',colorant)
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
                //  savePresentation(values)
                    break;
                }
                case 6:
                {
                    if(value.includes('R-'))
                        range = value
                    //console.log(i,': range =>',range)
                    break;
                }
        
            default:
                break;
        }//switch
        });//foreach data[]
    }///if
    });// foreach data
} catch (error) {
    console.log("error al hacer save excel:::::::::::: ",error)
}


}/// saveexcel

/*
paints.forEach(element => {
    console.log('PAINT: \n ',
    'Color: ', element.color, '. \n ',
    'Category: ', element.category, '. \n ', 
    'Presentation: [ \n ')

    element.presentations.forEach(element => {
        console.log(element)
    }); 

    console.log(']')                
    console.log('Base: ', element.base, '. \n',
                'Line: ', element.line, '. \n',
                'Range: ', element.range, '. \n') 
});
*/
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
          //      console.log(i,': 1lt element: \n', element , '\n :::::::::::::::::::::::::::::::::')
                break;
            }
        case 4:
            {
                fourlts.push(element)
         //       console.log(i,': 4lt element: \n', element , '\n :::::::::::::::::::::::::::::::::')
                break;
            }
        case 5:
            {
                nineteenlts.push(element)
         //       console.log(i,': 19lt element: \n', element , '\n :::::::::::::::::::::::::::::::::')
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
        }//switch
        let presentation ={
            name: presentationsName,
            elements: elementarr
        }
        elementarr = []
       presentations.push(presentation)
    }//for
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
     //   console.log(paint)    
    } catch (error) {
        console.log('dude, un error:  ', error)
    }
}




const upload = multer({
    dest: 'uploads/' // this saves your file into a directory called "uploads"
  }); 
  const app = express();
 
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  app.post('/', upload.single('file-to-upload'), (req, res) => {
    res.redirect('/');
    console.log(req.file)
    saveExcel(req.file.filename)
  });

 
  
  app.listen(3000);

//saveExcel()



module.exports= {
    saveExcel
}