from pymongo import MongoClient

def connection():
    databasename="simatran"
    connection=MongoClient()
    db = connection[databasename]
    return db