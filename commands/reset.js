const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'reset' )
        .setDescription( '재생 목록을 초기화합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        audio.once( 'reset', ( ) =>
        {
            interaction.editReply( `재생 목록을 초기화했습니다.` )
        } );

        audio.reset( );
    }
};