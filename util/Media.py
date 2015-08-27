import requests
import subprocess
import json
import re

class Media:
    'Abstraction of the media object that will be uploaded to the server'

    def __init__(self, a_header, path, show_name, show_dir):
        self.a_header  = a_header #header for my server
        self.path      = path
        self.show_name = show_name
        self.show_dir  = show_dir

        self.data         = {}
        self.data['name'] = path
        self.data['show'] = show_name
        self.data['path'] = path
        self.data['tags'] = []

    def populate(self):
        #Get json string from ffprobe and wash it into python
        metadata  = subprocess.check_output(["ffprobe","-v","quiet","-print_format","json","-show_format","-show_streams", self.show_dir + '/' + self.data['path']] )
        metadata  = json.loads(metadata.decode('utf8'))
        seq_regex = re.findall(r'- ?_?(\d+)', self.data['name'])
        sub_regex = re.findall(r'^\[([A-Za-z0-9_]+)\]', self.data['name'])

        self.data['filetype'] = metadata['format']['format_long_name']
        self.data['size']     = metadata['format']['size']
        self.data['length']   = metadata['format']['duration']
        self.data['seq']      = seq_regex.pop(0) if len(seq_regex) else 0
        self.data['lang']     = ''
        self.data['subgroup'] = sub_regex.pop(0) if len(sub_regex) else ""


    def post( self ):
        print( self.data )
        return requests.post('http://localhost:3000/api/media', headers=self.a_header, json=self.data )


