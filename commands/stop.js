const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'stop' )
        .setDescription( '음악 재생을 정지합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        audio.once( 'stopped', ( ) =>
        {
            interaction.editReply( `음악 재생을 정지했습니다.` )
        } );

        audio.stop( );
    }
};