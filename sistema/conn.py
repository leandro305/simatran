from pymongo import MongoClient

def connection():
    databasename="simatran"
    connection=MongoClient("mongodb+srv://leandro305:95991374293@cluster0.4uli0ht.mongodb.net/")
    db = connection[databasename]
    return db