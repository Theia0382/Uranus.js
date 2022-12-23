const { EmbedBuilder } = require( 'discord.js' );

class Embed
{
    songInfo( info, detail = false )
    {
        if ( detail )
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
                .addFields(
                    { name : '길이', value : `${ parseInt( parseInt( info.lengthSeconds ) / 60 ) }:${ new String( ( parseInt( info.lengthSeconds ) % 60 ) ).padStart( 2, '0' ) }`, inline : true },
                    { name : '업로드 날짜', value : info.uploadDate, inline : true },
                    { name : '조회수', value : info.viewCount, inline : true }
                )
                .setImage( info.thumbnails.at( -1 ).url );

                return embed;

        }
        else
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
    }

    playlist( playlist )
    {
        let description = '';
        for ( let i = 0; playlist[ i ]; i++ )
        {
            description += `**${ i + 1 }.** ${ playlist[ i ].title }\n\n`;
            if ( description.length > 3600 )
            {
                description += `**외 ${ playlist.length - i }곡**`
                break;
            }
        }

        const embed = new EmbedBuilder( )
            .setColor( 0x0099FF )
            .setTitle( '재생목록' )
            .setDescription( description )

        return embed;
    }
}

module.exports = Embed;