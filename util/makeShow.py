#!/bin/env python2
import requests
import json
import argparse
from os import walk

#Headers
animu_headers = {'x-access-token':'***REMOVED***'}
hummingbird_headers = {'X-Client-Id': '***REMOVED***'}

#Arguments
parser = argparse.ArgumentParser()
parser.add_argument('directory', metavar='directory', type=str, help='The directory that will be added')
args = parser.parse_args()

##Show Values
name = args.directory

#Humming Bird
search = {'query' : 'Neon_Genesis_Evangelion'}
bird_data = requests.get('http://hummingbird.me/api/v1/search/anime', params=search, headers=hummingbird_headers)
results = bird_data.json()

index=True
while index:
    for item in results:
        print( item['title'] )
    index = raw_input("Which of these is correct?: ")
    if index == "0":
        break;
    if index == "1":
        break

print( results[int(index)]['title'] )

#show = { 'name' : name }
#p = requests.post('http://localhost:3000/api/shows', headers=headers, json=show )


