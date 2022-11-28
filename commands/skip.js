const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

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
        }

        audio.once( 'playing', ( ) =>
        {
            interaction.editReply( `▼ 현재 재생 중\n${audio.playlist[ 0 ]}` );
        } );

        audio.skip( );
    }
};