import requests

class Show:
    'Abstraction of the Show object that will be uploaded to the server'

    def __init__(self, a_header, h_header, dir_name, tags):
        self.a_header = a_header #header for my server
        self.h_header = h_header #header for hummingbird
        self.dir_name = dir_name

        self.data              = {}
        self.data['directory'] = dir_name
        self.data['tags']      = tags
        self.data['name']      = dir_name
        self.data['path']      = dir_name

    def populate( self, query ):
        if query is None:
            query = self.dir_name

        search = {'query' : query }
        bird_data = requests.get('http://hummingbird.me/api/v1/search/anime', params=search, headers=self.h_header)
        results = bird_data.json()

        for i in range( 0, len(results)):
            print(i,':', str(results[i]['title']))

        index = input('Which of these is correct?: ')
        bird_data = results[int(index)]


        #Display Data
        self.data['name']     = bird_data['title']
        self.data['alt_name'] = bird_data['alternate_title']
        #cover image

        #Metadata
        self.data['mal_id']          = bird_data['mal_id']
        self.data['status']          = bird_data['status']
        self.data['episode_count']   = bird_data['episode_count']
        self.data['episode_length']  = bird_data['episode_length']
        self.data['synopsis']        = bird_data['synopsis']
        self.data['started_airing']  = bird_data['started_airing']
        self.data['finished_airing'] = bird_data['finished_airing']
        self.data['rating']          = bird_data['community_rating']
        self.data['age_rating']      = bird_data['age_rating']

        #Genres
        self.data['genres'] = list()
        for genre in bird_data['genres']:
            self.data['genres'].append(genre['name'])

    def getName(self):
        return self.data['name']

    def post( self ):
        print( self.data )
        return requests.post('http://localhost:3000/api/shows', headers=self.a_header, json=self.data )


