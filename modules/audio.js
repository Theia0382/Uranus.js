const { createAudioPlayer, createAudioResource } = require( '@discordjs/voice' );
const ytdl = require( 'ytdl-core' );
const fs = require('fs');
const path = require( 'path' );

const audioPlayer = [ ];
const playlist = [ ];

function getAudioPlayer( guildID )
{
    if ( !audioPlayer[ guildID ] )
    {
        audioPlayer[ guildID ] = createAudioPlayer( );
    }
    
    return audioPlayer[ guildID ];
}

function getPlaylist( guildID )
{
    if ( !playlist[ guildID ] )
    {
        playlist[ guildID ] = [ ];
    }

    return playlist[ guildID ];
}

async function play( guildID )
{
    const url = getPlaylist( guildID )[ 0 ];
    console.log( url );
    const player = getAudioPlayer( guildID );
    const download = ytdl( url, { filter : 'audioonly', quality : 'highestaudio' } );
    download.pipe( fs.createWriteStream( path.join( __dirname, `../temp/${guildID}.mp3` ) ) );

    download.once( 'end', ( ) =>
    {
        const stream = fs.createReadStream( path.join( __dirname, `../temp/${guildID}.mp3` ) );
        const resource = createAudioResource( stream, { inlineVolume : true } );
        resource.volume.setVolume( 0.5 );
        player.play( resource );
    } );
}

module.exports =
{
    getAudioPlayer,
    getPlaylist,
    play
}