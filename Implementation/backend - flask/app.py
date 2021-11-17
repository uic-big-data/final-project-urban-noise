import json
from flask import Flask
app = Flask(__name__)
import pandas as pd

sensor_data = pd.read_csv('sensor_mismatch.csv')
sensor_mismatch = pd.read_csv('sensor_mismatch_count.csv')
sensor_match = pd.read_csv('sensor_match.csv')
#get all sensors data
@app.route('/sensors',methods=['GET'])
def get_sensors():
    
    sensor_list = []
    for index,rows in sensor_data.iterrows():
        sensor_list.append({
            'sensor_id' : rows['sensor_id'],
            'latitude' : rows['latitude'],
            'longitude' : rows['longitude']
        })
    return json.dumps(sensor_list)

#get count of all mismtaches of all sensors
@app.route('/sensors_mismatch',methods=['GET'])
def get_sensors_mismatch():
   
    sensor_counts = []
    for index,rows in sensor_mismatch.iterrows():
        sensor_counts.append({
            'sensor_id' : int(rows['sensor_id']),
            'counts' : int(rows['number'])
        })
    print(sensor_counts)
    return json.dumps(sensor_counts)

#get mismtach of particular sensor based on id
@app.route('/particular_mismatch/<id>',methods=['GET'])
def get_particular_mismatch(id):
    if int(id) not in list(sensor_mismatch['sensor_id']):
        return json.dumps({
            'message' : 'id not present'
        })
    count = sensor_mismatch.loc[sensor_mismatch['sensor_id'] == int(id), 'number'].iloc[0]
    return json.dumps({
        'sensor_id' : id,
        'count' : count.tolist()
    })

#get matches of particular sensor based on id 
@app.route('/particular_match/<id>',methods=['GET'])
def get_particular_match(id):
    
    if int(id) not in list(sensor_match['sensor_id']):
        return json.dumps({
            'message' : 'id not present'
        })
    count = sensor_match.loc[sensor_match['sensor_id']  ==  int(id), 'number'].iloc[0]
    return json.dumps({
        'sensor_id' : id,
        'count' : count.tolist()
    })


#get most predicted sound at a particular sensor
@app.route('/sound_predicted/<id>',methods=['GET'])
def get_sound_predicted(id):
    if int(id) not in list(sensor_data['sensor_id']):
        return json.dumps({
            'message' : 'id not present'
        })
    sound = sensor_data.loc[sensor_data['sensor_id'] == int(id), 'predictions'].iloc[0]
    return json.dumps({
        'sensor_id' : id,
        'sound' : sound
    })



#get mismatches based on a particular region 
@app.route('/location_mismatch',methods=['GET'])
def get_location_mismatch():
    return json.dumps({})



if __name__ == '__main__':

    app.run(debug=True, host='127.0.0.1', port=8080)

