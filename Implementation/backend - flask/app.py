import json
from flask import Flask
app = Flask(__name__)

#get all sensors data
@app.route('/sensors',methods=['GET'])
def get_sensors():
    return json.dumps({})

#get all mismtaches of all sensors
@app.route('/sensors_mismatch',methods=['GET'])
def get_sensors_mismatch():
    return json.dumps({})

#get mismtach of particular sensor based on id
@app.route('/particular_mismatch/<id>',methods=['GET'])
def get_particular_mismatch(id):
    return json.dumps({})

#get matches of particular sensor based on id 
@app.route('/particular_match/<id>',methods=['GET'])
def get_particular_match(id):
    return json.dumps({})

#get matches of particular sensor based on id 
@app.route('/particular_match/<id>',methods=['GET'])
def get_particular_match(id):
    return json.dumps({})

#get mismatches based on a particular region 
@app.route('/location_mismatch',methods=['GET'])
def get_particular_match():
    return json.dumps({})



if __name__ == '__main__':

    app.run(debug=True, host='127.0.0.1', port=8080)

