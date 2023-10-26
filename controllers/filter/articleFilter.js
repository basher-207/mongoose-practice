exports.articleFilter = async (querys, model) => {
    let query = model.find();

    const queryKeys = Object.keys(querys) ;
    queryKeys.forEach(key => {
        switch (key) {
            case "title":
                query = query.where({title: querys[key]});
                break;
            case "theme":
                query = query.where({theme: querys[key]});
                break;
            case "description":
                query = query.where({description: querys[key]});
                break;
            case "lastChangedAt":
                query = query.where({lastChangedAt: querys[key]});
                break;
            case "viewsCount":
                if(typeof querys.viewsCount != 'object'){
                    query = query.where({viewsCount: querys[key]});
                }else{
                    const viewsQuery = Object.keys(querys.viewsCount).reduce((a, c) => (a[`$${c}`] = querys.viewsCount[c], a) , {});
                    query = query.where({viewsCount: viewsQuery});
                }
                break;
            case "sort":
                const sortString = querys[key].replace(',', ' ');
                query = query.sort(sortString);
                break;
            case "limit":
                if(querys.page){
                    query = query.skip( Number(querys.limit) * ( Number(querys.page) - 1 ));
                }
                query = query.limit(querys[key]);
                break;
            default:
                break;
        }
    });

    const result = await query.exec()

    if(querys.fields){
        const keysArr = querys.fields.split(',');
        const filteredObjArr = [...result];

        function filterObjectByKeys(originalObject, keysArray) {
            const filteredObject = {};
            
            keysArray.forEach(key => {
              if (originalObject[key] !== undefined) {
                filteredObject[key] = originalObject[key];
              }
            });
          
            return filteredObject;
        };

        const filteredByFields = filteredObjArr.map((obj) => {
            return filterObjectByKeys(obj, keysArr);
        });
        return filteredByFields;
    }

    return result;
}