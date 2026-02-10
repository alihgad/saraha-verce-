
export const findOne = async ({
    model,
    filter = {},
    select = '',
    options = {}
}) => {
    let doc = model.findOne(filter)
    if (select.length) {
        doc.select(select)
    }
    if (options.populate) {
        doc.populate(options.populate)
    }

    return await doc
}

export const findAll = async ({
    model,
    filter = {},
    select = '',
    options = {}
}) => {
    let doc = model.find(filter)
    if (select.length) {
        doc.select(select)
    }
    if (options.populate) {
        doc.populate(options.populate)
    }
    return await doc
}

export const findOneAndUpdate = async ({
    model,
    filter = {},
    update = {},
    options = {}
}) => {
    return await model.findOneAndUpdate(filter, update, options)
}

export const findOneAndDelete = async ({
    model,
    filter = {}
}) => {
    return await model.findOneAndDelete(filter)
}

export const insertOne = async ({
    model,
    data = {}
}) => {
    return await model.insertOne(data)
}

export const insertMany = async ({
    model,
    data = []
}) => {
    return await model.insertMany(data)
}