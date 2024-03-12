const fs=require('fs')
const path=require('path')
const xlsx = require('xlsx')

//디렉토리 내 모든 파일 추출
function getAllJsFiles(lpath, fls = []) {
    const files = fs.readdirSync(lpath)

    files.forEach(file => {
        const filePath = path.join(lpath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJsFiles(filePath, fls)
        } else if (file.endsWith('.js') && !file.endsWith('.min.js')) {
            fls.push(filePath)
        }
    });

    return fls;
}
function checkCodeInjection(fls){
    rls=[]
    re=/('.*[\n;].*')|(".*[\n;].*")|(`.*[\n;].*`)/g
    for(var i in fls){
        var contents=fs.readFileSync(fls[i],'utf-8').toString().split('\n')
        for(var j in contents){
            var line=contents[j]
            var result=line.match(re)
            if(result!=null){
                flag=checkValue(line)
                if(flag==1){
                    rls.push([fls[i],line])
                }
            }
        }
    }
    return rls
}
function checkValue(line){
    re=/('\s*\+\s*.+\s*\+\s*')|("\s*\+\s*.+\s*\+\s*")|((`\s*\+\s*.+\s*\+\s*`)|(`.*(\$\{.+\}).*`))/g
    result=line.match(re)
    if(result!=null){
        return 1
    }
    return 0
}
function checkCmdi(fls){
    rls=[]
    ls=['spawn','process','os','child_process','shell','execa']
    var re1=/(=(\s*)require(\s*)\(['"`])/g
    var re2=/import(\s*).*(\s*)(from(\s*).*)?/g
    for(var i in fls){
        var contents=fs.readFileSync(fls[i],'utf-8').toString().split('\n')
        for(var j in contents){
            var line=contents[j]
            var reqResult=line.match(re1)
            var impResult=line.match(re2)
            if(reqResult!=null | impResult!=null){
                var lib=line//.split('require')[1]
                for(var k in ls){
                    if(lib.indexOf(ls[k])!=-1){
                        rls.push([fls[i],lib
])
                    }
                }
            }
        }

    }
    return rls
}
function generateExcel(...sheet){
    const data = xlsx.utils.book_new()
    const CodeInjection=xlsx.utils.aoa_to_sheet(sheet[0])
    const CommandInjection=xlsx.utils.aoa_to_sheet(sheet[1])
    CodeInjection["!cols"]=[{wpx:250},{wpx:100}]
    CommandInjection["!cols"]=[{wpx:250},{wpx:100}]
    xlsx.utils.book_append_sheet(data,CodeInjection,"CodeInjection")
    xlsx.utils.book_append_sheet(data,CommandInjection,"CommandInjection")
    xlsx.writeFile(data,"./result/result.xlsx")
}
function main(){
    const library=process.argv[2]
    const librarPath = './node_modules/' + library
    fls=getAllJsFiles(librarPath,[])
    codei=checkCodeInjection(fls)
    cmdi=checkCmdi(fls)
    generateExcel(codei,cmdi)
}

main()
