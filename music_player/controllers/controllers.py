# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import Response
from odoo.modules.module import get_module_resource
import json

class MusicPlayer(http.Controller):
    @http.route('/music', auth='public')
    def index(self,**kw):
        return http.request.render('music_player.music_template')

    # @http.route('/music/search', auth='public')
    # def list(self, **kw):
    #     find_song = kw.get('song_name')
    #     print('-------',find_song)
    #     result = { "song_name": find_song}
    #     response_data = json.dumps(result)
    #     return http.Response(response_data)
    @http.route('/music/search', auth='public',type="http", methods=["GET"])
    def search(self, **kw):
        song_name = kw.get('song_name')
        # print('in controller')
        musics = http.request.env['music_player.music_player'].search_read([('name', 'ilike', song_name)],fields={"name","filename","url"})
        if not musics:
              musics = "Song not Found"
        # breakpoint()
        # musics='hello'
        return Response(json.dumps({'result': musics}), content_type='application/json')

#     @http.route('/music_player/music_player/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('music_player.listing', {
#             'root': '/music_player/music_player',
#             'objects': http.request.env['music_player.music_player'].search([]),
#         })

    @http.route('/music/<model("music_player.music_player"):music>',type='http', auth='public')
    def load(self, music, **kw):
        music_file_path = get_module_resource('music_player', 'static/songs', music.filename)
        file = open(music_file_path, 'rb').read()
        return file
