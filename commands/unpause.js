const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'unpause' )
        .setDescription( '음악 재생을 재개합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        audio.once( 'unpause', ( ) =>
        {
            interaction.editReply( `음악 재생을 재개했습니다.` )
        } );

        audio.once( 'cannotunpause', ( ) =>
        {
            interaction.editReply( `음악 재생을 일시정지 중이 아닙니다.` )
        } );

        audio.unpause( );
    }
};