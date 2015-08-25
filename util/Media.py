import requests

class Media:
    'Abstraction of the media object that will be uploaded to the server'

    def __init__(self, a_header, path, show_name):
        self.a_header  = a_header #header for my server
        self.path      = path
        self.show_name = show_name

        self.data         = {}
        self.data['name'] = path
        self.data['show'] = show_name
        self.data['path'] = path
        self.data['tags'] = []

    def populate(self):
        #TODO: Fill these
        self.data['filetype'] = ''
        self.data['size']     = 0
        self.data['length']   = 0
        self.data['seq']      = 0
        self.data['lang']     = ''
        self.data['subgroup'] = ''

    def post( self ):
        print( self.data )
        return requests.post('http://localhost:3000/api/media', headers=self.a_header, json=self.data )


