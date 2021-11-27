import json
from flask import Flask,request
app = Flask(__name__)
import pandas as pd

sensor_data = pd.read_csv('sensor_mismatch.csv')
sensor_mismatch = pd.read_csv('sensor_mismatch_count.csv')
sensor_match = pd.read_csv('sensor_match.csv')
temporal_mismatch = pd.read_csv('temporal_mismatch.csv')
week_aggregation = pd.read_csv('week_aggregation.csv')

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
    count1 = sensor_match.loc[sensor_match['sensor_id']  ==  int(id), 'number'].iloc[0]
    sound = sensor_data.loc[sensor_data['sensor_id'] == int(id), 'predictions'].iloc[0]
    return json.dumps({
        'sensor_id' : id,
        'mimatch_count' : count.tolist(),
        'match_count' : count1.tolist(),
        'sound' : sound
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



#get number of matches and mismatches for all the sensors under the region of polygon
@app.route('/mismatch_chart/<sensor_list>',methods=['GET'])
def get_location_mismatch(sensor_list):
    match_mismatch_count = {}
    sensor_list = json.loads(sensor_list)
    print(sensor_list)
    for sensor in sensor_list:
        print(sensor)
        match_mismatch_count[sensor] = {'mismatch' : int(sensor_mismatch.loc[sensor_mismatch['sensor_id'] == int(sensor),'number'].iloc[0]), 'match': int(sensor_match.loc[sensor_mismatch['sensor_id'] == int(sensor),'number'].iloc[0])}
    print(match_mismatch_count)
    return json.dumps(match_mismatch_count)

#get mismatches based on time
#input of the form - url/mismatch_time/[15,19]/tuesday/41
@app.route('/mismatch_time/<time_list_first>/<time_list_second>/<day>/<week>', methods = ['GET'])
def get_time_mismatch(time_list_first,time_list_second,day,week):
    #time_list = json.loads(time_list)
    try:
        first = int(time_list_first)
        last = int(time_list_second)
        day = str(day.capitalize().strip())
        lat_long = []
        sensors = []
        week = int(week)
        df = temporal_mismatch.loc[temporal_mismatch['week'] == week]
        df = df.loc[df['day'] == day]
        df = df.sort_values(by=['hour'])
        count = df[df['hour'].between(first,last)]['hour'].count()
        highest_prediction=week_aggregation.loc[week_aggregation['week'] == week,'target'].iloc[0]
        highest_prediction = highest_prediction.split('_')[1]
        for index,rows in df.iterrows():
            lat_long.append((rows['latitude'],rows['longitude']))
            sensors.append(rows['sensor_id'])
        lat_long = list(set(lat_long))
        sensors = list(set(sensors))
        return json.dumps({
            'count' : int(count),
            'prediction_according_to_week' : highest_prediction,
            'location' : lat_long,
            'sensors': sensors 
        })
    except:
        return json.dumps({
            'sensors': []
        })



if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080)

