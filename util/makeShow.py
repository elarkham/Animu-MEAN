#!/bin/env python
import requests
import json
import argparse
from os import walk

### Headers ###
animu_headers = {'x-access-token':'***REMOVED***'}
hummingbird_headers = {'X-Client-Id': '***REMOVED***'}

### Arguments ###
parser = argparse.ArgumentParser()
parser.add_argument('directory', metavar='directory', type=str, help='The directory that will be added')
parser.add_argument('-t', '--tags', nargs='*', metavar='tags', type=str, help='Defines the shows tags')
args = parser.parse_args()

### Show Values ###
directory = args.directory
tags = args.tags

#Query Hummingbird.me
search = {'query' : directory }
bird_data = requests.get('http://hummingbird.me/api/v1/search/anime', params=search, headers=hummingbird_headers)
results = bird_data.json()

#Ask which result is correct
for i in range( 0, len(results)):
    print(i,':', str(results[i]['title']))

index = input('Which of these is correct?: ')
bird_data = results[int(index)]

#Display Data
show = {}
show['name']     = bird_data['title']
show['alt_name'] = bird_data['alternate_title']
show['tags']     = args.tags
#path
#cover image

#Metadata
show['mal_id']          = bird_data['mal_id']
show['status']          = bird_data['status']
show['episode_count']   = bird_data['episode_count']
show['episode_length']  = bird_data['episode_length']
show['synopsis']        = bird_data['synopsis']
show['started_airing']  = bird_data['started_airing']
show['finished_airing'] = bird_data['finished_airing']
show['rating']          = bird_data['community_rating']
show['age_rating']      = bird_data['age_rating']

#Genres
show['genres'] = list()
for genre in bird_data['genres']:
    show['genres'].append(genre['name'])


##Post to Server
post = requests.post('http://localhost:3000/api/shows', headers=animu_headers, json=show )


