const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'shuffle' )
        .setDescription( '재생 목록을 섞습니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        audio.once( 'shuffle', ( ) =>
        {
            interaction.editReply( '재생 목록을 섞었습니다.' )
        } );

        audio.shuffle( );
    }
};