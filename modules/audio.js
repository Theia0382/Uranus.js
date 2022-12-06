const { createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require( '@discordjs/voice' );
const ytdl = require( 'ytdl-core' );
const ytpl = require( 'ytpl' );
const fs = require( 'fs' );
const join = require( 'path' ).join;
const EventEmitter = require( 'events' );
const FfmpegCommand = require( 'fluent-ffmpeg' );

new FfmpegCommand( ).setFfmpegPath( join( __dirname, '../node_modules/ffmpeg-static/ffmpeg.exe' ) );

const audioPlayer = [ ];
const playlist = [ ];
const status = [ ];


class Audio extends EventEmitter
{
    __getAudioPlayer( guildId )
    {
        if ( audioPlayer[ guildId ] === undefined )
        {
            audioPlayer[ guildId ] = createAudioPlayer( );

            audioPlayer[ guildId ].on( AudioPlayerStatus.Idle, ( ) =>
            {
                if( status[ guildId ].playing === true )
                {
                    this._getNextResource( );
                }
            } );
        }
        
        return audioPlayer[ guildId ];
    }
    
    __getPlaylist( guildId )
    {
        if ( playlist[ guildId ] === undefined )
        {
            playlist[ guildId ] = [ ];
        }
    
        return playlist[ guildId ];
    }

    __getStatus( guildId )
    {
        if ( status[ guildId ] === undefined )
        {
            status[ guildId ] =
            {
                playing : false
            };
        }

        return status[ guildId ];
    }


    constructor( guildId )
    {
        super( );
        this.id = guildId;
        this.player = this.__getAudioPlayer( guildId );
        this.playlist = this.__getPlaylist( guildId );
        this.status = this.__getStatus( guildId );
    }

    _play( )
    {
        if( !this.playlist[ 0 ] )
        {
            const error = new Error( );
            error.message = '재생목록이 비어있습니다.';
            error.code = 'noplaylist';
            this.emit( 'error', error );
            return;
        }

        const download = ytdl( this.playlist[ 0 ].video_url, { filter : format => format.container === 'mp4', quality : 'highestaudio' } );

        new FfmpegCommand( download )
            .noVideo( )
            .audioCodec( 'libopus' )
            .audioFilters( 'volume=0.1' )
            .format( 'ogg' )
            .pipe( fs.createWriteStream( join( __dirname, `../temp/${ this.id }.ogg` ) ) )
            .on( 'finish', ( ) =>
            {
                const stream = fs.createReadStream( join( __dirname, `../temp/${ this.id }.ogg` ) );
                const resource = createAudioResource( stream, { inputType : StreamType.OggOpus } );
                this.player.play( resource );

                this.status.playing = true;

                this.emit( 'play' );
                return;
            } );
    }

    _getNextResource( )
    {
        this.playlist.shift( );

        if( this.playlist[ 0 ] )
        {
            this._play( );
        }
        else
        {
            this.stop( );
        }
    }

    play( url )
    {
        if( url )
        {
            if ( ytpl.validateID( url ) )
            {
                ytpl( url, { limit : 10000, hl : 'ko' } )
                    .then( ( playlistInfo ) =>
                    {
                        const list = [ ];
                    
                        for( const i in playlistInfo.items )
                        {
                            ytdl.getBasicInfo( playlistInfo.items[ i ].shortUrl, { lang : 'ko' } )
                                .then( ( videoInfo ) =>
                                {
                                    list[ i ] = videoInfo.videoDetails;
                                    
                                    for( let j = 0; list[ j ] !== undefined; j++ )
                                    {
                                        if ( j == playlistInfo.items.length - 1 )
                                        {
                                            this.playlist.unshift( ...list );
                                        
                                            this.emit( 'add', playlistInfo.items.length );
                                        
                                            this._play( );
                                        }
                                    }
                                } );
                        }
                    } )
                    .catch( ( ) =>
                    {
                        const error = new Error( );
                        error.message = `${ url } 에서 재생목록 정보를 찾을 수 없습니다.`;
                        error.code = 'unknownplaylist';
                        this.emit( 'error', error );
                    } );
            }
            else if ( ytdl.validateURL( url ) )
            {
                ytdl.getBasicInfo( url, { lang : 'ko' } ).then( ( videoInfo ) =>
                {
                    this.playlist.unshift( videoInfo.videoDetails );

                    this.emit( 'add', 1 );

                    this._play( );
                } )
                .catch( ( ) =>
                {
                    const error = new Error( );
                    error.message = `${ url } 에서 비디오 정보를 찾을 수 없습니다.`;
                    error.code = 'unknownvideo';
                    this.emit( 'error', error );
                } );
            }
            else
            {
                const error = new Error( );
                error.message = `${ url } 은 올바른 URL이 아닙니다.`;
                error.code = 'invalidurl';
                this.emit( 'error', error );
                return;
            }
        }
        else
        {
            this._play( );
        }
    }

    add( url, shuffle )
    {
        if ( ytpl.validateID( url ) )
        {
            ytpl( url, { limit : 10000, hl : 'ko' } )
                .then( ( playlistInfo ) =>
                {
                    const list = [ ];

                    for( const i in playlistInfo.items )
                    {
                        ytdl.getBasicInfo( playlistInfo.items[ i ].shortUrl ).then( ( videoInfo ) =>
                        {
                            list[ i ] = videoInfo.videoDetails;
                            
                            for( let j = 0; list[ j ]; j++ )
                            {
                                if ( j == playlistInfo.items.length - 1 )
                                {
                                    if ( shuffle )
                                    {
                                        for ( let index = list.length - 1; index > 0; index-- )
                                        {
                                            const random = Math.floor( Math.random( ) * ( index + 1 ) );
                                            [ list[ index ], list[ random ] ] = [ list[ random ], list[ index ] ];
                                        }
                                    }

                                    this.playlist.push( ...list );

                                    this.emit( 'add', playlistInfo.items.length );
                                }
                            }
                        } );
                    }
                } )                
                .catch( ( ) =>
                {
                    const error = new Error( );
                    error.message = `${ url } 에서 재생목록 정보를 찾을 수 없습니다.`;
                    error.code = 'unknownplaylist';
                    this.emit( 'error', error );
                } );
        }
        else if ( ytdl.validateURL( url ) )
        {
            ytdl.getBasicInfo( url, { lang : 'ko' } )
                .then( ( videoInfo ) =>
                {
                    this.playlist.push( videoInfo.videoDetails );

                    this.emit( 'add', 1 );
                } )
                .catch( ( ) =>
                {
                    const error = new Error( );
                    error.message = `${ url } 에서 비디오 정보를 찾을 수 없습니다.`;
                    error.code = 'unknownvideo';
                    this.emit( 'error', error );
                } );
        }
        else
        {
            const error = new Error( );
            error.message = `${ url } 은 올바른 URL이 아닙니다.`;
            error.code = 'invalidurl';
            this.emit( 'error', error );
            return;
        }
    }

    pause( )
    {
        if( this.player.pause( ) )
        {
            this.emit( 'pause' );
        }
        else
        {
            this.emit( 'cannotpause' );
        }
    }

    unpause( )
    {
        if( this.player.unpause( ) )
        {
            this.emit( 'unpause' );
        }
        else
        {
            this.emit( 'cannotunpause' );
        }
    }

    skip( )
    {
        this._getNextResource( );
        this.emit( 'skip' );
    }

    stop( )
    {
        this.status.playing = false;
        this.player.stop( );
        this.emit( 'stop' );
    }

    shuffle( )
    {
        let firstSong;

        if ( this.status.playing === true )
        {
            firstSong = this.playlist.shift( );
        }

        for ( let index = this.playlist.length - 1; index > 0; index-- )
        {
            const random = Math.floor( Math.random( ) * ( index + 1 ) );
            [ this.playlist[ index ], this.playlist[ random ] ] = [ this.playlist[ random ], this.playlist[ index ] ];
        }

        if ( this.status.playing === true )
        {
            this.playlist.unshift( firstSong );
        }

        this.emit(  'shuffle' );
    }

    reset( )
    {
        this.playlist.length = 0;
        this.stop( );
        this.emit( 'reset' );
    }
}

module.exports = Audio;