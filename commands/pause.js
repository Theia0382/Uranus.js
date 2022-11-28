const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'pause' )
        .setDescription( '음악 재생을 일시정지합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        audio.once( 'pause', ( ) =>
        {
            interaction.editReply( `음악 재생을 일시정지했습니다.` )
        } );

        audio.once( 'cannotpause', ( ) =>
        {
            interaction.editReply( `음악 재생 중이 아닙니다.` )
        } );

        audio.pause( );
    }
};