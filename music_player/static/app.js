/** @odoo-module**/

const { Component, mount, xml, useState } = owl;

let audio = '';

class PlayList extends Component {
    static template = xml`
    <div style="position:absolute;right:5px">
    <h2>Playlist</h2>
    <t t-if="props.playlistData">
        <div>
        <t t-foreach="props.playlistData" t-as="song" t-key="song.id">
        <p><t t-out="song.name"/></p>
        <button id="play-btn" t-on-click="playThisSong">Play</button>
        
    </t>
        </div>
        </t>
    </div>
    `;
    playThisSong() {
        if (!audio) {
            return;
        }
        console.log("p")
        audio.play();
    }

    static props = ["playlistData"];
}
class Player extends Component {
    static template = xml`
    <div style="position:absolute;bottom:20px;background-color:green">
        <h2 id="song-title">Song Title</h2>
        <div>
            <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
            <button id="play-btn" t-on-click="playThisSong">Play</button>
            <button id="stop-button" t-on-click="stopThisSong">Stop</button>
        </div>
    </div>
    `;

    pauseThisSong() {
        if (!audio) {
            return;
        }
        audio.pause();
    }
    playThisSong() {
        if (!audio) {
            return;
        }
        audio.play();
    }
    stopThisSong() {
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    }
}

class Musiclist extends Component {
    static template = xml`
                        <div id="Musiclist" style="float: left">
                            <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
                                <h2>List of Songs</h2>
                                <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
                                    <p><t t-out="song.name"/></p>
                                    <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
                                    <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
                                </t>
                            </t>
                            <Player />
                            <PlayList playlistData="playlistData"/>
                        </div>
                        `;

    setup() {
        this.playlistData = useState([]);
    }
    playSong(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(song => song.url === selectedSongUrl);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl)
        audio.play();
    }

    addSongToPlaylist(ev) {
        const addedSongUrl = ev.target.getAttribute('value');
        const addedSong = this.props.searchData[0].find(song => song.url === addedSongUrl);
        this.playlistData.push(addedSong);
        audio = new Audio(addedSongUrl)
        console.log(this.playlistData);
    }
    static props = ["searchData"];
    static components = { Player, PlayList }
}

class Search extends Component {
    static template = xml`
    <div style="text-align:center">
        <input type="text" style="border:1px solid black;" id="searchSong" placeholder="Search a music" value="Akon"/>
        <button t-on-click="getMusic" id="SearchButton">Search</button>
        <Musiclist searchData="searchData"/>
    </div>
    `;

    setup() {
        this.searchData = useState([]);
    }

    async getMusic() {
        const findSong = document.getElementById('searchSong').value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const { result: response_data } = await response.json();
        console.log(response_data)
        this.searchData.push(response_data);
    }
    static components = { Musiclist };
}

class Root extends Component {
    static template = xml`
    <div>
    <Search />
    </div>
    `;

    static components = { Search }
}

window.onload = function () {
    mount(Root, document.body)
}