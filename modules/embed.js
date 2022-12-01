const { EmbedBuilder } = require( 'discord.js' );


class Embed
{
    songInfo( info )
    {
        const embed = new EmbedBuilder( )
            .setColor( 0x0099FF )
            .setTitle( info.title )
            .setURL( info.video_url )
            .setAuthor(
            {
                name : info.author.name,
                iconURL : info.author.thumbnails.at( -1 ).url,
                url : info.author.channel_url
            } )
            .setThumbnail( info.thumbnails.at( -1 ).url );

        return embed;
    }

    playlist( playlist )
    {
        let description = '';
        for ( const i in playlist )
        {
            description += `**${ parseInt( i ) + 1 }.** ${ playlist[ i ].title }\n\n`;
        }

        const embed = new EmbedBuilder( )
            .setColor( 0x0099FF )
            .setTitle( '재생목록' )
            .setDescription( description )

        return embed;
    }
}

module.exports = Embed;