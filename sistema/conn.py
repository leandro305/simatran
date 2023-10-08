from pymongo import MongoClient

def connection():
    databasename="simatran"
    connection=MongoClient('mongodb+srv://leandro305:95991558285@cluster0.4erz4.mongodb.net/')
    db = connection[databasename]
    return db