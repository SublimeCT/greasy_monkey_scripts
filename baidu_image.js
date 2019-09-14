const imagesJson = require('./baidu_images.json')
const fs = require('fs')

const result = {} // categoryName, idList
const map = {} // id: name

const originList = imagesJson.bsResult.data

const CATEGORY_FIELDS = ['skinData', 'starData']
const convert = () => {
    for (const row of originList) {
        if (Array.isArray(row.bgitem)) {
            handleRows(row, row.bgitem)
        } else {
            for (const field of CATEGORY_FIELDS) {
                if (!Array.isArray(row[field])) continue
                for (category of row[field]) {
                    for (const rows of row[field]) {
                        handleRows(rows, rows.list)
                    }
                    break
                }
                break
            }
        }
    }
}

const handleRows = (parent, rows) => {
    let index = 0
    for (const r of rows) {
        const categoryName = (parent.type || '') + (parent.name || '') + (parent.filewriter || '')
        const img = {
            id: Number(r.filename || r.dataindex),
            name: (r.name || r.filewriter)
                ? ((r.name || '') + ' ' + (r.filewriter || ''))
                : categoryName + index
        }
        if (img.id > 10000) continue // 过滤自定义背景图 ??
        console.log(categoryName, img.name)
        // console.log(img)
        // if (!img.name.trim()) console.log(rows)
        // if (map[img.id]) console.log(map[img.id])
        map[img.id] = img.name
        if (!Array.isArray(result[categoryName])) result[categoryName] = []
        result[categoryName].push(img.id)
        index++
    }
}

convert()

// console.log(result)
// console.log(map)

fs.writeFileSync('./baidu_image_categorys.json', JSON.stringify(result))
fs.writeFileSync('./baidu_image_map.json', JSON.stringify(map))