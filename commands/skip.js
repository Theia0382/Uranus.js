const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'skip' )
        .setDescription( '다음 곡을 재생합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        if ( !audio.playlist[ 1 ] )
        {
            interaction.editReply( '다음 곡이 없습니다.' );
            audio.skip( );

            return;
        }

        audio.once( 'play', ( ) =>
        {
            const embed = new Embed( ).songInfo( audio.playlist[ 0 ] );

            interaction.editReply( { content : '▼ 다음 곡 재생 중', embeds : [ embed ] } );

            return;
        } );

        audio.skip( );
    }
};